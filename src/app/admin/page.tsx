"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Flame,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";

interface EventItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  eventType: string;
  distance: number;
  elevationGain: number;
  cutOffTime: number;
  location: string | null;
  isActive: boolean;
  sourceUrl: string | null;
  _count?: { assessments: number };
}

interface Metrics {
  totalUsers: number;
  totalEvents: number;
  totalActivities: number;
  totalAssessments: number;
  avgReadinessScore: number;
  verdictDistribution: {
    READY: number;
    RISKY: number;
    NOT_READY: number;
  };
}

export default function AdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<any>(null);

  // Form New Event
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("FM");
  const [distanceKm, setDistanceKm] = useState("42.195");
  const [elevationGain, setElevationGain] = useState("200");
  const [cutOffHours, setCutOffHours] = useState("7");
  const [location, setLocation] = useState("");
  const [creating, setCreating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [eventsRes, metricsRes] = await Promise.all([
        fetch("/api/admin/events?limit=50"),
        fetch("/api/admin/metrics"),
      ]);

      if (eventsRes.ok) {
        const d = await eventsRes.json();
        setEvents(d.data || []);
      }
      if (metricsRes.ok) {
        const m = await metricsRes.json();
        setMetrics(m.metrics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScrape = async () => {
    if (!scrapeUrl) return;
    try {
      setScraping(true);
      setFeedbackMsg("");
      const res = await fetch("/api/admin/events/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      const data = await res.json();
      if (data.success && data.scraped) {
        setScrapeResult(data.scraped);
        setName(data.scraped.title || "");
        setSlug(
          (data.scraped.title || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        );
        if (data.scraped.suggestedCategory) setCategory(data.scraped.suggestedCategory);
        if (data.scraped.suggestedDistance)
          setDistanceKm((data.scraped.suggestedDistance / 1000).toString());
        if (data.scraped.suggestedCutOffHours)
          setCutOffHours(data.scraped.suggestedCutOffHours.toString());
      } else {
        setFeedbackMsg(data.error || "Gagal mengambil metadata.");
      }
    } catch (err: any) {
      setFeedbackMsg(err.message || "Error saat scraping.");
    } finally {
      setScraping(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setFeedbackMsg("");
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          category,
          eventType: category === "ULTRA" ? "TRAIL" : "ROAD",
          distance: parseFloat(distanceKm) * 1000,
          elevationGain: parseFloat(elevationGain) || 0,
          cutOffTime: parseFloat(cutOffHours) * 3600,
          location,
          sourceUrl: scrapeUrl || undefined,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        setFeedbackMsg("Event berhasil ditambahkan!");
        setName("");
        setSlug("");
        setLocation("");
        setScrapeUrl("");
        setScrapeResult(null);
        loadData();
      } else {
        setFeedbackMsg(d.error || "Gagal menambahkan event.");
      }
    } catch (err: any) {
      setFeedbackMsg(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus event ini dari database?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-none">Admin Control Center</h1>
                  <span className="text-xs text-slate-500 font-medium">RunHub Management</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Metric Cards (merbabudev style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Event</span>
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{metrics?.totalEvents || events.length}</div>
            <p className="text-xs text-slate-500 mt-1">Master event aktif dalam katalog</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pelari</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{metrics?.totalUsers || 0}</div>
            <p className="text-xs text-slate-500 mt-1">User terkoneksi Strava</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Aktivitas Lari</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{metrics?.totalActivities || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Riwayat tersinkronisasi</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg. Readiness</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{metrics?.avgReadinessScore || 0}%</div>
            <p className="text-xs text-slate-500 mt-1">Rata-rata skor kesiapan atlet</p>
          </div>
        </div>

        {/* 2-Column: Event Importer & Create Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* URL Scraper / AI Importer */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Auto Scraper
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Ambil dari Website Lomba</h2>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Masukkan link website resmi lomba lari untuk otomatis menarik judul, deskripsi, estimasi jarak dan Cut-Off Time.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">URL Website Lomba</label>
                <input
                  type="url"
                  placeholder="https://borobudurmarathon.com..."
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="button"
                onClick={handleScrape}
                disabled={scraping || !scrapeUrl}
                className="w-full py-2.5 px-4 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                {scraping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengekstrak Metadata...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Fetch Data Otomatis</span>
                  </>
                )}
              </button>

              {scrapeResult && (
                <div className="mt-4 p-3 bg-brand-50 border border-brand-100 rounded-xl text-xs space-y-1">
                  <div className="font-semibold text-brand-900">Hasil Deteksi:</div>
                  <div className="text-slate-700">Kategori: <strong className="uppercase">{scrapeResult.suggestedCategory}</strong></div>
                  <div className="text-slate-700">Estimasi Jarak: <strong>{scrapeResult.suggestedDistance / 1000} km</strong></div>
                  <div className="text-slate-700">Estimasi COT: <strong>{scrapeResult.suggestedCutOffHours} jam</strong></div>
                </div>
              )}
            </div>
          </div>

          {/* Form Create / Edit Master Event */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Plus className="w-3.5 h-3.5" />
              Event Master
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Tambah Master Event Lari</h2>
            <p className="text-xs text-slate-500 mb-6">
              Parameter ini digunakan oleh Race Readiness Engine untuk menilai kesiapan peserta.
            </p>

            {feedbackMsg && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-200">
                {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Nama Lomba / Event *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Borobudur Marathon 2025 - Full Marathon"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Slug URL Identifier *</label>
                <input
                  type="text"
                  required
                  placeholder="borobudur-marathon-2025-fm"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Kategori Lari *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500 bg-white"
                >
                  <option value="5K">5K (5.000 meter)</option>
                  <option value="10K">10K (10.000 meter)</option>
                  <option value="HM">Half Marathon (21.097 meter)</option>
                  <option value="FM">Full Marathon (42.195 meter)</option>
                  <option value="ULTRA">Ultra Marathon (Trail / Road)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Jarak Tempuh (Kilometer) *</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Batas Waktu COT (Jam) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="7"
                  value={cutOffHours}
                  onChange={(e) => setCutOffHours(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Elevation Gain (Meter)</label>
                <input
                  type="number"
                  value={elevationGain}
                  onChange={(e) => setElevationGain(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Lokasi Lomba</label>
                <input
                  type="text"
                  placeholder="Magelang, Jawa Tengah"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Simpan Master Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Event List Table (merbabudev style) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Katalog Event Terdaftar</h2>
              <p className="text-xs text-slate-500">Daftar lomba yang siap dipilih oleh pelari</p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Total {events.length} event
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <span>Memuat data event...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Belum ada event. Tambahkan event pertama Anda menggunakan form di atas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Nama Event</th>
                    <th className="px-6 py-3.5">Kategori</th>
                    <th className="px-6 py-3.5">Jarak &amp; Elevasi</th>
                    <th className="px-6 py-3.5">Batas COT</th>
                    <th className="px-6 py-3.5">Lokasi</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{ev.name}</span>
                          {ev.sourceUrl && (
                            <a
                              href={ev.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-brand-600"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-normal">{ev.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                          {ev.category} • {ev.eventType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <div>{(ev.distance / 1000).toFixed(1)} km</div>
                        <div className="text-xs text-slate-400">+{ev.elevationGain}m EG</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {(ev.cutOffTime / 3600).toFixed(1)} Jam
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {ev.location || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(ev.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
