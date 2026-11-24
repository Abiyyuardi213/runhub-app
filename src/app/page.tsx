import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Globe,
  Heart,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* 1. TOP NAVBAR (PERSIS MERBABUDEV: fixed, bg-white, h-20, border-slate-200) */}
      <nav
        className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-300 top-0 left-0"
        id="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-brand-500/20">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">
                  RunHub
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">
                  Race Readiness
                </span>
              </div>
            </Link>

            {/* Nav Menu Items */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#cara-kerja" className="text-slate-600 hover:text-brand-600 font-medium transition text-sm">
                Cara Kerja
              </a>
              <a href="#fitur" className="text-slate-600 hover:text-brand-600 font-medium transition text-sm">
                Fitur Analisis
              </a>
              <a href="#event" className="text-slate-600 hover:text-brand-600 font-medium transition text-sm">
                Event Katalog
              </a>
              <a href="#faq" className="text-slate-600 hover:text-brand-600 font-medium transition text-sm">
                FAQ
              </a>
              <Link
                href="/admin"
                className="text-slate-600 hover:text-brand-600 font-medium transition text-sm"
              >
                Admin Panel
              </Link>
              <Link
                href="/api/auth/strava/login"
                className="bg-brand-900 hover:bg-brand-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition shadow-sm inline-flex items-center gap-2"
              >
                <span>Connect Strava</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HEADER HERO (PERSIS MERBABUDEV: pt-32 pb-20 lg:pt-48 lg:pb-32, rounded background circles, pill badge) */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
        {/* Background decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 border border-slate-200 rounded-full opacity-40 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-50 rounded-full opacity-50 z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-brand-700 text-sm font-semibold mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
            </span>
            Koneksi Strava API v3 Aktif &amp; Teruji
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
            Analisis Kesiapan Lari &amp; Target Race <br />
            <span className="text-brand-600">Sesuai Performa Nyata Anda</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform verifikasi race readiness personal. Mulai dari audit volume latihan mingguan, jarak aman long run,
            hingga kalkulasi Peter Riegel terhadap batas Cut-Off Time lomba agar terhindar dari resiko DNF di hari perlombaan.
          </p>

          {/* CTA Buttons (persis merbabudev style) */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/api/auth/strava/login"
              className="px-8 py-4 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition shadow-lg hover:shadow-brand-500/20 flex items-center justify-center gap-2 group"
            >
              <span>Hubungkan Akun Strava</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <a
              href="#cara-kerja"
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              Pelajari Cara Hitung
            </a>
          </div>
        </div>
      </header>

      {/* 3. PARTNER / RACE EVENTS TICKER (PERSIS MERBABUDEV CLIENTS SECTION) */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xs uppercase tracking-widest font-semibold text-slate-400 mb-6">
            Mendukung Verifikasi Lomba Lari Resmi di Indonesia &amp; Internasional
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition">
            <span className="font-bold text-lg text-slate-700">Borobudur Marathon</span>
            <span className="font-bold text-lg text-slate-700">Maybank Marathon Bali</span>
            <span className="font-bold text-lg text-slate-700">Jakarta Marathon</span>
            <span className="font-bold text-lg text-slate-700">Rinjani 100 Trail</span>
            <span className="font-bold text-lg text-slate-700">BTS Ultra 100</span>
          </div>
        </div>
      </section>

      {/* 4. CARA KERJA / PROCESS SECTION (PERSIS MERBABUDEV LAYOUT: 3 Grid Cards with Clean Borders & Icons) */}
      <section id="cara-kerja" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
              Tahapan Analisis
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Bagaimana RunHub Menilai Kesiapan Anda?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Tiga langkah terukur yang menganalisis beban latihan nyata untuk memberikan rekomendasi objektif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Langkah 01</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tarik Riwayat Strava</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Menghubungkan akun melalui OAuth resmi dan otomatis membaca riwayat aktivitas 16 minggu terakhir:
                moving time, elevation gain, dan heart rate.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Langkah 02</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Pilih Profil Target Race</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tentukan lomba yang ingin Anda ikuti (10K, HM 21K, Full Marathon 42K, atau Ultra Trail) beserta profil elevasi dan jam cut-off time resmi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 transition-all duration-300 relative group">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-110 transition">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">Langkah 03</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Terima Skor &amp; Gap Analysis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dapatkan skor kesiapan 0–100%, status verdict (Ready, Risky, Not Ready), serta panduan kekurangan jarak long run mingguan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES / FITUR SECTION (PERSIS MERBABUDEV: Modern cards with clean badges and typography) */}
      <section id="fitur" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
              Fitur Lengkap
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Kalkulasi Ilmiah untuk Setiap Pelari
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Membantu pelari pemula hingga maratonis berpengalaman mengambil keputusan berbasis data yang akurat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-500 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Peter Riegel Prediction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Model prediksi waktu finish lomba berdasarkan lari terpanjang terakhir dengan koefisien penurunan daya tahan tubuh.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-500 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">COT Safety Margin</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Mengukur selisih waktu aman antara kecepatan rata-rata Anda dengan batas waktu penyapuan rute (sweep bus / Cut-Off Time).
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-500 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center mb-5">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Long Run Adequacy</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Menilai kecukupan latihan jarak jauh Anda (misal: minimal 30 km sebelum Full Marathon 42.195 km).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (PERSIS MERBABUDEV STYLE) */}
      <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
              Tanya Jawab
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-slate-600 text-base">
              Informasi mengenai integrasi akun Strava dan penilaian lomba.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Apakah data Strava saya aman?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sangat aman. Kami hanya meminta izin membaca aktivitas (read-only) untuk keperluan kalkulasi statistik dan tidak pernah mengubah atau menghapus data Anda di Strava.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Bagaimana jika event lari yang saya ikuti belum ada di daftar?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Melalui modul Admin, kami menyediakan fitur scraper otomatis dari URL website resmi lomba lari untuk menambahkan jarak, rute, dan jam COT ke dalam database.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2">
                Apa arti status READY, RISKY, dan NOT READY?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                READY berarti volume mingguan dan long run Anda sudah di ambang ideal. RISKY menandakan Anda kemungkinan finish namun rentan cedera atau mendekati batas COT. NOT READY menandakan volume latihan belum mencukupi batas aman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER (PERSIS MERBABUDEV: bg-brand-900 with high contrast typography) */}
      <section className="bg-brand-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Memeriksa Kesiapan Lomba Lari Anda?
          </h2>
          <p className="text-brand-200 text-lg max-w-2xl mx-auto mb-8">
            Hubungkan Strava sekarang untuk melihat analisis performa dan gap analysis latihan Anda.
          </p>
          <Link
            href="/api/auth/strava/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg shadow-lg transition"
          >
            <span>Hubungkan Strava Gratis</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 8. FOOTER (PERSIS MERBABUDEV: 4-column layout, contact info, slate-600 typography, bottom copyright) */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Col 1: About */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-slate-900">RunHub</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Platform race readiness analyzer untuk pelari road &amp; trail. Mengubah data latihan nyata menjadi panduan persiapan lomba yang terukur.
              </p>
              <div className="flex gap-4 pt-2">
                <a
                  href="https://github.com/Abiyyuardi213/runhub-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-brand-600 transition"
                  aria-label="GitHub"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Col 2: Fitur Utama */}
            <div>
              <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">
                Fitur Utama
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#cara-kerja" className="hover:text-brand-600 transition inline-block">Strava OAuth Sync</a></li>
                <li><a href="#fitur" className="hover:text-brand-600 transition inline-block">Riegel Finish Predictor</a></li>
                <li><a href="#fitur" className="hover:text-brand-600 transition inline-block">COT Safety Buffer</a></li>
                <li><a href="#fitur" className="hover:text-brand-600 transition inline-block">Long Run Ratio Check</a></li>
                <li><a href="#fitur" className="hover:text-brand-600 transition inline-block">Weekly Mileage Tracker</a></li>
              </ul>
            </div>

            {/* Col 3: Navigasi */}
            <div>
              <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">
                Navigasi
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><Link href="/" className="hover:text-brand-600 transition inline-block">Beranda</Link></li>
                <li><Link href="/admin" className="hover:text-brand-600 transition inline-block">Admin Dashboard</Link></li>
                <li><a href="#cara-kerja" className="hover:text-brand-600 transition inline-block">Cara Kerja</a></li>
                <li><a href="#faq" className="hover:text-brand-600 transition inline-block">FAQ</a></li>
              </ul>
            </div>

            {/* Col 4: Hubungi Kami */}
            <div>
              <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">
                Kontak &amp; Info
              </h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <span>Indonesia</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-600 shrink-0" />
                  <a href="mailto:support@runhub.id" className="hover:text-brand-600 transition">
                    support@runhub.id
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-brand-600 shrink-0" />
                  <span>Versi 1.0 (Increment 2)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2026 RunHub. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="text-slate-400">Built with Next.js &amp; Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
