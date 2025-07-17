/*
 *  Copyright 2018-2025 Felix Garcia Carballeira, Diego Camarmas Alonso, Alejandro Calderon Mateos
 *
 *  This file is part of CREATOR.
 *
 *  CREATOR is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  CREATOR is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with CREATOR.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
/*
 *  CREATOR instruction description API:
 *  CREATino variables
 */
var serial_begin = 0; // TODO: Which baud rate can we accept?
var initArduino = 0; // Flag to check if initArduino has been called
var _seed = 1;


/*
 *  CREATOR instruction description API:
 *  CREATino functions
 */
const hookMap = {
    0x0:    function cr_initArduino() {
		console.log("initArduino");
		if (initArduino === 0) 
		{
			initArduino = 1; 
			console.log("initArduino: " + initArduino);
		}
	}	,
	// GPIO functions
    0x4:    function cr_digitalRead() {console.log("digitalRead");},
    0x8:    function cr_pinMode() {console.log("pinMode");},
    0xc:    function cr_digitalWrite() {console.log("digitalWrite");},
    0x10:   function cr_analogRead() {console.log("analogRead");},
    0x14:   function cr_analogReadResolution() {console.log("analogReadResolution");},
    0x18:   function cr_analogWrite() {console.log("analogWrite");},
    0x1c:   function cr_map() {console.log("map");
		// Value to map
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		//fromLow the lower bound of the value’s current range.
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);	
		}
		var fromLow = readRegister(ret2.indexComp, ret2.indexElem);
		//fromHigh the upper bound of the value’s current range.
		var ret3 = crex_findReg('a2');
		if (ret3.match === 0) {
			throw packExecute(true, "capi_syscall: register a2 not found", 'danger', null);	
		}
		var fromHigh = readRegister(ret3.indexComp, ret3.indexElem);
		//toLow the lower bound of the value’s target range.
		var ret4 = crex_findReg('a3');
		if (ret4.match === 0) {
			throw packExecute(true, "capi_syscall: register a3 not found", 'danger', null);	
		}
		var toLow = readRegister(ret4.indexComp, ret4.indexElem);
		//toHigh the upper bound of the value’s target range.
		var ret5 = crex_findReg('a4');
		if (ret5.match === 0) {
			throw packExecute(true, "capi_syscall: register a4 not found", 'danger', null);	
		}
		var toHigh = readRegister(ret5.indexComp, ret5.indexElem);

		const mappedValue = (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
		writeRegister(mappedValue, ret1.indexComp, ret1.indexElem);
	},
    0x20:   function cr_constrain() {console.log("constrain");
		// Value to constrain
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		//lower end
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);	
		}
		var lower = readRegister(ret2.indexComp, ret2.indexElem);
		//upper end
		var ret3 = crex_findReg('a2');
		if (ret3.match === 0) {
			throw packExecute(true, "capi_syscall: register a2 not found", 'danger', null);	
		}
		var upper = readRegister(ret3.indexComp, ret3.indexElem);

		var constrained = Math.max(lower, Math.min(value, upper));
		writeRegister(constrained, ret1.indexComp, ret1.indexElem);
	},
    0x24:   function cr_abs() {
		console.log("abs");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		console.log("abs: value = " + value);
		// Calculate the absolute value
		if (value < 0) {
			value = -value;
		}
		writeRegister(value, ret1.indexComp, ret1.indexElem);

		},
    0x28:   function cr_max() {
		console.log("max");
		// Value 1
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		if (value1 === undefined) {
			ret1 = crex_findReg('fa0');
			if (ret1.match === 0) {
				console.log("capi_syscall: register a0/fa0 not found");
				throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);
			}
			value1 = readRegister(ret1.indexComp, ret1.indexElem, "SFP-Reg");
			console.log("cr_max: value1 is a float = " + value1);
		}

		// Value 2
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);	
		} 
		value2 = readRegister(ret2.indexComp, ret2.indexElem);
		if (value2 === undefined) {
			ret2 = crex_findReg('fa1');
			if (ret2.match === 0) {
				console.log("capi_syscall: register a0/fa0 not found");
				throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);
			}
			value2 = readRegister(ret2.indexComp, ret2.indexElem, "SFP-Reg");
			console.log("cr_max: value1 is a float = " + value2);
		}

		// Find the maximum value
		const max = (value1 > value2) ? value1 : value2;
		writeRegister(max, ret1.indexComp, ret1.indexElem);
	},
    0x2c:   function cr_min() {console.log("min");
	// Value 1
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		if (value1 === undefined) {
			ret1 = crex_findReg('fa0');
			if (ret1.match === 0) {
				console.log("capi_syscall: register a0/fa0 not found");
				throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);
			}
			value1 = readRegister(ret1.indexComp, ret1.indexElem, "SFP-Reg");
			console.log("cr_max: value1 is a float = " + value1);
		}

		// Value 2
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);	
		} 
		value2 = readRegister(ret2.indexComp, ret2.indexElem);
		if (value2 === undefined) {
			ret2 = crex_findReg('fa1');
			if (ret2.match === 0) {
				console.log("capi_syscall: register a0/fa0 not found");
				throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);
			}
			value2 = readRegister(ret2.indexComp, ret2.indexElem, "SFP-Reg");
			console.log("cr_max: value1 is a float = " + value2);
		}

		// Find the maximum value
		const min = (value1 < value2) ? value1 : value2;
		writeRegister(min, ret1.indexComp, ret1.indexElem);
	},
    0x30:   function cr_pow() {console.log("pow");
	// Value 1
	var ret1 = crex_findReg('a0');
	if (ret1.match === 0) {
		throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);	
	} 
	value1 = readRegister(ret1.indexComp, ret1.indexElem);
	if (value1 === undefined) {
		ret1 = crex_findReg('fa0');
		if (ret1.match === 0) {
			console.log("capi_syscall: register a0/fa0 not found");
			throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);
		}
		value1 = readRegister(ret1.indexComp, ret1.indexElem, "SFP-Reg");
		console.log("cr_max: value1 is a float = " + value1);
	}

	// Value 2
	var ret2 = crex_findReg('a1');
	if (ret2.match === 0) {
		throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);	
	} 
	value2 = readRegister(ret2.indexComp, ret2.indexElem);
	if (value2 === undefined) {
		ret2 = crex_findReg('fa1');
		if (ret2.match === 0) {
			console.log("capi_syscall: register a0/fa0 not found");
			throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);
		}
		value2 = readRegister(ret2.indexComp, ret2.indexElem, "SFP-Reg");
		console.log("cr_max: value1 is a float = " + value2);
	}
		const pow = Math.pow(value1, value2);
		writeRegister(pow, ret1.indexComp, ret1.indexElem);
	},
	// Bit manipulation functions
    0x34:   function cr_bit() {
		console.log("bit");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		var res = 0;
		if (value1 < 0 || value1 > 31) {
			res = 0; // Invalid bit position
		} else {
			res = 1 << value1; // Calculate the bit value
		}
		writeRegister(res, ret1.indexComp, ret1.indexElem);


	},
    0x38:   function cr_bitClear() {console.log("bitClear");
		//Numeric variable whose bit to clear
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		var res = 0;
		//Bit to clear, starting 0 for least-significant
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);	
		} 
		value2 = readRegister(ret2.indexComp, ret2.indexElem);
		if (value2 < 0 || value2 > 31) {
			res = value1; // Invalid bit position, return original value
		} else {
			res = value1 & ~(1 << value2); // Clear the specified bit
		}
		writeRegister(res, ret1.indexComp, ret1.indexElem);
	},
    0x3c:   function cr_bitRead() {console.log("bitRead");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		var res = 0;
		//Bit to clear, starting 0 for least-significant
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);	
		} 
		value2 = readRegister(ret2.indexComp, ret2.indexElem);
		if (value2 < 0 || value2 > 31) {
			res = 0; // Invalid bit position, return 0
		} else {
			res = (value1 & (1 << value2)) !== 0 ? 1 : 0; // Read the specified bit
		}
		writeRegister(res, ret1.indexComp, ret1.indexElem);
	},
    0x40:   function cr_bitSet() {console.log("bitSet");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		var res = 0;
		//Bit to clear, starting 0 for least-significant
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);	
		} 
		value2 = readRegister(ret2.indexComp, ret2.indexElem);
		if (value2 < 0 || value2 > 31) {
			res = 0; // Invalid bit position, return 0
		} else {
			res = value1 | (1 << value2); // Set the specified bit
		}
		writeRegister(res, ret1.indexComp, ret1.indexElem);

	},
    0x44:   function cr_bitWrite() {console.log("bitWrite");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		var res = 0;
		//Bit to write, starting 0 for least-significant
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);	
		} 
		value2 = readRegister(ret2.indexComp, ret2.indexElem);
		// Value to write
		var ret3 = crex_findReg('a2');
		if (ret3.match === 0) {
			throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);	
		} 
		value3 = readRegister(ret3.indexComp, ret3.indexElem);
		if (value2 < 0 || value2 > 31) {
			res = value1; // Invalid bit position, return original value
		} 
		else {
			if (value3 === 0) {
				res = value1 & ~(1 << value2); // Clear the specified bit
			} else if (value3 === 1) {
				res = value1 | (1 << value2); // Set the specified bit
			} else {
				throw packExecute(true, "capi_syscall: invalid value for bitWrite", 'danger', null);
			}
		}
		writeRegister(res, ret1.indexComp, ret1.indexElem);

	},
    0x48:   function cr_highByte() {console.log("highByte");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		var res = 0;
		res = (value1 >> 8) & 0xFF; // Get the high byte
	    writeRegister(res, ret1.indexComp, ret1.indexElem);
	},
	0x4c: function cr_lowByte() {
		console.log("lowByte");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		let value1 = readRegister(ret1.indexComp, ret1.indexElem);
		let res = value1 & 0xFF;  // Extraer los 8 bits bajos
		writeRegister(res, ret1.indexComp, ret1.indexElem);
	},
    0x50:   function cr_sqrt() {
		console.log("sqrt");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		if (value1 === undefined) {
			ret1 = crex_findReg('fa0');
			if (ret1.match === 0) {
				console.log("capi_syscall: register a0/fa0 not found");
				throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);
			}
			value1 = readRegister(ret1.indexComp, ret1.indexElem, "SFP-Reg");
			console.log("cr_max: value1 is a float = " + value1);
		}
			// Find the maximum value
			const sqrt = Math.sqrt(value1);
			writeRegister(sqrt, ret1.indexComp, ret1.indexElem);
	},
    0x54:   function cr_sq() {
		console.log("sq");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		if (value1 === undefined) {
			ret1 = crex_findReg('fa0');
			if (ret1.match === 0) {
				console.log("capi_syscall: register a0/fa0 not found");
				throw packExecute(true, "capi_syscall: register a0/fa0 not found", 'danger', null);
			}
			value1 = readRegister(ret1.indexComp, ret1.indexElem, "SFP-Reg");
		}
		const sq = value1*value1;
		writeRegister(sq, ret1.indexComp, ret1.indexElem);
	},
    0x58:   function cr_cos() {console.log("cos");
		var ret1 = crex_findReg('fa0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register fa0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		const cos = Math.cos(value1);
		writeRegister(cos, ret1.indexComp, ret1.indexElem);
	},
    0x5c:   function cr_sin() {console.log("sin");
		var ret1 = crex_findReg('fa0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register fa0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		const sin = Math.sin(value1);
		console.log("cr_sin: value1 = " + value1 + ", sin = " + sin);
		writeRegister(sin, ret1.indexComp, ret1.indexElem);
	},
    0x60:   function cr_tan() {console.log("tan");
		var ret1 = crex_findReg('fa0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register fa0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		const tan = Math.tan(value1);
		writeRegister(tan, ret1.indexComp, ret1.indexElem);
	},
	// Interruption functions
    0x64:   function cr_attachInterrupt() {console.log("attachInterrupt");},
    0x68:   function cr_detachInterrupt() {console.log("detachInterrupt");},
    0x6c:   function cr_digitalPinToInterrupt() {console.log("digitalPinToInterrupt");},
    0x70:   function cr_pulseIn() {console.log("pulseIn");},
    0x74:   function cr_pulseInLong() {console.log("pulseInLong");},
    0x78:   function cr_shiftIn() {console.log("shiftIn");},
    0x7c:   function cr_shiftOut() {console.log("shiftOut");},
    0x80:   function cr_interrupts() {console.log("interrupts");},
    0x84:   function cr_nointerrupts() {console.log("nointerrupts");},
	// Character functions: reference https://elcodigoascii.com.ar/ 
    0x88:   function cr_isDigit() {
		console.log("isDigit");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		console.log("isDigit: value = " + value);
		// Check if the value is a digit (0-9)
		if (value >= 48 && value <= 57) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		} else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	
	},
    0x8c:   function cr_isAlpha() {
		console.log("isAlpha");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);	
		console.log("isAlpha: value = " + value);
		// Check if the value is an alphabetic character (A-Z, a-z)
		if ((value >= 65 && value <= 90) || (value >= 97 && value <= 122)) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		} else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0x90:   function cr_isAlphaNumeric() {
		console.log("isAlphaNumeric");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		console.log("isAlphaNumeric: value = " + value);
		// Check if the value is an alphanumeric character (A-Z, a-z, 0-9)
		if ((value >= 48 && value <= 57) || (value >= 65 && value <= 90) || (value >= 97 && value <= 122)) {
			writeRegister(1, ret1.indexComp, ret1.indexElem);
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem);
		}
	},
    0x94:   function cr_isAscii() {
		console.log("isAscii");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		console.log("isAscii: value = " + value);
		// Check if the value is an ASCII character (0-127) Control characters are included
		if (value >= 0 && value <= 127) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0x98:   function cr_isControl() {
		console.log("isControl");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		// Check if the value is Control characters (0-31 and 127)
		if (value >= 0 && value <= 31 || value === 127) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0x9c:   function cr_isPunct() {
		console.log("isPunct");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		// Check if the value is punctuation characters(!"#$%&'()*+,-./:;<)
		if (value >= 33 && value <= 47 || value >= 58 && value <= 64 || value >= 91 && value <= 96 || value >= 123 && value <= 126) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0xa0:   function cr_isHexadecimalDigit() {console.log("isHexadecimalDigit");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		// Check if the value is a hexadecimal digit (0-9, A-F, a-f)
		if (value >= 48 && value <= 57 || value >= 65 && value <= 70 || value >= 97 && value <= 102) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0xa4:   function cr_isUpperCase() {
		console.log("isUpperCase");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		// Check if the value is an uppercase letter (A-Z)
		if (value >= 65 && value <= 90) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0xa8:   function cr_isLowerCase() {
		console.log("isLowerCase");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		// Check if the value is an lowercase letter (a-z)
		if (value >= 97 && value <= 122) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0xac:   function cr_isPrintable() {console.log("isPrintable");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		// Check if the value is a printable character (32-126)
		if (value >= 32 && value <= 126) {
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0xb0:   function cr_isGraph() {console.log("isGraph");	
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		// Check if the value is a space
		if (value != 32 || value != 9 || value != 10 || value != 13) { // space, tab, newline, carriage return
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0xb4:   function cr_isSpace() {console.log("isSpace");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		// Check if the value is a space
		if (value === 32 || value === 9 || value === 10 || value === 13) { // space, tab, newline, carriage return
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
    0xb8:   function cr_isWhiteSpace() {console.log("isWhiteSpace");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var value = readRegister(ret1.indexComp, ret1.indexElem);
		
		// Check if the value is a space
		if (value === 32 ) { // space
			writeRegister(1, ret1.indexComp, ret1.indexElem); 
		}
		else {
			writeRegister(0, ret1.indexComp, ret1.indexElem); 
		}
	},
	//Time functions
	0xbc:  function cr_delay() {
		console.log("delay");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var ms = readRegister(ret1.indexComp, ret1.indexElem);
		var start = performance.now(); // Mejor precisión que Date.now()
		while ((performance.now() - start) < (ms)) {
			// wait
		}
			// run_program = 4; // Estado especial de delay
			// function checkDelay() {
			// 	if (Date.now() - start >= ms) {
			// 		console.log("Delay finalizado: " + (Date.now() - start) + "ms");
			// 		execution_index++; // Avanza a la siguiente instrucción
			// 		run_program = 1; // Reanuda ejecución normal
			// 	} else {
			// 		setTimeout(checkDelay, 10); // Vuelve a comprobar en 10ms
			// 	}
			// }
	},
    0xc0:  function cr_delayMicroseconds() {console.log("delayMicroseconds");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		var us = readRegister(ret1.indexComp, ret1.indexElem);
    	var start = performance.now(); // Mejor precisión que Date.now()
		while ((performance.now() - start) < (us / 1000)) {
			// Espera activa
		}
	},
	// Random functions	
    0xc4:  function cr_randomSeed() {console.log("randomSeed");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		_seed = value1 >>> 0; // Set the seed for random number generation
	},
   0xc8:  function cr_random() {
		console.log("random");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);	
		} 
		value1 = readRegister(ret1.indexComp, ret1.indexElem);
		// Value 2
		var ret2 = crex_findReg('a1');
		if (ret2.match === 0) {
			throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);	
		} 
		value2 = readRegister(ret2.indexComp, ret2.indexElem);

		// Linear Congruential Generator (LCG)
		// Constants from Numerical Recipes
		_seed = (_seed * 1664525 + 1013904223) >>> 0;
		var rand = _seed / 0xFFFFFFFF;

		if (value2 === 0) {
			// Si solo hay un valor, devuelve un valor aleatorio entre 0 y value1
			var randomValue = Math.floor(rand * value1);
			writeRegister(randomValue, ret1.indexComp, ret1.indexElem);
		} else {
			// Si hay 2 valores, devuelve un valor aleatorio entre value1 y value2
			if (value1 > value2) {
				var temp = value1;
				value1 = value2;
				value2 = temp;
			}
			var randomValue = Math.floor(rand * (value2 - value1 + 1)) + value1;
			writeRegister(randomValue, ret1.indexComp, ret1.indexElem);
		}
	},
	// Serial functions
	0xcc:  function cr_serial_available() {
		console.log("serial_available");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		if(serial_begin != 0 && initArduino != 0) {
			// Devuelve la cantidad de caracteres pendientes en el buffer de entrada
			var available = (typeof keyboard === "string") ? keyboard.length : 0;
			writeRegister(available, ret1.indexComp, ret1.indexElem);  
		}
		else {
			//ERROR
			writeRegister(-1, ret1.indexComp, ret1.indexElem);
		 }
		
	},
    0xd0:  function cr_serial_availableForWrite() {
		console.log("serial_availableForWrite");
		var ret1 = crex_findReg('a0');
		if (ret1.match === 0) {
			throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
		}
		if(serial_begin != 0 && initArduino != 0) {
			// Ready but with nothing being sended TODO: simulate complex scenaries
			// writeRegister(0, ret1.indexComp, ret1.indexElem);
			writeRegister(64, ret1.indexComp, ret1.indexElem);  //simulates 64k buffer
			//in real hw it will only show data if its receiving data 
		}
		else {
			//ERROR
			writeRegister(-1, ret1.indexComp, ret1.indexElem);
		 }
	},
    0xd4:  function cr_serial_begin() {
		console.log("serial_begin");
		if (initArduino != 0) {
			if (serial_begin === 0) {
				var ret1 = crex_findReg('a0') ;
				if (ret1.match === 0) {
					throw packExecute(true, "capi_syscall: register " + 'a0' + " not found", 'danger', null);
				}

				/* Print integer */
				var value   = readRegister(ret1.indexComp, ret1.indexElem);
				var val_int = parseInt(value.toString()) >> 0 ;	
				serial_begin = val_int; 
				console.log("serial_begin: " + serial_begin);
			}
		}
	},
    0xd8:  function cr_serial_end() {
		console.log("serial_end");
		if (serial_begin != 0 && initArduino != 0) {
			serial_begin = 0; // Reset serial_begin
		}
	},
	0xdc:  function cr_serial_find() {
		console.log("serial_find");
		if (serial_begin != 0 && initArduino != 0) {
			var ret1 = crex_findReg('a0');
			if (ret1.match == 0) {
				throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
			}

			var addr = readRegister(ret1.indexComp, ret1.indexElem);
			var search = readMemory(parseInt(addr), "string");
			var buffer = app._data.keyboard;

			// Si el buffer está vacío, espera entrada y retorna
			if (!buffer || buffer.length === 0) {
				run_program = 3;
				return keyboard_read(kbd_read_string, ret1);
			}

			if (buffer.indexOf(search) !== -1) {
				console.log("serial_find: " + search + " found in " + buffer);
				writeRegister(1, ret1.indexComp, ret1.indexElem);
			} else {
				console.log("serial_find: " + search + " not found in " + buffer);
				writeRegister(0, ret1.indexComp, ret1.indexElem);
			}
			app._data.keyboard = "";
			app._data.display = "";
			keyboard = "";
		}
	},
    0xe0:  function cr_serial_findUntil() {
		console.log("serial_findUntil");
		if (serial_begin != 0 && initArduino != 0) {
			//console.log(app._data.keyboard);
			// Search character is in register a0
				var ret1 = crex_findReg('a0') ;
				if (ret1.match == 0) {
					throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
				}

				var addr = readRegister(ret1.indexComp, ret1.indexElem);
				var search  = readMemory(parseInt(addr), "string") ;
				// Ex character is in register a1
				var ret2 = crex_findReg('a1') ;
				if (ret2.match == 0) {
					throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
				}

				var addr2 = readRegister(ret2.indexComp, ret2.indexElem);
				var ex  = readMemory(parseInt(addr2), "string") ;

				var buffer = app._data.keyboard;
				var idxSearch = buffer.indexOf(search);
				var idxEx = buffer.indexOf(ex);
				if (idxSearch !== -1 && (idxEx === -1 || idxEx > idxSearch))  {
				// La subcadena está presente
					writeRegister(1, ret1.indexComp, ret1.indexElem); // Return 1 if found
				}
				else {
					writeRegister(0, ret1.indexComp, ret1.indexElem); // Return 0 if not found
				}
				// serial.find is destructive, so we clean the buffer
				app._data.keyboard = "";
				app._data.display = "";
				keyboard = "";

			

		}
	},
    0xe4:  function cr_serial_flush() {
		console.log("serial_flush");
		//Cleans the serial buffer. Not exaclty what the board does, imitates Arduino 1.0
		if (serial_begin != 0 && initArduino != 0) {
			keyboard = "";
			if (typeof app !== "undefined" && app._data) {
				app._data.keyboard = "";
				app._data.display = "";
			}
		}
	
	},
	0xe8:  function cr_serial_parseFloat() {
		console.log("serial_parseFloat");
		if (serial_begin != 0 && initArduino != 0) {
			var ret1 = crex_findReg('fa0');
			if (ret1.match == 0) {
				throw packExecute(true, "capi_syscall: register fa0 not found", 'danger', null);
			}
	
			var addr = readRegister(ret1.indexComp, ret1.indexElem);
			var buffer = app._data.keyboard;
	
			// Si el buffer está vacío, espera entrada y retorna
			if (!buffer || buffer.length === 0) {
				run_program = 3;
				return keyboard_read(kbd_read_string, ret1);
			}
	
			// Busca el número flotante en el buffer
			var regex = /\s*(-?\d+(?:\.\d+)?)/g;
			var match = regex.exec(buffer);
			if (match && match.length > 1) {
				var value = parseFloat(match[1]);
				console.log("serial_parseFloat: found " + value + " in " + buffer);
				writeRegister(value, ret1.indexComp, ret1.indexElem, "SFP-Reg"); 
			} else {
				console.log("serial_parseFloat: no float found in " + buffer);
				writeRegister(0.0, ret1.indexComp, ret1.indexElem, "SFP-Reg"); // Return 0 if not found
			}
			app._data.keyboard = "";
			keyboard = "";
		}
	},
    0xec:  function cr_serial_parseInt() {console.log("serial_parseInt");
		if (serial_begin != 0 && initArduino != 0) {
			var ret1 = crex_findReg('a0');
			if (ret1.match == 0) {
				throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
			}

			var addr = readRegister(ret1.indexComp, ret1.indexElem);
			var buffer = app._data.keyboard;

			// Si el buffer está vacío, espera entrada y retorna
			if (!buffer || buffer.length === 0) {
				run_program = 3;
				return keyboard_read(kbd_read_string, ret1);
			}

			// Busca el número entero en el buffer
			var regex = new RegExp("\\s*(-?\\d+)", "g");
			var match = regex.exec(buffer);
			if (match && match.length > 1) {
				var value = parseInt(match[1], 10);
				console.log("serial_parseInt: found " + value + " in " + buffer);
				writeRegister(value, ret1.indexComp, ret1.indexElem);
			} else {
				console.log("serial_parseInt: " + search + " not found in " + buffer);
				writeRegister(0, ret1.indexComp, ret1.indexElem); // Return 0 if not found
			}
			app._data.keyboard = "";
			keyboard = "";
		}
	},
    0xf0:  function cr_serial_read() {
			console.log("serial_read");
			if (serial_begin != 0 && initArduino != 0) {
				capi_read_char('a0'); 
			}

	},
    0xf4:  function cr_serial_readBytes() {
		console.log("serial_readBytes");
		capi_read_string ( 'a0', 'a1' );
    },
    0xf8:  function cr_serial_readBytesUntil() { //REVISAR
		console.log("serial_readBytesUntil");
		if (serial_begin != 0 && initArduino != 0) {
			// Break character is in register a0
			var ret_a0 = crex_findReg('a0');
			if (ret_a0.match === 0) {
				throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
			}
			var endChar = readRegister(ret_a0.indexComp, ret_a0.indexElem);
			console.log("serial_readBytesUntil: endChar = " + String.fromCharCode(endChar) + ", charCode = " + endChar);
			var buffer = "";
			// Len in a2
			var ret_a2 = crex_findReg('a2');
			if (ret_a2.match === 0) {
				throw packExecute(true, "capi_syscall: register a2 not found", 'danger', null);
			}
			var len = readRegister(ret_a2.indexComp, ret_a2.indexElem);
			var done = 0;
			while (done < len) {
				capi_read_char('a0');
				var ret1 = crex_findReg('a0');
				if (ret1.match === 0) {
					throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
				}
				var charCode = readRegister(ret1.indexComp, ret1.indexElem);
				var char = String.fromCharCode(charCode);
				console.log("serial_readBytesUntil: char = " + char + ", charCode = " + charCode);
				if (charCode === endChar) {
					break;
				}
				buffer += char;
				done ++;
			}
			var ret_a1 = crex_findReg('a1');
			if (ret_a1.match !== 0) {
				var addr = readRegister(ret_a1.indexComp, ret_a1.indexElem);
				writeMemory(buffer, parseInt(addr), "string");
			}
		}

	},
    0xfc:  function cr_serial_readString() {
		console.log("serial_readString");
		if (serial_begin != 0 && initArduino != 0) {
			capi_cr_readString('a0')
		}
		}, // Revisar
    0x100:  function cr_serial_readStringUntil() {console.log("serial_readStringUntil");},
	0x104:  function cr_serial_write() {
		console.log("serial_write");
		if (serial_begin != 0 && initArduino != 0) {
			var ret1 = crex_findReg('a0'); 
			// var ret2 = crex_findReg('a1'); 
			// if (ret1.match === 0) {
			// 	throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
			// }
			// var value = readRegister(ret1.indexComp, ret1.indexElem);
			// // Case: serial.write(buf,len). Len must be a value not a memory address
			// if (ret2.match !== 0) {
			// 	var len = readRegister(ret2.indexComp, ret2.indexElem);
			// 	console.log("serial_write: " + value + ", len: " + len);
			// 	if (len > 0 || len < 100) { //if its a number and can fit
			// 		var output = "";
			// 		for (var i = 0; i < len; i++) {
			// 			var byte = readMemory(parseInt(value) + i, "byte");
			// 			output += String.fromCharCode(byte);
			// 			console.log("serial_write: byte " + i + " = " + byte);
			// 		}
			// 		display_print(output);
			// 		writeRegister(len, ret1.indexComp, ret1.indexElem);
			// }
				if (ret1.match === 0) {
					throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
				}
				value= readRegister(ret1.indexComp, ret1.indexElem);
				if (typeof value === "number" && value < 256) {
					var char = String.fromCharCode(value & 0xFF);
					console.log("serial_write: " + char);
					display_print(char);
					writeRegister(1, ret1.indexComp, ret1.indexElem);
				} else {
					// Memory direction, imprime string completa
					var msg = readMemory(parseInt(value), "string");
					display_print(msg);
					writeRegister(msg.length, ret1.indexComp, ret1.indexElem);
				}
			} 
			
		},
	0x108:  function cr_serial_printf() 
	{
		console.log("serial_printf ") ; 
		if (serial_begin != 0 && initArduino != 0) {
			capi_printf('a0');
		}
	},
};

function capi_arduino (funcName, pc_state)
{
	var key = Number(pc_state) + Number(funcName) - 4; 
	console.log("CREATino function called: " + key) ;
    if (key in hookMap)
    {
        hookMap[Math.abs(key)]();
        return true;
    }
    else {
        console.log("Not Arduino") ;
        return false;
    }
}
function capi_printf ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.printf');
	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	/* Primary value */
	var addr = readRegister(ret1.indexComp, ret1.indexElem);
    console.log("print_addr: "+ addr)
    var msg  = readMemory(parseInt(addr), "string") ;
	console.log("print_string: "+ msg)
	/* Check if there are more arguments */
	var i = 1;

	//while (/%[csd]/.test(msg)) {
	while (msg.includes("%s") || msg.includes("%c") || msg.includes("%d") || msg.includes("%f")	) {
    // Hay un % seguido de una consonante (mayúscula o minúscula)
		// Get next register
		var next = msg.match(/%([csdf])/i)[1];
		console.log("next: " + next) ;
		if (next === 'c') {
			// Print char
			var ret2 = crex_findReg('a' + i) ;
			if (ret2.match == 0) {
				throw packExecute(true, "capi_syscall: register a0 not found", 'danger', null);
			}
			var aux    = readRegister(ret2.indexComp, ret2.indexElem);
			var aux2   = aux.toString(16);
			var length = aux2.length;

			var value = aux2.substring(length-2, length) ;
			value = String.fromCharCode(parseInt(value, 16)) ;
			msg = msg.replace(/%c/, value) ;
		}
		else if (next === 's') {
			// Print string
			var ret2 = crex_findReg('a' + i) ;
			if (ret2.match == 0) {
				throw packExecute(true, "capi_syscall: register a" + i + " not found", 'danger', null);
			}
			var addr = readRegister(ret2.indexComp, ret2.indexElem);
			console.log("print_addr: "+ addr)
			var value = readMemory(parseInt(addr), "string") ;
			msg = msg.replace(/%s/, value) ;
		}
		else if (next === 'd') {
			// Print integer
			var ret2 = crex_findReg('a' + i) ;
			if (ret2.match == 0) {
				throw packExecute(true, "capi_syscall: register a" + i + " not found", 'danger', null);
			}
			var value = readRegister(ret2.indexComp, ret2.indexElem);
			console.log("value: " + value) ;
			var val_int = parseInt(value.toString()) >> 0 ;
			msg = msg.replace(/%d/, full_print(val_int, null, false)) ;
		}
		else if (next === 'f') {
			/*ESP32C3 does not have fpu support :(*/ 
			// Print float
			var ret2 = crex_findReg('fa' + i); // fa1, fa2, ...
			if (ret2.match == 0) {
				throw packExecute(true, "capi_syscall: register fa" + i + " not found", 'danger', null);
			}
			var value = readRegister(ret2.indexComp, ret2.indexElem, "SFP-Reg");
			if (Number.isInteger(value)) {
				console.log("value is integer: " + value) ;
				value = value + 0.0;
				msg = msg.replace(/%f/, value.toFixed(1));
			} else {
				value = parseFloat(value);
				msg = msg.replace(/%f/, value.toString());
			}
		}
		i= i + 1;

		console.log("msg: " + msg) ;
	
	}
	/* Print message */
	display_print(msg) ;
}

function capi_cr_readString ( value1 )
// TODO: Create an inside buffer??
{
    /* Google Analytics */
    creator_ga('execute', 'execute.syscall', 'execute.syscall.read_string');

    /* Get register id */
    var ret1 = crex_findReg(value1) ;
    if (ret1.match === 0) {
        throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
    }

    // Usa el registro 'a1' para el tamaño del buffer y asígnale 100
    var ret2 = crex_findReg('a1');
    if (ret2.match === 0) {
        throw packExecute(true, "capi_syscall: register a1 not found", 'danger', null);
    }
    writeRegister(100, ret2.indexComp, ret2.indexElem);

    if (typeof document != "undefined") {
        document.getElementById('enter_keyboard').scrollIntoView();
    }

    // Asigna el tamaño del buffer como si fuera el segundo registro
    ret1.indexComp2 = ret2.indexComp;
    ret1.indexElem2 = ret2.indexElem;

    run_program = 3;
    return keyboard_read(kbd_read_string, ret1) ;
}


function capi_loaded(){
    /* Google Analytics */
    creator_ga('execute', 'execute.arduino', 'execute.arduino.loaded');
    if (typeof load_binary !== "undefined" && load_binary && update_binary.instructions_tag) {
        let tags = update_binary.instructions_tag;
        if (tags.length > 0) {
            let last = tags[tags.length - 1];
            let last_addr = last.addr;
            console.log("Última dirección registrada en la librería:", last_addr);
            return last_addr; // Puedes devolverla como número o string
        } else {
            console.log("La librería está cargada pero no tiene instrucciones.");
            return 0;
        }
    } else {
        console.log("No hay librería cargada");
        return 0;
    }
}



/*
 *  CREATOR instruction description API:
 *  Assert
 */

function capi_raise ( msg )
{
	if (typeof app !== "undefined"){
		app.exception(msg);
	}
	else
	{
		console.log(msg);
	}
}

function capi_arithmetic_overflow ( op1, op2, res_u )
{
	op1_u = capi_uint2int(op1) ;
	op2_u = capi_uint2int(op2) ;
	res_u = capi_uint2int(res_u) ;

	return ((op1_u > 0) && (op2_u > 0) && (res_u < 0)) || 
		   ((op1_u < 0) && (op2_u < 0) && (res_u > 0)) ;
}

function capi_bad_align ( addr, type )
{
	size = creator_memory_type2size(type) ;
	return (addr % size !== 0) ; // && (architecture.properties.memory_align == true) ; <- FUTURE-WORK
}


/*
 *  CREATOR instruction description API:
 *  Memory access
 */

/*
 * Name:        mp_write - Write value into a memory address
 * Sypnosis:    mp_write (destination_address, value2store, byte_or_half_or_word)
 * Description: similar to memmove/memcpy, store a value into an address
 */

function capi_mem_write ( addr, value, type, reg_name )
{
	var size = 1 ;

	// 1) check address is aligned
	if (capi_bad_align(addr, type))
	{
		capi_raise("The memory must be aligned") ;
		creator_executor_exit( true );
	}

	// 2) check address is into text segment

	// check if kernel to compute offset
	let mem_offset = architecture.memory_layout.length == 10 ? 4 : 0;

	var addr_16 = parseInt(addr, 16);
	if((addr_16 >= parseInt(architecture.memory_layout[mem_offset + 0].value)) && (addr_16 <= parseInt(architecture.memory_layout[mem_offset + 1].value)) && (checkDeviceAddr(addr) === null))
    {
        capi_raise('Segmentation fault. You tried to write in the text segment');
        creator_executor_exit( true );
    }

	// 3) write into memory
	try {
		writeMemory(value, addr, type);
	} 
	catch(e) {
		capi_raise("Invalid memory access to address '0x" + addr.toString(16) + "'") ;
		creator_executor_exit( true );
	}

	// 4) Call convenction
	var ret = crex_findReg(reg_name) ;
	if (ret.match === 0) {
		return;
	}

	var i = ret.indexComp ;
	var j = ret.indexElem ;

	creator_callstack_newWrite(i, j, addr, type);
}

/*
 * Name:        mp_read - Read value from a memory address
 * Sypnosis:    mp_read (source_address, byte_or_half_or_word)
 * Description: read a value from an address
 */

function capi_mem_read ( addr, type, reg_name )
{
	var size = 1 ;
	var val  = 0x0 ;

	// 1) check address is aligned
	if (capi_bad_align(addr, type))
	{
		capi_raise("The memory must be aligned") ;
		creator_executor_exit( true );
	}

	// 2) check address is into text segment
	var addr_16 = parseInt(addr, 16);

	// check if kernel to compute offset
	let mem_offset = architecture.memory_layout.length == 10 ? 4 : 0;

	if((addr_16 >= parseInt(architecture.memory_layout[mem_offset + 0].value)) && (addr_16 <= parseInt(architecture.memory_layout[mem_offset + 1].value)) && (checkDeviceAddr(addr) === null))
    {
        capi_raise('Segmentation fault. You tried to read in the text segment');
        creator_executor_exit( true );
    }

	// 3) read from memory
	try {
		val = readMemory(addr, type);
	} 
	catch(e) {
	   capi_raise("Invalid memory access to address '0x" + addr.toString(16) + "'") ;
	   creator_executor_exit( true );
	}

	var ret = creator_memory_value_by_type(val, type) ;

	// 4) Call convenction
	var find_ret = crex_findReg(reg_name) ;
	if (find_ret.match === 0) {
		return ret;
	}

	var i = find_ret.indexComp ;
	var j = find_ret.indexElem ;
	
	creator_callstack_newRead(i, j, addr, type);

	// 5) return value
	return ret ;
}



/*
 *  CREATOR instruction description API:
 *  Syscall
 */

function capi_exit ( )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.exit');

	return creator_executor_exit( false ) ;
}

function capi_print_int ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.print_int');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match === 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	/* Print integer */
	var value   = readRegister(ret1.indexComp, ret1.indexElem);
	var val_int = parseInt(value.toString()) >> 0 ;


	var value = readRegister(ret1.indexComp, ret1.indexElem);
	var val_int = parseInt(value.toString()) >> 0 ;

	display_print(full_print(val_int, null, false));
}

function capi_print_float ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.print_float');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	/* Print float */
	var value = readRegister(ret1.indexComp, ret1.indexElem, "SFP-Reg");
	var bin = float2bin(value);

	display_print(full_print(value, bin, true));
}

function capi_print_double ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.print_double');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	/* Print double */
	var value = readRegister(ret1.indexComp, ret1.indexElem, "DFP-Reg");
	var bin = double2bin(value);

	display_print(full_print(value, bin, true));
}

function capi_print_char ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.print_char');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	/* Print char */
	var aux    = readRegister(ret1.indexComp, ret1.indexElem);
	var aux2   = aux.toString(16);
	var length = aux2.length;

	var value = aux2.substring(length-2, length) ;
	value = String.fromCharCode(parseInt(value, 16)) ;

	display_print(value) ;
}

function capi_print_string ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.print_string');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	/* Print string */
	var addr = readRegister(ret1.indexComp, ret1.indexElem);
    var msg  = readMemory(parseInt(addr), "string") ;
	display_print(msg) ;
}

function capi_read_int ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.read_int');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	/* Read integer */
        if (typeof document != "undefined") {
	    document.getElementById('enter_keyboard').scrollIntoView();
	}

	run_program = 3;
	return keyboard_read(kbd_read_int, ret1) ;
}

function capi_read_float ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.read_float');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

        if (typeof document != "undefined") {
	    document.getElementById('enter_keyboard').scrollIntoView();
	}

	run_program = 3;
	return keyboard_read(kbd_read_float, ret1) ;
}

function capi_read_double ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.read_double');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

        if (typeof document != "undefined") {
	    document.getElementById('enter_keyboard').scrollIntoView();
	}

	run_program = 3;
	return keyboard_read(kbd_read_double, ret1) ;
}

function capi_read_char ( value1 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.read_char');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match == 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

        if (typeof document != "undefined") {
	    document.getElementById('enter_keyboard').scrollIntoView();
	}

	run_program = 3;
	return keyboard_read(kbd_read_char, ret1) ;
}

function capi_read_string ( value1, value2 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.read_string');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match === 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	var ret2 = crex_findReg(value2) ;
	if (ret2.match === 0) {
		throw packExecute(true, "capi_syscall: register " + value2 + " not found", 'danger', null);
	}

	/* Read string */
	if (typeof document != "undefined") {
	    document.getElementById('enter_keyboard').scrollIntoView();
	}

	ret1.indexComp2 = ret2.indexComp ;
	ret1.indexElem2 = ret2.indexElem ;

	run_program = 3;
	return keyboard_read(kbd_read_string, ret1) ;
}

function capi_sbrk ( value1, value2 )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.sbrk');

	/* Get register id */
	var ret1 = crex_findReg(value1) ;
	if (ret1.match === 0) {
		throw packExecute(true, "capi_syscall: register " + value1 + " not found", 'danger', null);
	}

	var ret2 = crex_findReg(value2) ;
	if (ret2.match === 0) {
		throw packExecute(true, "capi_syscall: register " + value2 + " not found", 'danger', null);
	}

	/* Request more memory */
	var new_size = parseInt(readRegister(ret1.indexComp, ret1.indexElem)) ;
	if (new_size < 0) {
		throw packExecute(true, "capi_syscall: negative size", 'danger', null) ;
	}

    var new_addr = creator_memory_alloc(new_size) ;
	writeRegister(new_addr, ret2.indexComp, ret2.indexElem);
}

function capi_get_clk_cycles ( )
{
	/* Google Analytics */
	creator_ga('execute', 'execute.syscall', 'execute.syscall.get_clk_cycles');

	return total_clk_cycles;
}


/*
 *  CREATOR instruction description API:
 *  Check stack
 */

function capi_callconv_begin ( addr )
{
	var function_name = "" ;

	// 1) Passing Convection enable?
	if (architecture.arch_conf[6].value === 0) {
		return;
	}

	// 2) get function name
	if (typeof architecture.components[0] !== "undefined")
	{
		if ((addr_label[addr] ?? []).length === 0)
			 function_name = "0x" + parseInt(addr).toString(16) ;
		else function_name = addr_label[addr].join(" | ") ;
	}

	// 3) callstack_enter
	creator_callstack_enter(function_name) ;
}

function capi_callconv_end ()
{
	// 1) Passing Convection enable?
	if (architecture.arch_conf[6].value === 0) {
		return;
	}

	// 2) Callstack_leave
	var ret = creator_callstack_leave();

	// 3) If everything is ok, just return 
	if (ret.ok) {
		return;
	}

	// 4) Othewise report some warning...
	// Google Analytics
	creator_ga('execute', 'execute.exception', 'execute.exception.protection_jrra' + ret.msg);

	// User notification
	crex_show_notification(ret.msg, 'danger') ;
}



/*
 *  CREATOR instruction description API:
 *  Draw stack
 */

function capi_drawstack_begin ( addr )
{
	var function_name = "" ;

	// 1.- get function name
	if (typeof architecture.components[0] !== "undefined")
	{
		if ((addr_label[addr] ?? []).length === 0)
			 function_name = "0x" + parseInt(addr).toString(16) ;
		else function_name = addr_label[addr].join(" | ") ;
	}

	// 2.- callstack_enter
	track_stack_enter(function_name) ;
}

function capi_drawstack_end ()
{
	// track leave
	var ret = track_stack_leave() ;

	// 2) If everything is ok, just return 
	if (ret.ok) {
		return;
	}

	// User notification
	crex_show_notification(ret.msg, 'warning') ;
}


/*
 *  CREATOR instruction description API:
 *  Representation
 */

function capi_split_double ( reg, index )
{
	var value = bin2hex(double2bin(reg));
	console_log(value);
	if(index === 0){
		return value.substring(0,8);
	}
	if(index === 1) {
		return value.substring(8,16);
	}
}

function capi_uint2float32 ( value )
{
	return uint_to_float32(value) ;
}

function capi_float322uint ( value )
{
	return float32_to_uint(value) ;
}

function capi_int2uint ( value )
{
	return (value >>> 0) ;
}

function capi_uint2int ( value )
{
	return (value >> 0) ;
}

function capi_uint2float64 ( value0, value1 )
{
	return uint_to_float64(value0, value1) ;
}

function capi_float642uint ( value )
{
	return float64_to_uint(value) ;
}

function capi_check_ieee ( s, e, m )
{
	return checkTypeIEEE(s, e, m) ;
}

function capi_float2bin ( f )
{
	return float2bin(f) ;
}
