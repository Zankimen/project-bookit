// src\app\page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { format } from "date-fns";
import { motion } from "framer-motion";

// Define the Event interface based on your API response
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

export default function HomePage() {
  const sliderRef = useRef<HTMLDivElement>(null);

  // States
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCity, setActiveCity] = useState("All Cities");

  // Categories from your system
  const categories = [
    { name: "All", icon: "🌟" },
    { name: "Music", icon: "🎵" },
    { name: "Sports", icon: "⚽" },
    { name: "Arts", icon: "🖼️" },
    { name: "Theater", icon: "🎭" },
    { name: "Education", icon: "📚" },
    { name: "Food & Beverage", icon: "🍔" },
    { name: "Technology", icon: "🖥️" },
    { name: "Lifestyle", icon: "👗" },
    { name: "Health", icon: "🧘" },
  ];

  const cities = [
    "All Cities",
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Yogyakarta",
    "Bali",
    "Medan",
    "Makassar",
    "Semarang",
  ];

  // Fetch events when component mounts
  useEffect(() => {
    // Reset filters and fetch initial data
    setActiveCategory("All");
    setActiveCity("All Cities");
    fetchEvents();
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch all events with larger limit to have enough data
      const response = await fetch("/api/events?limit=20");
      const data = await response.json();

      if (data.events && data.events.length > 0) {
        // Sort events by date (newest first)
        const sortedEvents = [...data.events].sort(
          (a, b) =>
            new Date(a.tanggal_mulai).getTime() -
            new Date(b.tanggal_mulai).getTime()
        );

        // Take 4 events for featured slider (or less if we don't have enough)
        setFeaturedEvents(
          sortedEvents.slice(0, Math.min(4, sortedEvents.length))
        );

        // Take up to 6 events for the upcoming events section
        setUpcomingEvents(
          sortedEvents.slice(0, Math.min(6, sortedEvents.length))
        );
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter events by category
  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    filterEvents(category, activeCity);

    // If category is "All", we might want to refresh the featured events as well
    if (category === "All") {
      fetchEvents();
    }
  };

  // Filter events by city
  const filterByCity = (city: string) => {
    setActiveCity(city);
    filterEvents(activeCategory, city);

    // If city is "All Cities", refresh the events
    if (city === "All Cities") {
      fetchEvents();
    }
  };

  // Apply both filters
  const filterEvents = async (category: string, city: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/events?limit=20");
      const data = await response.json();

      if (data.events && data.events.length > 0) {
        let filteredEvents = [...data.events];

        // Apply category filter if not "All"
        if (category !== "All") {
          filteredEvents = filteredEvents.filter(
            (event) =>
              event.kategori_event.toLowerCase() === category.toLowerCase()
          );
        }

        // Apply city filter if not "All Cities"
        if (city !== "All Cities") {
          filteredEvents = filteredEvents.filter((event) => {
            const eventCity = event.lokasi.split(",")[0].trim(); // Get first part of location (city)
            return eventCity.toLowerCase() === city.toLowerCase();
          });
        }

        // Sort by date
        filteredEvents.sort(
          (a, b) =>
            new Date(a.tanggal_mulai).getTime() -
            new Date(b.tanggal_mulai).getTime()
        );

        // Update both featured and upcoming events
        setFeaturedEvents(
          filteredEvents.slice(0, Math.min(4, filteredEvents.length))
        );
        setUpcomingEvents(
          filteredEvents.slice(0, Math.min(6, filteredEvents.length))
        );
      } else {
        setFeaturedEvents([]);
        setUpcomingEvents([]);
      }
    } catch (error) {
      console.error("Failed to filter events:", error);
      setFeaturedEvents([]);
      setUpcomingEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-sliding every 2 seconds for featured events
  useEffect(() => {
    if (featuredEvents.length === 0) return;

    const interval = setInterval(() => {
      const nextSlide =
        currentSlide === featuredEvents.length - 1 ? 0 : currentSlide + 1;
      setCurrentSlide(nextSlide);

      // Scroll the slider smoothly
      if (sliderRef.current) {
        const scrollAmount = sliderRef.current.offsetWidth;
        sliderRef.current.scrollTo({
          left: scrollAmount * nextSlide,
          behavior: "smooth",
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentSlide, featuredEvents.length]);

  // Get ticket price range text
  const getTicketPriceText = (event: Event) => {
    if (!event.tipe_tikets || event.tipe_tikets.length === 0) {
      return "Gratis";
    }

    const prices = event.tipe_tikets.map((ticket) => ticket.harga);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `Rp ${minPrice.toLocaleString("id-ID")}`;
    }

    return `Rp ${minPrice.toLocaleString("id-ID")} - ${maxPrice.toLocaleString(
      "id-ID"
    )}`;
  };

  // Format date for display
  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      return format(start, "dd MMMM yyyy");
    }

    return `${format(start, "dd")} - ${format(end, "dd MMMM yyyy")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header with modern gradient background */}
      {/* Header with Islamic celebration themed animations */}
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
      {/* Auto-sliding carousel with background image */}
      {featuredEvents.length > 0 && (
        <div className="mt-20 mb-12 overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                ></path>
              </svg>
              Featured Events
            </h2>
            <div
              ref={sliderRef}
              className="flex overflow-x-hidden scroll-smooth"
            >
              {featuredEvents.map((event, index) => (
                <div
                  key={event.event_id}
                  className="min-w-full md:min-w-[50%] lg:min-w-[100%] flex-shrink-0 px-2 relative h-72 rounded-xl overflow-hidden"
                >
                  {/* Background image */}
                  <Image
                    src={event.foto_event || "/placeholder-event.jpg"}
                    alt={event.nama_event}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  {/* Content slider */}
                  <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {event.nama_event}
                    </h3>
                    <p className="text-white/90 mb-6 max-w-lg">
                      {event.deskripsi?.slice(0, 120) ||
                        `${event.kategori_event} event in ${event.lokasi}`}
                      {event.deskripsi && event.deskripsi.length > 120
                        ? "..."
                        : ""}
                    </p>
                    <div className="flex">
                      <Link href={`/ticket/${event.event_id}`}>
                        <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg">
                          Learn more
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {featuredEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    if (sliderRef.current) {
                      const scrollAmount = sliderRef.current.offsetWidth;
                      sliderRef.current.scrollTo({
                        left: scrollAmount * index,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-indigo-600 scale-110"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Chips - Enhanced */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto pb-2 -mx-2 scrollbar-hide">
          {categories.map((category, index) => (
            <div key={index} className="flex-shrink-0 px-2">
              <button
                className={`flex items-center space-x-2 ${
                  activeCategory === category.name
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
                } rounded-full px-5 py-2.5 text-sm transition-all duration-200 shadow-sm`}
                onClick={() => filterByCategory(category.name)}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Location Filter - Enhanced */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex overflow-x-auto pb-2 -mx-2 scrollbar-hide">
          {cities.map((city, index) => (
            <div key={index} className="flex-shrink-0 px-2">
              <button
                className={`flex items-center space-x-1 ${
                  activeCity === city
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                } rounded-full px-5 py-2.5 text-sm transition-all duration-200 font-medium shadow-sm`}
                onClick={() => filterByCity(city)}
              >
                <span>{city}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Event Cards - Enhanced with the same design as the events page */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Upcoming Events
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
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
              No events found
            </h3>
            <p className="text-gray-500">
              Try changing your filters or check back later
            </p>
          </div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.event_id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                    },
                  },
                }}
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
                        {formatEventDate(
                          event.tanggal_mulai,
                          event.tanggal_selesai
                        )}
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

        <div className="text-center mt-10">
          <Link href="/events">
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-50 transition-all duration-300 font-medium">
              Lihat Semua Event
            </button>
          </Link>
        </div>
      </div>

      {/* Promo Section - Enhanced */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-16 mt-12">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center text-white">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/image/image create event.png"
              alt="Create event illustration"
              width={500}
              height={400}
              className="max-w-md mx-auto rounded-lg shadow-2xl"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-4">Make your own Event</h2>
            <p className="mb-6 max-w-md text-white/90">
              Create and manage your own events. Reach more attendees and grow
              your community.
            </p>
            <Link href="/organizer/create-event">
              <button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-8 py-3 font-medium transition-all duration-300 shadow-lg">
                Create Events
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
