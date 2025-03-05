/* tslint:disable */
/* eslint-disable */
/**
 * Method used to render colors in error messages
 */
export enum Color {
  Html = 0,
  Ansi = 1,
  Off = 2,
}
/**
 * General category of a compiled data element
 */
export enum DataCategoryJS {
  Number = 0,
  String = 1,
  Space = 2,
  Padding = 3,
}
/**
 *r" Architecture definition
 */
export class ArchitectureJS {
  free(): void;
  /**
   * Load architecture data from `JSON`
   *
   * # Parameters
   *
   * * `src`: `JSON` data to deserialize
   *
   * # Errors
   *
   * Errors if the input `JSON` data is invalid, either because it's ill-formatted or because it
   * doesn't conform to the specification
   * @param {string} json
   * @returns {ArchitectureJS}
   */
  static from_json(json: string): ArchitectureJS;
  /**
   * Converts the architecture to a pretty printed string for debugging
   * @returns {string}
   */
  toString(): string;
  /**
   * Compiles an assembly source according to the architecture description
   *
   * # Parameters
   *
   * * `src`: assembly code to compile
   * * `reserved_offset`: amount of bytes that should be reserved for library instructions
   * * `labels`: mapping from label names specified in the library to their addresses, in `JSON`
   * * `library`: whether the code should be compiled as a library (`true`) or not (`false`)
   * * `color`: method used to render colors in error messages
   *
   * # Errors
   *
   * Errors if the assembly code has a syntactical or semantical error, or if the `labels`
   * parameter is either an invalid `JSON` or has invalid mappings
   * @param {string} src
   * @param {number} reserved_offset
   * @param {string} labels
   * @param {boolean} library
   * @param {Color} color
   * @returns {CompiledCodeJS}
   */
  compile(src: string, reserved_offset: number, labels: string, library: boolean, color: Color): CompiledCodeJS;
  /**
   * Generate a `JSON` schema
   * @returns {string}
   */
  static schema(): string;
}
/**
 * Assembly compilation output
 */
export class CompiledCodeJS {
  free(): void;
  /**
   * Converts the compiled code to a pretty printed string for debugging
   * @returns {string}
   */
  toString(): string;
/**
 * Compiled data to add to the data segment
 */
  readonly data: (DataJS)[];
/**
 * Compiled instructions to execute
 */
  readonly instructions: (InstructionJS)[];
/**
 * Symbol table for labels
 */
  readonly label_table: (LabelJS)[];
}
/**
 * Compiled data wrapper
 */
export class DataJS {
  free(): void;
  /**
   * Address of the data element
   * @returns {bigint}
   */
  address(): bigint;
  /**
   * Labels pointing to this data element
   * @returns {(string)[]}
   */
  labels(): (string)[];
  /**
   * Value of the data element:
   *
   * * For integers/floating point values, it's their value either in hexadecimal without the
   *   `0x` prefix or as a number, depending on the `human` parameter
   * * For strings, it's their contents
   * * For empty spaces/padding, it's their size as a string
   *
   * # Parameters
   *
   * * `human`: whether to return the value as a human-readable representation or in hexadecimal
   * @param {boolean} human
   * @returns {string}
   */
  value(human: boolean): string;
  /**
   * Precise type of the data element
   * @returns {string}
   */
  type(): string;
  /**
   * General category of the data element
   * @returns {DataCategoryJS}
   */
  data_category(): DataCategoryJS;
  /**
   * Size of the data element in bytes
   * @returns {bigint}
   */
  size(): bigint;
}
/**
 * Compiled instruction wrapper
 */
export class InstructionJS {
  free(): void;
/**
 * Address of the instruction in hexadecimal (`0xABCD`)
 */
  address: string;
/**
 * Instruction encoded in binary
 */
  binary: string;
/**
 * Labels pointing to this instruction
 */
  labels: (string)[];
/**
 * Translated instruction to a simplified syntax
 */
  loaded: string;
/**
 * Instruction in the code
 */
  user: string;
}
/**
 * Label table entry wrapper
 */
export class LabelJS {
  free(): void;
/**
 * Address to which the label points
 */
  address: bigint;
/**
 * Whether the label is local to the file (`false`) or global
 */
  global: boolean;
/**
 * Name of the label
 */
  name: string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_architecturejs_free: (a: number, b: number) => void;
  readonly architecturejs_from_json: (a: number, b: number) => Array;
  readonly architecturejs_toString: (a: number) => Array;
  readonly architecturejs_compile: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => Array;
  readonly architecturejs_schema: () => Array;
  readonly __wbg_compiledcodejs_free: (a: number, b: number) => void;
  readonly __wbg_get_compiledcodejs_instructions: (a: number) => Array;
  readonly __wbg_get_compiledcodejs_data: (a: number) => Array;
  readonly __wbg_get_compiledcodejs_label_table: (a: number) => Array;
  readonly compiledcodejs_toString: (a: number) => Array;
  readonly __wbg_labeljs_free: (a: number, b: number) => void;
  readonly __wbg_get_labeljs_name: (a: number) => Array;
  readonly __wbg_set_labeljs_name: (a: number, b: number, c: number) => void;
  readonly __wbg_get_labeljs_address: (a: number) => number;
  readonly __wbg_set_labeljs_address: (a: number, b: number) => void;
  readonly __wbg_get_labeljs_global: (a: number) => number;
  readonly __wbg_set_labeljs_global: (a: number, b: number) => void;
  readonly __wbg_instructionjs_free: (a: number, b: number) => void;
  readonly __wbg_get_instructionjs_address: (a: number) => Array;
  readonly __wbg_set_instructionjs_address: (a: number, b: number, c: number) => void;
  readonly __wbg_get_instructionjs_labels: (a: number) => Array;
  readonly __wbg_set_instructionjs_labels: (a: number, b: number, c: number) => void;
  readonly __wbg_get_instructionjs_loaded: (a: number) => Array;
  readonly __wbg_set_instructionjs_loaded: (a: number, b: number, c: number) => void;
  readonly __wbg_get_instructionjs_binary: (a: number) => Array;
  readonly __wbg_set_instructionjs_binary: (a: number, b: number, c: number) => void;
  readonly __wbg_get_instructionjs_user: (a: number) => Array;
  readonly __wbg_set_instructionjs_user: (a: number, b: number, c: number) => void;
  readonly __wbg_datajs_free: (a: number, b: number) => void;
  readonly datajs_address: (a: number) => number;
  readonly datajs_labels: (a: number) => Array;
  readonly datajs_value: (a: number, b: number) => Array;
  readonly datajs_type: (a: number) => Array;
  readonly datajs_data_category: (a: number) => number;
  readonly datajs_size: (a: number) => number;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_export_3: (a: number) => void;
  readonly __wbindgen_export_4: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_5: (a: number, b: number) => void;
  readonly __wbindgen_export_6: () => number;
  readonly __wbindgen_export_7: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
