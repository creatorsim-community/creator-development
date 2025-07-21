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


  /* jshint esversion: 6 */

  var uielto_instruction_help = {
    
    props:      {
                  id:                       { type: String, required: true },
                  architecture_name:        { type: String, required: true },
                  architecture:             { type: Object, required: true },
                  architecture_guide:       { type: String, required: true },
                  instruction_help_size:    { type: Object, required: true }
                   
                },

    data:       function () {
                  return {
                    //Help Filter
                    instHelpFilter: null,

                    //Help table
                    insHelpFields: ['name']
                  }
                },

    methods:   {
                  get_width(){
                    return this._props.instruction_help_size + "vw"
                  }
                },

    template:   '<b-sidebar :id="id" sidebar-class="border-left border-info px-3 py-2" right shadow' + 
                '           title="Instruction Help"' +
                '           :width="get_width()">' +
                ' ' +
                ' <b-form-input id="filter-input"' +
                '               v-model="instHelpFilter"' +
                '               type="search"' +
                '               placeholder="Search instruction"' +
                '               size=sm' +
                ' ></b-form-input>' +
                ' ' +
                ' <br>' +
                ' <a v-if="architecture_guide !=\'\'" target="_blank" :href="architecture_guide"><span class="fas fa-file-pdf"></span> {{architecture_name}} Guide</a>' +
                ' <br>' +
                ' ' +
                ' <b-table small :items="architecture.instructions" ' +
                '                :fields="insHelpFields" ' +
                '                class="text-left help-scroll-y my-3"' +
                '                :filter="instHelpFilter"' +
                '                thead-class="d-none">' +
                ' ' +
                '   <template v-slot:cell(name)="row">' +
                '     <h4>{{row.item.name}}</h4>' +
                '     <em>{{row.item.signatureRaw}}</em>' +
                '     <br>' +
                '     {{row.item.help}}' +
                '   </template>' +
                ' ' +
                ' </b-table>' +
                ' ' +
                '</b-sidebar'
  }


  var uielto_creatino_help = {
    
    props:      {
                  id:                       { type: String, required: true },
                  architecture_name:        { type: String, required: true },
                  architecture:             { type: Object, required: true },
                  architecture_guide:       { type: String, required: true },
                  instruction_help_size:    { type: Object, required: true }
                   
                },

    data:       function () {
                  return {
                    //Help Filter
                    instHelpFilter: null,

                    //Help table
                    insHelpFields: ['name'],

                    arduinoJson: [
                      { group: "Digital I/O", items: [
                          { "name": "digitalRead (int pin)", "help": "Reads the value from a specified digital pin", "inputType": "int", "returnType": "int" },
                          { "name": "digitalWrite (int pin, int value)", "help": "Writes a value to a specified digital pin", "inputType": "int, int", "returnType": "void" },
                          { "name": "pinMode (int pin, int mode)", "help": "Configures a specified pin to behave either as an input or an output",
                            "inputType": "int, int", "returnType": "void" }, 
                      ]},
                      { group: "Analog I/O", items: [
                          { "name": "analogRead (int pin)", "help": "Reads the value  from a specified analog pin", "inputType": "int", "returnType": "int" }, 
                          {"name":"analogReadResolution (int bits)", "help": "Sets the resolution of the analog input", "inputType": "int", "returnType": "void" },   
                          { "name": "analogWrite (int pin, int value)", "help": "Writes an analog value to a specified pin", "inputType": "int, int", "returnType": "void" },
                      ]},
                      {group: "Trigonometry", items: [
                          { "name": "sin (float x)", "help": "Computes the sine of an angle (in radians)", "inputType": "float", "returnType": "float " },
                          { "name": "cos (float x)", "help": "Computes the cosine of an angle (in radians)", "inputType": "float", "returnType": "float " },
                          { "name": "tan (float x)", "help": "Computes the tangent of an angle (in radians)", "inputType": "float", "returnType": "float " },
                      ]},
                      { group:"Bit and Bytes", items: [
                          { "name": "bitRead (int value, int bit)", "help": "Reads a specific bit from a value", "inputType": "int, int", "returnType": "int" },
                          { "name": "bitWrite (int value, int bit, int bitValue)", "help": "Writes a specific bit to a value", "inputType": "int, int, int", "returnType": "void" },
                          { "name": "bitSet (int value, int bit)", "help": "Sets a specific bit in a value", "inputType": "int, int", "returnType": "void" },
                          { "name": "bitClear (int value, int bit)", "help": "Clears a specific bit in a value", "inputType": "int, int", "returnType": "void" },
                          { "name": "bit (int n)",  "help":  "Returns the value of a specific bit position",  "inputType":"int",  "returnType":"int" },
                          {"name":"highByte (int value)", "help": "Returns the high byte of a value", "inputType": "int", "returnType": "int" },
                          {"name":"lowByte (int value)", "help": "Returns the low byte of a value", "inputType": "int", "returnType": "int" },
                          
                        ]
                      },
                      { group: "Character and String", items: [
                        {"name": "isAlpha (char c)", "help": "Checks if a character is an alphabetic letter", "inputType": "char", "returnType": "bool" },
                        {"name": "isDigit (char c)", "help": "Checks if a character is a digit", "inputType": "char", "returnType": "bool" },
                        {"name": "isAlphaNumeric (char c)", "help": "Checks if a character is alphanumeric", "inputType": "char", "returnType": "bool" },
                        {"name" : "isHexadecimalDigit (char c)", "help": "Checks if a character is a hexadecimal digit", "inputType": "char", "returnType": "bool" },
                        {"name": "isAscii (char c)", "help": "Checks if a character is an ASCII character", "inputType": "char", "returnType": "bool" },
                        {"name": "isSpace (char c)", "help": "Checks if a character is a whitespace", "inputType": "char", "returnType": "bool" },
                        {"name": "isPunct (char c)", "help": "Checks if a character is a punctuation character", "inputType": "char", "returnType": "bool" },
                        {"name": "isGraph (char c)", "help": "Checks if a character is a graphical character", "inputType": "char", "returnType": "bool" },
                        {"name": "isControl (char c)", "help": "Checks if a character is a control character", "inputType": "char", "returnType": "bool" },
                        {"name": "isLowerCase (char c)", "help": "Checks if a character is a lowercase letter", "inputType": "char", "returnType": "bool"},
                        {"name": "isUpperCase (char c)", "help": "Checks if a character is an uppercase letter", "inputType": "char", "returnType": "bool" },
                        {"name": "isPrintable (char c)", "help": "Checks if a character is printable", "inputType": "char", "returnType": "bool" },
                        {"name": "toLowerCase (char c)", "help": "Converts a character to lowercase", "inputType": "char", "returnType": "char" },
                        {"name": "toUpperCase (char c)", "help": "Converts a character to uppercase", "inputType": "char", "returnType": "char" },
        
                      ]},

                      { group: "Mathematics", items: [
                          { "name": "abs (int x)",    "help": "Computes the absolute value of a number", "inputType": "int",   "returnType": "int" },
                          { "name": "max (int x, int y)",    "help": "Finds the maximum of two values",         "inputType": "int",   "returnType": "int" },
                          { "name": "min (int x, int y)",    "help": "Finds the minimum of two values",         "inputType": "int",   "returnType": "int" },
                          { "name": "pow (int base, int exp)",    "help": "Computes the value of a number raised to a power", "inputType": "int, int", "returnType": "int" },
                          { "name": "sqrt (int x)",   "help": "Computes the square root of a number",    "inputType": "int",   "returnType": "int" },
                          { "name": "sq (int x)",     "help": "Squares a number",                        "inputType": "int",   "returnType": "int" },
                          { "name": "fabs (float x)",   "help": "Computes the absolute value of a float",  "inputType": "float", "returnType": "float" },
                          { "name": "fmax (float x, float y)",   "help": "Finds the maximum of two floats",         "inputType": "float, float", "returnType": "float" },
                          { "name": "fmin (float x, float y)",   "help": "Finds the minimum of two floats",         "inputType": "float, float", "returnType": "float" },
                          { "name": "sqrtf (float x)",  "help": "Computes the square root of a float",     "inputType": "float", "returnType": "float" },
                          { "name": "sqf (float x)",    "help": "Squares a float",                         "inputType": "float", "returnType": "float" }
                        ]
                      },
                      { group: "Serial", items: [
                          { "name": "serial_available ()", "help": "Gets the number of bytes available for reading from the serial buffer", "inputType": "", "returnType": "" },
                          { "name": "serial_write (char *data)", "help": "Writes binary data to the serial port", "inputType": "char *", "returnType": "" },
                          { "name": "serial_read (char *buffer, int size)", "help": "Reads binary data from the serial port", "inputType": "char *, int", "returnType": "" },
                          { "name": "serial_printf (char *data)", "help": "Prints data to the serial port", "inputType": "char *", "returnType": "" },
                          { "name": "serial_begin (int baudrate)", "help": "Initializes the serial port with a specified baud rate", "inputType": "int", "returnType": "" },
                          { "name": "serial_end ()", "help": "Ends the serial communication", "inputType": "", "returnType": "" },
                          { "name": "serial_flush ()", "help": "Waits for the transmission of outgoing serial data to complete", "inputType": "", "returnType": "" },
                          { "name": "serial_readBytes (char *buffer, int length)", "help": "Reads a specified number of bytes from the serial port", "inputType": "char *, int", "returnType": "" },  
                          { "name": "serial_readStringUntil (char terminator)", "help": "Reads characters from the serial buffer until a specified terminator character is found", "inputType": "char", "returnType": "" },
                          { "name":"serial_find (char *target, int length)", "help": "Searches for a specific sequence of characters in the serial buffer", "inputType": "char *, int", "returnType": "" },
                          { "name": "serial_findUntil (char *target, int length, char terminator)", "help": "Searches for a specific sequence of characters in the serial buffer until a specified terminator character is found", "inputType": "char *, int, char", "returnType": "" },
                          { "name": "serial_parseInt ()", "help": "Parses an integer from the serial buffer", "inputType": "", "returnType": "int" },
                          { "name": "serial_parseFloat ()", "help": "Parses a float from the serial buffer", "inputType": "", "returnType": "float" },
                          { "name": "serial_availableForWrite ()", "help": "Checks if there is space available for writing in the serial buffer", "inputType": "", "returnType": "int" }, 
                          { "name": "serial_available()", "help": "Checks if there are bytes available to read from the serial buffer", "inputType": "", "returnType": "int" },

                          
                        ]
                      },
                      { group: "Time", items: [
                          { "name": "delay", "help": "Pauses the program for the specified amount of time (in milliseconds)", "inputType": "unsigned long", "returnType": "" },
                          { "name": "delayMicroseconds", "help": "Pauses the program for the specified amount of time (in microseconds)" }
                        ]
                      },
                      { group: "Random", items: [
                          { "name": "random (int min, int max)", "help": "Generates a random number", "inputType": "int", "returnType": "int" },
                          { "name": "randomSeed (int seed)", "help": "Seeds the random number generator", "inputType": "unsigned long", "returnType": "" }
                      ]}
                    ]
                  }},
    methods:   {
                  get_width(){
                    return this._props.instruction_help_size + "vw"
                  }
                },

    template:   '<b-sidebar :id="id" sidebar-class="border-left border-info px-3 py-2" right shadow' +
            '           title="Arduino functions Help"' +
            '           :width="get_width()">' +
            ' <b-form-input id="filter-input"' +
            '               v-model="instHelpFilter"' +
            '               type="search"' +
            '               placeholder="Search instruction"' +
            '               size=sm' +
            ' ></b-form-input>' +
            ' <br>' +
            '<a target="_blank" href="https://docs.arduino.cc/language-reference/#functions"><span class="fas fa-globe"></span> Arduino Guide</a>'+
            ' <br>' +
            ' <div v-for="section in arduinoJson" :key="section.group">' +
            '   <h4 class="mt-3"><strong>{{ section.group }}</strong></h4>' +
            '   <b-table small :items="section.items" ' +
            '            :fields="insHelpFields" ' +
            '            class="text-left help-scroll-y my-3"' +
            '            :filter="instHelpFilter"' +
            '            thead-class="d-none">' +
            '     <template v-slot:cell(name)="row">' +
            '       <h4>{{row.item.name}}</h4>' +
            '       <em>{{row.item.signatureRaw}}</em><br>' +
            '       {{row.item.help}}<br>' +
            '       <b>Input:</b> {{row.item.inputType}}<br>' +
            '       <b>Returns:</b> {{row.item.returnType}}' +
            '     </template>' +
            '   </b-table>' +
            ' </div>' +
            '</b-sidebar'
  }
var uielto_board_help = {
  props: {
    id:                    { type: String, required: true },
    architecture_name:     { type: String, required: true },
    architecture:          { type: Object, required: true },
    architecture_guide:    { type: String, required: true },
    instruction_help_size: { type: Object, required: true }
  },

  data: function () {
    return {
      instHelpFilter: null,

      insHelpFields: [{ key: 'image', label: 'Image' }],

      // Lista completa de boards
      board_list: [
        {
          name: "ESP32-C3 ARCHITECTURE",
          image: "https://docs.espressif.com/projects/esp-idf/en/v5.0/esp32c3/_images/esp32-c3-devkitc-02-v1-pinout.png"
        },
        {
          name: "ESP32-H2 ARCHITECTURE",
          image: "https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/_images/esp32-h2-devkitm-1-v1.2_pinlayout.png"
        },
        {
          name: "ESP32-C2 ARCHITECTURE",
          image: "https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c2/_images/esp8684-devkitm-1-pinout_v1.1.png"
        }
      ],

      selected_board: "ESP32-C3 ARCHITECTURE"
    }
  },

  computed: {
    // Devuelve solo la board seleccionada
    board_info() {
      return this.board_list.filter(b => b.name === this.selected_board);
    }
  },

  methods: {
    get_width() {
      return this._props.instruction_help_size + "vw";
    }
  },

  template: `
    <b-sidebar :id="id" sidebar-class="border-left border-info px-3 py-2" right shadow
               title="Board Distribution Help"
               :width="get_width()">

      <br>
      <a target="_blank" href="https://docs.espressif.com/projects/esp-idf/en/v5.0/esp32c3/hw-reference/esp32c3/user-guide-devkitc-02.html">
        <span class="fas fa-globe"></span> Hardware Documentation
      </a>

      <br><br>

      <b-form-group label="Select Board:" label-for="boardSelect">
        <b-form-select id="boardSelect"
                       v-model="selected_board"
                       :options="board_list.map(b => b.name)">
        </b-form-select>
      </b-form-group>

      <b-table small :items="board_info"
               :fields="insHelpFields"
               class="text-left help-scroll-y my-3"
               :filter="instHelpFilter"
               thead-class="d-none">
        <template #cell(image)="data">
          <div>
            <h5 class="font-weight-bold mb-2">{{ data.item.name }}</h5>
            <img :src="data.item.image" alt="Board Image" class="img-fluid mt-2" style="max-width:300px;" />
          </div>
        </template>
      </b-table>

    </b-sidebar>
  `
}
  Vue.component('sidebar-creatino_help', uielto_creatino_help) ;
  Vue.component('sidebar-board_help', uielto_board_help) ;
  Vue.component('sidebar-instruction-help', uielto_instruction_help) ;