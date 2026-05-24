"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Trash2, Edit, Plus, LogOut, Save, X, Upload, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Palette, Home, Shield, Type, Fingerprint, Clock, Check, AlertTriangle, Key, Copy } from "lucide-react";
import { COLOR_THEMES, DEFAULT_CSS_VARS, type ColorTheme, type ColorOverrides } from "@/lib/theme-utils";
import LoadingScreen from "@/components/LoadingScreen";

type Farmhouse = {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  pricePerNight: number;
  weekendSurcharge: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  coverImage: string;
  images: string[];
  available: boolean;
  pricingEnabled?: boolean;
};

type DeviceBinding = {
  id: string;
  admin_key_hash: string;
  device_id: string;
  bound_at: string;
  last_used: string;
  user_agent: string;
};

const EMPTY_FARMHOUSE: Farmhouse = {
  id: "", name: "", location: "Karachi, Sindh, Pakistan",
  shortDescription: "", fullDescription: "",
  pricePerNight: 0, weekendSurcharge: 0,
  maxGuests: 10, bedrooms: 2, bathrooms: 2,
  amenities: [], coverImage: "", images: [],
  available: true, pricingEnabled: false,
};

// Editable CSS variable groups for the color customizer
const COLOR_GROUPS = [
  { label: "🎨 Primary", desc: "Buttons, links, highlights", vars: ["--color-primary", "--color-primary-hover", "--color-primary-light"] },
  { label: "📄 Backgrounds", desc: "Section backgrounds", vars: ["--color-cream-50", "--color-cream-100", "--color-cream-200", "--color-cream-300"] },
  { label: "🖼️ Surfaces", desc: "Cards, panels", vars: ["--color-surface", "--color-surface-warm", "--color-surface-alt"] },
  { label: "🌙 Dark Areas", desc: "Header, footer, navbar", vars: ["--color-brown-800", "--color-brown-850", "--color-brown-900", "--color-brown-950"] },
  { label: "🌲 Dark Accents", desc: "Dark section gradients", vars: ["--color-forest-600", "--color-forest-700", "--color-forest-750", "--color-forest-800", "--color-forest-900", "--color-forest-950"] },
  { label: "✨ Accent", desc: "Amber/gold highlights", vars: ["--color-amber-500", "--color-amber-600", "--color-amber-700", "--color-amber-800", "--color-amber-900"] },
  { label: "📝 Text", desc: "Headings, body, light text", vars: ["--color-text-primary", "--color-text-secondary", "--color-text-light"] },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"farmhouses" | "theme" | "hero" | "content" | "security">("farmhouses");
  const [farmhouses, setFarmhouses] = useState<Farmhouse[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginKey, setLoginKey] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Farmhouse states
  const [editingFarmhouse, setEditingFarmhouse] = useState<Farmhouse | null>(null);
  const [isNewFarmhouse, setIsNewFarmhouse] = useState(false);
  const [savingFarmhouse, setSavingFarmhouse] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [amenityInput, setAmenityInput] = useState("");
  const [expandedFarmhouseId, setExpandedFarmhouseId] = useState<string | null>(null);

  // Settings saving state
  const [savingSettings, setSavingSettings] = useState(false);

  // Device bindings state
  const [deviceBindings, setDeviceBindings] = useState<DeviceBinding[]>([]);

  // Role-based access
  const [userRole, setUserRole] = useState<"master" | "admin">("admin");

  // Admin keys management (master only)
  const [adminKeys, setAdminKeys] = useState<any[]>([]);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [generatingKey, setGeneratingKey] = useState(false);

  // Theme preview state
  const [previewActive, setPreviewActive] = useState(false);
  const [previewExpiry, setPreviewExpiry] = useState<string | null>(null);
  const [previewCountdown, setPreviewCountdown] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("gold");
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [confirmPermanent, setConfirmPermanent] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Loading screen preview states
  const [previewLoaderStyle, setPreviewLoaderStyle] = useState<string | null>(null);
  const [previewLoaderExiting, setPreviewLoaderExiting] = useState(false);

  const handleTestLoader = (styleName: string) => {
    setPreviewLoaderStyle(styleName);
    setPreviewLoaderExiting(false);
    // Trigger exiting sequence after 2.2 seconds
    setTimeout(() => {
      setPreviewLoaderExiting(true);
    }, 2200);
    // Unmount after 3.5 seconds
    setTimeout(() => {
      setPreviewLoaderStyle(null);
    }, 3500);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const resFarm = await fetch("/api/admin/farmhouses");
      if (resFarm.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      const dataFarm = await resFarm.json();
      if (dataFarm.success) {
        setFarmhouses(dataFarm.farmhouses);
        setIsAuthenticated(true);
      }

      const resSettings = await fetch("/api/admin/settings");
      const dataSettings = await resSettings.json();
      if (dataSettings.success) {
        setSettings(dataSettings.settings);
        setSelectedPreset(dataSettings.settings.theme?.activeColorPreset || "gold");
        setCustomColors(dataSettings.settings.theme?.customColors || {});
        if (dataSettings.preview) {
          setPreviewActive(true);
          setPreviewExpiry(dataSettings.preview.expiresAt);
        }
        // Set user role from API
        if (dataSettings.role) {
          setUserRole(dataSettings.role);
        }
      }

      // Load device bindings
      const resBindings = await fetch("/api/admin/device-bindings");
      if (resBindings.ok) {
        const dataBindings = await resBindings.json();
        if (dataBindings.success) setDeviceBindings(dataBindings.bindings);
      }

      // Load admin keys (master only — will 403 for admins)
      const resKeys = await fetch("/api/admin/keys");
      if (resKeys.ok) {
        const dataKeys = await resKeys.json();
        if (dataKeys.success) setAdminKeys(dataKeys.keys);
      }
    } catch {
      showMsg("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Countdown timer for preview
  useEffect(() => {
    if (!previewExpiry) {
      setPreviewCountdown("");
      if (countdownRef.current) clearInterval(countdownRef.current);
      return;
    }
    const updateCountdown = () => {
      const diff = new Date(previewExpiry).getTime() - Date.now();
      if (diff <= 0) {
        setPreviewActive(false);
        setPreviewExpiry(null);
        setPreviewCountdown("");
        showMsg("Preview expired — reverted to permanent theme", "success");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setPreviewCountdown(`${mins}:${secs.toString().padStart(2, "0")}`);
    };
    updateCountdown();
    countdownRef.current = setInterval(updateCountdown, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [previewExpiry]);

  const showMsg = (text: string, type: "success" | "error" = "success") => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(""), 5000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginKey.trim()) {
      setLoginError("Please enter your admin security key.");
      return;
    }
    setLoggingIn(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: loginKey.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.message || "Invalid credentials.");
      }
    } catch {
      setLoginError("A network error occurred. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    window.location.reload();
  };

  // ── DEVICE BINDING ─────────────────────────────────────────
  const handleRevokeBinding = async (bindingId: string) => {
    if (!confirm("Revoke this device binding? The key can then be used on a new device.")) return;
    try {
      const res = await fetch("/api/admin/device-bindings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bindingId }),
      });
      const data = await res.json();
      if (data.success) {
        showMsg("Device binding revoked!", "success");
        setDeviceBindings((prev) => prev.filter((b) => b.id !== bindingId));
      } else { showMsg(data.error || "Failed to revoke", "error"); }
    } catch { showMsg("Network error", "error"); }
  };

  // ── KEY MANAGEMENT (Master only) ──────────────────────────────
  const handleGenerateKey = async () => {
    if (!newKeyLabel.trim()) { showMsg("Enter a label for the key", "error"); return; }
    setGeneratingKey(true);
    try {
      const res = await fetch("/api/admin/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newKeyLabel.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedKey(data.key);
        setNewKeyLabel("");
        // Refresh key list
        const resKeys = await fetch("/api/admin/keys");
        if (resKeys.ok) {
          const dataKeys = await resKeys.json();
          if (dataKeys.success) setAdminKeys(dataKeys.keys);
        }
        showMsg("Key generated! Copy it now — it won't be shown again.", "success");
      } else { showMsg(data.error || "Failed to generate key", "error"); }
    } catch { showMsg("Network error", "error"); }
    setGeneratingKey(false);
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm("Revoke this admin key? The user will be locked out.")) return;
    try {
      const res = await fetch(`/api/admin/keys?id=${keyId}&action=revoke`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAdminKeys((prev) => prev.map((k) => k.id === keyId ? { ...k, revoked: true, revoked_at: new Date().toISOString(), device_bound: false } : k));
        showMsg("Key revoked!", "success");
      } else { showMsg(data.error || "Failed to revoke", "error"); }
    } catch { showMsg("Network error", "error"); }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm("Permanently delete this admin key? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/keys?id=${keyId}&action=delete`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAdminKeys((prev) => prev.filter((k) => k.id !== keyId));
        showMsg("Key deleted permanently!", "success");
      } else { showMsg(data.error || "Failed to delete", "error"); }
    } catch { showMsg("Network error", "error"); }
  };

  // ── THEME PREVIEW ──────────────────────────────────────────
  const handleApplyPreview = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview", preset: selectedPreset, customColors, durationMinutes: 5 }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewActive(true);
        setPreviewExpiry(data.preview.expiresAt);
        showMsg("Preview active! Theme will auto-revert in 5 minutes.", "success");
      } else { showMsg(data.error || "Failed to apply preview", "error"); }
    } catch { showMsg("Network error", "error"); }
  };

  const handleMakePermanent = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "make-permanent" }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewActive(false);
        setPreviewExpiry(null);
        setConfirmPermanent(false);
        setSettings(data.settings);
        showMsg("Theme is now PERMANENT on the website!", "success");
      } else { showMsg(data.error || "Failed", "error"); }
    } catch { showMsg("Network error", "error"); }
  };

  const handleRevertPreview = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revert" }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewActive(false);
        setPreviewExpiry(null);
        showMsg("Reverted to permanent theme", "success");
      }
    } catch { showMsg("Network error", "error"); }
  };

  // ── FARMHOUSE CRUD ──────────────────────────────────────────
  const handleSaveFarmhouse = async () => {
    if (!editingFarmhouse || !editingFarmhouse.name.trim()) { showMsg("Name is required", "error"); return; }
    setSavingFarmhouse(true);
    try {
      const method = isNewFarmhouse ? "POST" : "PUT";
      const body = isNewFarmhouse ? { ...editingFarmhouse, id: editingFarmhouse.id || editingFarmhouse.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : editingFarmhouse;
      const res = await fetch("/api/admin/farmhouses", {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showMsg(isNewFarmhouse ? "Farmhouse added!" : "Farmhouse updated!", "success");
        setEditingFarmhouse(null);
        setIsNewFarmhouse(false);
        fetchData();
      } else { showMsg(data.error || "Failed to save", "error"); }
    } catch { showMsg("Network error", "error"); }
    finally { setSavingFarmhouse(false); }
  };

  const handleDeleteFarmhouse = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/farmhouses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { showMsg("Farmhouse deleted", "success"); fetchData(); }
      else { showMsg(data.error || "Failed to delete", "error"); }
    } catch { showMsg("Network error", "error"); }
    setDeleteConfirm(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingFarmhouse || !e.target.files?.length) return;
    const file = e.target.files[0];
    const farmId = editingFarmhouse.id || editingFarmhouse.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("farmhouseId", farmId);
    showMsg("Uploading image...", "success");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        const newImages = [...editingFarmhouse.images, data.path];
        setEditingFarmhouse({ ...editingFarmhouse, images: newImages, coverImage: editingFarmhouse.coverImage || data.path, id: farmId });
        showMsg("Image uploaded!", "success");
      } else { showMsg(data.error || "Upload failed", "error"); }
    } catch { showMsg("Upload failed", "error"); }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("file", file);
    fd.append("farmhouseId", "site-logo"); // Use a fixed identifier for site logo
    showMsg("Uploading logo...", "success");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, theme: { ...settings.theme, logoUrl: data.path } });
        showMsg("Logo uploaded! Don't forget to save.", "success");
      } else { showMsg(data.error || "Upload failed", "error"); }
    } catch { showMsg("Upload failed", "error"); }
  };

  const removeImage = (idx: number) => {
    if (!editingFarmhouse) return;
    const newImages = editingFarmhouse.images.filter((_, i) => i !== idx);
    const newCover = editingFarmhouse.coverImage === editingFarmhouse.images[idx] ? (newImages[0] || "") : editingFarmhouse.coverImage;
    setEditingFarmhouse({ ...editingFarmhouse, images: newImages, coverImage: newCover });
  };

  // ── SETTINGS UPDATE ─────────────────────────────────────────
  const handleSaveSettings = async (updatedSettings: any) => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        showMsg("Settings saved successfully!", "success");
      } else {
        showMsg(data.error || "Failed to save settings", "error");
      }
    } catch {
      showMsg("Network error saving settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleResetSettings = async () => {
    if (!confirm("Are you sure you want to reset all settings and content to factory defaults? This cannot be undone.")) return;
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        showMsg("Settings reset to defaults!", "success");
      } else {
        showMsg(data.error || "Failed to reset settings", "error");
      }
    } catch {
      showMsg("Network error resetting settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="animate-pulse text-lg">Loading Al Jannat CMS Dashboard...</div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-500">
              <Shield size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Al Jannat Admin Access</h2>
            <p className="text-xs text-zinc-500 mt-1">Enter your admin security key to access the dashboard</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Security Key</label>
              <input
                type="password"
                value={loginKey}
                onChange={(e) => setLoginKey(e.target.value)}
                placeholder="••••••••••••••••"
                disabled={loggingIn}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              />
            </div>

            {loginError && (
              <div className="rounded-lg bg-red-950/50 border border-red-800 p-3 text-xs text-red-400">
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-lg bg-amber-600 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              {loggingIn ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-amber-400">Al Jannat Admin Panel</h1>
            <p className="text-xs text-zinc-500">Full Website Content Management System</p>
          </div>
          <div className="flex gap-3">
            {activeTab === "farmhouses" && (
              <button onClick={() => { setEditingFarmhouse({ ...EMPTY_FARMHOUSE }); setIsNewFarmhouse(true); setAmenityInput(""); }}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500">
                <Plus size={16} /> Add Farmhouse
              </button>
            )}
            <button onClick={handleResetSettings} disabled={savingSettings}
              className="rounded-lg bg-red-950/50 border border-red-800 px-4 py-2 text-sm text-red-400 transition hover:bg-red-900/30">
              Reset to Default
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="border-b border-zinc-800 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 flex gap-4">
          <button onClick={() => { setActiveTab("farmhouses"); setEditingFarmhouse(null); }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === "farmhouses" ? "border-amber-500 text-amber-400" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>
            <Home size={16} /> Farmhouses ({farmhouses.length})
          </button>
          <button onClick={() => { setActiveTab("theme"); setEditingFarmhouse(null); }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === "theme" ? "border-amber-500 text-amber-400" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>
            <Palette size={16} /> Website Theme
          </button>
          <button onClick={() => { setActiveTab("hero"); setEditingFarmhouse(null); }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === "hero" ? "border-amber-500 text-amber-400" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>
            <Shield size={16} /> Hero Section
          </button>
          <button onClick={() => { setActiveTab("content"); setEditingFarmhouse(null); }}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === "content" ? "border-amber-500 text-amber-400" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>
            <Type size={16} /> Page Content
          </button>
          {userRole === "master" && (
            <button onClick={() => { setActiveTab("security"); setEditingFarmhouse(null); }}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${activeTab === "security" ? "border-amber-500 text-amber-400" : "border-transparent text-zinc-400 hover:text-zinc-200"}`}>
              <Key size={16} /> Key Management
            </button>
          )}
        </div>
      </div>

      {/* Status Message */}
      {msg && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className={`rounded-lg px-4 py-2 text-sm flex justify-between items-center ${msgType === "success" ? "bg-emerald-950 border border-emerald-800 text-emerald-400" : "bg-red-950 border border-red-800 text-red-400"}`}>
            <span>{msg}</span>
            <button onClick={() => setMsg("")} className="text-xs opacity-60 hover:opacity-100">dismiss</button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* ── TAB 1: FARMHOUSES ───────────────────────────────── */}
        {activeTab === "farmhouses" && (
          <div>
            {editingFarmhouse && (
              <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-amber-400">{isNewFarmhouse ? "Add New Farmhouse" : `Edit: ${editingFarmhouse.name}`}</h2>
                  <button onClick={() => { setEditingFarmhouse(null); setIsNewFarmhouse(false); }} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Name *</label>
                    <input value={editingFarmhouse.name} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, name: e.target.value })}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Location</label>
                    <input value={editingFarmhouse.location} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, location: e.target.value })}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Short Description</label>
                    <input value={editingFarmhouse.shortDescription} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, shortDescription: e.target.value })}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Full Description</label>
                    <textarea value={editingFarmhouse.fullDescription} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, fullDescription: e.target.value })} rows={3}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Max Guests</label>
                    <input type="number" value={editingFarmhouse.maxGuests} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, maxGuests: +e.target.value })}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Bedrooms</label>
                    <input type="number" value={editingFarmhouse.bedrooms} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, bedrooms: +e.target.value })}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Bathrooms</label>
                    <input type="number" value={editingFarmhouse.bathrooms} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, bathrooms: +e.target.value })}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-zinc-400">Available</label>
                    <button onClick={() => setEditingFarmhouse({ ...editingFarmhouse, available: !editingFarmhouse.available })}
                      className={`transition ${editingFarmhouse.available ? "text-emerald-400" : "text-zinc-600"}`}>
                      {editingFarmhouse.available ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </div>

                  {/* Pricing Fields */}
                  <div className="sm:col-span-2 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-200">Enable Pricing</h3>
                        <p className="text-xs text-zinc-500">Show prices on the website</p>
                      </div>
                      <button onClick={() => setEditingFarmhouse({ ...editingFarmhouse, pricingEnabled: !editingFarmhouse.pricingEnabled })}
                        className={`transition ${editingFarmhouse.pricingEnabled ? "text-amber-400" : "text-zinc-600"}`}>
                        {editingFarmhouse.pricingEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                      </button>
                    </div>
                    {editingFarmhouse.pricingEnabled && (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-400">Price Per Night (PKR)</label>
                          <input type="number" value={editingFarmhouse.pricePerNight} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, pricePerNight: +e.target.value })}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-zinc-400">Weekend Surcharge (PKR)</label>
                          <input type="number" value={editingFarmhouse.weekendSurcharge} onChange={(e) => setEditingFarmhouse({ ...editingFarmhouse, weekendSurcharge: +e.target.value })}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Amenities</label>
                    <div className="flex gap-2">
                      <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (amenityInput.trim()) { setEditingFarmhouse({ ...editingFarmhouse, amenities: [...editingFarmhouse.amenities, amenityInput.trim()] }); setAmenityInput(""); } } }}
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="Add amenity and press Enter" />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {editingFarmhouse.amenities.map((a, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1 text-xs text-zinc-200">
                          {a}
                          <button onClick={() => setEditingFarmhouse({ ...editingFarmhouse, amenities: editingFarmhouse.amenities.filter((_, idx) => idx !== i) })} className="text-zinc-400 hover:text-red-400"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-zinc-400">Images</label>
                    <div className="flex flex-wrap gap-3">
                      {editingFarmhouse.images.map((img, i) => (
                        <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          {editingFarmhouse.coverImage === img && (
                            <span className="absolute left-0 top-0 rounded-br bg-amber-600 px-1 text-[9px] font-bold text-white">COVER</span>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/65 opacity-0 transition group-hover:opacity-100">
                            <button onClick={() => setEditingFarmhouse({ ...editingFarmhouse, coverImage: img })} className="rounded bg-amber-600 px-1.5 py-0.5 text-[9px] text-white">Cover</button>
                            <button onClick={() => removeImage(i)} className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] text-white">Del</button>
                          </div>
                        </div>
                      ))}
                      <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 text-zinc-500 transition hover:border-amber-500 hover:text-amber-400 bg-zinc-900">
                        <Upload size={20} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={handleSaveFarmhouse} disabled={savingFarmhouse}
                    className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-50">
                    <Save size={16} /> {savingFarmhouse ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => { setEditingFarmhouse(null); setIsNewFarmhouse(false); }}
                    className="rounded-lg bg-zinc-800 px-6 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700">Cancel</button>
                </div>
              </div>
            )}

            {/* Farmhouses Table List */}
            <div className="space-y-3">
              {farmhouses.map((f) => (
                <div key={f.id} className="rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-700">
                  <div className="flex items-center gap-4 p-4" onClick={() => setExpandedFarmhouseId(expandedFarmhouseId === f.id ? null : f.id)} role="button">
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                      {f.coverImage ? <img src={f.coverImage} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-zinc-600 text-xs">No img</div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-white">{f.name}</h3>
                        {f.pricingEnabled && <span className="rounded bg-amber-900/40 px-1.5 py-0.5 text-[10px] text-amber-400">PKR {f.pricePerNight.toLocaleString()}</span>}
                        {!f.available && <span className="rounded bg-red-900/40 px-1.5 py-0.5 text-[10px] text-red-400">Unavailable</span>}
                      </div>
                      <p className="truncate text-xs text-zinc-500">{f.shortDescription}</p>
                      <div className="mt-1 flex gap-3 text-[10px] text-zinc-600">
                        <span>{f.bedrooms} bed</span><span>{f.bathrooms} bath</span><span>{f.maxGuests} guests</span><span>{f.images.length} photos</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setEditingFarmhouse({ ...f }); setIsNewFarmhouse(false); setAmenityInput(""); }}
                        className="rounded-lg bg-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-700 hover:text-amber-400"><Edit size={16} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(f.id); }}
                        className="rounded-lg bg-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-700 hover:text-red-400"><Trash2 size={16} /></button>
                      {expandedFarmhouseId === f.id ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                    </div>
                  </div>

                  {expandedFarmhouseId === f.id && (
                    <div className="border-t border-zinc-800 px-4 py-3">
                      <p className="mb-2 text-xs text-zinc-400">{f.fullDescription}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {f.amenities.map((a, i) => (
                          <span key={i} className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: THEME (Color Customizer) ─────────────────── */}
        {activeTab === "theme" && settings && (
          <div className="space-y-6">
            {/* Preview Status Banner */}
            {previewActive && (
              <div className="rounded-2xl border-2 border-amber-500/50 bg-amber-950/30 p-4 flex items-center justify-between animate-pulse-slow">
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-amber-400" />
                  <div>
                    <p className="text-sm font-bold text-amber-300">🔴 LIVE PREVIEW ACTIVE</p>
                    <p className="text-xs text-amber-400/80">Theme is temporarily live on the website. Auto-reverts in <span className="font-mono font-bold">{previewCountdown}</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmPermanent(true)}
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-500">
                    <Check size={14} /> Make This Theme Permanent
                  </button>
                  <button onClick={handleRevertPreview}
                    className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-600">
                    Revert Now
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
              <h2 className="text-lg font-bold text-amber-400 mb-2">🎨 Color Customizer</h2>
              <p className="text-xs text-zinc-500 -mt-4">Choose a preset or customize individual colors. Preview changes temporarily before making them permanent.</p>

              {/* Preset Theme Swatches */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Theme Presets</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {(Object.entries(COLOR_THEMES) as [string, { label: string; overrides: ColorOverrides }][]).map(([key, theme]) => {
                    const primary = theme.overrides["--color-primary"] || DEFAULT_CSS_VARS["--color-primary"];
                    const surface = theme.overrides["--color-surface"] || DEFAULT_CSS_VARS["--color-surface"];
                    const accent = theme.overrides["--color-amber-500"] || DEFAULT_CSS_VARS["--color-amber-500"];
                    return (
                      <button key={key} onClick={() => { setSelectedPreset(key); setCustomColors(theme.overrides); }}
                        className={`rounded-xl border-2 p-3 transition hover:scale-105 ${selectedPreset === key ? "border-amber-400 ring-2 ring-amber-400/30" : "border-zinc-700 hover:border-zinc-500"}`}>
                        <div className="flex gap-1 mb-2">
                          <div className="h-6 w-6 rounded-full border border-black/20" style={{ background: primary }} />
                          <div className="h-6 w-6 rounded-full border border-black/20" style={{ background: accent }} />
                          <div className="h-6 w-6 rounded-full border border-black/20" style={{ background: surface }} />
                        </div>
                        <p className="text-xs font-medium text-zinc-300">{theme.label}</p>
                        {selectedPreset === key && <p className="text-[9px] text-amber-400 mt-0.5">Selected</p>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Fine-Tune Colors</label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {COLOR_GROUPS.map((group) => (
                    <div key={group.label} className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-3">
                      <h4 className="text-xs font-bold text-zinc-300 mb-0.5">{group.label}</h4>
                      <p className="text-[10px] text-zinc-600 mb-2">{group.desc}</p>
                      {group.vars.map((v) => {
                        const currentVal = customColors[v] || DEFAULT_CSS_VARS[v] || "#888888";
                        return (
                          <div key={v} className="flex items-center gap-2 mb-1.5">
                            <input type="color" value={currentVal}
                              onChange={(e) => setCustomColors({ ...customColors, [v]: e.target.value })}
                              className="h-7 w-7 cursor-pointer rounded border border-zinc-600 bg-transparent" />
                            <span className="text-[10px] text-zinc-500 truncate flex-1">{v.replace("--color-", "")}</span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Theme Selection (kept) */}
              <div className="border-t border-zinc-800 pt-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero Section Layout</label>
                <select value={settings.theme.heroTheme} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, heroTheme: e.target.value } })}
                  className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none">
                  <option value="theme1">Theme 1: Video Placeholder</option>
                  <option value="theme2">Theme 2: Classic Dynamic Gradients</option>
                  <option value="theme3">Theme 3: Auto-Sliding Photography</option>
                </select>
              </div>

              {/* Logo Upload */}
              <div className="border-t border-zinc-800 pt-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Website Logo</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-auto p-2 bg-white rounded-lg border border-zinc-700 flex items-center justify-center">
                    {settings.theme.logoUrl ? (
                      <img src={settings.theme.logoUrl} alt="Logo" className="h-full object-contain" />
                    ) : (
                      <span className="text-zinc-400 text-xs">No Logo</span>
                    )}
                  </div>
                  <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 px-4 py-2 text-zinc-500 transition hover:border-amber-500 hover:text-amber-400 bg-zinc-900">
                    <Upload size={16} className="mr-2" /> Upload New Logo
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                </div>
              </div>

              {/* Loading Screen Customizer */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Loading Screen Theme</h3>
                <p className="text-xs text-zinc-500 mb-4">Select the transition animation that plays when visitors first open the website and test the animation preview instantly</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { id: "monogram", name: "AJ Elegant Monogram", desc: "Classic rotating golden crest with monogram letters and staggered text reveal" },
                    { id: "split", name: "Split Screen Reveal", desc: "Top and bottom panels splitting horizontally like a biscuit crack sliding away" },
                    { id: "gate", name: "Gilded Gate Reveal", desc: "Two elegant vertical doors opening from the center and sliding to the sides" },
                    { id: "fade", name: "Classic Minimalist Fade", desc: "Clean full screen overlay smoothly fading out with premium golden accents" }
                  ].map((preset) => {
                    const isSelected = (settings.theme.loaderStyle || "monogram") === preset.id;
                    return (
                      <div key={preset.id} className={`rounded-xl border p-4 flex flex-col justify-between bg-zinc-900/50 transition hover:border-zinc-500 ${isSelected ? "border-amber-500 ring-2 ring-amber-500/20" : "border-zinc-800"}`}>
                        <div>
                          <h4 className="text-sm font-semibold text-white flex items-center justify-between">
                            {preset.name}
                            {isSelected && <span className="rounded bg-amber-900/50 px-2 py-0.5 text-[10px] text-amber-400 font-bold">Active</span>}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{preset.desc}</p>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => {
                              setSettings({
                                ...settings,
                                theme: { ...settings.theme, loaderStyle: preset.id }
                              });
                            }}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${isSelected ? "bg-amber-600/20 text-amber-400 border border-amber-500/30" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                          >
                            Select
                          </button>
                          <button
                            onClick={() => handleTestLoader(preset.id)}
                            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white transition"
                          >
                            Test
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-zinc-800 pt-6 flex flex-wrap gap-3">
                <button onClick={handleApplyPreview}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">
                  <Clock size={16} /> Apply 5-Minute Preview
                </button>
                {previewActive && (
                  <button onClick={() => setConfirmPermanent(true)}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500">
                    <Check size={16} /> Make This Theme Permanent
                  </button>
                )}
                <button onClick={() => handleSaveSettings(settings)} disabled={savingSettings}
                  className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
                  <Save size={16} /> {savingSettings ? "Saving..." : "Save Theme & Layout"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: HERO ─────────────────────────────────────── */}
        {activeTab === "hero" && settings && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
            <h2 className="text-lg font-bold text-amber-400 mb-4">Hero Text & Actions</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Badge Text</label>
                <input value={settings.hero.badgeText} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, badgeText: e.target.value } })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Headline prefix</label>
                  <input value={settings.hero.headline} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, headline: e.target.value } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">Headline Accent</label>
                  <input value={settings.hero.headlineAccent} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, headlineAccent: e.target.value } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-400">Subheadline Text</label>
                <textarea value={settings.hero.subheadline} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subheadline: e.target.value } })} rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500" />
              </div>

              {/* CTAs */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Primary CTA Button Text</label>
                <input value={settings.hero.ctaPrimary.text} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, ctaPrimary: { ...settings.hero.ctaPrimary, text: e.target.value } } })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Secondary CTA Button Text</label>
                <input value={settings.hero.ctaSecondary.text} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, ctaSecondary: { ...settings.hero.ctaSecondary, text: e.target.value } } })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500" />
              </div>

              {/* Hero Video URL */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-400">Promo Video URL (Optional mp4 / youtube / vimeo link)</label>
                <input value={settings.hero.videoUrl || ""} onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, videoUrl: e.target.value } })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500" placeholder="e.g. /video.mp4" />
              </div>

              {/* Banner stats */}
              <div className="sm:col-span-2 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Stats Banner Statistics</label>
                <div className="grid gap-4 md:grid-cols-3">
                  {settings.hero.stats.map((st: any, i: number) => (
                    <div key={i} className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 flex gap-2">
                      <div className="flex-1">
                        <input value={st.value} onChange={(e) => {
                          const newStats = [...settings.hero.stats];
                          newStats[i].value = e.target.value;
                          setSettings({ ...settings, hero: { ...settings.hero, stats: newStats } });
                        }} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" placeholder="Value" />
                        <input value={st.label} onChange={(e) => {
                          const newStats = [...settings.hero.stats];
                          newStats[i].label = e.target.value;
                          setSettings({ ...settings, hero: { ...settings.hero, stats: newStats } });
                        }} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 mt-1.5 text-xs text-zinc-300" placeholder="Label" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <button onClick={() => handleSaveSettings(settings)} disabled={savingSettings}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
                <Save size={16} /> {savingSettings ? "Saving..." : "Save Hero Settings"}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 4: CONTENT ──────────────────────────────────── */}
        {activeTab === "content" && settings && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
            <h2 className="text-lg font-bold text-amber-400 mb-4">Core Page Text Sections</h2>

            {/* Packages Section Text */}
            <div className="border-b border-zinc-800 pb-5">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">Luxury Packages Section</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Subtitle</label>
                  <input value={settings.sections.packages.subtitle} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, packages: { ...settings.sections.packages, subtitle: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Title</label>
                  <input value={settings.sections.packages.title} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, packages: { ...settings.sections.packages, title: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Description text</label>
                  <input value={settings.sections.packages.description} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, packages: { ...settings.sections.packages, description: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="border-b border-zinc-800 pb-5">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">Services Section</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Subtitle</label>
                  <input value={settings.sections.services.subtitle} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, services: { ...settings.sections.services, subtitle: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Title</label>
                  <input value={settings.sections.services.title} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, services: { ...settings.sections.services, title: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Description text</label>
                  <input value={settings.sections.services.description} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, services: { ...settings.sections.services, description: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="border-b border-zinc-800 pb-5">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">About Us Section</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Subtitle</label>
                  <input value={settings.sections.about.subtitle} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, subtitle: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Title</label>
                  <input value={settings.sections.about.title} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, title: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Main Heading text</label>
                  <input value={settings.sections.about.heading} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, heading: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Paragraph 1</label>
                  <textarea value={settings.sections.about.paragraphs[0]} onChange={(e) => {
                    const newParas = [...settings.sections.about.paragraphs];
                    newParas[0] = e.target.value;
                    setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, paragraphs: newParas } } });
                  }} rows={2} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Paragraph 2</label>
                  <textarea value={settings.sections.about.paragraphs[1]} onChange={(e) => {
                    const newParas = [...settings.sections.about.paragraphs];
                    newParas[1] = e.target.value;
                    setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, paragraphs: newParas } } });
                  }} rows={2} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Promise Title</label>
                  <input value={settings.sections.about.promiseTitle} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, promiseTitle: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Promise Text</label>
                  <input value={settings.sections.about.promiseText} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, promiseText: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Core Values</label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {settings.sections.about.values?.map((val: any, i: number) => (
                      <div key={i} className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 flex flex-col gap-2">
                        <input value={val.title} onChange={(e) => {
                          const newValues = [...settings.sections.about.values];
                          newValues[i].title = e.target.value;
                          setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, values: newValues } } });
                        }} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-semibold text-amber-400" placeholder="Title" />
                        <textarea value={val.description} onChange={(e) => {
                          const newValues = [...settings.sections.about.values];
                          newValues[i].description = e.target.value;
                          setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, values: newValues } } });
                        }} rows={2} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 resize-none" placeholder="Description" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">About Stats</label>
                  <div className="grid gap-4 md:grid-cols-4">
                    {settings.sections.about.stats?.map((st: any, i: number) => (
                      <div key={i} className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 flex flex-col gap-2">
                        <input value={st.value} onChange={(e) => {
                          const newStats = [...settings.sections.about.stats];
                          newStats[i].value = e.target.value;
                          setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, stats: newStats } } });
                        }} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-bold text-white" placeholder="Value (e.g. 10,000+)" />
                        <input value={st.label} onChange={(e) => {
                          const newStats = [...settings.sections.about.stats];
                          newStats[i].label = e.target.value;
                          setSettings({ ...settings, sections: { ...settings.sections, about: { ...settings.sections.about, stats: newStats } } });
                        }} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300" placeholder="Label" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="border-b border-zinc-800 pb-5">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">Booking & Contact Section</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Subtitle</label>
                  <input value={settings.sections.contact.subtitle} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, contact: { ...settings.sections.contact, subtitle: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Title</label>
                  <input value={settings.sections.contact.title} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, contact: { ...settings.sections.contact, title: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Description text</label>
                  <input value={settings.sections.contact.description} onChange={(e) => setSettings({ ...settings, sections: { ...settings.sections, contact: { ...settings.sections.contact, description: e.target.value } } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div className="sm:col-span-2 space-y-3 mt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Timing Options (Grid)</label>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {settings.sections.contact.timingOptions?.map((opt: any, i: number) => (
                      <div key={i} className="rounded-lg border border-zinc-700 bg-zinc-800 p-3 flex flex-col gap-2">
                        <input value={opt.label} onChange={(e) => {
                          const newOpts = [...settings.sections.contact.timingOptions];
                          newOpts[i].label = e.target.value;
                          setSettings({ ...settings, sections: { ...settings.sections, contact: { ...settings.sections.contact, timingOptions: newOpts } } });
                        }} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-semibold text-amber-400" placeholder="Label (e.g. Morning to Morning)" />
                        <input value={opt.time} onChange={(e) => {
                          const newOpts = [...settings.sections.contact.timingOptions];
                          newOpts[i].time = e.target.value;
                          setSettings({ ...settings, sections: { ...settings.sections, contact: { ...settings.sections.contact, timingOptions: newOpts } } });
                        }} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300" placeholder="Time (e.g. 8 am – 6 am)" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div>
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-3">Footer Info</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-zinc-400">Brand Description</label>
                  <textarea value={settings.footer.brandDescription} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, brandDescription: e.target.value } })} rows={2}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Phone 1</label>
                  <input value={settings.footer.phone1} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, phone1: e.target.value } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Phone 2</label>
                  <input value={settings.footer.phone2} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, phone2: e.target.value } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">WhatsApp Text</label>
                  <input value={settings.footer.whatsapp} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, whatsapp: e.target.value } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">WhatsApp Link (URL)</label>
                  <input value={settings.footer.whatsappHref} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, whatsappHref: e.target.value } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Email</label>
                  <input value={settings.footer.email} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, email: e.target.value } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-400">Address</label>
                  <input value={settings.footer.address} onChange={(e) => setSettings({ ...settings, footer: { ...settings.footer, address: e.target.value } })}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white" />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <button onClick={() => handleSaveSettings(settings)} disabled={savingSettings}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
                <Save size={16} /> {savingSettings ? "Saving Content..." : "Save Page Content"}
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 5: KEY MANAGEMENT (Master Only) ──────────────── */}
        {activeTab === "security" && userRole === "master" && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
            <h2 className="text-lg font-bold text-amber-400 mb-2">🔑 Admin Key Management</h2>
            <p className="text-xs text-zinc-500 -mt-4">Generate, manage, and revoke admin access keys. Only the master key holder can access this page.</p>

            {/* Generate New Key */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2"><Plus size={14} className="text-amber-400" /> Generate New Admin Key</h3>
              <div className="flex gap-3">
                <input
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="Key label (e.g. Manager Phone)"
                  maxLength={50}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
                <button
                  onClick={handleGenerateKey}
                  disabled={generatingKey}
                  className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50 flex items-center gap-2"
                >
                  <Key size={14} /> {generatingKey ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>

            {/* Generated Key Display */}
            {generatedKey && (
              <div className="rounded-xl border border-emerald-700 bg-emerald-950/30 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2"><Check size={14} /> Key Generated Successfully</h3>
                <p className="text-xs text-emerald-300/70">Copy this key now — it will never be shown again!</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-black/50 border border-emerald-800 px-4 py-3 font-mono text-sm text-emerald-300 select-all">{generatedKey}</code>
                  <button
                    onClick={() => { navigator.clipboard.writeText(generatedKey); showMsg("Key copied to clipboard!", "success"); }}
                    className="rounded-lg bg-emerald-800 px-3 py-3 text-emerald-200 transition hover:bg-emerald-700"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <button onClick={() => setGeneratedKey(null)} className="text-xs text-zinc-500 hover:text-zinc-300 transition">Dismiss</button>
              </div>
            )}

            {/* Keys List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-zinc-300">Active Admin Keys ({adminKeys.filter(k => !k.revoked).length})</h3>
              {adminKeys.filter(k => !k.revoked).length === 0 ? (
                <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-8 text-center">
                  <Key size={32} className="mx-auto text-zinc-600 mb-2" />
                  <p className="text-sm text-zinc-500">No active admin keys. Generate one above.</p>
                </div>
              ) : (
                adminKeys.filter(k => !k.revoked).map((k) => (
                  <div key={k.id} className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Key size={14} className="text-amber-400" />
                        <span className="text-sm font-semibold text-zinc-200">{k.label}</span>
                        {k.device_bound && <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded-full">Bound</span>}
                      </div>
                      <p className="text-xs font-mono text-zinc-500">{k.key_hash_short}</p>
                      {k.device_user_agent && (
                        <p className="text-xs text-zinc-600 truncate mt-0.5">Device: {k.device_user_agent.substring(0, 60)}...</p>
                      )}
                      <p className="text-[10px] text-zinc-600 mt-1">Created: {new Date(k.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button onClick={() => handleRevokeKey(k.id)}
                        className="rounded-lg bg-red-950/50 border border-red-800 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-900/30">
                        Revoke
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Revoked Keys */}
            {adminKeys.filter(k => k.revoked).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-zinc-500">Revoked Keys ({adminKeys.filter(k => k.revoked).length})</h3>
                {adminKeys.filter(k => k.revoked).map((k) => (
                  <div key={k.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 opacity-60">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Key size={14} className="text-zinc-600" />
                        <span className="text-sm text-zinc-500 line-through">{k.label}</span>
                        <span className="text-[10px] bg-red-950 border border-red-900 text-red-500 px-2 py-0.5 rounded-full">Revoked</span>
                      </div>
                      <p className="text-xs font-mono text-zinc-600">{k.key_hash_short}</p>
                      {k.revoked_at && <p className="text-[10px] text-zinc-700 mt-1">Revoked: {new Date(k.revoked_at).toLocaleDateString()}</p>}
                    </div>
                    <button onClick={() => handleDeleteKey(k.id)}
                      className="ml-3 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-zinc-700 hover:text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* How It Works */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-800/30 p-4">
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">ℹ️ How It Works</h3>
              <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside">
                <li>Generate a key and share it with your admin. They use it to login.</li>
                <li>Each key is automatically bound to the first device it&apos;s used on.</li>
                <li>Revoking a key locks that admin out immediately.</li>
                <li>Only you (master key holder) can manage admin keys.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-2 text-lg font-bold text-white">Delete Farmhouse?</h3>
            <p className="mb-6 text-sm text-zinc-400">This action cannot be undone. The farmhouse will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">Cancel</button>
              <button onClick={() => handleDeleteFarmhouse(deleteConfirm)} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Make Theme Permanent Confirmation Modal */}
      {confirmPermanent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-amber-400" />
              <h3 className="text-lg font-bold text-white">Make Theme Permanent?</h3>
            </div>
            <p className="mb-2 text-sm text-zinc-400">Are you sure you want to permanently apply this theme to the website?</p>
            <p className="mb-6 text-xs text-zinc-500">This will replace the current permanent theme. You can always change it later from the Theme tab or reset to defaults.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmPermanent(false)} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">Cancel</button>
              <button onClick={handleMakePermanent} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500">Yes, Make Permanent</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading screen preview container */}
      {previewLoaderStyle && (
        <LoadingScreen style={previewLoaderStyle as any} exiting={previewLoaderExiting} />
      )}
    </div>
  );
}

