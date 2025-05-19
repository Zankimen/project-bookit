// src/app/organizer/settings/page.tsx
"use client";

import { useState } from 'react';
import Sidebar from '@/app/components/sidebar';

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('close-account');
  const [agreeToClose, setAgreeToClose] = useState(false);

  const handleCloseAccount = () => {
    if (!agreeToClose) {
      alert('Anda harus menyetujui syarat dan ketentuan terlebih dahulu');
      return;
    }
    if (confirm('Apakah Anda yakin ingin menutup akun? Tindakan ini tidak dapat dibatalkan.')) {
      alert('Akun Anda akan ditutup. Proses ini mungkin memerlukan beberapa waktu.');
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Pengaturan</h1>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Profil Kamu</h1>
            
            {/* Settings Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveSettingsTab('account')}
                className={`px-4 py-2 font-medium ${
                  activeSettingsTab === 'account' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Akun
              </button>
              <button
                onClick={() => setActiveSettingsTab('settings')}
                className={`px-4 py-2 font-medium ${
                  activeSettingsTab === 'settings' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pengaturan
              </button>
              <button
                onClick={() => setActiveSettingsTab('close-account')}
                className={`px-4 py-2 font-medium ${
                  activeSettingsTab === 'close-account' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tutup Akun
              </button>
            </div>

            {/* Close Account Section */}
            {activeSettingsTab === 'close-account' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Tutup Akun</h2>
                <p className="text-gray-600 mb-6">
                  Harap baca syarat dan ketentuan berikut dengan teliti sebelum menutup akun kamu.
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Menutup Akun</h3>
                  <p className="text-gray-600 mb-4">
                    Setelah kamu menutup akun, hal-hal yang berkaitan dengan informasi pribadi akan dinonaktifkan, termasuk:
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
                    <li>Data pribadi</li>
                    <li>Keterlibatan dari kampanye promosi</li>
                    <li>Bagi event creator, riwayat eventmu akan hilang setelah penutupan akun</li>
                  </ul>

                  <div className="flex items-start mb-6">
                    <input
                      type="checkbox"
                      id="agree-to-close"
                      checked={agreeToClose}
                      onChange={(e) => setAgreeToClose(e.target.checked)}
                      className="mt-1 mr-2"
                    />
                    <label htmlFor="agree-to-close" className="text-gray-700">
                      Saya dengan sadar setuju untuk menutup akun.
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={handleCloseAccount}
                    disabled={!agreeToClose}
                    className={`px-4 py-2 rounded-md ${
                      agreeToClose 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Tutup Akun
                  </button>
                </div>
              </div>
            )}

            {/* Other tabs content would go here */}
            {activeSettingsTab === 'account' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Pengaturan Akun</h2>
                <p className="text-gray-600">Konten pengaturan akun akan ditampilkan di sini.</p>
              </div>
            )}

            {activeSettingsTab === 'settings' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Pengaturan Umum</h2>
                <p className="text-gray-600">Konten pengaturan umum akan ditampilkan di sini.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}