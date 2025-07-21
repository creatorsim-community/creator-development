# Creatino Example: Starting Monitor Print
.data
	msg: .string "Hello! Serial here"
    msg2: .string "You should not see me"
.text
	main:
        # ESP-IDF needs to initiate Arduino component first
        jal ra, initArduino
        # Baud rate depends on the board you are using. Maybe the same values don't fit everywhere
        li a0, 115200
        jal ra, serial_begin
        la a0, msg
        jal ra, serial_printf
        jal ra, serial_end
        # You cutted serial connection. Now you can't see!!!
        la a0, msg
        jal ra, serial_printf
        
        jr ra