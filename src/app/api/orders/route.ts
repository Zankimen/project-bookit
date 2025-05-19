// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/lib/prisma";
import { z } from 'zod'

// Validation Schema for orders
const OrderSchema = z.object({
  user_id: z.string().uuid("Invalid user ID"),
  event_id: z.string().uuid("Invalid event ID"),
  tiket_type_id: z.string().uuid("Invalid ticket type ID"),
  quantity: z.number().int().positive("Quantity must be positive"),
  jumlah_total: z.number().positive("Total amount must be positive"),
  buyer_info: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required")
  }),
  payment_method: z.string().min(1, "Payment method is required")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = OrderSchema.parse(body)

    // Begin a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if ticket type exists and has enough availability
      const ticketType = await tx.tipeTiket.findUnique({
        where: { tiket_type_id: validatedData.tiket_type_id }
      })

      if (!ticketType) {
        throw new Error('Ticket type not found')
      }

      if (ticketType.jumlah_tersedia < validatedData.quantity) {
        throw new Error('Not enough tickets available')
      }

      // 2. Create the order
      const order = await tx.order.create({
        data: {
          user_id: validatedData.user_id,
          jumlah_total: validatedData.jumlah_total,
          status: 'PAID',
        }
      })

      // 3. Create the tickets
      const tickets = []
      for (let i = 0; i < validatedData.quantity; i++) {
        const ticket = await tx.tiket.create({
          data: {
            tiket_type_id: validatedData.tiket_type_id,
            order_id: order.order_id,
            status: 'SOLD',
            kode_qr: `TICKET-${Date.now()}-${i}` // Generate a simple QR code reference
          }
        })
        tickets.push(ticket)
      }

      // 4. Update ticket availability
      await tx.tipeTiket.update({
        where: { tiket_type_id: validatedData.tiket_type_id },
        data: {
          jumlah_tersedia: ticketType.jumlah_tersedia - validatedData.quantity
        }
      })

      // 5. Create payment record
      const payment = await tx.pembayaran.create({
        data: {
          order_id: order.order_id,
          jumlah: validatedData.jumlah_total,
          status: 'PAID', // Will be updated after payment confirmation
        }
      })

      // 6. Create invoice
      const invoice = await tx.invoice.create({
        data: {
          pembayaran_id: payment.payment_id,
          nomor_invoice: `INV-${Date.now()}`,
          jumlah: validatedData.jumlah_total,
        }
      })

      // 7. Create event history
      await tx.eventHistory.create({
        data: {
          event_id: validatedData.event_id,
          user_id: validatedData.user_id,
        }
      })

      return {
        order,
        tickets,
        payment,
        invoice
      }
    })

    return NextResponse.json({
      message: 'Order created successfully',
      data: result
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Failed to create order', 
      message: error.message || 'Unknown error' 
    }, { status: 500 })
  }
}