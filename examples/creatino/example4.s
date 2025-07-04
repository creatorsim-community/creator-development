
.data
    msg: .string "Hello %s %d"
    arg: .string "World"
        .align 2
    arg1: .word 2025


.text
setup:
    li a0, 115200 
    addi sp, sp, -4      
    sw ra, 0(sp)     
    jal ra, serial_begin
    lw ra, 0(sp)     
    addi sp, sp, 4 

    la a0, msg       
    la a1, arg       
    la t0, arg1
    lw a2, 0(t0)


    addi sp, sp, -16       
    sw ra, 12(sp)          
    jal ra, serial_printf
    lw ra, 12(sp)          
    addi sp, sp, 16       
    jr ra

loop:
    nop

main:
    addi sp, sp, -16       
    sw ra, 12(sp)          
    jal ra, initArduino
    jal ra, setup
    lw ra, 12(sp)          
    addi sp, sp, 16       
    jr ra

