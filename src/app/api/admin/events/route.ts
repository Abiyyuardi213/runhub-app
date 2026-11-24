import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/events
 * Mengambil daftar seluruh event lari (termasuk pagination, search, dan filter status aktif)
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const eventType = searchParams.get("eventType");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const skip = (page - 1) * limit;

  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { location: { contains: search } },
      { slug: { contains: search } },
    ];
  }
  if (category) whereClause.category = category;
  if (eventType) whereClause.eventType = eventType;

  const [total, events] = await Promise.all([
    prisma.event.count({ where: whereClause }),
    prisma.event.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        _count: {
          select: { assessments: true },
        },
      },
    }),
  ]);

  return NextResponse.json({
    data: events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/**
 * POST /api/admin/events
 * Membuat event lari baru
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      category,
      eventType = "ROAD",
      distance, // in meters
      elevationGain = 0,
      cutOffTime, // in seconds
      location,
      eventDate,
      sourceUrl,
      isActive = true,
    } = body;

    if (!name || !slug || !category || !distance || !cutOffTime) {
      return NextResponse.json(
        { error: "Field name, slug, category, distance, dan cutOffTime wajib diisi." },
        { status: 400 }
      );
    }

    // Periksa keunikan slug
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: `Event dengan slug '${slug}' sudah ada. Gunakan slug yang berbeda.` },
        { status: 409 }
      );
    }

    const event = await prisma.event.create({
      data: {
        name,
        slug,
        description,
        category,
        eventType,
        distance: parseFloat(distance),
        elevationGain: parseFloat(elevationGain) || 0,
        cutOffTime: parseInt(cutOffTime, 10),
        location,
        eventDate: eventDate ? new Date(eventDate) : null,
        sourceUrl,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    console.error("Admin Create Event Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create event" }, { status: 500 });
  }
}
