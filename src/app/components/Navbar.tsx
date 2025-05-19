"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";

export default function Navbar() {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for navbar scrolling
  const [isScrolled, setIsScrolled] = useState(false);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for search results
  const [searchResults, setSearchResults] = useState<Array<{
    event_id: string;
    nama_event: string;
    tanggal_mulai: string;
    lokasi: string;
  }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Auth context
  const { user, logout, setUser } = useAuth();
  const router = useRouter();

  // Refs
  const navbarRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/events/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSearchResults(data.events);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    }, 300),
    []
  );

  // Handle search input changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Handle scroll event to make navbar sticky
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setMobileMenuOpen(false);
  };

  const handleSwitchAccountType = async (type: "customer" | "creator") => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const currentUser = JSON.parse(userData);

      // Update user type and authorization role
      const updatedUser = {
        ...currentUser,
        type: type,
        activeRole: type, // Set active role to match the selected type
      };

      // Update local storage with new user data
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Set user context data
      setUser && setUser(updatedUser);

      // Redirect to homepage using window.location for a full page refresh
      window.location.href = "/";
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/events/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <div
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-gray-800 shadow-lg"
          : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link href="/" className="font-bold text-2xl flex items-center">
              {/* logo */}
              <img
                src={isScrolled ? "/image/warna.svg" : "/image/putih.svg"}
                alt="BookIt Logo"
                className="w-6 h-6 mr-1"
              />
              <span
                className={
                  isScrolled ? "text-indigo-600" : "text-white tracking-wider"
                }
              >
                BookIt
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-1">
              {user?.type === "creator" && (
                <Link
                  href="/organizer"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Kelola Event
                </Link>
              )}

              {user?.type === "customer" && (
                <Link
                  href="/customer/dashboard"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isScrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Tiket Saya
                </Link>
              )}

              <div className="relative">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Cari event..."
                    className={`w-64 pl-4 pr-12 py-2 text-sm rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isScrolled
                        ? "bg-gray-50 border-gray-200 focus:ring-indigo-500 text-gray-800"
                        : "bg-white/10 border-transparent text-white placeholder-white/70 focus:ring-white/50 focus:w-72"
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    onFocus={() => setShowSearchResults(true)}
                  />
                  <button
                    onClick={handleSearch}
                    className={`absolute right-0 top-0 h-full px-4 flex items-center justify-center transition-all duration-200 rounded-r-full ${
                      isScrolled
                        ? "text-gray-400 hover:text-indigo-600"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>

                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults && searchResults.length > 0 && (
                    <div 
                      className="absolute mt-2 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((event) => (
                          <Link
                            key={event.event_id}
                            href={`/ticket/${event.event_id}`}
                            onClick={() => {
                              setShowSearchResults(false);
                              setSearchQuery('');
                            }}
                            className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                          >
                            <div className="text-sm font-medium text-gray-800">{event.nama_event}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              <span className="inline-block mr-3">
                                📅 {new Date(event.tanggal_mulai).toLocaleDateString('id-ID')}
                              </span>
                              <span>📍 {event.lokasi}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center">
                <div className="relative group">
                  <button
                    className={`flex items-center text-sm py-2 px-4 rounded-full transition-all duration-200 ${
                      isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                    }`}
                  >
                    <span className="mr-1">{user.name}</span>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Profil Saya
                      </Link>

                      {/* Show appropriate menu based on user type */}
                      {user.type === "customer" ? (
                        <Link
                          href="/customer/dashboard"
                          className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Tiket Saya
                        </Link>
                      ) : (
                        <Link
                          href="/organizer"
                          className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Kelola Event
                        </Link>
                      )}

                      <div className="border-t border-gray-200 my-1"></div>

                      {/* Account switching buttons */}
                      {user.type === "customer" ? (
                        <button
                          onClick={() => handleSwitchAccountType("creator")}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Beralih ke Event Creator
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSwitchAccountType("customer")}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Beralih ke Akun Pembeli
                        </button>
                      )}

                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button
                    className={`text-sm py-2 px-5 rounded-full transition-all duration-200 ${
                      isScrolled
                        ? "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        : "text-white border border-white/60 hover:bg-white hover:text-indigo-600"
                    }`}
                  >
                    Masuk
                  </button>
                </Link>

                <Link href="/register">
                  <button
                    className={`text-sm py-2 px-5 rounded-full transition-all duration-200 shadow-lg ${
                      isScrolled
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-white text-indigo-600 hover:bg-indigo-100"
                    }`}
                  >
                    Daftar
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke={isScrolled ? "currentColor" : "white"}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke={isScrolled ? "currentColor" : "white"}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-x-0 top-16 z-40 bg-gradient-to-b from-indigo-600 to-purple-700 pt-4 pb-6 px-4 shadow-xl rounded-b-2xl">
            <nav className="flex flex-col space-y-3">
              <div className="relative px-4 py-2">
                <input
                  type="text"
                  placeholder="Cari event..."
                  className="w-full px-4 pr-12 py-2 text-sm rounded-full bg-white/10 border border-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      setMobileMenuOpen(false);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    handleSearch();
                    setMobileMenuOpen(false);
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white"
                >
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              {user?.type === "creator" && (
                <Link
                  href="/organizer"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kelola Event
                </Link>
              )}

              {user && (
                <Link
                  href="/customer/dashboard"
                  className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tiket Saya
                </Link>
              )}

              {user ? (
                <>
                  <div className="pt-3 pb-1 px-4 border-t border-white/20">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-white/70 text-sm">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profil Saya
                  </Link>

                  {/* Show appropriate menu based on user type */}
                  {user.type === "customer" ? (
                    <Link
                      href="/customer/dashboard"
                      className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tiket Saya
                    </Link>
                  ) : (
                    <Link
                      href="/organizer"
                      className="px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Kelola Event
                    </Link>
                  )}

                  {/* Account switching buttons */}
                  <div className="border-t border-white/10 my-2"></div>
                  {user.type === "customer" ? (
                    <button
                      onClick={() => {
                        handleSwitchAccountType("creator");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                    >
                      Beralih ke Event Creator
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleSwitchAccountType("customer");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                    >
                      Beralih ke Akun Pembeli
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left text-white hover:bg-white/10 rounded-lg"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col space-y-3">
                  <Link href="/login">
                    <button
                      className="w-full text-sm py-2 px-4 text-white border border-white/60 rounded-full hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Masuk
                    </button>
                  </Link>
                  <Link href="/register">
                    <button
                      className="w-full text-sm py-2 px-4 bg-white text-indigo-600 rounded-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Daftar
                    </button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
