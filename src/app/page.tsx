import Link from "next/link";
import { Activity, Award, Calendar, CheckCircle2, Flame, RefreshCw } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-lg tracking-tight">RunHub</span>
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium">
              Race Readiness
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/api/auth/strava/login"
              className="inline-flex items-center gap-2 bg-[#FC4C02] hover:bg-[#e04300] text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Connect with Strava
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
            Apakah Latihanmu Sudah Siap Untuk Race Day?
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
            Analisis otomatis riwayat lari dari akun Strava Anda, hitung kesiapan jarak tempuh mingguan, batas cut-off time, dan gap analysis sebelum hari lomba.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/api/auth/strava/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FC4C02] hover:bg-[#e04300] text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 transition"
            >
              <Activity className="w-5 h-5" />
              Hubungkan Strava Sekarang
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 bg-slate-900/50 text-slate-300 font-medium px-6 py-3 rounded-xl transition"
            >
              Lihat Cara Kerja
            </a>
          </div>
        </div>

        {/* Feature Cards */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Sync Data Strava Otomatis</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tarik data aktivitas lari 16 minggu terakhir secara instan meliputi jarak, elevasi, moving time, dan detak jantung.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Race Readiness Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Kalkulator cerdas berbasis Peter Riegel formula untuk memprediksi waktu finish dan membandingkan pace terhadap Cut-Off Time (COT).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Event Master Management</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Katalog event lari (Road / Trail Marathon, HM, 10K) dengan batas COT dan elevasi yang bisa dikontrol penuh oleh Admin.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
