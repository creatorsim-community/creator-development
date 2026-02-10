#
# Creator (https://creatorsim.github.io/creator/)
# ESP32C3 Hardware Interrupt Example
#


.data
fmt_button:
    .string "Button %s\n"
pressed_msg:
    .string "pressed"
released_msg:
    .string "released" 
allocated:
    .word 0              

allocated_msg:
    .string  "Allocated CPU IRQ %d, prio %u\n"    

.text


#---Interrupts
gpio_clear_interrupt:
    # a0 = pin
    li t0, GPIO_BASE
    addi t0, t0, 0x44
    lw t1, 0(t0)
    li t2, 1
    sll t2, t2, a0   # BIT(pin)
    not t0, t0      # ~BIT(pin)
    and t1, t1, t0  #t1 & ~(1 << pin) Clear pin
    sw t1, 0(t0)
    ret


cpu_alloc_interrupt:
    #Save all save registers, just in case
    addi sp, sp, -12
    sw s0, 0(sp)
    sw s1, 4(sp)
    sw s2, 8(sp)

    #Save argument
    mv s0,a0 #PRIORITY (1-15)

    la t0, allocated     # t0 = &allocated
    lw t1, 0(t0)         # t1 = allocated
    #Start loop conditions
    li t2, 1             # t2 =  BIT(1)
    li t3, 1             # t3 = no = 1 
loop_bits:
    li t5, 31
    bge t3, t5, no_free # si no >= 31, todas las interrupciones están cogidas

    sll t4, t2, t3      # t4 = 1 << t3
    and t5, t1, t4      # t5 = allocated & (1 << t3)
    bne t5, zero, next  

    # mark bit as allocated
    or t1, t1, t4       # allocated |= (1 << t3)
    sw t1, 0(t0)

    # (1) Enable CPU interruptions REG(C3_INTERRUPT)[0x104 / 4] |= BIT(no); 
    li t5, INTERRUPT_BASE
    addi t5, t5, 0x104
    lw t0, 0(t5)
    li t1, 1
    sll t1, t1, t3 #BIT(no)
    or t0, t0, t1
    sw t0, 0(t5)

    # (2) Assign priority REG(C3_INTERRUPT)[0x118 / 4 + no - 1] = prio;  // CPU_INT_PRI_N
    li t5, INTERRUPT_BASE
    addi t5, t5, 0x118
    addi t1, t3, -1
    slli t1, t1, 2
    add t5, t5, t1
    sw s0, 0(t5)

    mv a0, t3            # return no
    j done

next:
    addi t3, t3, 1       # no++
    j loop_bits

no_free:
    li a0, -1            

done:
    # Restore all save registers
    lw s0, 0(sp)
    lw s1, 4(sp)
    lw s2, 8(sp)
    addi sp, sp, 12
    ret

gpio_set_irq_handler:
    # a0 = pin, a1 = handler, a2 = arg
    #Move args into saved registers
    mv s0, a0  # pin
    mv s1, a1  # handler
    mv s2, a2  # arg

    # (1)Allocate interrupt in CPU with priority 1
    li a0, 1          # priority
    jal ra,  cpu_alloc_interrupt
    mv s3, a0         # save IRQ number in s3

    # (2)Save pin interrupt
    la t0, g_irq_data
    slli t1, s3, 4    # t1 = no * 16
    add t0, t0, t1    # t0 = &g_irq_data[no]

    sw s1, 0(t0)     # *(t0 + 0) = handler (a1)
    sw s2, 4(t0)     # *(t0 + 4) = arg (a2)
    la t2, gpio_clear_interrupt # t2 = gpio_clear_interrupt
    sw t2, 8(t0)     # *(t0 + 8) = gpio_clear_interrupt
    sw s0, 12(t0)    # *(t0 + 12) = pin (s0)

    # (3) Set characteristics for the interrupt = REG(C3_GPIO)[0x74 / 4 + pin] |= (3U << 7) | BIT(13); 
    li t0, GPIO_BASE
    addi t0, t0, 0x74
    slli t1, s0, 2 #t1 = pin * 4
    add t0, t0, t1 #t0 = &REG(C3_GPIO)[0x74 / 4 + pin]
    lw t2, 0(t0)
    # li t3, 0x2180 # t3 = (3U << 7) | BIT(13)
    li t3, 3         # t3 = 3
    slli t3, t3, 7   # t3 = 3 << 7 = 0x180
    li t4, 1         # t4 = 1
    slli t4, t4, 13  # t4 = 1 << 13 = 0x2000
    or t3, t3, t4    # t3 = t3 | t4 = 0x180 | 0x2000 = 0x2180
    or t2, t2, t3 #REG(C3_GPIO)[0x74 / 4 + pin] |= t3
    sw t2, 0(t0)
    # (4) Map GPIO IRQ to CPU
    li t0, INTERRUPT_BASE
    addi t0, t0, 0x40 #GPIO_INTERRUPT_PRO_MAP_REG
    sw s3, 0(t0)
    ret
##---ISR and main part---
button_handler:
    addi sp, sp, -4         
    sw ra, 0(sp)            

    li a0, 9 
    jal ra,  gpio_read          

    #beqz a0, use_released 
    bnez a0, finish_handler  
    la a1, pressed_msg
    j do_printf             

use_released:
    la a1, released_msg

do_printf:
    la a0, fmt_button        
    jal ra,  printf
finish_handler:
    lw ra, 0(sp)             
    addi sp, sp, 4           
    ret        


main:
    # Set button pin (9) as input
    li a0, 9        
    jal ra,  gpio_input

    # Llamar gpio_output(2)
    li a0, 2
    jal ra,  gpio_output
    # Set irq handler
    li a0, 9 
    la a1, button_handler
    li a2, 9 
    jal ra,  gpio_set_irq_handler


loop:
    j loop
