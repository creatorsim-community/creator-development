import { loadedESP32C3Interr } from "../core.mjs";
import { esp32vect } from "./pinstates.mjs" ;

/*Data stuctures for interrupts*/ 
export const ESPINTERR = {
    check_interr: (): boolean => {
        return check_interr();
    },
};
export const protectedStart = 0x60000000n; 
export const protectedEnd = 0x60FFFFFFn;  

/* POSITIONS:
    g_irq_data: 0x06000000 - 0x060001F0
    INTERRUPT = 0x600c2000 - 0x600c2FFF
    GPIO = 0x60004000 - 0x60004FFF
    SYSTIMER = 0x60023000 - 0x60023FFF

/* Check functions*/ 
export function check_interr(): boolean {
    if (loadedESP32C3Interr == false) {
        console.log("Not ESP32C3 library loaded");
        return false;
    }
    return true;
}

export function can_access_protected_memory(): boolean {
    if (!check_interr()) {
        console.log("Access to protected memory is denied: Interrupt library not loaded.");
        return false;
    }
    return true;
}