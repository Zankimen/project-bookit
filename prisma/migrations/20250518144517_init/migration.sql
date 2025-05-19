-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TiketStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'SOLD', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Pembeli" (
    "pembeli_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama_pembeli" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "foto_profil" TEXT,

    CONSTRAINT "Pembeli_pkey" PRIMARY KEY ("pembeli_id")
);

-- CreateTable
CREATE TABLE "EventCreator" (
    "creator_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama_brand" TEXT NOT NULL,
    "deskripsi_creator" TEXT,
    "foto_profil" TEXT,
    "no_rekening" TEXT,
    "kontak" TEXT,

    CONSTRAINT "EventCreator_pkey" PRIMARY KEY ("creator_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" TEXT NOT NULL,
    "nama_event" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kota_kabupaten" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "foto_event" TEXT,
    "kategori_event" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "TipeTiket" (
    "tiket_type_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,
    "jumlah_tersedia" INTEGER NOT NULL,

    CONSTRAINT "TipeTiket_pkey" PRIMARY KEY ("tiket_type_id")
);

-- CreateTable
CREATE TABLE "Tiket" (
    "tiket_id" TEXT NOT NULL,
    "tiket_type_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" "TiketStatus" NOT NULL,
    "kode_qr" TEXT,
    "dibuat_di" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tiket_pkey" PRIMARY KEY ("tiket_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "jumlah_total" DECIMAL(65,30) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "dibuat_di" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "payment_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "invoice_id" TEXT,
    "jumlah" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "waktu_transaksi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "invoice_id" TEXT NOT NULL,
    "pembayaran_id" TEXT NOT NULL,
    "nomor_invoice" TEXT NOT NULL,
    "jumlah" DECIMAL(65,30) NOT NULL,
    "dibuat_di" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "EventHistory" (
    "history_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "catatan_waktu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventHistory_pkey" PRIMARY KEY ("history_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pembeli_user_id_key" ON "Pembeli"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventCreator_user_id_key" ON "EventCreator"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pembayaran_order_id_key" ON "Pembayaran"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_pembayaran_id_key" ON "Invoice"("pembayaran_id");

-- AddForeignKey
ALTER TABLE "Pembeli" ADD CONSTRAINT "Pembeli_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCreator" ADD CONSTRAINT "EventCreator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "EventCreator"("creator_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipeTiket" ADD CONSTRAINT "TipeTiket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tiket" ADD CONSTRAINT "Tiket_tiket_type_id_fkey" FOREIGN KEY ("tiket_type_id") REFERENCES "TipeTiket"("tiket_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tiket" ADD CONSTRAINT "Tiket_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_pembayaran_id_fkey" FOREIGN KEY ("pembayaran_id") REFERENCES "Pembayaran"("payment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventHistory" ADD CONSTRAINT "EventHistory_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventHistory" ADD CONSTRAINT "EventHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
