"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from '@/app/components/sidebar';

export default function AdminDashboard() {
  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dummy data for dashboard statistics
  const stats = [
    { id: 1, title: "Event Aktif", value: "124", change: "", icon: "📅" },
    { id: 2, title: "Total Penjualan", value: "Rp 1.25M", change: "", icon: "💰" },
    { id: 3, title: "Total Pengunjung", value: "4,582", change: "", icon: "👥" },
    { id: 4, title: "Total Tiket Terjual", value: "8,927", change: "", icon: "🎟️" },
    { id: 5, title: "Total Transaksi", value: "8,927", change: "", icon: "💳" },

  ];
  
  // Dummy data for recent events
  const recentEvents = [
    {
      id: 1,
      title: "Java Jazz Festival 2025",
      date: "24-26 March 2025",
      location: "JIExpo Kemayoran, Jakarta",
      status: "Active",
      sold: 1240,
      total: 2500,
      image: "/api/placeholder/50/50",
    },
    {
      id: 2,
      title: "Jakarta International Food Festival",
      date: "15-17 April 2025",
      location: "Senayan City, Jakarta",
      status: "Active",
      sold: 850,
      total: 1200,
      image: "/api/placeholder/50/50",
    },
    {
      id: 3,
      title: "Indonesia Comic Con 2025",
      date: "5-6 May 2025",
      location: "ICE BSD, Tangerang",
      status: "Draft",
      sold: 0,
      total: 3000,
      image: "/api/placeholder/50/50",
    },
    {
      id: 4,
      title: "Bali Spirit Festival",
      date: "10-14 June 2025",
      location: "Ubud, Bali",
      status: "Active",
      sold: 950,
      total: 1500,
      image: "/api/placeholder/50/50",
    },
    {
      id: 5,
      title: "Jakarta Fashion Week",
      date: "20-26 July 2025",
      location: "Senayan City, Jakarta",
      status: "Active",
      sold: 675,
      total: 2000,
      image: "/api/placeholder/50/50",
    },
  ];
  
  // Dummy data for recent transactions
  const recentTransactions = [
    {
      id: "TRX-24560",
      customer: "Anisa Wijaya",
      event: "Java Jazz Festival 2025",
      date: "Mar 23, 2025",
      amount: "Rp 850.000",
      status: "Completed",
    },
    {
      id: "TRX-24559",
      customer: "Budi Santoso",
      event: "Bali Spirit Festival",
      date: "Mar 23, 2025",
      amount: "Rp 1.200.000",
      status: "Completed",
    },
    {
      id: "TRX-24558",
      customer: "Citra Damayanti",
      event: "Jakarta Fashion Week",
      date: "Mar 22, 2025",
      amount: "Rp 350.000",
      status: "Pending",
    },
    {
      id: "TRX-24557",
      customer: "Dodi Prakasa",
      event: "Java Jazz Festival 2025",
      date: "Mar 22, 2025",
      amount: "Rp 850.000",
      status: "Completed",
    },
    {
      id: "TRX-24556",
      customer: "Eka Putri",
      event: "Jakarta International Food Festival",
      date: "Mar 21, 2025",
      amount: "Rp 150.000",
      status: "Failed",
    },
  ];

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
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl font-semibold text-gray-800">Pengaturan</h1>
                <div className="w-6"></div>
              </div>
            </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
<div className="bg-white shadow-sm z-10 relative">
  <div className="px-4 py-3 flex items-center justify-between">
    <div className="flex items-center lg:hidden">
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
      <span className="ml-2 text-lg font-semibold text-gray-800">BookIt Admin</span>
    </div>

    <div className="flex items-center space-x-4">
      {/* Tombol Create Event baru */}
      <Link 
        href="/organizer/create-event"
        className="hidden md:flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
        Buat Event
      </Link>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
      
      <button className="text-gray-500 hover:text-gray-700">
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
      
      <div className="border-l border-gray-300 h-6"></div>
      
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
          A
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Page Content */}
        <div className="p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Home</h1>
            <p className="text-gray-600">Selamat datang di BookIt</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>{stat.change}</span>
                  <span className="text-gray-500 text-sm ml-1"></span>
                </div>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Events */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Recent Events</h2>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View All</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                                <Image src={event.image} alt={event.title} width={40} height={40} className="object-cover" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                <div className="text-sm text-gray-500">{event.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{event.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              event.status === "Active" 
                                ? "bg-green-100 text-green-800" 
                                : event.status === "Draft" 
                                ? "bg-gray-100 text-gray-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{event.sold} / {event.total}</div>
                            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full" 
                                style={{ width: `${(event.sold / event.total) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                            <button className="text-gray-500 hover:text-gray-700">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium">5</span> of <span className="font-medium">42</span> events
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">Previous</button>
                      <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-indigo-600 text-white">Next</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">View All</button>
                  </div>
                </div>
                <div className="p-4">
                  {recentTransactions.map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className={`p-3 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} mb-2`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{transaction.id}</span>
                        <span className={`text-xs font-semibold rounded-full px-2 py-1 ${
                          transaction.status === "Completed" 
                            ? "bg-green-100 text-green-800" 
                            : transaction.status === "Pending" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{transaction.customer}</div>
                      <div className="text-xs text-gray-500">{transaction.event}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{transaction.date}</span>
                        <span className="text-sm font-semibold text-indigo-600">{transaction.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                    Load more transactions
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Create New Event</h3>
              <p className="mb-4 text-white/80">
              Mulailah menyiapkan acara Anda berikutnya dengan proses pembuatan kami yang efisien..
              </p>
              <Link
                href="/"
                className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg px-4 py-2 text-sm font-medium transition-all">
                Create Event
              </Link>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Generate Reports</h3>
              <p className="mb-4 text-white/80">
              Dapatkan laporan tentang bisnis Anda dengan analisis yang terperinci..
              </p>
              <Link 
                href="/organizer/reports" 
                className="inline-block bg-white text-purple-600 hover:bg-purple-50 rounded-lg px-4 py-2 text-sm font-medium transition-all"
              >
                View Reports
              </Link>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Manage Settings</h3>
              <p className="mb-4 text-white/80">
              Perbarui pengaturan platform Anda dan sesuaikan tampilannya..
              </p>
              <Link
                href="/organizer/pengaturan"
                className="bg-white text-pink-600 hover:bg-pink-50 rounded-lg px-4 py-2 text-sm font-medium transition-all">
                Go to Settings
                </Link>
            
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}