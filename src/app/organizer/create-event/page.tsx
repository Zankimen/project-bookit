// app/admin/events/create/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
// Import TipTap
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { indonesianCities } from "@/data/cities";

// Use the same validation schema from the backend
const EventSchema = z.object({
  nama_event: z.string().min(1, "Event name is required"),
  deskripsi: z.string().optional(),
  kota_kabupaten: z.string().min(1, "City/Regency is required"),
  lokasi: z.string().min(1, "Location is required"),
  tanggal_mulai: z.string().transform((val) => new Date(val).toISOString()),
  tanggal_selesai: z.string().transform((val) => new Date(val).toISOString()),
  foto_event: z.string().optional(),
  kategori_event: z.string().min(1, "Event category is required"),
  creator_id: z.string().min(1, "Creator ID is required"),
  tipe_tikets: z
    .array(
      z.object({
        nama: z.string().min(1, "Ticket type name is required"),
        harga: z.number().positive("Price must be positive"),
        jumlah_tersedia: z
          .number()
          .int()
          .positive("Available tickets must be positive"),
      })
    )
    .optional(),
});

type FileWithPreview = {
  file: File;
  preview: string;
};

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nama_event: "",
    deskripsi: "",
    kota_kabupaten: "",
    lokasi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    foto_event: "",
    kategori_event: "",
    creator_id: "",
    tipe_tikets: [{ nama: "", harga: 0, jumlah_tersedia: 0 }],
  });
  const [selectedImage, setSelectedImage] = useState<FileWithPreview | null>(
    null
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: formData.deskripsi,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({
        ...prev,
        deskripsi: html,
      }));
    },
  });

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [detailLocation, setDetailLocation] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchCreatorId = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/creator`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch creator information");
        }

        setFormData((prev) => ({
          ...prev,
          creator_id: data.creator_id,
        }));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching creator ID:", error);
        router.push("/organizer/profile");
      }
    };

    fetchCreatorId();
  }, [user, router]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest(".relative")) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTicketChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedTickets = [...formData.tipe_tikets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [name]:
        name === "harga" || name === "jumlah_tersedia" ? Number(value) : value,
    };
    setFormData((prev) => ({
      ...prev,
      tipe_tikets: updatedTickets,
    }));
  };

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      tipe_tikets: [
        ...prev.tipe_tikets,
        { nama: "", harga: 0, jumlah_tersedia: 0 },
      ],
    }));
  };

  const removeTicketType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tipe_tikets: prev.tipe_tikets.filter((_, i) => i !== index),
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }

      const preview = URL.createObjectURL(file);
      setSelectedImage({ file, preview });
    }
  };

  // Function to handle city selection
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);

    // Update formData dengan lokasi lengkap
    const fullLocation = detailLocation ? `${city}, ${detailLocation}` : city;

    setFormData((prev) => ({
      ...prev,
      lokasi: fullLocation,
    }));
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSearchQuery(city);
    setIsDropdownOpen(false);

    setFormData((prev) => ({
      ...prev,
      kota_kabupaten: city,
    }));
  };

  const handleDetailLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const detail = e.target.value;
    setDetailLocation(detail);

    setFormData((prev) => ({
      ...prev,
      lokasi: detail,
    }));
  };

  const filteredCities = useMemo(() => {
    return indonesianCities.filter((city) =>
      city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Function to handle image upload for TipTap editor
  const addImageToEditor = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      if (!input.files?.length) return;
      const file = input.files[0];

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.url;

        if (editor) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image");
      }
    };

    input.click();
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage.file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const eventData = {
        ...formData,
        foto_event: imageUrl,
      };

      const parsedData = EventSchema.parse(eventData);

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(parsedData),
      });

      if (response.ok) {
        router.push("/organizer/event-saya");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          errorMap[err.path[0]] = err.message;
        });
        setErrors(errorMap);
      } else {
        console.error("Error creating event:", error);
        alert(
          error instanceof Error ? error.message : "Failed to create event"
        );
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-500 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Buat Event Baru</h1>
          <button
            onClick={() => router.back()}
            className="bg-white rounded-full px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mb-2 ${
                  currentStep === 1 ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Info Dasar</span>
            </div>

            {/* Line connector */}
            <div className="h-1 bg-gray-200 flex-grow mx-4">
              <div
                className={`h-full bg-purple-600 transition-all duration-300 ${
                  currentStep >= 2 ? "w-full" : "w-0"
                }`}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mb-2 ${
                  currentStep === 2 ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Tanggal & Lokasi</span>
            </div>

            {/* Line connector */}
            <div className="h-1 bg-gray-200 flex-grow mx-4">
              <div
                className={`h-full bg-purple-600 transition-all duration-300 ${
                  currentStep >= 3 ? "w-full" : "w-0"
                }`}
              ></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mb-2 ${
                  currentStep === 3 ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Tiket</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Detail Event
                </h2>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Nama Event <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_event"
                    value={formData.nama_event}
                    onChange={handleChange}
                    placeholder="Masukkan nama event"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {errors.nama_event && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nama_event}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Deskripsi
                  </label>

                  <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 overflow-hidden mb-2">
                    {/* TipTap Editor Toolbar */}
                    <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleBold().run()
                        }
                        className={`p-1 rounded hover:bg-gray-200 ${
                          editor?.isActive("bold") ? "bg-gray-200" : ""
                        }`}
                        title="Bold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleItalic().run()
                        }
                        className={`p-1 rounded hover:bg-gray-200 ${
                          editor?.isActive("italic") ? "bg-gray-200" : ""
                        }`}
                        title="Italic"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="19" y1="4" x2="10" y2="4"></line>
                          <line x1="14" y1="20" x2="5" y2="20"></line>
                          <line x1="15" y1="4" x2="9" y2="20"></line>
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        className={`p-1 rounded hover:bg-gray-200 ${
                          editor?.isActive("heading", { level: 2 })
                            ? "bg-gray-200"
                            : ""
                        }`}
                        title="Heading"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 12h12"></path>
                          <path d="M6 4v16"></path>
                          <path d="M18 4v16"></path>
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          editor?.chain().focus().toggleBulletList().run()
                        }
                        className={`p-1 rounded hover:bg-gray-200 ${
                          editor?.isActive("bulletList") ? "bg-gray-200" : ""
                        }`}
                        title="Bullet List"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>

                      <div className="h-6 w-px bg-gray-300 mx-1"></div>

                      <button
                        type="button"
                        onClick={addImageToEditor}
                        className="p-1 rounded hover:bg-gray-200"
                        title="Add Image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const url = window.prompt("Enter the URL");
                          if (url) {
                            editor
                              ?.chain()
                              .focus()
                              .setLink({ href: url })
                              .run();
                          }
                        }}
                        className={`p-1 rounded hover:bg-gray-200 ${
                          editor?.isActive("link") ? "bg-gray-200" : ""
                        }`}
                        title="Add Link"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </button>
                    </div>

                    {/* TipTap Editor Content */}
                    <div className="p-4 min-h-[200px]">
                      <EditorContent
                        editor={editor}
                        className="prose max-w-none focus:outline-none"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    * Anda dapat menambahkan gambar venue map dengan mengklik
                    tombol gambar di toolbar
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Kategori Event <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="kategori_event"
                    value={formData.kategori_event}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts">Arts</option>
                    <option value="Theater">Theater</option>
                    <option value="Education">Education</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Health">Health</option>
                  </select>
                  {errors.kategori_event && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.kategori_event}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Foto Event
                  </label>
                  <div className="mt-2">
                    {selectedImage ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
                        <img
                          src={selectedImage.preview}
                          alt="Preview Event"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">
                          Unggah foto untuk event Anda
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="event-image"
                      />
                      <label
                        htmlFor="event-image"
                        className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        {selectedImage ? "Ganti Gambar" : "Upload Gambar"}
                      </label>
                      <p className="text-xs text-gray-500 ml-3">
                        Format: JPG, PNG. Maks: 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors font-medium"
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Location */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Tanggal & Lokasi
                </h2>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Tanggal Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="tanggal_mulai"
                    value={formData.tanggal_mulai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {errors.tanggal_mulai && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tanggal_mulai}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Tanggal Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="tanggal_selesai"
                    value={formData.tanggal_selesai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {errors.tanggal_selesai && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.tanggal_selesai}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Lokasi Event <span className="text-red-500">*</span>
                  </label>

                  <div className="space-y-4">
                    {/* Pencarian Kota/Kabupaten */}
                    <div className="relative">
                      <label className="block text-gray-600 text-sm mb-1">
                        Kota/Kabupaten
                      </label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="Cari kota/kabupaten..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />

                      {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => handleCitySelect(city)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                              >
                                {city}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-gray-500">
                              Tidak ada hasil yang ditemukan
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Detail Lokasi */}
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">
                        Detail Lokasi
                      </label>
                      <input
                        type="text"
                        value={detailLocation}
                        onChange={handleDetailLocationChange}
                        placeholder="Masukkan nama gedung, alamat lengkap, dll"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {(errors.kota_kabupaten || errors.lokasi) && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.kota_kabupaten || errors.lokasi}
                    </p>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="border border-purple-600 text-purple-600 px-6 py-3 rounded-full hover:bg-purple-50 transition-colors font-medium"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors font-medium"
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Tickets */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Tiket
                </h2>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-700">
                      Jenis Tiket
                    </h3>
                    <button
                      type="button"
                      onClick={addTicketType}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      + Tambah Jenis Tiket
                    </button>
                  </div>

                  {formData.tipe_tikets.map((ticket, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-4"
                    >
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          Nama Tiket <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="nama"
                          value={ticket.nama}
                          onChange={(e) => handleTicketChange(index, e)}
                          placeholder="Mis. VIP, Regular, Early Bird"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Harga (IDR) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="harga"
                            value={ticket.harga}
                            onChange={(e) => handleTicketChange(index, e)}
                            placeholder="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Jumlah Tersedia{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              name="jumlah_tersedia"
                              value={ticket.jumlah_tersedia}
                              onChange={(e) => handleTicketChange(index, e)}
                              placeholder="0"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {formData.tipe_tikets.length > 1 && (
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeTicketType(index)}
                            className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                          >
                            Hapus Tiket
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="border border-purple-600 text-purple-600 px-6 py-3 rounded-full hover:bg-purple-50 transition-colors font-medium"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors font-medium"
                  >
                    Buat Event
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
