"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

interface Farmhouse {
  id: string;
  name: string;
  available: boolean;
}

interface ContactSectionProps {
  selectedFarmhouse: string;
  onFarmhouseChange: (id: string) => void;
  settings: {
    subtitle: string;
    title: string;
    description: string;
  };
}

type FormErrors = Record<string, string>;

const SLOT_OPTIONS = [
  { value: "", label: "Select a slot..." },
  { value: "Morning", label: "Morning" },
  { value: "Evening", label: "Evening" },
  { value: "Full Day", label: "Full Day" },
  { value: "Overnight", label: "Overnight" },
];

// ── Security: Sanitize input to strip HTML/script tags ────────
function sanitize(str: string): string {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// ── Security: Client-side rate limiter ────────────────────────
const SUBMIT_COOLDOWN_MS = 30_000; // 30 seconds between submissions
const MAX_SUBMITS_PER_SESSION = 5;

export default function ContactSection({
  selectedFarmhouse,
  onFarmhouseChange,
  settings,
}: ContactSectionProps) {
  const [farmhouses, setFarmhouses] = useState<Farmhouse[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    farmhouseName: "",
    eventDate: "",
    slots: "",
    budget: "",
    query: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security state
  const [honeypot, setHoneypot] = useState(""); // bot trap
  const lastSubmitTime = useRef(0);
  const submitCount = useRef(0);

  // Load farmhouses dynamically
  useEffect(() => {
    async function loadFarmhouses() {
      try {
        const res = await fetch("/api/farmhouses");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setFarmhouses(data.farmhouses.filter((f: Farmhouse) => f.available));
          }
        }
      } catch (err) {
        console.error("Failed to load farmhouses", err);
      }
    }
    loadFarmhouses();
  }, []);

  // Pre-select farmhouse from Packages section
  useEffect(() => {
    if (selectedFarmhouse && farmhouses.length > 0) {
      const farm = farmhouses.find((f) => f.id === selectedFarmhouse);
      if (farm) {
        setFormData((prev) => ({ ...prev, farmhouseName: farm.name }));
      }
    }
  }, [selectedFarmhouse, farmhouses]);

  const today = new Date().toISOString().split("T")[0];

  const validateField = useCallback(
    (name: string, value: string): string => {
      switch (name) {
        case "name":
          if (!value || value.trim().length < 2)
            return "Name must be at least 2 characters";
          if (value.trim().length > 100)
            return "Name must be at most 100 characters";
          return "";
        case "number": {
          const phone = value.replace(/[-\s]/g, "");
          if (!/^(\+92|0)[0-9]{10}$/.test(phone))
            return "Enter a valid Pakistani number (03XX-XXXXXXX)";
          return "";
        }
        case "farmhouseName":
          if (!value) return "Please select a farmhouse";
          return "";
        case "eventDate":
          if (!value) return "Select an event date";
          if (new Date(value) < new Date(today))
            return "Event date must be today or later";
          return "";
        case "slots":
          if (!value) return "Please select a slot";
          return "";
        case "budget":
          if (!value || value.trim().length === 0)
            return "Please enter your budget";
          if (value.trim().length > 50) return "Budget too long";
          return "";
        case "query":
          if (value.length > 1000) return "Maximum 1000 characters";
          return "";
        default:
          return "";
      }
    },
    [today]
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "farmhouseName") {
      const farm = farmhouses.find((f) => f.name === value);
      if (farm) onFarmhouseChange(farm.id);
    }

    // Clear error on change
    if (errors[name]) {
      const error = validateField(name, value);
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

    const trimmedName = formData.name.trim();

    // ── Admin Login Intercept ────────────────────────────────
    if (trimmedName && !trimmedName.includes(" ") && trimmedName.length >= 8 && !formData.number) {
      setIsSubmitting(true);
      try {
        const loginRes = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: trimmedName }),
        });
        
        if (loginRes.ok) {
          toast.success("Admin authenticated. Redirecting...");
          window.location.href = "/admin";
          return;
        }
      } catch (err) {
        console.error(err);
      }
      setIsSubmitting(false);
    }

    if (honeypot) {
      toast.success(
        "Booking inquiry received! We will contact you within 24 hours."
      );
      return;
    }

    const now = Date.now();
    if (now - lastSubmitTime.current < SUBMIT_COOLDOWN_MS) {
      const remaining = Math.ceil(
        (SUBMIT_COOLDOWN_MS - (now - lastSubmitTime.current)) / 1000
      );
      toast.error(`Please wait ${remaining}s before submitting again.`);
      return;
    }

    if (submitCount.current >= MAX_SUBMITS_PER_SESSION) {
      toast.error(
        "Maximum inquiries reached. Please contact us on WhatsApp for additional requests."
      );
      return;
    }

    if (!validateAll() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: sanitize(formData.name.trim()),
        number: formData.number.replace(/[-\s]/g, ""),
        farmhouseName: formData.farmhouseName,
        eventDate: formData.eventDate,
        slots: formData.slots,
        budget: sanitize(formData.budget.trim()),
        query: sanitize(formData.query.trim()),
      };

      const res = await fetch(
        "https://ajtestbackend-production.up.railway.app/api/inquiries",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        lastSubmitTime.current = Date.now();
        submitCount.current++;
        toast.success(
          "Booking inquiry received! We will contact you within 24 hours."
        );
        setFormData({
          name: "",
          number: "",
          farmhouseName: "",
          eventDate: "",
          slots: "",
          budget: "",
          query: "",
        });
        onFarmhouseChange("");
        setErrors({});
      } else {
        const data = await res.json().catch(() => null);
        toast.error(
          data?.message ||
            "Something went wrong. Please try again or contact us directly on WhatsApp."
        );
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
    "w-full rounded-xl border bg-white/60 px-4 py-3 text-sm text-brown-800 placeholder-amber-900/40 backdrop-blur-sm transition-colors duration-200 hover:bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 shadow-sm";
  const inputErrorClass =
    "border-red-400 focus:ring-red-300 focus:border-red-400";
  const inputNormalClass = "border-white/80 hover:border-white";

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-cream-100"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -right-60 top-0 h-96 w-96 rounded-full bg-amber-700/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-forest-800/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
            {settings.subtitle || "Get In Touch"}
          </p>
          <h2
            className="mb-4 text-3xl font-bold text-brown-800 sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {settings.title || "Book Your Stay"}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-amber-900/70 sm:text-lg">
            {settings.description || "Fill out the form below and our team will get back to you within 24 hours to confirm your booking."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-8"
              noValidate
            >
              <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] -top-[9999px]"
                >
                  <input
                    type="text"
                    name="website_url"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-brown-800"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    maxLength={100}
                    className={`${inputBaseClass} ${errors.name ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="number"
                    className="mb-1.5 block text-sm font-medium text-brown-800"
                  >
                    Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="number"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="03XX-XXXXXXX"
                    maxLength={15}
                    className={`${inputBaseClass} ${errors.number ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.number && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.number}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="farmhouseName"
                    className="mb-1.5 block text-sm font-medium text-brown-800"
                  >
                    Farmhouse Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="farmhouseName"
                    name="farmhouseName"
                    value={formData.farmhouseName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputBaseClass} ${errors.farmhouseName ? inputErrorClass : inputNormalClass}`}
                  >
                    <option value="">Select a farmhouse...</option>
                    {farmhouses.map((farm) => (
                      <option key={farm.id} value={farm.name}>
                        {farm.name}
                      </option>
                    ))}
                  </select>
                  {errors.farmhouseName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.farmhouseName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="eventDate"
                    className="mb-1.5 block text-sm font-medium text-brown-800"
                  >
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={today}
                    className={`${inputBaseClass} ${errors.eventDate ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.eventDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.eventDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="slots"
                    className="mb-1.5 block text-sm font-medium text-brown-800"
                  >
                    Slots <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="slots"
                    name="slots"
                    value={formData.slots}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputBaseClass} ${errors.slots ? inputErrorClass : inputNormalClass}`}
                  >
                    {SLOT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.slots && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.slots}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="mb-1.5 block text-sm font-medium text-brown-800"
                  >
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 50,000 PKR"
                    maxLength={50}
                    className={`${inputBaseClass} ${errors.budget ? inputErrorClass : inputNormalClass}`}
                  />
                  {errors.budget && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.budget}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="query"
                    className="mb-1.5 block text-sm font-medium text-brown-800"
                  >
                    Query{" "}
                    <span className="text-amber-900/40">(optional)</span>
                  </label>
                  <textarea
                    id="query"
                    name="query"
                    value={formData.query}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={3}
                    maxLength={1000}
                    placeholder="Any questions or special requirements..."
                    className={`${inputBaseClass} resize-none ${errors.query ? inputErrorClass : inputNormalClass}`}
                  />
                  <div className="mt-1 flex justify-between">
                    {errors.query ? (
                      <p className="text-xs text-red-500">{errors.query}</p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-amber-900/40">
                      {formData.query.length}/1000
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 px-8 py-3.5 text-base font-bold text-cream-100 shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[240px]"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Submit Booking Inquiry
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-8">
              <h3
                className="mb-5 text-xl font-bold text-brown-800"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Contact Information
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="tel:02134548555"
                    className="flex items-center gap-3 text-sm text-amber-900/80 transition-colors hover:text-amber-700"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-700/10">
                      <Phone size={18} className="text-amber-700" />
                    </div>
                    <span>021-3454 8555</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@aljannatfarms.com"
                    className="flex items-center gap-3 text-sm text-amber-900/80 transition-colors hover:text-amber-700"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-700/10">
                      <Mail size={18} className="text-amber-700" />
                    </div>
                    <span>info@aljannatfarms.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/+923332272020"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-amber-900/80 transition-colors hover:text-[#25D366]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10">
                      <MessageCircle size={18} className="text-[#25D366]" />
                    </div>
                    <span>WhatsApp Us</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-sm text-amber-900/80">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-700/10">
                      <MapPin size={18} className="text-amber-700" />
                    </div>
                    <span>
                      Office Z-53, Near Ideal Bakery, Block 7/8, Hill Park,
                      Karachi
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-8">
              <h3
                className="mb-4 text-xl font-bold text-brown-800"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Operating Hours
              </h3>
              <div className="space-y-2 text-sm text-amber-900/70">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-700" />
                  <span>Monday – Saturday: 9 AM – 9 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-700" />
                  <span>Sunday: 10 AM – 6 PM</span>
                </div>
              </div>
            </div>

            <div className="relative h-64 overflow-hidden rounded-3xl border border-white/60 bg-white/40 p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
              <iframe
                src="https://maps.google.com/maps?q=Al+Jannat+farmhouse+booking&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="rounded-2xl"
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
