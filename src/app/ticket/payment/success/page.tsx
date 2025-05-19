"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isTicketCopied, setIsTicketCopied] = useState(false);

  // Mock transaction data - in a real app, you would get this from API
  const transaction = {
    id:
      "TRX" +
      Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, "0"),
    date: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "SUCCESS",
    amount: "Rp 850.000",
    paymentMethod: "Bank Transfer",
    eventTitle: "Java Jazz Festival 2025",
    eventDate: "24-26 March 2025",
    eventLocation: "JIExpo Kemayoran, Jakarta",
    ticketType: "Regular Pass",
    quantity: 1,
    ticketCode:
      "JJF-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  };

  // Get query params
  const eventId = searchParams.get("eventId") || "1";

  // Handle scroll events for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Countdown redirection to event detail
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle copy ticket code to clipboard
  const copyTicketCode = () => {
    navigator.clipboard.writeText(transaction.ticketCode);
    setIsTicketCopied(true);

    setTimeout(() => {
      setIsTicketCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Success Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Success Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-500 py-8 px-6 text-white text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Payment Successful!
              </h1>
              <p className="opacity-90">
                Thank you for your purchase. Your ticket is ready.
              </p>
            </div>

            {/* Order Summary */}
            <div className="p-6 md:p-8">
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <h2 className="font-bold text-lg mb-4 text-indigo-800">
                  Transaction Details
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium text-gray-800">
                      {transaction.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="text-gray-800">{transaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-green-600">
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="text-gray-800">
                      {transaction.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-bold text-gray-800">
                      {transaction.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Information */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-bold text-gray-800">
                    Ticket Information
                  </h2>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="md:w-1/2">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-gray-500 text-sm">Event</h3>
                          <p className="font-bold text-gray-800">
                            {transaction.eventTitle}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-sm">Date</h3>
                          <p className="text-gray-800">
                            {transaction.eventDate}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-sm">Location</h3>
                          <p className="text-gray-800">
                            {transaction.eventLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-gray-500 text-sm">Ticket</h3>
                          <p className="text-gray-800">
                            {transaction.ticketType} × {transaction.quantity}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-sm">Ticket Code</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-gray-800 bg-gray-100 py-1 px-3 rounded font-mono text-lg tracking-wider mr-2">
                              {transaction.ticketCode}
                            </span>
                            <button
                              onClick={copyTicketCode}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {isTicketCopied ? (
                                <svg
                                  className="w-5 h-5 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            You'll need this code to enter the event
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 mb-8">
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm mb-3">
                  <div className="relative w-48 h-48">
                    <Image
                      src="/api/placeholder/200/200"
                      alt="Ticket QR Code"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-4 py-2 bg-white/80 rounded-lg text-sm font-medium text-gray-800">
                        QR Code would be here
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Present this QR code when entering the venue
                </p>
                <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Ticket
                </button>
              </div>

              {/* Next Steps */}
              <div className="flex flex-col items-center text-center">
                <h3 className="font-bold text-gray-800 mb-2">What's Next?</h3>
                <p className="text-gray-600 mb-4">
                  Your ticket has been emailed to you. Check your inbox
                  including the spam folder.
                </p>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-3">
                  <Link
                    href={`/ticket/${eventId}`}
                    className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-2 px-6 rounded-lg transition-colors"
                  >
                    Back to Event
                  </Link>
                  <Link
                    href="/ticket"
                    className="text-indigo-600 hover:underline py-2 px-6"
                  >
                    Browse More Events
                  </Link>
                </div>

                <p className="text-sm text-gray-500">
                  You will be redirected to event page in {countdown} seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
