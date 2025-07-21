# Creatino: Guess what type of data is

.data
	true: .string "%c is a number (0-9)!!"
    true2: .string "\n %c is a alpha!!"
    .align 2
    true3: .string "\n %c is uppercase"
    false: .string "%c is not a number"
.text
	falseStatement:
        la a0, false
        jal ra, serial_printf
        jr ra
        
    trueStatement:
        la a0, true
        jal ra, serial_printf
        jr ra

    trueStatement2:
        la a0, true2
        jal ra, serial_printf
        jr ra
        
    trueStatement3:
        la a0, true3
        jal ra, serial_printf
        jr ra     
        
	main:
    	jal ra, initArduino
        li a0, 115200
        jal ra, serial_begin
        # Charge a char that is a number (isDigit only takes char)
        
        li a0, 51 # A in ascii
        mv a1,a0
        #la a0, letter
        #lw a0, 0(a0)
        jal ra, isDigit
        
        beqz a0, falseStatement
        jal ra, trueStatement
        
        # Check if its a Alpha
        
        li a0, 65 # A in ascii
         mv a1,a0
        
        jal ra, isAlpha
        beqz a0, falseStatement
        jal ra, trueStatement2
        
        #check if its UpperCase
        
        li a0, 65 # A in ascii
        mv a1,a0
        
        jal ra, isUpperCase
        beqz a0, falseStatement
        jal ra, trueStatement3
        
        
        
        jr ra
        