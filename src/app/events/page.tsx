"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { format } from 'date-fns';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const eventsPerPage = 12;

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const fetchEvents = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events?page=${page}&limit=${eventsPerPage}`);
      const data = await response.json();
      
      if (data.events) {
        setEvents(data.events);
        setTotalPages(Math.ceil(data.total / eventsPerPage));
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date helper
  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return format(start, 'dd MMMM yyyy');
    }
    return `${format(start, 'dd')} - ${format(end, 'dd MMMM yyyy')}`;
  };

  // Get ticket price range
  const getTicketPriceText = (event: Event) => {
    if (!event.tipe_tikets || event.tipe_tikets.length === 0) {
      return "Gratis";
    }
    
    const prices = event.tipe_tikets.map(ticket => ticket.harga);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
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

  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("Particles loaded", container);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 pt-16 relative overflow-hidden">
        {/* Islamic themed animated elements */}

        {/* Crescent moon animations */}
        <motion.div
          className="absolute top-10 left-10 w-16 h-16 text-yellow-200/30"
          animate={{
            x: [0, 200, 0],
            y: [0, 50, 0],
            rotate: 360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2.37 C7.17,2.37 3.16,5.43 2.12,9.62 C6.37,6.24 12.14,7.58 14.96,12.15 C16.97,15.21 16.87,18.75 14.96,21.6 C19.03,20.4 22,16.56 22,12 C22,6.67 17.5,2.37 12,2.37 Z" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-20 right-10 w-12 h-12 text-yellow-200/40"
          animate={{
            x: [-100, 100, -100],
            y: [20, -20, 20],
            rotate: -360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2.37 C7.17,2.37 3.16,5.43 2.12,9.62 C6.37,6.24 12.14,7.58 14.96,12.15 C16.97,15.21 16.87,18.75 14.96,21.6 C19.03,20.4 22,16.56 22,12 C22,6.67 17.5,2.37 12,2.37 Z" />
          </svg>
        </motion.div>

        {/* Star animations */}
        <motion.div
          className="absolute top-5 left-1/4 w-8 h-8 text-yellow-100/30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,1 L15.09,7.34 L22,8.33 L17,13.17 L18.18,20.02 L12,16.77 L5.82,20.02 L7,13.17 L2,8.33 L8.91,7.34 Z" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-20 right-1/3 w-6 h-6 text-yellow-100/40"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.2, 0.6, 0.2],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,1 L15.09,7.34 L22,8.33 L17,13.17 L18.18,20.02 L12,16.77 L5.82,20.02 L7,13.17 L2,8.33 L8.91,7.34 Z" />
          </svg>
        </motion.div>

        {/* Mosque dome animations */}
        <motion.div
          className="absolute bottom-5 left-1/3 w-20 h-20 text-white/20"
          animate={{
            x: [-50, 50, -50],
            y: [10, -10, 10],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 C7.58,2 4,5.58 4,10 C4,14.08 7.05,17.44 11,17.93 L11,21 L13,21 L13,17.93 C16.95,17.44 20,14.08 20,10 C20,5.58 16.42,2 12,2 Z M12,4 C15.31,4 18,6.69 18,10 C18,13.31 15.31,16 12,16 C8.69,16 6,13.31 6,10 C6,6.69 8.69,4 12,4 Z" />
          </svg>
        </motion.div>

        {/* Lantern animations */}
        <motion.div
          className="absolute bottom-10 right-1/4 w-16 h-16 text-yellow-300/30"
          animate={{
            y: [-20, 20, -20],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10,2 L14,2 L14,4 L15,4 C16.1,4 17,4.9 17,6 L17,18 C17,19.1 16.1,20 15,20 L9,20 C7.9,20 7,19.1 7,18 L7,6 C7,4.9 7.9,4 9,4 L10,4 L10,2 Z M9,6 L9,18 L15,18 L15,6 L9,6 Z M11,8 L13,8 L13,16 L11,16 L11,8 Z" />
          </svg>
        </motion.div>

        {/* Islamic geometric pattern animations */}
        <motion.div
          className="absolute top-1/3 right-10 w-24 h-24 text-white/10"
          animate={{
            rotate: 360,
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 L22,12 L12,22 L2,12 L12,2 Z M12,6.83 L6.83,12 L12,17.17 L17.17,12 L12,6.83 Z" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-20 w-32 h-32 text-white/10"
          animate={{
            rotate: -360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2 L22,12 L12,22 L2,12 L12,2 Z M12,6.83 L6.83,12 L12,17.17 L17.17,12 L12,6.83 Z" />
          </svg>
        </motion.div>

        {/* Additional small stars scattered around */}
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={`star-${index}`}
            className="absolute w-4 h-4 text-yellow-100/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,1 L15.09,7.34 L22,8.33 L17,13.17 L18.18,20.02 L12,16.77 L5.82,20.02 L7,13.17 L2,8.33 L8.91,7.34 Z" />
            </svg>
          </motion.div>
        ))}

        <div className="container mx-auto px-4 py-8 pb-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8">
            {/* Static heading (removed animations) */}
            <h1 className="text-2xl md:text-4xl font-bold mb-3 text-white relative z-20">
              Temukan Event Menarik di Sekitarmu
            </h1>
            <motion.p
              className="text-white/80 text-sm md:text-base max-w-xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Jelajahi ratusan event konser, workshop, pameran, dan festival di
              seluruh Indonesia
            </motion.p>
          </div>
        </div>

        {/* Light glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-yellow-200/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-yellow-200/10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
      </header>

      {/* Enhanced Events Grid */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-2xl font-medium text-gray-700">No events found</h3>
            <p className="text-gray-500 mt-2">Check back later for new events</p>
          </motion.div>
        ) : (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                          src={event.foto_event || '/placeholder-event.jpg'}
                          alt={event.nama_event}
                          fill
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

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-16 space-x-2"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-6 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}