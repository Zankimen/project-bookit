import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ events: [] });
    }

    const events = await prisma.event.findMany({
      where: {
        OR: [
          {
            nama_event: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            lokasi: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        tipe_tikets: true, // Include ticket types
        creator: true, // Include creator details if needed
      },
      orderBy: {
        tanggal_mulai: 'asc',
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}