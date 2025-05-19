// src/app/ticket/view/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { jsPDF } from "jspdf";
import { QRCodeCanvas } from "qrcode.react";

// Define ticket type
interface Ticket {
  id: string;
  eventTitle: string;
  date: string;
  time: string;
  location: string;
  ticketType: string;
  ticketCode: string;
  price: string;
  image: string;
  status: string;
  eventId?: string;
  buyerName?: string;
  buyerEmail?: string;
  orderDate?: string;
}

// Define API ticket type
interface ApiTicket {
  tiket_id: string;
  tiket_type_id: string;
  order_id: string;
  status: string;
  kode_qr: string;
  dibuat_di: string;
  tipe_tiket: {
    nama: string;
    harga: number;
    event: {
      event_id: string;
      nama_event: string;
      lokasi: string;
      tanggal_mulai: string;
      tanggal_selesai: string;
      foto_event?: string;
    };
  };
  order: {
    jumlah_total: number;
    status: string;
    buyer_info?: {
      name: string;
      email: string;
    };
    created_at: string;
  };
}

export default function TicketViewPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirectTo=/ticket/view/" + ticketId);
      return;
    }

    // Try to get ticket data from search params
    const searchParams = new URLSearchParams(window.location.search);
    const ticketDataStr = searchParams.get("ticketData");

    if (ticketDataStr) {
      try {
        const parsedTicket = JSON.parse(ticketDataStr);
        setTicket(parsedTicket);
        setIsLoading(false);
      } catch (err) {
        console.error("Error parsing ticket data:", err);
        fetchTicket();
      }
    } else {
      fetchTicket();
    }
  }, [user, ticketId, router]);

  const fetchTicket = async () => {
    setIsLoading(true);
    try {
      // Fetch ticket details from API
      const response = await fetch(`/api/tickets/${ticketId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch ticket");
      }

      const data = await response.json();
      processTicket(data.ticket);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError("Failed to load ticket details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const processTicket = (apiTicket: ApiTicket) => {
    // Similar to existing method, but use the API ticket data
    const ticketData: Ticket = {
      id: apiTicket.tiket_id,
      eventTitle: apiTicket.tipe_tiket.event.nama_event,
      date: formatDateRange(
        apiTicket.tipe_tiket.event.tanggal_mulai,
        apiTicket.tipe_tiket.event.tanggal_selesai
      ),
      time: formatTimeRange(
        apiTicket.tipe_tiket.event.tanggal_mulai,
        apiTicket.tipe_tiket.event.tanggal_selesai
      ),
      location: apiTicket.tipe_tiket.event.lokasi,
      ticketType: apiTicket.tipe_tiket.nama,
      ticketCode: apiTicket.kode_qr || "",
      price: `Rp ${apiTicket.tipe_tiket.harga.toLocaleString()}`,
      image:
        apiTicket.tipe_tiket.event.foto_event || "/api/placeholder/500/300",
      status: mapStatus(apiTicket.status),
      eventId: apiTicket.tipe_tiket.event.event_id,
      buyerName: apiTicket.order.buyer_info?.name || user?.name || "",
      buyerEmail: apiTicket.order.buyer_info?.email || user?.email || "",
      orderDate: formatDate(apiTicket.order.created_at || apiTicket.dibuat_di),
    };

    setTicket(ticketData);
  };

  // Format date range (e.g., "24-26 March 2025")
  const formatDateRange = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleString("en-US", { month: "long" });
    const year = startDate.getFullYear();

    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      if (startDay === endDay) {
        return `${startDay} ${month} ${year}`;
      } else {
        return `${startDay}-${endDay} ${month} ${year}`;
      }
    } else {
      const endMonth = endDate.toLocaleString("en-US", { month: "long" });
      const endYear = endDate.getFullYear();

      if (startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDay} ${month} - ${endDay} ${endMonth} ${year}`;
      } else {
        return `${startDay} ${month} ${year} - ${endDay} ${endMonth} ${endYear}`;
      }
    }
  };

  // Format single date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time range (e.g., "18:00 - 23:00")
  const formatTimeRange = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const startHours = startDate.getHours().toString().padStart(2, "0");
    const startMinutes = startDate.getMinutes().toString().padStart(2, "0");
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

    // If the event spans multiple days, show "All Day" or return specific format
    if (
      startDate.getDate() !== endDate.getDate() ||
      startDate.getMonth() !== endDate.getMonth() ||
      startDate.getFullYear() !== endDate.getFullYear()
    ) {
      // Check if it's a full day event (spans entire day)
      if (
        startHours === "00" &&
        startMinutes === "00" &&
        endHours === "23" &&
        endMinutes === "59"
      ) {
        return "All Day";
      }
    }

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
  };

  // Create a structured verification object (now using ticket code directly)
  const createTicketVerificationData = () => {
    return ticket?.ticketCode || '';
  };

  // Map API status to UI status
  const mapStatus = (apiStatus: string) => {
    switch (apiStatus.toUpperCase()) {
      case "AVAILABLE":
        return "Pending";
      case "SOLD":
        return "Completed";
      case "PENDING_PAYMENT":
        return "Awaiting Payment";
      case "CHECKED_IN":
        return "Checked In";
      default:
        return apiStatus || "Unknown";
    }
  };

  // Get the appropriate status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500 text-white";
      case "Pending":
      case "Awaiting Payment":
        return "bg-yellow-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      case "Completed":
        return "bg-blue-500 text-white";
      case "Checked In":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Function to generate PDF ticket
  const generatePDF = () => {
    if (!ticket) return;

    setGenerating(true);

    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Add background color
      doc.setFillColor(249, 250, 251); // Light gray background
      doc.rect(0, 0, 210, 297, "F");

      // Add header with gradient
      doc.setFillColor(79, 70, 229); // Indigo color
      doc.rect(0, 0, 210, 40, "F");

      // Add title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("E-TICKET", 105, 20, { align: "center" });
      doc.setFontSize(12);
      doc.text("BookIt - Your Event Ticketing Platform", 105, 30, {
        align: "center",
      });

      // Add event info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.text(ticket.eventTitle, 105, 60, { align: "center" });

      // Add event details
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Date:", 20, 80);
      doc.text("Time:", 20, 90);
      doc.text("Location:", 20, 100);
      doc.text("Ticket Type:", 20, 110);
      doc.text("Price:", 20, 120);

      doc.setTextColor(0, 0, 0);
      doc.text(ticket.date, 80, 80);
      doc.text(ticket.time, 80, 90);
      doc.text(ticket.location, 80, 100);
      doc.text(ticket.ticketType, 80, 110);
      doc.text(ticket.price, 80, 120);

      // Add ticket info
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 130, 190, 130);

      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text("TICKET INFORMATION", 105, 145, { align: "center" });

      doc.setFontSize(12);
      doc.text("Attendee:", 20, 160);
      doc.text("Order Date:", 20, 170);
      doc.text("Status:", 20, 180);
      doc.text("Ticket Code:", 20, 190);

      doc.setTextColor(0, 0, 0);
      doc.text(ticket.buyerName || "N/A", 80, 160);
      doc.text(ticket.orderDate || "N/A", 80, 170);
      doc.text(ticket.status, 80, 180);
      doc.text(ticket.ticketCode, 80, 190);

      // Generate QR code image URL from SVG
      const qrCanvas = document.getElementById(
        "ticket-qr-code"
      ) as HTMLCanvasElement;
      if (qrCanvas) {
        const qrImageData = qrCanvas.toDataURL("image/png");

        // Add QR code
        doc.addImage(qrImageData, "PNG", 65, 200, 80, 80);

        // Add QR code caption
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Scan this QR code for event entry", 105, 290, {
          align: "center",
        });
      }

      // Save the PDF
      doc.save(`ticket-${ticket.id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Ticket Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the ticket you're looking for."}
            </p>
            <Link
              href="/customer/dashboard"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center">
            <Link
              href="/customer/dashboard"
              className="text-indigo-600 hover:text-indigo-800 mr-2"
            >
              <svg
                className="w-5 h-5 inline-block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="ml-1">Back to Dashboard</span>
            </Link>
          </div>

          {/* Ticket Container */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">E-TICKET</h1>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </div>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                {/* Left Column - Event Info */}
                <div className="md:w-2/3 pr-0 md:pr-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {ticket.eventTitle}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 mb-6">
                    <div>
                      <p className="text-gray-500 text-sm">Date</p>
                      <p className="font-medium">{ticket.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Time</p>
                      <p className="font-medium">{ticket.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Location</p>
                      <p className="font-medium">{ticket.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Ticket Type</p>
                      <p className="font-medium">{ticket.ticketType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Attendee</p>
                      <p className="font-medium">{ticket.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Email</p>
                      <p className="font-medium">{ticket.buyerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Price</p>
                      <p className="font-medium text-indigo-600">
                        {ticket.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Order Date</p>
                      <p className="font-medium">{ticket.orderDate}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-500 text-sm mb-1">Ticket Code</p>
                    <p className="bg-gray-100 p-2 rounded-md font-mono text-gray-800">
                      {ticket.ticketCode}
                    </p>
                  </div>
                </div>

                {/* Right Column - QR Code */}
                <div className="md:w-1/3 flex flex-col items-center justify-center mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200">
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <QRCodeCanvas
                      id="ticket-qr-code"
                      value={createTicketVerificationData()}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Please show this QR code at event entry
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                  This ticket is provided by BookIt. For help, contact
                  support@bookit.id
                </p>
                <button
                  onClick={generatePDF}
                  disabled={generating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  {generating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Event Details
              </h3>
              <div className="relative h-64 mb-6">
                <Image
                  src={ticket.image}
                  alt={ticket.eventTitle}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <Link
                href={`/ticket/${ticket.eventId}`}
                className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors inline-block"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
