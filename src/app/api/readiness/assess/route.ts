import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { evaluateRaceReadiness } from "@/lib/readiness";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, eventId } = body;

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: "userId and eventId are required" },
        { status: 400 }
      );
    }

    // Ambil data event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Ambil 16 minggu terakhir aktivitas user
    const sixteenWeeksAgo = new Date(Date.now() - 16 * 7 * 24 * 60 * 60 * 1000);
    const activities = await prisma.activity.findMany({
      where: {
        userId,
        startDate: { gte: sixteenWeeksAgo },
      },
      orderBy: { startDate: "desc" },
    });

    // Jalankan kalkulator kesiapan
    const assessment = evaluateRaceReadiness(
      activities.map((a) => ({
        distance: a.distance,
        movingTime: a.movingTime,
        totalElevation: a.totalElevation,
        startDate: a.startDate,
        averageSpeed: a.averageSpeed,
      })),
      {
        name: event.name,
        category: event.category,
        distance: event.distance,
        cutOffTime: event.cutOffTime,
        elevationGain: event.elevationGain,
        eventType: event.eventType,
      }
    );

    // Simpan hasil asesmen ke database
    const savedAssessment = await prisma.raceAssessment.create({
      data: {
        userId,
        eventId,
        readinessScore: assessment.readinessScore,
        verdict: assessment.verdict,
        predictedFinishTime: assessment.predictedFinishTime,
        minRequiredPace: assessment.minRequiredPace,
        userAvgPace: assessment.userAvgPace,
        longestRunKm: assessment.longestRunKm,
        weeklyMileageAvgKm: assessment.weeklyMileageAvgKm,
        gapAnalysisNotes: assessment.gapAnalysisNotes,
      },
    });

    return NextResponse.json({
      success: true,
      assessment: savedAssessment,
      analysis: assessment,
    });
  } catch (error: any) {
    console.error("Race Assessment error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
