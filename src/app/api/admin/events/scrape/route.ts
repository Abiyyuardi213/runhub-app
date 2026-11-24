import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { fetchEventMetadataFromUrl } from "@/lib/scraper";

/**
 * POST /api/admin/events/scrape
 * Membaca URL referensi event lari dan mengembalikan draft metadata
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  try {
    const { url } = await request.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "URL yang dimasukkan tidak valid." }, { status: 400 });
    }

    const scrapedData = await fetchEventMetadataFromUrl(url);

    return NextResponse.json({
      success: true,
      scraped: scrapedData,
    });
  } catch (error: any) {
    console.error("Scraper Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari URL lomba.", details: error.message },
      { status: 500 }
    );
  }
}
