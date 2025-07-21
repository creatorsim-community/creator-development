#Creatino example: Playing with binaries
.data
	msg: .string "Result: %d\n"
.text
setup:
	li a0, 115200
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra,  serial_begin
    lw ra, 0(sp)  
    addi sp, sp, 4
    
    # Test bit
    li a0, 2          
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra,  bit       # Call cr_bit
    lw ra, 0(sp)          
    addi sp, sp, 4
    # Expected result: a0 = 0b0100 (4)
    #Print
    mv a1, a0
    la a0, msg  
    addi sp, sp, -4       
    sw ra, 0(sp)      
    jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4
    
    # Test bitClear
    li a1, 3          # Set bit position to 3
    li a0, 0b1111     # Initial value: 0b1111 (15)
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra, bitClear 
    lw ra, 0(sp)          
    addi sp, sp, 4
    # Expected result: a0 = 0b0111 (7)

    mv a1, a0
    la a0, msg  
    addi sp, sp, -4       
    sw ra, 0(sp)      
    jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4
    
    # Test bitRead
    li a1, 2          # Set bit position to 2
    li a0, 0b0100     # Initial value: 0b0100 (4)
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra, bitRead   
    lw ra, 0(sp)          
    addi sp, sp, 4
    # Expected result: a0 = 1 (bit 2 is set)

    #Print
    mv a1, a0
    la a0, msg  
    addi sp, sp, -4       
    sw ra, 0(sp)      
    jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4
    
    # Test bitSet
    li a0, 0          # Set bit position to 1
    li a1, 1         # Set bit position to 1
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra,  bitSet    # Call cr_bitSet
    lw ra, 0(sp)          
    addi sp, sp, 4
    # Expected result: a0 = 0b0010 (2)
    
    #Print
    mv a1, a0
    la a0, msg  
    addi sp, sp, -4       
    sw ra, 0(sp)      
    jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4

    # Test cr_bitWrite (1)
    li a1, 2          
    li a0, 0b0000     
    li a2, 1          
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra, bitWrite  # Call cr_bitWrite
    lw ra, 0(sp)          
    addi sp, sp, 4
    # Expected result: a1 = 0b0100 (4)

    #Print
    mv a1, a0
    la a0, msg  
    addi sp, sp, -4       
    sw ra, 0(sp)      
    jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4
    
    # bitWrite (0)
    li a1, 2          
    li a0, 0b0100     
    li a2, 0          
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra, bitWrite  
    lw ra, 0(sp)          
    addi sp, sp, 4
    # Expected result: a1 = 0b0000 (0)

    #Print
    mv a1, a0
    la a0, msg  
    addi sp, sp, -4       
    sw ra, 0(sp)      
    jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4

    # Test lowByte
    li a0, 0x1234  # NÃºmero de 16 bits (4660 en decimal)
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra, lowByte 
    lw ra, 0(sp)          
    addi sp, sp, 4

    mv a1, a0
    la a0, msg  
    addi sp, sp, -4       
    sw ra, 0(sp)      
    jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4
    #Expected result: 52
    
    # High Byte
    li a0, 0x1234  # NÃºmero de 16 bits (4660 en decimal)
    addi sp, sp, -4       
    sw ra, 0(sp) 
    jal ra, highByte 
    lw ra, 0(sp)          
    addi sp, sp, 4
	# Expected result: 18
    mv a1, a0
    la a0, msg  
    addi sp, sp, -4       
    sw ra, 0(sp)      
    jal ra, serial_printf
    lw ra, 0(sp)          
    addi sp, sp, 4
    
    jr ra
main:
    jal ra, initArduino
    addi sp, sp, -4       
    sw ra, 0(sp)          
    jal ra,setup
    lw ra, 0(sp)          
    addi sp, sp, 4       
    jr ra