"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Edit, Plus, LogOut, Save, X, Upload, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Palette, Home, Shield, Type } from "lucide-react";

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

const EMPTY_FARMHOUSE: Farmhouse = {
  id: "", name: "", location: "Karachi, Sindh, Pakistan",
  shortDescription: "", fullDescription: "",
  pricePerNight: 0, weekendSurcharge: 0,
  maxGuests: 10, bedrooms: 2, bathrooms: 2,
  amenities: [], coverImage: "", images: [],
  available: true, pricingEnabled: false,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"farmhouses" | "theme" | "hero" | "content">("farmhouses");
  const [farmhouses, setFarmhouses] = useState<Farmhouse[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");

  // Farmhouse states
  const [editingFarmhouse, setEditingFarmhouse] = useState<Farmhouse | null>(null);
  const [isNewFarmhouse, setIsNewFarmhouse] = useState(false);
  const [savingFarmhouse, setSavingFarmhouse] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [amenityInput, setAmenityInput] = useState("");
  const [expandedFarmhouseId, setExpandedFarmhouseId] = useState<string | null>(null);

  // Settings saving state
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const resFarm = await fetch("/api/admin/farmhouses");
      if (resFarm.status === 401) { window.location.href = "/"; return; }
      const dataFarm = await resFarm.json();
      if (dataFarm.success) setFarmhouses(dataFarm.farmhouses);

      const resSettings = await fetch("/api/admin/settings");
      const dataSettings = await resSettings.json();
      if (dataSettings.success) setSettings(dataSettings.settings);
    } catch {
      showMsg("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showMsg = (text: string, type: "success" | "error" = "success") => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(""), 5000);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
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

        {/* ── TAB 2: THEME ────────────────────────────────────── */}
        {activeTab === "theme" && settings && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
            <h2 className="text-lg font-bold text-amber-400 mb-4">Website Colors & Layouts</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Color Preset */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Color Palette Preset</label>
                <select value={settings.theme.activeColorPreset} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, activeColorPreset: e.target.value } })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none">
                  <option value="gold">Gold (Default Classic)</option>
                  <option value="green">Green (Nature & Fresh)</option>
                  <option value="red">Red (Royal Vibrant)</option>
                  <option value="blue">Blue (Calm Ocean)</option>
                  <option value="yellow">Yellow (Golden Bright)</option>
                  <option value="logo">Logo Theme (Agency Custom)</option>
                </select>
                <p className="mt-1 text-xs text-zinc-500">Selecting a preset automatically updates all main colors throughout the public website pages.</p>
              </div>

              {/* Hero Theme Selection */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Hero Section Theme</label>
                <select value={settings.theme.heroTheme} onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, heroTheme: e.target.value } })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none">
                  <option value="theme1">Theme 1: Video Placeholder (Promo Coming Soon)</option>
                  <option value="theme2">Theme 2: Classic Dynamic Gradients</option>
                  <option value="theme3">Theme 3: Auto-Sliding Photography Slides</option>
                </select>
                <p className="mt-1 text-xs text-zinc-500">Choose the presentation layout type for the home page header hero banner.</p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <button onClick={() => handleSaveSettings(settings)} disabled={savingSettings}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50">
                <Save size={16} /> {savingSettings ? "Saving Theme..." : "Save Theme Settings"}
              </button>
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
    </div>
  );
}
