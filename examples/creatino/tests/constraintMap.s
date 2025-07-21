#Creatino function: Difference between map and constrain
.data
	msg: .string "%d\n"
.text

main:
    addi sp, sp, -4       
    sw ra, 0(sp)          
	jal ra, initArduino 
    lw ra, 0(sp)          
    addi sp, sp, 4  
       
    addi sp, sp, -4       
    sw ra, 0(sp)          
    jal ra, setup
    lw ra, 0(sp)          
    addi sp, sp, 4              
    jr ra

setup:
    li a0, 115200 
    addi sp, sp, -4       
    sw ra, 0(sp)          
    jal ra, serial_begin
    lw ra, 0(sp)          
    addi sp, sp, 4 
    # Constrain: a value has to be in a range
    li a0, 1000 
    li a1, 0
    li a2, 255
    
    addi sp,sp, -4
    sw ra, 0(sp)
    jal ra, constrain #Expected result: 255
    lw ra, 0(sp)
    addi sp, sp, 4
    
    mv a1, a0
    
    la a0, msg
    addi sp,sp, -4
    sw ra, 0(sp)
    jal ra, serial_printf
    lw ra, 0(sp)
    addi sp, sp, 4
    
    # Map: Maps a value to another range: for example, fom 10 bits(0-1023) to 8 bits (0-255)
    li a0, 1000
    li a1, 0 # fromLow
    li a2, 1023 #fromUpper
    li a3, 0 #toLow
    li a4, 255 #toUpper
    
    addi sp,sp, -4
    sw ra, 0(sp)
    jal ra, map
    lw ra, 0(sp)
    addi sp, sp, 4
    
    mv a1, a0
    
    la a0, msg
    addi sp,sp, -4
    sw ra, 0(sp)
    jal ra, serial_printf
    lw ra, 0(sp)
    addi sp, sp, 4
	jr ra
    