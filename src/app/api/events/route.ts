import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const SAMPLE_EVENTS = [
  {
    name: "Borobudur Marathon 2024 - Full Marathon",
    slug: "borobudur-marathon-2024-fm",
    category: "FM",
    distance: 42195,
    elevationGain: 280,
    cutOffTime: 7 * 3600, // 7 hours (25200s)
    location: "Magelang, Jawa Tengah",
    eventType: "ROAD",
    sourceUrl: "https://borobudurmarathon.com",
  },
  {
    name: "Borobudur Marathon 2024 - Half Marathon",
    slug: "borobudur-marathon-2024-hm",
    category: "HM",
    distance: 21097,
    elevationGain: 140,
    cutOffTime: 3.5 * 3600, // 3h 30m (12600s)
    location: "Magelang, Jawa Tengah",
    eventType: "ROAD",
    sourceUrl: "https://borobudurmarathon.com",
  },
  {
    name: "Maybank Marathon Bali 2024 - Full Marathon",
    slug: "maybank-marathon-2024-fm",
    category: "FM",
    distance: 42195,
    elevationGain: 350,
    cutOffTime: 7 * 3600, // 7 hours
    location: "Gianyar, Bali",
    eventType: "ROAD",
    sourceUrl: "https://maybankmarathon.com",
  },
  {
    name: "Rinjani 100 - 36K",
    slug: "rinjani-100-36k",
    category: "ULTRA",
    distance: 36000,
    elevationGain: 3200,
    cutOffTime: 15 * 3600, // 15 hours
    location: "Lombok, NTB",
    eventType: "TRAIL",
    sourceUrl: "https://rinjani100.com",
  },
];

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const createdEvents = [];
    for (const ev of SAMPLE_EVENTS) {
      const item = await prisma.event.upsert({
        where: { slug: ev.slug },
        update: ev,
        create: ev,
      });
      createdEvents.push(item);
    }

    return NextResponse.json({
      message: "Sample events seeded successfully",
      events: createdEvents,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
