import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/metrics
 * Mengambil statistik ringkas sistem: Total Pelari, Total Event, Total Asesmen Kesiapan, Distribusi Verdict
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const [totalUsers, totalEvents, totalActivities, totalAssessments, assessments] =
    await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.activity.count(),
      prisma.raceAssessment.count(),
      prisma.raceAssessment.findMany({
        select: { verdict: true, readinessScore: true },
      }),
    ]);

  const verdictDistribution = {
    READY: assessments.filter((a) => a.verdict === "READY").length,
    RISKY: assessments.filter((a) => a.verdict === "RISKY").length,
    NOT_READY: assessments.filter((a) => a.verdict === "NOT_READY").length,
  };

  const avgReadinessScore =
    assessments.length > 0
      ? Math.round(assessments.reduce((acc, curr) => acc + curr.readinessScore, 0) / assessments.length)
      : 0;

  return NextResponse.json({
    metrics: {
      totalUsers,
      totalEvents,
      totalActivities,
      totalAssessments,
      avgReadinessScore,
      verdictDistribution,
    },
  });
}
