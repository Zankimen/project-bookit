// src/app/organizer/informasi-dasar/page.tsx
"use client";

import { useState } from 'react';
import Sidebar from '@/app/components/sidebar';

export default function InformasiDasarPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    profileImage: '',
    shortUrl: 'https://loket.com/o/',
    organizerName: 'Muhammad Daffa Ayyasy',
    email: 'daffa@example.com',
    phone: '+6281234567890',
    address: 'Jl. Contoh No. 123, Jakarta',
    about: 'Penyelenggara event kreatif dan inovatif',
    featuredEvent: '',
    twitter: '@daffaayyasy',
    instagram: '@daffaayyasy',
    facebook: 'https://facebook.com/daffaayyasy'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file tidak boleh lebih dari 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, profileImage: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Perubahan berhasil disimpan!');
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
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl font-semibold text-gray-800">Pengaturan</h1>
                <div className="w-6"></div>
              </div>
            </header>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden lg:ml-0`}>
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
            <h1 className="text-xl font-semibold text-gray-800">Informasi Dasar</h1>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Informasi Dasar</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Upload Gambar */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Unggah gambar/poster/banner</h2>
                <p className="text-gray-600 mb-4">Direkomendasikan 1500 x 500px dan tidak lebih dari 2Mb</p>
                <div className="flex items-center">
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Pilih File
                    </div>
                  </label>
                  {formData.profileImage && (
                    <img 
                      src={formData.profileImage} 
                      alt="Preview" 
                      className="ml-4 w-20 h-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              {/* Tautan Profil */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Tautan Singkat Profil</h2>
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    value={formData.shortUrl}
                    readOnly
                    className="border border-gray-300 rounded-l-md px-3 py-2 flex-grow"
                  />
                  <button 
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-md"
                    onClick={() => navigator.clipboard.writeText(formData.shortUrl)}
                  >
                    Salin
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Tautan singkat profil hanya dapat diganti satu kali.
                </p>
              </div>

              {/* Informasi Organizer */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6">Informasi Organizer</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Organizer *
                  </label>
                  <input
                    type="text"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Nama kamu akan ditampilkan sebagai Nama Penyelenggara di halaman event kamu.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Ponsel *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tentang Kami
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Event (ID Event)
                  </label>
                  <input
                    type="text"
                    name="featuredEvent"
                    value={formData.featuredEvent}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Masukkan ID event yang ingin ditampilkan"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Event yang kamu pilih akan tampil di halaman profil kamu.
                  </p>
                </div>
              </div>

              {/* Media Sosial */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6">Media Sosial</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter Username
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        @
                      </span>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        className="flex-1 border border-gray-300 rounded-r-md px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram Username
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                        @
                      </span>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="flex-1 border border-gray-300 rounded-r-md px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="https://facebook.com/username"
                  />
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}