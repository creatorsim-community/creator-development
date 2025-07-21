
#Creatino example: parseFloat 
.data
	msg: .string "Enter a float number:\n"
    sol: .string "You entered %f\n"

.text

number:
	fmv.s fa1, fa0
    la a0, sol
    addi sp, sp, -4       
    sw ra, 0(sp)             
	jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4 
    jal ra, loop

setup:
	li a0, 115200
    addi sp, sp, -4       
    sw ra, 0(sp)             
	jal ra, serial_begin
    lw ra, 0(sp)          
    addi sp, sp, 4 
    
    jr ra
    
loop:    
	la a0, msg 
	addi sp, sp, -4       
	sw ra, 0(sp)             
	jal ra, serial_printf
	lw ra, 0(sp)          
	addi sp, sp, 4 
    
	addi sp, sp, -4       
	sw ra, 0(sp)             
	jal ra, serial_parseFloat
	lw ra, 0(sp)          
	addi sp, sp, 4 

	feq.s a1, f0, f1   # a1 = (fa0 == 0.0) ? 1 : 0
    fmv.s f1, f0
	bnez a1, number   # si fa0 Ã¢ÂÂ  0.0, ir a number

	j loop

    
    
main:
	jal ra, initArduino
    addi sp, sp, -4       
    sw ra, 0(sp)             
    jal ra, setup
    lw ra, 0(sp)          
    addi sp, sp, 4              
    j loop