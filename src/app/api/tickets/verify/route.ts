// src/app/api/tickets/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming ticket code
    const { ticketCode } = await request.json();
    
    // Validate input
    if (!ticketCode) {
      return NextResponse.json(
        { 
          valid: false, 
          message: 'Ticket code is required' 
        },
        { status: 400 }
      );
    }

    // Find the ticket by QR code
    const ticket = await prisma.tiket.findFirst({
      where: { 
        kode_qr: ticketCode 
      },
      include: {
        tipe_tiket: {
          include: {
            event: true
          }
        },
        order: {
          include: {
            user: true
          }
        }
      }
    });

    // If ticket not found
    if (!ticket) {
      return NextResponse.json(
        { 
          valid: false, 
          message: 'Invalid ticket code' 
        },
        { status: 404 }
      );
    }

    // Check ticket status
    switch (ticket.status) {
      case 'CANCELLED':
        return NextResponse.json({
          valid: false,
          message: 'This ticket has been cancelled'
        });
      
      case 'SOLD':
        return NextResponse.json({
          valid: false,
          message: 'This ticket has already been used'
        });
    }

    // Prepare ticket details for response
    return NextResponse.json({
      valid: true,
      message: 'Ticket is valid',
      details: {
        eventName: ticket.tipe_tiket.event.nama_event,
        eventLocation: ticket.tipe_tiket.event.lokasi,
        ticketType: ticket.tipe_tiket.nama,
        buyerName: ticket.order.user.email,
        purchaseDate: ticket.dibuat_di,
        status: ticket.status
      }
    });

  } catch (error) {
    console.error('Ticket verification error:', error);
    return NextResponse.json(
      { 
        valid: false, 
        message: 'Ticket verification failed' 
      },
      { status: 500 }
    );
  }
}