"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Mock user profile data
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812 3456 7890",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    birthdate: "1990-05-15",
    gender: "Male",
    avatar: "/api/placeholder/100/100",
    preferredCategories: ["Music", "Theater", "Food & Beverage"],
    notificationSettings: {
      email: true,
      sms: true,
      app: true,
      marketing: false
    },
    paymentMethods: [
      {
        id: 1,
        type: "Credit Card",
        name: "Visa ending in 4242",
        isDefault: true,
        expires: "09/2026"
      },
      {
        id: 2,
        type: "E-Wallet",
        name: "GoPay",
        isDefault: false,
        linked: true
      }
    ]
  });

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

  // Handle saving profile edits
  const handleSaveProfile = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // In a real app, you'd save the updated profile here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white text-gray-800 shadow-lg"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="font-bold text-2xl flex items-center">
                <svg
                  className={`w-8 h-8 mr-2 ${
                    isScrolled ? "text-indigo-600" : "text-white"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 13L12 16L15 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className={
                    isScrolled ? "text-indigo-600" : "text-white tracking-wider"
                  }
                >
                  BookIt
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-1">
                {[
                  { name: "Events", href: "/ticket", active: false },
                  { name: "Dashboard", href: "/dashboard", active: false },
                  { name: "My Tickets", href: "/dashboard", active: false },
                  { name: "Profile", href: "/profile", active: true },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isScrolled
                        ? item.active
                          ? "bg-indigo-100 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100"
                        : item.active
                        ? "bg-white/20 text-white backdrop-blur-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image 
                    src={userProfile.avatar}
                    alt="User avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className={isScrolled ? "text-gray-700" : "text-white"}>
                  {userProfile.name}
                </span>
              </div>
              <div className="relative group">
                <button
                  className={`text-sm py-2 px-3 rounded-full transition-all duration-200 ${
                    isScrolled
                      ? "hover:bg-gray-100"
                      : "hover:bg-white/10"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                      My Profile
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                      My Tickets
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden z-50">
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
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl p-6 md:p-8 mb-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 mr-6 group">
                  <Image 
                    src={userProfile.avatar}
                    alt="User avatar"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{userProfile.name}</h1>
                  <p className="text-white/80">{userProfile.email}</p>
                  <p className="text-white/80">{userProfile.phone}</p>
                </div>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-bold text-gray-800">Profile Settings</h2>
                </div>
                <div className="p-2">
                  <nav>
                    {[
                      { id: "profile", name: "Personal Information", icon: "user" },
                      { id: "preferences", name: "Preferences", icon: "heart" },
                      { id: "payment", name: "Payment Methods", icon: "credit-card" },
                      { id: "notifications", name: "Notifications", icon: "bell" },
                      { id: "security", name: "Security", icon: "lock" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center p-3 text-left rounded-lg transition-colors mb-1 ${
                          activeSection === item.id
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {item.icon === "user" && (
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                        {item.icon === "heart" && (
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                        {item.icon === "credit-card" && (
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        )}
                        {item.icon === "bell" && (
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        )}
                        {item.icon === "lock" && (
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        )}
                        {item.name}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Personal Information */}
                {activeSection === "profile" && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="font-bold text-gray-800">Personal Information</h2>
                    </div>
                    <div className="p-6">
                      {isEditing ? (
                        <form onSubmit={handleSaveProfile}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={userProfile.name}
                                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <input
                                type="email"
                                value={userProfile.email}
                                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={userProfile.phone}
                                onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender
                              </label>
                              <select
                                value={userProfile.gender}
                                onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                              </label>
                              <input
                                type="date"
                                value={userProfile.birthdate}
                                onChange={(e) => setUserProfile({...userProfile, birthdate: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                              </label>
                              <textarea
                                value={userProfile.address}
                                onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">Full Name</h3>
                              <p className="font-medium">{userProfile.name}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">Email</h3>
                              <p className="font-medium">{userProfile.email}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">Phone Number</h3>
                              <p className="font-medium">{userProfile.phone}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">Gender</h3>
                              <p className="font-medium">{userProfile.gender}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">Date of Birth</h3>
                              <p className="font-medium">{new Date(userProfile.birthdate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <h3 className="text-sm text-gray-500 mb-1">Address</h3>
                              <p className="font-medium">{userProfile.address}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preferences */}
                {activeSection === "preferences" && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="font-bold text-gray-800">Preferences</h2>
                    </div>
                    <div className="p-6">
                      <h3 className="font-medium text-gray-800 mb-3">Event Categories</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Select event categories you're interested in to receive personalized recommendations.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {["Music", "Sports", "Theater", "Food & Beverage", "Exhibition", "Conference", "Workshop", "Fashion", "Wellness"].map((category) => (
                          <div
                            key={category}
                            className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                              userProfile.preferredCategories.includes(category)
                                ? "bg-indigo-100 text-indigo-600 border border-indigo-300"
                                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                            }`}
                            onClick={() => {
                              if (userProfile.preferredCategories.includes(category)) {
                                setUserProfile({
                                  ...userProfile,
                                  preferredCategories: userProfile.preferredCategories.filter(c => c !== category)
                                });
                              } else {
                                setUserProfile({
                                  ...userProfile,
                                  preferredCategories: [...userProfile.preferredCategories, category]
                                });
                              }
                            }}
                          >
                            {category}
                          </div>
                        ))}
                      </div>

                      <h3 className="font-medium text-gray-800 mb-3">Language Preference</h3>
                      <div className="mb-8">
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="en">English</option>
                          <option value="id">Bahasa Indonesia</option>
                        </select>
                      </div>

                      <div className="flex justify-end">
                        <button
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                {activeSection === "payment" && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="font-bold text-gray-800">Payment Methods</h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {userProfile.paymentMethods.map((method) => (
                          <div 
                            key={method.id}
                            className="border rounded-lg p-4 flex items-center justify-between hover:border-indigo-300 transition-colors"
                          >
                            <div className="flex items-center">
                              {method.type === "Credit Card" ? (
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{method.name}</div>
                                <div className="text-sm text-gray-500">
                                  {method.expires && `Expires ${method.expires}`}
                                  {method.linked && "Linked to your account"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {method.isDefault && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeSection === "notifications" && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="font-bold text-gray-800">Notification Settings</h2>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-600 mb-6">
                        Manage how you receive notifications about events, tickets, and updates.
                      </p>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Receive updates and confirmations via email</p>
                          </div>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id="email-notifications"
                              checked={userProfile.notificationSettings.email}
                              onChange={() => {
                                setUserProfile({
                                  ...userProfile,
                                  notificationSettings: {
                                    ...userProfile.notificationSettings,
                                    email: !userProfile.notificationSettings.email
                                  }
                                });
                              }}
                              className="sr-only"
                            />
                            <label 
                              htmlFor="email-notifications" 
                              className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                                userProfile.notificationSettings.email ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span 
                                className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white ${
                                  userProfile.notificationSettings.email ? 'transform translate-x-6' : ''
                                }`} 
                              />
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                            <p className="text-sm text-gray-500">Receive text message alerts about your tickets</p>
                          </div>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id="sms-notifications"
                              checked={userProfile.notificationSettings.sms}
                              onChange={() => {
                                setUserProfile({
                                  ...userProfile,
                                  notificationSettings: {
                                    ...userProfile.notificationSettings,
                                    sms: !userProfile.notificationSettings.sms
                                  }
                                });
                              }}
                              className="sr-only"
                            />
                            <label 
                              htmlFor="sms-notifications" 
                              className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                                userProfile.notificationSettings.sms ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span 
                                className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white ${
                                  userProfile.notificationSettings.sms ? 'transform translate-x-6' : ''
                                }`} 
                              />
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">App Notifications</h3>
                            <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                          </div>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id="app-notifications"
                              checked={userProfile.notificationSettings.app}
                              onChange={() => {
                                setUserProfile({
                                  ...userProfile,
                                  notificationSettings: {
                                    ...userProfile.notificationSettings,
                                    app: !userProfile.notificationSettings.app
                                  }
                                });
                              }}
                              className="sr-only"
                            />
                            <label 
                              htmlFor="app-notifications" 
                              className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                                userProfile.notificationSettings.app ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span 
                                className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white ${
                                  userProfile.notificationSettings.app ? 'transform translate-x-6' : ''
                                }`} 
                              />
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">Marketing Emails</h3>
                            <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                          </div>
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              id="marketing-notifications"
                              checked={userProfile.notificationSettings.marketing}
                              onChange={() => {
                                setUserProfile({
                                  ...userProfile,
                                  notificationSettings: {
                                    ...userProfile.notificationSettings,
                                    marketing: !userProfile.notificationSettings.marketing
                                  }
                                });
                              }}
                              className="sr-only"
                            />
                            <label 
                              htmlFor="marketing-notifications" 
                              className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                                userProfile.notificationSettings.marketing ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span 
                                className={`block w-4 h-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white ${
                                  userProfile.notificationSettings.marketing ? 'transform translate-x-6' : ''
                                }`} 
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-8">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security */}
                {activeSection === "security" && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="font-bold text-gray-800">Security Settings</h2>
                    </div>
                    <div className="p-6">
                      <h3 className="font-medium text-gray-800 mb-6">Change Password</h3>
                      
                      <form className="space-y-4 mb-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="pt-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-medium text-gray-800 mb-3">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                          Enable Two-Factor Authentication
                        </button>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="font-medium text-gray-800 mb-3">Login Sessions</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          These are devices that have logged into your account. Revoke any sessions that you do not recognize.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">Current Session</div>
                              <div className="text-sm text-gray-500">Chrome on Windows • Jakarta, Indonesia</div>
                            </div>
                            <div className="text-sm text-gray-500">Active now</div>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">iPhone 12</div>
                              <div className="text-sm text-gray-500">Safari on iOS • Jakarta, Indonesia</div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-sm text-gray-500">2 days ago</div>
                              <button className="text-sm text-red-600 hover:text-red-800">Revoke</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-3">
                <svg
                  className="w-7 h-7 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 13L12 16L15 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xl font-bold">BookIt</span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                The best event ticketing platform for all your entertainment needs
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all duration-300"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© 2025 BookIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}