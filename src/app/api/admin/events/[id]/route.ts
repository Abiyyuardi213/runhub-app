import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/events/[id]
 * Mengambil detail satu event beserta rekap asesmen
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      assessments: {
        take: 10,
        orderBy: { calculatedAt: "desc" },
        include: {
          user: {
            select: { id: true, name: true, profileImage: true },
          },
        },
      },
      _count: {
        select: { assessments: true },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: event });
}

/**
 * PUT /api/admin/events/[id]
 * Memperbarui data event lari
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      category,
      eventType,
      distance,
      elevationGain,
      cutOffTime,
      location,
      eventDate,
      sourceUrl,
      isActive,
    } = body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(eventType !== undefined && { eventType }),
        ...(distance !== undefined && { distance: parseFloat(distance) }),
        ...(elevationGain !== undefined && { elevationGain: parseFloat(elevationGain) }),
        ...(cutOffTime !== undefined && { cutOffTime: parseInt(cutOffTime, 10) }),
        ...(location !== undefined && { location }),
        ...(eventDate !== undefined && { eventDate: eventDate ? new Date(eventDate) : null }),
        ...(sourceUrl !== undefined && { sourceUrl }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "Failed to update event" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/events/[id]
 * Menghapus event lari dari sistem
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const { id } = await params;
  try {
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Event berhasil dihapus." });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || "Failed to delete event" }, { status: 500 });
  }
}
