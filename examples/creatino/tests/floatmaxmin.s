
# Creatino example: Max and min functions with float

.data
    number1:    .float 40.5
    number2:    .float 38.5
    msg:        .string "%f\n"

.text
main:
    addi sp, sp, -4
    sw ra, 0(sp)
    jal ra, initArduino
    lw ra, 0(sp)
    addi sp, sp, 4

    # Cargar valores a registros
    la t0, number1
    la t1, number2

    flw f10, 0(t0)   # number1
    flw f11, 0(t1)   # number2

    # Lookup the max number (expecter result: 40.5)
    jal ra, fmax
    fmv.s fa1, fa0    # preparar resultado en f1 para printf

    li a0, 115200
    addi sp, sp, -4
    sw ra, 0(sp)
    jal ra, serial_begin
    lw ra, 0(sp)
    addi sp, sp, 4

    # Print
    la a0, msg
    addi sp, sp, -16
    sw ra, 12(sp)
    jal ra, serial_printf
    lw ra, 12(sp)
    addi sp, sp, 16
    
    #Min function
    la t0, number1
    la t1, number2
    
    flw f10, 0(t0)   # number1
    flw f11, 0(t1)   # number2

    # Lookup the max number (expecter result: 40.5)
    jal ra, fmin
    fmv.s fa1, fa0    
    
    # Print
    la a0, msg
    addi sp, sp, -16
    sw ra, 12(sp)
    jal ra, serial_printf
    lw ra, 12(sp)
    addi sp, sp, 16
    

    jr ra
