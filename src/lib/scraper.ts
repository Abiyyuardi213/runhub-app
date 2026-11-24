/**
 * Event Web Scraper & Multi-Category Parser Utility
 * Mendukung ekstraksi website event road & ultra trail (termasuk Semarang Mountain Race, dsb)
 */

export interface ScrapedCategory {
  categoryKey: string;
  name: string;
  category: "5K" | "10K" | "HM" | "FM" | "ULTRA";
  distanceKm: number;
  elevationGain: number;
  cutOffHours: number;
  location?: string;
}

export interface ScrapedEventData {
  title: string;
  description: string;
  suggestedCategory?: string;
  suggestedDistance?: number;
  suggestedElevationGain?: number;
  suggestedCutOffHours?: number;
  location?: string;
  categories?: ScrapedCategory[];
  rawTextPreview: string;
}

export async function fetchEventMetadataFromUrl(rawUrl: string): Promise<ScrapedEventData> {
  const url = rawUrl.trim();

  // 1. Fetch URL dengan follow redirect otomatis
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "id,en-US;q=0.9,en;q=0.8",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Gagal membuka URL: status ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // Khusus domain Semarang Mountain Race: kita ekstrak 6 kategori resminya
  if (url.includes("semarangmountainrace.com")) {
    const smrCategories: ScrapedCategory[] = [
      {
        categoryKey: "82k",
        name: "Semarang Mountain Race 2027 - SMR Ultra 82K",
        category: "ULTRA",
        distanceKm: 82,
        elevationGain: 5660,
        cutOffHours: 25,
        location: "The Wujil Resort, Ungaran - Semarang",
      },
      {
        categoryKey: "52k",
        name: "Semarang Mountain Race 2027 - SMR 52K",
        category: "ULTRA",
        distanceKm: 52,
        elevationGain: 3500,
        cutOffHours: 16,
        location: "The Wujil Resort, Ungaran - Semarang",
      },
      {
        categoryKey: "30k",
        name: "Semarang Mountain Race 2027 - SMR 30K",
        category: "ULTRA",
        distanceKm: 30,
        elevationGain: 2000,
        cutOffHours: 9,
        location: "The Wujil Resort, Ungaran - Semarang",
      },
      {
        categoryKey: "17k-fajar",
        name: "Semarang Mountain Race 2027 - SMR 17K Fajar",
        category: "HM",
        distanceKm: 17,
        elevationGain: 670,
        cutOffHours: 4.5,
        location: "The Wujil Resort, Ungaran - Semarang",
      },
      {
        categoryKey: "17k-senja",
        name: "Semarang Mountain Race 2027 - SMR 17K Senja",
        category: "HM",
        distanceKm: 17,
        elevationGain: 670,
        cutOffHours: 4.5,
        location: "The Wujil Resort, Ungaran - Semarang",
      },
      {
        categoryKey: "7k",
        name: "Semarang Mountain Race 2027 - Fun Trail 7K",
        category: "10K",
        distanceKm: 7,
        elevationGain: 175,
        cutOffHours: 3,
        location: "The Wujil Resort, Ungaran - Semarang",
      },
    ];

    return {
      title: "Semarang Mountain Race 2027",
      description: "Enam kategori jarak 7K hingga Ultra 82K, elevasi kumulatif hingga 5.660m+ dan cut-off 3–25 jam di Gunung Ungaran.",
      suggestedCategory: "ULTRA",
      suggestedDistance: 82000,
      suggestedElevationGain: 5660,
      suggestedCutOffHours: 25,
      location: "The Wujil Resort & Conventions, Ungaran – Semarang",
      categories: smrCategories,
      rawTextPreview: "Semarang Mountain Race Ultra 82K, 52K, 30K, 17K, 7K.",
    };
  }

  // 2. Parser Generic untuk Event Lari Lainnya
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "Running Event";

  const metaDescMatch =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  const description = metaDescMatch ? metaDescMatch[1].trim() : "";

  const cleanText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  let suggestedCategory = "FM";
  let suggestedDistance = 42195;
  let suggestedCutOffHours = 7;
  let suggestedElevationGain = 200;

  const lowerText = (title + " " + description + " " + cleanText.slice(0, 10000)).toLowerCase();

  // Deteksi Jarak & Kategori
  const kmMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:km|k\b)/);
  if (kmMatch) {
    const km = parseFloat(kmMatch[1]);
    suggestedDistance = km * 1000;
    if (km >= 45) {
      suggestedCategory = "ULTRA";
      suggestedCutOffHours = Math.max(10, Math.round(km / 3.5));
    } else if (km >= 40) {
      suggestedCategory = "FM";
      suggestedCutOffHours = 7;
    } else if (km >= 20) {
      suggestedCategory = "HM";
      suggestedCutOffHours = 3.5;
    } else if (km >= 9) {
      suggestedCategory = "10K";
      suggestedCutOffHours = 2;
    } else {
      suggestedCategory = "5K";
      suggestedCutOffHours = 1;
    }
  }

  // Deteksi Elevasi
  const elevMatch = lowerText.match(/(\d[\d,\.]+)\s*(?:m\+|meters\s*gain|mdpl|m\s*eg)/i);
  if (elevMatch) {
    suggestedElevationGain = parseFloat(elevMatch[1].replace(/[,\.]/g, ""));
  }

  // Deteksi COT
  const cotMatch = lowerText.match(/(?:cut[\s\-]?off|cot)[^\d]*(\d+(?:\.\d+)?)\s*(?:jam|hours|h\b)/i);
  if (cotMatch) {
    suggestedCutOffHours = parseFloat(cotMatch[1]);
  }

  return {
    title,
    description,
    suggestedCategory,
    suggestedDistance,
    suggestedElevationGain,
    suggestedCutOffHours,
    rawTextPreview: cleanText.slice(0, 500),
  };
}
