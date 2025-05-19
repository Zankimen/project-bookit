import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

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
  tipe_tikets: z
    .array(
      z.object({
        tiket_type_id: z.string().optional(),
        nama: z.string().min(1, "Ticket type name is required"),
        harga: z.number().positive("Price must be positive"),
        jumlah_tersedia: z
          .number()
          .int()
          .positive("Available tickets must be positive"),
      })
    )
    .optional(),
});

interface TiketType {
  tiket_type_id: string;
}

// GET handler
export async function GET(
  request: NextRequest
) {
  // Get id from URL
  const id = request.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    // Get the event
    const event = await prisma.event.findUnique({
      where: { event_id: id },
      include: {
        creator: true,
        tipe_tikets: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT handler
export async function PUT(
  request: NextRequest
) {
  // Get id from URL
  const id = request.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log("Received update data:", JSON.stringify(body, null, 2));

    // Validate input
    const validatedData = EventSchema.parse(body);

    // Update event and ticket types
    const result = await prisma.$transaction(async (tx) => {
      // First, update the main event
      const updatedEvent = await tx.event.update({
        where: { event_id: id },
        data: {
          nama_event: validatedData.nama_event,
          deskripsi: validatedData.deskripsi,
          kota_kabupaten: validatedData.kota_kabupaten,
          lokasi: validatedData.lokasi,
          tanggal_mulai: validatedData.tanggal_mulai,
          tanggal_selesai: validatedData.tanggal_selesai,
          foto_event: validatedData.foto_event,
          kategori_event: validatedData.kategori_event,
        },
        include: {
          tipe_tikets: true,
        },
      });

      // If ticket types are provided, update them
      if (validatedData.tipe_tikets && validatedData.tipe_tikets.length > 0) {
        // Get existing ticket type IDs
        const existingTicketIds = updatedEvent.tipe_tikets.map(
          (t: TiketType) => t.tiket_type_id
        );

        // Get IDs of tickets in the updated data that have IDs
        const updatedTicketIds = validatedData.tipe_tikets
          .filter((t) => t.tiket_type_id)
          .map((t) => t.tiket_type_id!);

        // Find IDs that are in existing but not in updated = tickets to delete
        const ticketIdsToDelete = existingTicketIds.filter(
          (id: string) => !updatedTicketIds.includes(id)
        );

        // Delete tickets that are no longer in the list
        if (ticketIdsToDelete.length > 0) {
          await tx.tipeTiket.deleteMany({
            where: {
              tiket_type_id: {
                in: ticketIdsToDelete,
              },
            },
          });
        }

        // Process each ticket type
        for (const ticket of validatedData.tipe_tikets) {
          if (ticket.tiket_type_id) {
            // Update existing ticket
            await tx.tipeTiket.update({
              where: { tiket_type_id: ticket.tiket_type_id },
              data: {
                nama: ticket.nama,
                harga: ticket.harga,
                jumlah_tersedia: ticket.jumlah_tersedia,
              },
            });
          } else {
            // Create new ticket
            await tx.tipeTiket.create({
              data: {
                event_id: id,
                nama: ticket.nama,
                harga: ticket.harga,
                jumlah_tersedia: ticket.jumlah_tersedia,
              },
            });
          }
        }
      }

      // Return updated event with fresh ticket data
      return await tx.event.findUnique({
        where: { event_id: id },
        include: {
          tipe_tikets: true,
        },
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating event:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE handler
export async function DELETE(
  request: NextRequest
) {
  // Get id from URL
  const id = request.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // First, delete associated ticket types
      await tx.tipeTiket.deleteMany({
        where: { event_id: id },
      });

      // Then delete the event
      await tx.event.delete({
        where: { event_id: id },
      });
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}