// src\app\api\users\[userId]\tickets\route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch all tickets for the user
    const tickets = await prisma.tiket.findMany({
      where: {
        order: {
          user_id: userId
        }
      },
      include: {
        tipe_tiket: {
          include: {
            event: true
          }
        },
        order: true
      },
      orderBy: {
        dibuat_di: 'desc'
      }
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}