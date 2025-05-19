"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Event {
  event_id: string;
  nama_event: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  kategori_event: string;
  foto_event?: string;
  deskripsi?: string;
  tipe_tikets?: Array<{
    nama: string;
    harga: number;
    jumlah_tersedia: number;
  }>;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format date helper
  const formatEventDate = (startDate: string, endDate: string) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "Tanggal tidak tersedia";
      }
      
      if (start.toDateString() === end.toDateString()) {
        return format(start, 'dd MMMM yyyy', { locale: id });
      }
      return `${format(start, 'dd')} - ${format(end, 'dd MMMM yyyy', { locale: id })}`;
    } catch (error) {
      return "Tanggal tidak tersedia";
    }
  };

  // Get ticket price range - Updated to match HomePage
  const getTicketPriceText = (event: Event) => {
    if (!event.tipe_tikets || event.tipe_tikets.length === 0) {
      return "Gratis";
    }
    
    const prices = event.tipe_tikets.map(ticket => ticket.harga);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === 0 && maxPrice === 0) {
      return "Gratis";
    }
    
    if (minPrice === maxPrice) {
      return `Rp ${minPrice.toLocaleString('id-ID')}`;
    }
    return `Rp ${minPrice.toLocaleString('id-ID')} - ${maxPrice.toLocaleString('id-ID')}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/events/search?q=${encodeURIComponent(query || "")}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        
        // Transform the data to match the Event interface
        const transformedEvents = data.events.map((event: any) => ({
          event_id: event.event_id,
          nama_event: event.nama_event,
          tanggal_mulai: event.tanggal_mulai,
          tanggal_selesai: event.tanggal_selesai,
          lokasi: event.lokasi,
          kategori_event: event.kategori_event,
          foto_event: event.foto_event,
          deskripsi: event.deskripsi,
          tipe_tikets: event.tipe_tikets,
        }));
        
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Enhanced Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 pt-28 pb-16"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            Hasil pencarian untuk "{query}"
          </motion.h1>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-white/10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </motion.header>

      {/* Events Grid - Updated to match HomePage style */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-md"
          >
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-1">
              Tidak ada event yang ditemukan
            </h3>
            <p className="text-gray-500">Coba dengan kata kunci lain</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event) => (
              <motion.div
                key={event.event_id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Link
                  href={`/ticket/${event.event_id}`}
                  className="block h-full group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative h-52">
                      <Image
                        src={event.foto_event || "/placeholder-event.jpg"}
                        alt={event.nama_event}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                      <div className="absolute top-0 left-0 m-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {event.kategori_event}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {event.nama_event}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <svg
                          className="w-4 h-4 mr-2 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatEventDate(event.tanggal_mulai, event.tanggal_selesai)}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <svg
                          className="w-4 h-4 mr-2 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {event.lokasi}
                      </div>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="font-bold text-lg text-indigo-600">
                          {getTicketPriceText(event)}
                        </span>
                        <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105">
                          Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}