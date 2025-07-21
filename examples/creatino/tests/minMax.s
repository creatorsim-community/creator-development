# Creatino example: min and max
.data
    msg: .string "%d"
    
.text
main:

	addi sp, sp, -4      
    sw ra, 0(sp)          
    jal ra, initArduino    
    lw ra, 0(sp)          
    addi sp, sp, 4 
  
  	li a0, 40
    li a1, 80
    
    jal ra, min
    
    mv a1, a0
    
    li a0, 115200 
    addi sp, sp, -4      
    sw ra, 0(sp)     
    jal ra, serial_begin
    lw ra, 0(sp)     
    addi sp, sp, 4 
    
    la a0, msg
    
    addi sp, sp, -16       
    sw ra, 12(sp)          
    jal ra, serial_printf
    lw ra, 12(sp)          
    addi sp, sp, 16       
    jr ra
    
    
    
    

    #return 
    jr ra

