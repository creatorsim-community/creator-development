import { loadedESP32C3Interr, main_memory } from "../core.mjs";
import { coreEvents } from "../events.mts";
import { pinStates,esp32vect, setVectRow, getVectRow } from "./pinstates.mts" ;
import {
    readRegister,
    writeRegister,
} from "../register/registerOperations.mjs";
import { crex_findReg } from "../register/registerLookup.mjs";
import { packExecute } from "../utils/utils.mjs";
import {
    display_print,
    keyboard_read_find,
    kbd_read_string,
    keyboard_parseInt,
    keyboard_read,
    kbd_read_char,
    keyboard_read_until,
} from "../executor/IO.mjs";
import type { Memory } from "../memory/Memory.mts";
/*Data stuctures for interrupts*/ 
export const ESPINTERR = {
    check_interr: (funName: bigint,pc_state: bigint): boolean => {
        return check_interr(funName,pc_state);
    },
};
export const protectedStart = 0x6000000n; 
export const protectedEnd = 0x60FFFFFn;  

/* POSITIONS:
    g_irq_data: 0x06000000 - 0x060001F0
    INTERRUPT = 0x600c2000 - 0x600c2FFF
    GPIO = 0x60004000 - 0x60004FFF
    SYSTIMER = 0x60023000 - 0x60023FFF

/* Check functions*/ 
// 1. Definición del Mapa
const hookMap = new Map<number, () => void>();

// 2. Definición de las funciones (Lógica de los hooks)
const gpio_output = () => {
    var ret1 = crex_findReg("a0");
    if (ret1.match === 0) {
        throw packExecute(
            true,
            "capi_arduino: register a0 not found",
            "danger",
            null,
        );
    }
    var pin = BigInt.asIntN(32, readRegister(ret1.indexComp, ret1.indexElem));
    coreEvents.emit("arduino-pin-mode", {
        pin: Number(pin),
        mode: Number(3n),
    })
};
const gpio_input = () => {
        var ret1 = crex_findReg("a0");
    if (ret1.match === 0) {
        throw packExecute(
            true,
            "capi_arduino: register a0 not found",
            "danger",
            null,
        );
    }
    var pin = BigInt.asIntN(32, readRegister(ret1.indexComp, ret1.indexElem));
    coreEvents.emit("arduino-pin-mode", {
        pin: Number(pin),
        mode: Number(1n),
    })
};

const gpio_read = () => {
    var ret1 = crex_findReg("a0");
    if (ret1.match === 0) {
        throw packExecute(
            true,
            "capi_arduino: register a0 not found",
            "danger",
            null,
        );
    }
    var pin = BigInt.asIntN(32, readRegister(ret1.indexComp, ret1.indexElem));
    const gpiopin = "GPIO" + pin.toString();
    const value = pinStates.value?.[gpiopin] || 0n;
    writeRegister(BigInt(value), ret1.indexComp, ret1.indexElem);
};

const printf = () => {
        const valueReg = crex_findReg("a0");
        if (valueReg.match === 0) {
            throw packExecute(
                true,
                "capi_espinterr: register a0 not found",
                "danger",
                null,
            );
        }
        // Read the address stored in the register (already BigInt)
        let stringAddress = readRegister(
            valueReg.indexComp,
            valueReg.indexElem,
        ) as bigint;
    
        // Normalize address to positive range
        stringAddress = BigInt.asUintN(32, stringAddress);
    
        // Get the memory instance
        const memory = main_memory as Memory;
    
        // Validate address is within memory bounds
        if (stringAddress >= BigInt(memory.getSize())) {
            throw packExecute(
                true,
                "capi_espinterr: invalid string address",
                "danger",
                null,
            );
        }
    
        // Read the format string from memory
        let formatString = "";
        let memoryAddr = stringAddress;
        while (memoryAddr < BigInt(memory.getSize())) {
            const byte = memory.read(memoryAddr);
            if (byte === 0) break; // Null terminator
            formatString += String.fromCharCode(byte);
            memoryAddr++;
        }
    
        // Process format specifiers
        let result = formatString;
        const argRegisters = ["a1", "a2", "a3", "a4", "a5", "a6", "a7"];
    
        for (const reg of argRegisters) {
            const argReg = crex_findReg(reg);
            if (argReg.match === 0) break;
    
            const argValue = readRegister(argReg.indexComp, argReg.indexElem);
    
            // Replacements
            result = result.replace("%d", String(BigInt.asIntN(32, argValue)));
            result = result.replace("%u", String(BigInt.asUintN(32, argValue)));
            result = result.replace(
                "%x",
                BigInt.asUintN(32, argValue).toString(16),
            );
            result = result.replace(
                "%c",
                String.fromCharCode(Number(BigInt.asUintN(8, argValue))),
            );
            if (result.includes("%s")) {
                let str = "";
                let addr = argValue;
    
                while (addr < BigInt(memory.getSize())) {
                    const byte = memory.read(addr);
                    if (byte === 0) break; // Null terminator
                    str += String.fromCharCode(byte);
                    addr++;
                }
                result = result.replace("%s", str);
            }
        }
    
        // Print the formatted string directly
        display_print(result);
};

export function createHookMap() {
    // Ejemplo: Si el PC es 0x4000 y el ID de la función es 0x10...
    hookMap.set(0x0, gpio_output);
    hookMap.set(0x4, gpio_input);  
    hookMap.set(0x8, gpio_read);
    hookMap.set(0xC, printf);

    console.log(`[SYSTEM] HookMap cargado con ${hookMap.size} funciones de GPIO.`);
}
export function check_interr(funcName:bigint,pc_state:bigint): boolean {
    console.log(`[DEBUG] check_interr called with funcName: ${funcName.toString(16)}, pc_state: ${pc_state.toString(16)}`);
    if (loadedESP32C3Interr == false) {
        console.log("Not ESP32C3 library loaded");
        return false;
    }
    const key = Math.abs(Number(pc_state) + Number(funcName));
    // 2. Inicializar mapa si está vacío
    if (hookMap.size === 0) {
        createHookMap();
    }

    // 3. Buscar y ejecutar el Hook
    const func = hookMap.get(key);
    if (func) {
        console.log(`[SYSTEM] Disparando Hook de Interrupción: 0x${key.toString(16)}`);
        func();
        return true;
    }

    console.log(`[DEBUG] No hay hook registrado para la interrupción 0x${key.toString(16)}`);
    return false;
}
export function add_g_irq_to_graphic_interrupt(addr: bigint, value: bigint) {
    const G_IRQ_START = 0x06000000n;
    if (addr < G_IRQ_START || addr >= 0x060001F0n) return;

    const offset = addr - G_IRQ_START;
    const index = Number(offset / 16n);
    const subOffset = Number(offset % 16n);

    // 1. Leer estado actual directamente de la memoria cruda
    let [pin, isr, mode] = getVectRow(index);

    // 2. Actualizar según el offset
    if (subOffset === 0x0) {
        isr = value;
        console.log(`📡 [HARDWARE WRITE] Slot ${index} ISR -> 0x${value.toString(16)}`);
    } else if (subOffset === 0xC) {
        pin = value;
        console.log(`📡 [HARDWARE WRITE] Slot ${index} PIN -> ${value}`);
    }

    // 3. Guardar de vuelta en la memoria cruda inmediatamente
    setVectRow(index, pin, isr, mode);

    // 4. Verificación de disparo
    if (pin !== 0n && pin !== 0xffffn && isr !== 0n && isr !== 0xffffn) {
        console.log(`🔔 INTERRUPCIÓN VALIDADA: Pin ${pin} con Handler 0x${isr.toString(16)}`);
        coreEvents.emit("arduino-pin-interrupt", "GPIO" + pin.toString());
    }
}

export function can_access_protected_memory(): boolean {
    if (loadedESP32C3Interr == false) {
        console.log("Not ESP32C3 library loaded");
        return false;
    }
    return true;
}

