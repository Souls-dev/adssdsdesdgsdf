"use client";

import { useState, useEffect, useCallback } from "react";
import { FARMHOUSES } from "@/data/farmhouses";
import toast from "react-hot-toast";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  MessageCircle,
} from "lucide-react";

interface ContactSectionProps {
  selectedFarmhouse: string;
  onFarmhouseChange: (id: string) => void;
}

type FormErrors = Record<string, string>;

export default function ContactSection({
  selectedFarmhouse,
  onFarmhouseChange,
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    farmhouseId: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    specialRequests: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-select farmhouse from Packages section
  useEffect(() => {
    if (selectedFarmhouse) {
      setFormData((prev) => ({ ...prev, farmhouseId: selectedFarmhouse }));
    }
  }, [selectedFarmhouse]);

  const today = new Date().toISOString().split("T")[0];

  const minCheckOut = formData.checkInDate
    ? new Date(new Date(formData.checkInDate).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    : today;

  const validateField = useCallback(
    (name: string, value: string | number): string => {
      switch (name) {
        case "fullName":
          if (!value || String(value).trim().length < 2)
            return "Name must be at least 2 characters";
          if (String(value).trim().length > 100)
            return "Name must be at most 100 characters";
          return "";
        case "contactNumber": {
          const phone = String(value).replace(/[-\s]/g, "");
          if (!/^(\+92|0)[0-9]{10}$/.test(phone))
            return "Enter a valid Pakistani number (03XX-XXXXXXX or +92XXXXXXXXXX)";
          return "";
        }
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)))
            return "Enter a valid email address";
          return "";
        case "farmhouseId":
          if (!value) return "Please select a farmhouse";
          return "";
        case "checkInDate":
          if (!value) return "Select a check-in date";
          if (new Date(String(value)) < new Date(today))
            return "Check-in must be today or later";
          return "";
        case "checkOutDate":
          if (!value) return "Select a check-out date";
          if (
            formData.checkInDate &&
            new Date(String(value)) <= new Date(formData.checkInDate)
          )
            return "Check-out must be after check-in";
          return "";
        case "numberOfGuests":
          if (!value || Number(value) < 1) return "At least 1 guest required";
          if (Number(value) > 50) return "Maximum 50 guests";
          return "";
        case "specialRequests":
          if (String(value).length > 500) return "Maximum 500 characters";
          return "";
        default:
          return "";
      }
    },
    [formData.checkInDate, today]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const newValue =
      name === "numberOfGuests" ? parseInt(value, 10) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (name === "farmhouseId") {
      onFarmhouseChange(value);
    }

    // Clear error on change
    if (errors[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        contactNumber: formData.contactNumber.replace(/[-\s]/g, ""),
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message);
        setFormData({
          fullName: "",
          contactNumber: "",
          email: "",
          farmhouseId: "",
          checkInDate: "",
          checkOutDate: "",
          numberOfGuests: 1,
          specialRequests: "",
        });
        onFarmhouseChange("");
        setErrors({});
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch {
      toast.error(
        "Something went wrong. Please try again or contact us directly on WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClass =
    "w-full rounded-2xl border bg-white/60 px-5 py-4 text-sm text-[#451a03] placeholder-[#78350f]/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#b45309]/20 focus:border-[#b45309] shadow-sm";
  const inputErrorClass = "border-red-400 focus:ring-red-300 focus:border-red-400";
  const inputNormalClass = "border-white/80 hover:border-white";

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 pb-24"
      style={{ backgroundColor: "#fef3c7" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-60 top-0 h-96 w-96 rounded-full bg-[#b45309]/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#14532d]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#b45309]">
            Get In Touch
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-[#451a03] sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book Your Stay
          </h2>
          <p className="mx-auto max-w-2xl text-base text-[#78350f]/70 sm:text-lg">
            Fill out the form below and our team will get back to you within 24
            hours to confirm your booking.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Form — 2 columns */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-10"
              noValidate
            >
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#fef3c7] to-[#fde68a] opacity-30 blur-3xl pointer-events-none" />
              <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-sm font-medium text-[#451a03]"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    className={`${inputBaseClass} ${errors.fullName ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label
                    htmlFor="contactNumber"
                    className="mb-1.5 block text-sm font-medium text-[#451a03]"
                  >
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="03XX-XXXXXXX or +92XXXXXXXXXX"
                    className={`${inputBaseClass} ${errors.contactNumber ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.contactNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-[#451a03]"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    className={`${inputBaseClass} ${errors.email ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Select Farmhouse */}
                <div>
                  <label
                    htmlFor="farmhouseId"
                    className="mb-1.5 block text-sm font-medium text-[#451a03]"
                  >
                    Select Farmhouse <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="farmhouseId"
                    name="farmhouseId"
                    value={formData.farmhouseId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputBaseClass} ${errors.farmhouseId ? inputErrorClass : inputNormalClass}`}
                  >
                    <option value="">Select a farmhouse...</option>
                    {FARMHOUSES.map((farm) => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name} — PKR{" "}
                        {farm.pricePerNight.toLocaleString("en-PK")}/night
                      </option>
                    ))}
                  </select>
                  {errors.farmhouseId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.farmhouseId}
                    </p>
                  )}
                </div>

                {/* Check-in Date */}
                <div>
                  <label
                    htmlFor="checkInDate"
                    className="mb-1.5 block text-sm font-medium text-[#451a03]"
                  >
                    Check-in Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={today}
                    className={`${inputBaseClass} ${errors.checkInDate ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.checkInDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.checkInDate}
                    </p>
                  )}
                </div>

                {/* Check-out Date */}
                <div>
                  <label
                    htmlFor="checkOutDate"
                    className="mb-1.5 block text-sm font-medium text-[#451a03]"
                  >
                    Check-out Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={minCheckOut}
                    className={`${inputBaseClass} ${errors.checkOutDate ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.checkOutDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.checkOutDate}
                    </p>
                  )}
                </div>

                {/* Number of Guests */}
                <div>
                  <label
                    htmlFor="numberOfGuests"
                    className="mb-1.5 block text-sm font-medium text-[#451a03]"
                  >
                    Number of Guests <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="numberOfGuests"
                    name="numberOfGuests"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={1}
                    max={50}
                    className={`${inputBaseClass} ${errors.numberOfGuests ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.numberOfGuests && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.numberOfGuests}
                    </p>
                  )}
                </div>

                {/* Special Requests — full width */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="specialRequests"
                    className="mb-1.5 block text-sm font-medium text-[#451a03]"
                  >
                    Special Requests{" "}
                    <span className="text-[#78350f]/40">(optional)</span>
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={3}
                    placeholder="Any special requirements or notes..."
                    className={`${inputBaseClass} resize-none ${errors.specialRequests ? inputErrorClass : inputNormalClass}`}
                  />
                  <div className="mt-1 flex justify-between">
                    {errors.specialRequests ? (
                      <p className="text-xs text-red-500">
                        {errors.specialRequests}
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-[#78350f]/40">
                      {formData.specialRequests.length}/500
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#b45309] to-[#92400e] px-8 py-4 text-base font-bold text-[#fef3c7] shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#b45309]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-xl sm:w-auto sm:min-w-[240px]"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                      Submit Booking Inquiry
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Sidebar — 1 column */}
          <div className="space-y-6">
            {/* Contact info card */}
            <div className="group rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_8px_30px_rgb(180,83,9,0.1)]">
              <h3
                className="mb-6 text-xl font-bold text-[#451a03]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Contact Information
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="tel:02134548555"
                    className="flex items-center gap-3 text-sm text-[#78350f]/80 transition-colors hover:text-[#b45309]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#b45309]/10">
                      <Phone size={18} className="text-[#b45309]" />
                    </div>
                    <span>021-3454 8555</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@aljannatfarms.com"
                    className="flex items-center gap-3 text-sm text-[#78350f]/80 transition-colors hover:text-[#b45309]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#b45309]/10">
                      <Mail size={18} className="text-[#b45309]" />
                    </div>
                    <span>info@aljannatfarms.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/+922134548555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-[#78350f]/80 transition-colors hover:text-[#25D366]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10">
                      <MessageCircle size={18} className="text-[#25D366]" />
                    </div>
                    <span>WhatsApp Us</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-sm text-[#78350f]/80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#b45309]/10">
                      <MapPin size={18} className="text-[#b45309]" />
                    </div>
                    <span>Office Z-53, Near Ideal Bakery, Block 7/8, Hill Park, Karachi</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Operating hours */}
            <div className="group rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/60 hover:shadow-[0_8px_30px_rgb(180,83,9,0.1)]">
              <h3
                className="mb-5 text-xl font-bold text-[#451a03]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Operating Hours
              </h3>
              <div className="space-y-2 text-sm text-[#78350f]/70">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#b45309]" />
                  <span>Monday – Saturday: 9 AM – 9 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#b45309]" />
                  <span>Sunday: 10 AM – 6 PM</span>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="group relative h-64 overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(180,83,9,0.1)]">
              <iframe
                src="https://maps.google.com/maps?q=Al+Jannat+farmhouse+booking&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="rounded-[1.5rem]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Al Jannat Office Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
