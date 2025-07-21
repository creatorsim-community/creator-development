
# Creatino example: Trigonometric functions

.data
    pi:    .float 3.1416
    grad:  .float 180.0
    value: .float 90.0
    msg:   .string "%f"

.text
main:
    # Llamar initArduino
    addi sp, sp, -4
    sw ra, 0(sp)
    jal ra, initArduino
    lw ra, 0(sp)
    addi sp, sp, 4

    # Cargar valores a registros
    la t0, pi
    la t1, grad
    la t2, value

    flw f0, 0(t0)   # pi
    flw f1, 0(t1)   # grad
    flw f2, 0(t2)   # value
	# Convert 90º to radians
    # f0 = value * pi
    fmul.s f0, f2, f0
    # f0 = (value * pi) / grad
    fdiv.s f0, f0, f1
    fmv.s fa0,f0

    # Llamar sin(f0)
    jal ra, sin
    fmv.s fa1, fa0    # preparar resultado en f1 para printf

    # Iniciar puerto serie
    li a0, 115200
    addi sp, sp, -4
    sw ra, 0(sp)
    jal ra, serial_begin
    lw ra, 0(sp)
    addi sp, sp, 4

    # Imprimir sin(valor en radianes)
    la a0, msg
    addi sp, sp, -16
    sw ra, 12(sp)
    jal ra, serial_printf
    lw ra, 12(sp)
    addi sp, sp, 16
    

    jr ra
