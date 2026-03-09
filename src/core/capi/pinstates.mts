import { ref, type Ref } from "vue";
// --- Tipado ---
export interface PinStateMap {
    [key: string]: number;
}

export interface BoardConfig {
    name: string;
    svg: string;
    pinLabels: string[][]; // Estructura de columnas [izquierda, derecha]
    initialStates: PinStateMap;
}
const env = (import.meta as any).env || {};
const baseUrl = env.BASE_URL || '/';
// Board definition
var BOARDS: Record<string, BoardConfig> = {
    esp32c3devkit2: {
        name: "ESP32-C3 DevKitC-02",
        svg: baseUrl + "maker/boards/esp32c3devkit2.svg",
        pinLabels: [
            ["GPIO4", "GPIO5", "GPIO6", "GPIO7", "GPIO8", "GPIO9", "GPIO30"],
            [
                "GPIO0",
                "GPIO1",
                "GPIO2",
                "GPIO3",
                "GPIO20",
                "GPIO21",
                "GPIO18",
                "GPIO19",
            ],
        ],
        initialStates: {
            GPIO0: 0,
            GPIO1: 0,
            GPIO2: 0,
            GPIO3: 0,
            GPIO4: 0,
            GPIO5: 0,
            GPIO6: 0,
            GPIO7: 0,
            GPIO8: 0,
            GPIO9: 0,
            GPIO10: 0,
            GPIO18: 0,
            GPIO19: 0,
            GPIO20: 0,
            GPIO21: 0,
            GPIO30: 0,
        },
    },
    esp32c6devkit1: {
        name: "ESP32-C6 DevKit",
        svg: baseUrl + "maker/boards/esp32c6devkit1.svg",
        pinLabels: [
            [
                "GPIO4",
                "GPIO5",
                "GPIO6",
                "GPIO7",
                "GPIO0",
                "GPIO1",
                "GPIO8",
                "GPIO10",
                "GPIO11",
                "GPIO2",
                "GPIO3",
            ],
            [
                "GPIO15",
                "GPIO23",
                "GPIO22",
                "GPIO21",
                "GPIO20",
                "GPIO19",
                "GPIO18",
                "GPIO9",
                "GPIO17",
                "GPIO9",
                "GPIO13",
                "GPIO12",
            ],
        ],
        initialStates: {
            GPIO0: 0,
            GPIO1: 0,
            GPIO2: 0,
            GPIO3: 0,
            GPIO4: 0,
            GPIO5: 0,
            GPIO6: 0,
            GPIO7: 0,
            GPIO8: 0,
            GPIO9: 0,
            GPIO10: 0,
            GPIO11: 0,
            GPIO12: 0,
            GPIO13: 0,
            GPIO15: 0,
            GPIO17: 0,
            GPIO18: 0,
            GPIO19: 0,
            GPIO20: 0,
            GPIO21: 0,
            GPIO22: 0,
            GPIO23: 0,
        },
    },
};

// interrupt
const RAW_STORAGE = new BigUint64Array(32 * 3); // 32 slots * 3 columnas

export const esp32vect = {
    value: {
        // Simulamos el comportamiento de un ref para no romper tu código
        get length() { return 32; },
        get [1]() { return [RAW_STORAGE[3], RAW_STORAGE[4], RAW_STORAGE[5]]; }, // Ejemplo
    }
};

// Función para obtener los datos de forma segura
export function getVectRow(index: number): bigint[] {
    const base = index * 3;
    return [RAW_STORAGE[base], RAW_STORAGE[base + 1], RAW_STORAGE[base + 2]];
}

export function setVectRow(index: number, pin: bigint, isr: bigint, mode: bigint) {
    const base = index * 3;
    RAW_STORAGE[base] = pin;
    RAW_STORAGE[base + 1] = isr;
    RAW_STORAGE[base + 2] = mode;
}


// States

// Por defecto empezamos con la ESP32
const currentBoardKey = "esp32c3devkit2";

export const activeBoard = ref(BOARDS[currentBoardKey]);
export var pinStates: Ref<PinStateMap> = ref({
    ...BOARDS[currentBoardKey]?.initialStates,
});
export const pinLabels = ref(BOARDS[currentBoardKey]?.pinLabels);



// Change boards
export function switchBoard(boardKey: string) {
    if (BOARDS[boardKey]) {
        activeBoard.value = BOARDS[boardKey];
        pinStates.value = { ...BOARDS[boardKey].initialStates };
        pinLabels.value = BOARDS[boardKey].pinLabels;
    }
}
