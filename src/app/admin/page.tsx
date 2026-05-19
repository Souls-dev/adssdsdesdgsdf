"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Edit, Plus, LogOut, Save, X, Upload, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";

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

const EMPTY: Farmhouse = {
  id: "", name: "", location: "Karachi, Sindh, Pakistan",
  shortDescription: "", fullDescription: "",
  pricePerNight: 0, weekendSurcharge: 0,
  maxGuests: 10, bedrooms: 2, bathrooms: 2,
  amenities: [], coverImage: "", images: [],
  available: true, pricingEnabled: false,
};

export default function AdminPage() {
  const [farmhouses, setFarmhouses] = useState<Farmhouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Farmhouse | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [amenityInput, setAmenityInput] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchFarmhouses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/farmhouses");
      if (res.status === 401) { window.location.href = "/"; return; }
      const data = await res.json();
      if (data.success) setFarmhouses(data.farmhouses);
    } catch { setMsg("Failed to load farmhouses"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFarmhouses(); }, [fetchFarmhouses]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  };

  const handleSave = async () => {
    if (!editing || !editing.name.trim()) { setMsg("Name is required"); return; }
    setSaving(true); setMsg("");
    try {
      const method = isNew ? "POST" : "PUT";
      const body = isNew ? { ...editing, id: editing.id || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") } : editing;
      const res = await fetch("/api/admin/farmhouses", {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(isNew ? "Farmhouse added!" : "Farmhouse updated!");
        setEditing(null); setIsNew(false);
        fetchFarmhouses();
      } else { setMsg(data.error || "Failed to save"); }
    } catch { setMsg("Network error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/farmhouses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { setMsg("Farmhouse deleted"); fetchFarmhouses(); }
      else { setMsg(data.error || "Failed to delete"); }
    } catch { setMsg("Network error"); }
    setDeleteConfirm(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing || !e.target.files?.length) return;
    const file = e.target.files[0];
    const farmId = editing.id || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("farmhouseId", farmId);
    setMsg("Uploading...");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        const newImages = [...editing.images, data.path];
        setEditing({ ...editing, images: newImages, coverImage: editing.coverImage || data.path, id: farmId });
        setMsg("Image uploaded!");
      } else { setMsg(data.error || "Upload failed"); }
    } catch { setMsg("Upload failed"); }
  };

  const removeImage = (idx: number) => {
    if (!editing) return;
    const newImages = editing.images.filter((_, i) => i !== idx);
    const newCover = editing.coverImage === editing.images[idx] ? (newImages[0] || "") : editing.coverImage;
    setEditing({ ...editing, images: newImages, coverImage: newCover });
  };

  const addAmenity = () => {
    if (!editing || !amenityInput.trim()) return;
    setEditing({ ...editing, amenities: [...editing.amenities, amenityInput.trim()] });
    setAmenityInput("");
  };

  const removeAmenity = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, amenities: editing.amenities.filter((_, i) => i !== idx) });
  };

  // ── RENDER ─────────────────────────────────────────────────
  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="animate-pulse text-lg">Loading Admin Panel...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-amber-400">Al Jannat Admin</h1>
            <p className="text-xs text-zinc-500">{farmhouses.length} farmhouses</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); setAmenityInput(""); }}
              className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500">
              <Plus size={16} /> Add Farmhouse
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Status Message */}
      {msg && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className={`rounded-lg px-4 py-2 text-sm ${msg.includes("!") ? "bg-emerald-900/40 text-emerald-300" : "bg-red-900/40 text-red-300"}`}>
            {msg}
            <button onClick={() => setMsg("")} className="float-right text-xs opacity-60 hover:opacity-100">dismiss</button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* ── EDITING FORM ──────────────────────────────── */}
        {editing && (
          <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-400">{isNew ? "Add New Farmhouse" : `Edit: ${editing.name}`}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-zinc-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Name *</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none" placeholder="Farmhouse name" />
              </div>
              {/* Location */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Location</label>
                <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none" placeholder="City, Province, Pakistan" />
              </div>
              {/* Short Description */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-400">Short Description</label>
                <input value={editing.shortDescription} onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none" placeholder="Brief one-liner" />
              </div>
              {/* Full Description */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-400">Full Description</label>
                <textarea value={editing.fullDescription} onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })} rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none" placeholder="Detailed description" />
              </div>
              {/* Numeric fields */}
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Max Guests</label>
                <input type="number" value={editing.maxGuests} onChange={(e) => setEditing({ ...editing, maxGuests: +e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Bedrooms</label>
                <input type="number" value={editing.bedrooms} onChange={(e) => setEditing({ ...editing, bedrooms: +e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-400">Bathrooms</label>
                <input type="number" value={editing.bathrooms} onChange={(e) => setEditing({ ...editing, bathrooms: +e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
              </div>
              {/* Available toggle */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-zinc-400">Available</label>
                <button onClick={() => setEditing({ ...editing, available: !editing.available })}
                  className={`transition ${editing.available ? "text-emerald-400" : "text-zinc-600"}`}>
                  {editing.available ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              {/* ── PRICING TOGGLE ── */}
              <div className="sm:col-span-2 rounded-xl border border-zinc-700 bg-zinc-800/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200">Enable Pricing</h3>
                    <p className="text-xs text-zinc-500">Show prices on the website for this farmhouse</p>
                  </div>
                  <button onClick={() => setEditing({ ...editing, pricingEnabled: !editing.pricingEnabled })}
                    className={`transition ${editing.pricingEnabled ? "text-amber-400" : "text-zinc-600"}`}>
                    {editing.pricingEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>
                {editing.pricingEnabled && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-400">Price Per Night (PKR)</label>
                      <input type="number" value={editing.pricePerNight} onChange={(e) => setEditing({ ...editing, pricePerNight: +e.target.value })}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-zinc-400">Weekend Surcharge (PKR)</label>
                      <input type="number" value={editing.weekendSurcharge} onChange={(e) => setEditing({ ...editing, weekendSurcharge: +e.target.value })}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* ── AMENITIES ── */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-400">Amenities</label>
                <div className="flex gap-2">
                  <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
                    className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none" placeholder="Type amenity and press Enter" />
                  <button onClick={addAmenity} className="rounded-lg bg-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-600"><Plus size={16} /></button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {editing.amenities.map((a, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1 text-xs text-zinc-200">
                      {a}
                      <button onClick={() => removeAmenity(i)} className="text-zinc-400 hover:text-red-400"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* ── IMAGES ── */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-400">Images</label>
                <div className="flex flex-wrap gap-3">
                  {editing.images.map((img, i) => (
                    <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-700">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      {editing.coverImage === img && (
                        <span className="absolute left-0 top-0 rounded-br bg-amber-600 px-1 text-[9px] font-bold text-white">COVER</span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition group-hover:opacity-100">
                        <button onClick={() => setEditing({ ...editing, coverImage: img })}
                          className="rounded bg-amber-600 px-1.5 py-0.5 text-[10px] text-white">Cover</button>
                        <button onClick={() => removeImage(i)}
                          className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white">Del</button>
                      </div>
                    </div>
                  ))}
                  <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 text-zinc-500 transition hover:border-amber-500 hover:text-amber-400">
                    <Upload size={20} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>

            {/* Save/Cancel */}
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-50">
                <Save size={16} /> {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => { setEditing(null); setIsNew(false); }}
                className="rounded-lg bg-zinc-800 px-6 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700">Cancel</button>
            </div>
          </div>
        )}

        {/* ── FARMHOUSE LIST ──────────────────────────── */}
        <div className="space-y-3">
          {farmhouses.map((f) => (
            <div key={f.id} className="rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-700">
              <div className="flex items-center gap-4 p-4" onClick={() => setExpandedId(expandedId === f.id ? null : f.id)} role="button">
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
                  <button onClick={(e) => { e.stopPropagation(); setEditing({ ...f }); setIsNew(false); setAmenityInput(""); }}
                    className="rounded-lg bg-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-700 hover:text-amber-400"><Edit size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(f.id); }}
                    className="rounded-lg bg-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-700 hover:text-red-400"><Trash2 size={16} /></button>
                  {expandedId === f.id ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === f.id && (
                <div className="border-t border-zinc-800 px-4 py-3">
                  <p className="mb-2 text-xs text-zinc-400">{f.fullDescription}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.amenities.map((a, i) => (
                      <span key={i} className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">{a}</span>
                    ))}
                  </div>
                  {f.images.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {f.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {farmhouses.length === 0 && !loading && (
          <div className="py-20 text-center text-zinc-600">
            <p className="text-lg">No farmhouses found</p>
            <p className="text-sm">Click "Add Farmhouse" to get started</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-2 text-lg font-bold text-white">Delete Farmhouse?</h3>
            <p className="mb-6 text-sm text-zinc-400">This action cannot be undone. The farmhouse will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
