// src/app/ticket/verify/page.tsx
"use client";

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function TicketVerificationPage() {
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Extract QR code from image
  const extractQRCodeFromImage = async (file: File): Promise<string> => {
    try {
      // Create image element
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create canvas to process image
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Failed to get canvas context');
      }
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      context.drawImage(img, 0, 0, img.width, img.height);
      
      // Get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use QR code library to read QR code from canvas
      const jsQR = await import('jsqr');
      const code = jsQR.default(imageData.data, imageData.width, imageData.height);

      if (code) {
        return code.data;
      }
      
      throw new Error('No QR code found in the image');
    } catch (err) {
      console.error('Error extracting QR code:', err);
      throw new Error('Failed to extract QR code from image');
    }
  };

  // Verify ticket
  const verifyTicket = async (ticketCode: string) => {
    try {
      const response = await fetch('/api/tickets/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketCode }),
      });

      return await response.json();
    } catch (err) {
      console.error('Verification error:', err);
      throw new Error('Failed to verify ticket');
    }
  };

  // Handle file drop
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Reset previous states
    setVerificationResult(null);
    setError(null);
    setIsLoading(true);
    
    // Set preview image
    setPreviewImage(URL.createObjectURL(file));

    try {
      // Extract QR code from image
      const ticketCode = await extractQRCodeFromImage(file);
      
      // Verify ticket
      const result = await verifyTicket(ticketCode);
      
      setVerificationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxFiles: 1
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16 container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Ticket Verification
          </h1>

          {/* Dropzone */}
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer 
              transition-colors duration-200
              ${
                isDragActive 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-gray-300 hover:border-indigo-600 hover:bg-indigo-50'
              }
            `}
          >
            <input {...getInputProps()} />
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
            <p className="text-gray-600 mb-2">
              {isDragActive 
                ? 'Drop the image here ...' 
                : 'Drag and drop an image ticket here, or click to select a file'}
            </p>
            <em className="text-xs text-gray-500">
              (Only *.jpg, *.png, *.gif files will be accepted)
            </em>
          </div>

          {/* Preview Image */}
          {previewImage && (
            <div className="mt-6 flex justify-center">
              <div className="max-w-md w-full">
                <img 
                  src={previewImage} 
                  alt="Uploaded ticket" 
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Verifying ticket...</p>
            </div>
          )}

          {/* Verification Result */}
          {verificationResult && !isLoading && (
            <div 
              className={`
                mt-6 p-4 rounded-lg text-center
                ${
                  verificationResult.valid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }
              `}
            >
              <h2 className="text-xl font-bold mb-4">
                {verificationResult.valid ? 'Ticket Verified' : 'Ticket Invalid'}
              </h2>
              <p className="mb-4">{verificationResult.message}</p>
              
              {verificationResult.valid && verificationResult.details && (
                <div className="bg-white p-4 rounded-lg shadow-md text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Ticket Details</h3>
                  <p><strong>Event:</strong> {verificationResult.details.eventName}</p>
                  <p><strong>Location:</strong> {verificationResult.details.eventLocation}</p>
                  <p><strong>Ticket Type:</strong> {verificationResult.details.ticketType}</p>
                  <p><strong>Buyer:</strong> {verificationResult.details.buyerName}</p>
                  <p><strong>Purchase Date:</strong> {new Date(verificationResult.details.purchaseDate).toLocaleString()}</p>
                  <p><strong>Status:</strong> {verificationResult.details.status}</p>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="mt-6 bg-red-100 text-red-800 p-4 rounded-lg text-center">
              <p className="font-semibold mb-2">Verification Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}