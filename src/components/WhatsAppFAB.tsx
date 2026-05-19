"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppFABProps {
  settings: {
    whatsappHref: string;
  };
}

export default function WhatsAppFAB({ settings }: WhatsAppFABProps) {
  const href = settings.whatsappHref || "https://wa.me/+923332272020";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-transform duration-200 hover:scale-110 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  );
}
