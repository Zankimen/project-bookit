// src/app/organizer/reports/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/sidebar";
import type { ReportData } from "@/types/report";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState("monthly");
  const [eventFilter, setEventFilter] = useState("all");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchReportData();
  }, [user, timeRange, eventFilter, router]);

  const fetchReportData = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get creator ID first
      const creatorResponse = await fetch(`/api/users/${user.id}/creator`);
      const creatorData = await creatorResponse.json();

      if (!creatorResponse.ok) {
        throw new Error("Failed to fetch creator information");
      }

      // Fetch report data
      const response = await fetch(
        `/api/reports/creator/${creatorData.creator_id}?timeRange=${timeRange}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !reportData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  const monthlyData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    datasets: [
      {
        label: "Pendapatan",
        data: reportData.monthlyData.sales,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        tension: 0.1,
      },
      {
        label: "Tiket Terjual",
        data: reportData.monthlyData.tickets,
        borderColor: "rgb(236, 72, 153)",
        backgroundColor: "rgba(236, 72, 153, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const weeklyData = {
    labels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
    datasets: [
      {
        label: "Pendapatan",
        data: reportData.weeklyData?.sales || [],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        tension: 0.1,
      },
      {
        label: "Tiket Terjual",
        data: reportData.weeklyData?.tickets || [],
        borderColor: "rgb(236, 72, 153)",
        backgroundColor: "rgba(236, 72, 153, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const eventSalesData = {
    labels: reportData.events.map(event => event.nama_event),
    datasets: [
      {
        label: "Penjualan Tiket",
        data: reportData.events.map(event => event.tiketTerjual),
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  };

  // Update the JSX to use real data
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
              <h1 className="text-xl font-semibold text-gray-800">Laporan</h1>
              <div className="w-6"></div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
            <div className="container mx-auto">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Pendapatan
                  </h3>
                  <p className="text-2xl font-bold">
                    Rp
                    {reportData.statistics.totalPendapatan.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">
                    Tiket Terjual
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.statistics.totalTiketTerjual}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">
                    Event Aktif
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.statistics.eventAktif}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">
                    Rata-rata Harga Tiket
                  </h3>
                  <p className="text-2xl font-bold">
                    Rp
                    {reportData.statistics.rataRataHargaTiket.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Tren Pendapatan & Penjualan
                  </h3>
                  <div className="h-64">
                    <Line
                      data={timeRange === "monthly" ? monthlyData : weeklyData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Penjualan per Event
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={eventSalesData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Events Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Nama Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tiket Terjual
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pendapatan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.events.map((event) => (
                      <tr key={event.event_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {event.nama_event}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(event.tanggal_mulai), "dd MMM yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.tiketTerjual}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Rp{event.pendapatan.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              event.status === "Selesai"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}