import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = loginSchema.parse(body);

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        pembeli: true,
        event_creator: true
      }
    });

    // If user doesn't exist or password doesn't match
    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Create JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    const token = sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set cookie
    const cookieStore = cookies();
    (await cookieStore).set('auth_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    // Return success response
    return NextResponse.json({
      user: {
        id: user.user_id,
        email: user.email,
        name: user.pembeli?.nama_pembeli || user.event_creator?.nama_brand,
        type: 'customer', // Default type
        activeRole: 'customer', // Default role when logging in
        roles: {
          customer: !!user.pembeli,
          creator: !!user.event_creator
        }
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Login gagal' },
      { status: 500 }
    );
  }
}