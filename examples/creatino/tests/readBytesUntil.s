# Creatino example:readBytes
.data
    space:   .zero 100 #Buffer to place the string
    print:  .string "%s"
    char: .byte 65 #A

.text
loop:
    # read int
    la a0, char
    lb a0, 0(a0)
    la a1, space
    la a2, 5 # number of letters it will have
    jal ra, serial_readBytesUntil

    # print: checkout it's printf!! 
    la a0, print
    la a1, space
    jal ra, serial_printf 

    # return
    j loop
main:
	jal ra, initArduino
    li a0, 115200
    jal ra, serial_begin
    j loop


