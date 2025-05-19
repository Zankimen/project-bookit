// src/app/organizer/rekening/page.tsx
"use client";

import { useState } from 'react';
import Sidebar from '@/app/components/sidebar';


export default function RekeningPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('bank');
  
  // Data bank di Indonesia
  const banks = [
    { id: 'bca', name: 'Bank Central Asia (BCA)' },
    { id: 'bni', name: 'Bank Negara Indonesia (BNI)' },
    { id: 'bri', name: 'Bank Rakyat Indonesia (BRI)' },
    { id: 'mandiri', name: 'Bank Mandiri' },
    { id: 'cimb', name: 'CIMB Niaga' },
    { id: 'danamon', name: 'Bank Danamon' },
    { id: 'permata', name: 'Bank Permata' },
    { id: 'panin', name: 'Bank Panin' },
    { id: 'maybank', name: 'Maybank Indonesia' },
    { id: 'btn', name: 'Bank Tabungan Negara (BTN)' },
    { id: 'bukopin', name: 'Bank Bukopin' },
    { id: 'ocbc', name: 'OCBC NISP' },
  ];

  const [formData, setFormData] = useState({
    bank: '',
    accountName: '',
    accountNumber: '',
    branch: '',
    city: ''
  });

  const [charCount, setCharCount] = useState({
    branch: 0,
    city: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Hitung karakter untuk field tertentu
    if (name === 'branch' || name === 'city') {
      setCharCount(prev => ({ ...prev, [name]: value.length }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi sebelum submit
    if (!formData.bank || !formData.accountName || !formData.accountNumber) {
      alert('Harap isi semua field yang wajib diisi');
      return;
    }
    // Simpan data rekening
    alert('Data rekening berhasil disimpan!');
    console.log('Data rekening:', formData);
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
      <div className={`flex-1 flex flex-col overflow-hidden lg:ml-0`}>        {/* Mobile header */}
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
            <h1 className="text-xl font-semibold text-gray-800">Rekening</h1>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="container mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Rekening Kamu</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Bank Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank *
                </label>
                <select
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Pilih Bank</option>
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
              </div>

              {/* Account Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemilik Rekening *
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Account Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Rekening *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              {/* Branch */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kantor Cabang *
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                  maxLength={30}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kantor cabang saat kamu membuka rekening. Contoh: Kantor Cabang Kallurang. ({charCount.branch}/30)
                </p>
              </div>

              {/* City */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kota *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                  maxLength={30}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kota tempat kantor cabang saat kamu membuka rekening. Contoh: Yogyakarta. ({charCount.city}/30)
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Simpan Rekening
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