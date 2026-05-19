import { Globe, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Packages", href: "#packages" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

interface FooterProps {
  settings: {
    brandDescription: string;
    phone1: string;
    phone1Href: string;
    phone2: string;
    phone2Href: string;
    whatsapp: string;
    whatsappHref: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
    copyright: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-brown-900 text-cream-100">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-cream-300">Al</span> Jannat
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-cream-100/70">
              {settings.brandDescription || "Pakistan's most trusted farmhouse booking agency with over 32 years of legacy. Delivering premium booking solutions and unforgettable experiences since 1994."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cream-100/70 transition-colors duration-200 hover:text-cream-300"
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
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contact Info
            </h4>
            <ul className="space-y-3">
              {settings.phone1 && (
                <li>
                  <a
                    href={settings.phone1Href || `tel:${settings.phone1.replace(/[-\s]/g, "")}`}
                    className="flex items-center gap-2 text-sm text-cream-100/70 transition-colors duration-200 hover:text-cream-300"
                  >
                    <Phone size={16} className="shrink-0" />
                    {settings.phone1}
                  </a>
                </li>
              )}
              {settings.phone2 && (
                <li>
                  <a
                    href={settings.phone2Href || `tel:${settings.phone2.replace(/[-\s]/g, "")}`}
                    className="flex items-center gap-2 text-sm text-cream-100/70 transition-colors duration-200 hover:text-cream-300"
                  >
                    <Phone size={16} className="shrink-0" />
                    {settings.phone2}
                  </a>
                </li>
              )}
              {settings.whatsapp && (
                <li>
                  <a
                    href={settings.whatsappHref || `https://wa.me/${settings.whatsapp.replace(/[-\s()]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-cream-100/70 transition-colors duration-200 hover:text-[#25D366]"
                  >
                    <MessageCircle size={16} className="shrink-0" />
                    {settings.whatsapp}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-2 text-sm text-cream-100/70 transition-colors duration-200 hover:text-cream-300"
                  >
                    <Mail size={16} className="shrink-0" />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li>
                  <div className="flex items-start gap-2 text-sm text-cream-100/70">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{settings.address}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4
              className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-300"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Follow Us
            </h4>
            <div className="flex gap-3">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100/10 text-cream-100/70 transition-all duration-200 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100/10 text-cream-100/70 transition-all duration-200 hover:bg-[#1877F2] hover:text-white"
                  aria-label="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-cream-100/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-cream-100/50">
            © {new Date().getFullYear()} {settings.copyright || "Al Jannat Farmhouse Booking Agency. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
