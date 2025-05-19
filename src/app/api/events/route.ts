// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation Schema
const EventSchema = z.object({
  nama_event: z.string().min(1, "Event name is required"),
  deskripsi: z.string().optional(),
  kota_kabupaten: z.string().min(1, "City/Regency is required"),
  lokasi: z.string().min(1, "Location is required"),
  tanggal_mulai: z.string().datetime(),
  tanggal_selesai: z.string().datetime(),
  foto_event: z.string().optional(),
  kategori_event: z.string().min(1, "Event category is required"),
  creator_id: z.string().min(1, "Creator ID is required"),
  tipe_tikets: z.array(z.object({
    nama: z.string().min(1, "Ticket type name is required"),
    harga: z.number().positive("Price must be positive"),
    jumlah_tersedia: z.number().int().positive("Available tickets must be positive")
  })).optional()
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit

  try {
    const events = await prisma.event.findMany({
      skip,
      take: limit,
      include: {
        creator: true,
        tipe_tikets: true
      },
      orderBy: {
        tanggal_mulai: 'desc'
      }
    })

    const total = await prisma.event.count()

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = EventSchema.parse(body);

    // Create event with nested ticket types
    const newEvent = await prisma.event.create({
      data: {
        nama_event: validatedData.nama_event,
        deskripsi: validatedData.deskripsi,
        kota_kabupaten: validatedData.kota_kabupaten,
        lokasi: validatedData.lokasi,
        tanggal_mulai: new Date(validatedData.tanggal_mulai),
        tanggal_selesai: new Date(validatedData.tanggal_selesai),
        foto_event: validatedData.foto_event,
        kategori_event: validatedData.kategori_event,
        creator_id: validatedData.creator_id,
        tipe_tikets: {
          create: validatedData.tipe_tikets
        }
      },
      include: {
        tipe_tikets: true,
        creator: true
      }
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}