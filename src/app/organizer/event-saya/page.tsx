// src\app\organizer\event-saya\page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import { format } from "date-fns";

interface Event {
  event_id: string;
  nama_event: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  kategori_event: string;
  foto_event?: string;
}

export default function EventSayaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState("active");

  const { user } = useAuth();
  const router = useRouter();

  // State for events
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchEvents();
  }, [page, activeEventTab, user, router]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // First get creator ID
      const creatorResponse = await fetch(`/api/users/${user.id}/creator`);
      const creatorData = await creatorResponse.json();

      if (!creatorResponse.ok) {
        throw new Error("Failed to fetch creator information");
      }

      // Then fetch events for this creator with pagination
      const response = await fetch(
        `/api/events/creator/${creatorData.creator_id}?page=${page}&limit=10`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      // Filter events based on active tab
      const now = new Date();
      const filteredEvents = data.events.filter((event: Event) => {
        const startDate = new Date(event.tanggal_mulai);
        const endDate = new Date(event.tanggal_selesai);

        switch (activeEventTab) {
          case "active":
            return startDate > now;
          case "draft":
            // Implement draft logic based on your requirements
            return false;
          case "past":
            return endDate < now;
          default:
            return true;
        }
      });

      setEvents(filteredEvents);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          fetchEvents();
          alert("Event berhasil dihapus");
        } else {
          const errorData = await response.json();
          alert(`Gagal menghapus event: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error menghapus event:", error);
        alert("Gagal menghapus event");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Event Saya</h1>
            <div className="w-6"></div> {/* Spacer for alignment */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Event Saya</h1>
              <Link
                href="/organizer/create-event"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              >
                Buat Event
              </Link>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveEventTab("active")}
                  className={`px-4 py-2 font-medium ${
                    activeEventTab === "active"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-indigo-600"
                  }`}
                >
                  EVENT AKTIF
                </button>
                <button
                  onClick={() => setActiveEventTab("draft")}
                  className={`px-4 py-2 font-medium ${
                    activeEventTab === "draft"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-indigo-600"
                  }`}
                >
                  EVENT DRAF
                </button>
                <button
                  onClick={() => setActiveEventTab("past")}
                  className={`px-4 py-2 font-medium ${
                    activeEventTab === "past"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-indigo-600"
                  }`}
                >
                  EVENT LALU
                </button>
              </div>
            </div>

            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Menampilkan {events.length} event
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Urutkan:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Waktu Mulai (Terdekat)</option>
                  <option>Waktu Mulai (Terjauh)</option>
                  <option>Nama Event (A-Z)</option>
                  <option>Nama Event (Z-A)</option>
                </select>
              </div>
            </div>

            {/* Events Section */}
            <div className="mb-8">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                </div>
              ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div
                      key={event.event_id}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="bg-gray-100 h-40 relative">
                        {event.foto_event && (
                          <img
                            src={event.foto_event}
                            alt={event.nama_event}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {event.nama_event}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {format(new Date(event.tanggal_mulai), "PP")} -{" "}
                          {format(new Date(event.tanggal_selesai), "PP")}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {event.kategori_event}
                          </span>
                          <div className="flex space-x-3">
                            <Link
                              href={`/organizer/edit/${event.event_id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteEvent(event.event_id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    Hai, terima kasih telah menggunakan layanan LOKET
                  </p>
                  <p className="text-gray-500">
                    Silakan buat eventmu dengan klik button "Buat Event" di
                    atas.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-lg ${
                        page === pageNum
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
