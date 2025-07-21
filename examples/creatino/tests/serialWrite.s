# Creatino example: difference between printf and write
.data
    print: .string "\n%d"
    chain: .string "\nThis prints 15"
.text
  main:
      jal ra, initArduino
      li a0, 115200
      jal ra, serial_begin
      # Serial.write sends bytes to the serial port.
      li a0, 69 
      jal ra, serial_write #Prints "E"
      

      la a0, print
      li a1, 69
      jal ra, serial_printf #Prints 69
      
      #Serial.write returns number of bytes sended on a string
      
      la a0, chain
      jal ra, serial_write
      
      mv a1, a0
      la a0, print
      jal ra, serial_printf
      

      jr ra
    
    
	