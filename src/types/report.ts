export interface ReportStats {
  totalPendapatan: number;
  totalTiketTerjual: number;
  eventAktif: number;
  rataRataHargaTiket: number;
}

export interface EventReport {
  event_id: string;
  nama_event: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  tiketTerjual: number;
  pendapatan: number;
  status: string;
}

export interface MonthlyData {
  sales: number[];
  tickets: number[];
}

export interface ReportData {
  weeklyData: any;
  statistics: ReportStats;
  events: EventReport[];
  monthlyData: MonthlyData;
}