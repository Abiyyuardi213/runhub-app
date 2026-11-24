/**
 * Event Web Scraper & Parser Utility
 * Mengekstrak informasi dasar (title, description, event keywords) dari URL website resmi lomba lari
 */

export interface ScrapedEventData {
  title: string;
  description: string;
  suggestedCategory?: string;
  suggestedDistance?: number;
  suggestedCutOffHours?: number;
  rawTextPreview: string;
}

export async function fetchEventMetadataFromUrl(url: string): Promise<ScrapedEventData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(10000), // 10 detik timeout
  });

  if (!response.ok) {
    throw new Error(`Gagal membuka URL: status ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // 1. Ekstrak Title tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // 2. Ekstrak Meta Description
  const metaDescMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  const description = metaDescMatch ? metaDescMatch[1].trim() : "";

  // 3. Bersihkan tag HTML untuk teks polos pencarian kata kunci
  const cleanText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  // 4. Deteksi kategori & jarak lomba secara heuristik
  let suggestedCategory = "FM";
  let suggestedDistance = 42195;
  let suggestedCutOffHours = 7;

  const lowerText = (title + " " + description + " " + cleanText.slice(0, 5000)).toLowerCase();

  if (lowerText.includes("half marathon") || lowerText.includes("21k") || lowerText.includes("21.1k")) {
    suggestedCategory = "HM";
    suggestedDistance = 21097.5;
    suggestedCutOffHours = 3.5;
  } else if (lowerText.includes("100k") || lowerText.includes("ultra")) {
    suggestedCategory = "ULTRA";
    suggestedDistance = 100000;
    suggestedCutOffHours = 24;
  } else if (lowerText.includes("50k")) {
    suggestedCategory = "ULTRA";
    suggestedDistance = 50000;
    suggestedCutOffHours = 10;
  } else if (lowerText.includes("10k")) {
    suggestedCategory = "10K";
    suggestedDistance = 10000;
    suggestedCutOffHours = 2;
  } else if (lowerText.includes("5k")) {
    suggestedCategory = "5K";
    suggestedDistance = 5000;
    suggestedCutOffHours = 1;
  }

  return {
    title: title || "Running Event",
    description,
    suggestedCategory,
    suggestedDistance,
    suggestedCutOffHours,
    rawTextPreview: cleanText.slice(0, 500),
  };
}
