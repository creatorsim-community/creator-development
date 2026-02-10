#
# Creator (https://creatorsim.github.io/creator/)
# ESP32C3 Timer Interrupt Example
#

.data
systimer_tick:
    .word 0
allocated:
    .word 0  
msg_tick:
    .string "Hi!!! \n"
msg_dev:
    .string "Here\n"     


.text
##---ISR---


systimer_clear_interrupt:
   li t0, SYSTIMER_BASE
   addi t0, t0, 0x06C # 
   lw t1, 0(t0)
   li t2, 7
   sw t2, 0(t0)  
   jr ra 


print_function:
    addi sp, sp,-4
    sw ra,0(sp)
    la a0, msg_tick
    jal ra, printf
    li t0, 0                # t0 = 0
    la t1, systimer_tick    # t1 = &systimer_tick
    sw t0, 0(t1)            # systimer_tick = 0
    lw ra,0(sp)
    addi sp, sp,4
    jr ra

log_task:
    la t1, systimer_tick
    lw t0, 0(t1)
    li t1, 1000 #1 s
    bge t0,t1, print_function
    j log_task

timer_handler:
    la t0, systimer_tick
    lw t1, 0(t0)
    addi t1, t1, 1
    sw t1, 0(t0)
    jr ra

#---Interrupts
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
    li t2, 1             # t2 = BIT(1)
    li t3, 1             # t3 = no = 1 
loop_bits:
    li t5, 31
    bge t3, t5, no_free # no >= 31, all interrupts are allocated

    sll t4, t2, t3      # t4 = 1 << t3
    and t5, t1, t4      # t5 = allocated & (1 << t3)
    bne t5, zero, next  

    # mark bit as allocated
    or t1, t1, t4       # allocated |= (1 << t3)
    sw t1, 0(t0)

    # (1) Enable CPU interruptions REG(C3_INTERRUPT)[0x104 / 4] |= BIT(no); 
    li t5, INTERRUPT_BASE
    addi t5, t5, 0x104 # INTERRUPT_CORE0_CPU_INT_ENABLE_REG
    lw t0, 0(t5)
    li t1, 1
    sll t1, t1, t3 #BIT(no)
    or t0, t0, t1
    sw t0, 0(t5)

    # (2) Assign priority REG(C3_INTERRUPT)[0x118 / 4 + no - 1] = prio;  // CPU_INT_PRI_N
    li t5, INTERRUPT_BASE
    addi t5, t5, 0x118 #INTERRUPT_CORE0_CPU_INT_PRI_n_REG  
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

systimer_init:
    # Arguments: a0 = period
    mv s0, a0 
    # (1) Configure timer
    addi sp, sp, -4      
    sw ra, 0(sp)         
    # SYSTIMER->TARGET0_CONF = BIT(30) | 16000; Set period
    li t0, SYSTIMER_BASE
    addi t0, t0, 0x034 #SYSTIMER_TARGET0_CONF_REG
    li t1, 1
    slli t1, t1, 30 #Bit(30)
    or t1, t1, s0  # t1 = BIT(30) | 16000
    sw t1, 0(t0)
    # SYSTIMER->COMP0_LOAD = BIT(0); Reload period
    li t0, SYSTIMER_BASE
    addi t0, t0, 0x050
    li t1, 1
    slli t1, t1, 0 # t1 = BIT(0)
    sw t1, 0(t0)
    # SYSTIMER->CONF |= BIT(24);                 
    li t0, SYSTIMER_BASE
    addi t0, t0, 0x000  #SYSTIMER_CONF_REG
    lw t1, 0(t0)
    li t2, 1
    slli t3, t2, 24  # t3 = BIT(24)
    or t1, t1, t3  # BIT(24) | 0
    sw t1, 0(t0)
    # SYSTIMER->INT_ENA |= 7U enable triggers in all targets
    li t0, SYSTIMER_BASE
    addi t0, t0, 0x064 # t0 = SYSTIMER_INT_ENA_REG
    lw t1, 0(t0)
    li t2, 7 # 7 (111) activate all targets
    or t1, t1, t2 # SYSTIMER->INT_ENA |= 7U;
    sw t1, 0(t0)
    # (2)Allocate interrupt in CPU with priority 1
    li a0, 1          # prioridad
    jal ra, cpu_alloc_interrupt
    mv s1, a0         # Save IRQ assigned
    # (3) Save ISR in g_irq_data
    la t0, g_irq_data
    slli t1, s1, 4 # t1 = no * 16 (4 fields x 4 bytes)
    add t0, t0, t1
    la t2, timer_handler
    sw t2, 0(t0)
    la t2, systimer_clear_interrupt
    sw t2, 8(t0)
    # (4) Map systimer IRQ to CPU
    li t0, INTERRUPT_BASE
    addi t0, t0, 0x94
    lw t1, 0(t0)
    mv t2, s1 #no
    sw t2, 0(t0)

    lw ra, 0(sp)         
    addi sp, sp, 4       

    jr ra


main: 
    li a0, 16000
    jal ra, systimer_init
    j log_task

loop:
    j loop
