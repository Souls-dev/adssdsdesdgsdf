import { Camera, Globe, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Packages", href: "#packages" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#321204] text-[#fef3c7]">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-[#fcd34d]">Al</span> Jannat
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#fef3c7]/70">
              Pakistan&apos;s most trusted farmhouse booking agency with over 32
              years of legacy. Delivering premium booking solutions and
              unforgettable experiences since 1994.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#fcd34d]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#fef3c7]/70 transition-colors duration-200 hover:text-[#fcd34d]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#fcd34d]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:02134548555"
                  className="flex items-center gap-2 text-sm text-[#fef3c7]/70 transition-colors duration-200 hover:text-[#fcd34d]"
                >
                  <Phone size={16} className="shrink-0" />
                  021-3454 8555
                </a>
              </li>
              <li>
                <a
                  href="tel:02134544996"
                  className="flex items-center gap-2 text-sm text-[#fef3c7]/70 transition-colors duration-200 hover:text-[#fcd34d]"
                >
                  <Phone size={16} className="shrink-0" />
                  021-3454 4996
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@aljannatfarms.com"
                  className="flex items-center gap-2 text-sm text-[#fef3c7]/70 transition-colors duration-200 hover:text-[#fcd34d]"
                >
                  <Mail size={16} className="shrink-0" />
                  info@aljannatfarms.com
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-[#fef3c7]/70">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>Office Z-53, Near Ideal Bakery, Block 7/8, Hill Park, Karachi</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#fcd34d]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Follow Us
            </h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/Aljannatfarmhousebooking"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7]/10 text-[#fef3c7]/70 transition-all duration-200 hover:bg-[#b45309] hover:text-[#fef3c7]"
                aria-label="Instagram"
              >
                <Camera size={18} />
              </a>
              <a
                href="https://facebook.com/Aljannatfarmhousebooking"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7]/10 text-[#fef3c7]/70 transition-all duration-200 hover:bg-[#b45309] hover:text-[#fef3c7]"
                aria-label="Facebook"
              >
                <Globe size={18} />
              </a>
              <a
                href="https://wa.me/+922134548555"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fef3c7]/10 text-[#fef3c7]/70 transition-all duration-200 hover:bg-[#25D366] hover:text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
            <a
              href="https://www.aljannatfarms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#fef3c7]/50 transition-colors duration-200 hover:text-[#fcd34d]"
            >
              <Globe size={14} />
              www.aljannatfarms.com
            </a>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-[#fef3c7]/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-[#fef3c7]/50">
            © {new Date().getFullYear()} Al Jannat Farmhouse Booking Agency. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
