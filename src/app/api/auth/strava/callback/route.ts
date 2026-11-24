import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { exchangeStravaCode, fetchAthleteActivities } from "@/lib/strava";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.json(
      { error: error || "No authorization code provided" },
      { status: 400 }
    );
  }

  try {
    // 1. Tukar auth code dengan token Strava
    const tokenData = await exchangeStravaCode(code);
    const athlete = tokenData.athlete;

    // 2. Simpan / Perbarui User di MySQL
    const user = await prisma.user.upsert({
      where: {
        stravaId: BigInt(athlete.id),
      },
      update: {
        name: [athlete.firstname, athlete.lastname].filter(Boolean).join(" ") || "Runner",
        profileImage: athlete.profile,
      },
      create: {
        stravaId: BigInt(athlete.id),
        name: [athlete.firstname, athlete.lastname].filter(Boolean).join(" ") || "Runner",
        profileImage: athlete.profile,
        role: "ADMIN", // Jadikan user pertama sebagai admin
      },
    });

    // 3. Simpan / Perbarui Kredensial Strava Account
    await prisma.stravaAccount.upsert({
      where: {
        userId: user.id,
      },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_at,
      },
      create: {
        userId: user.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_at,
      },
    });

    // 4. Lakukan penarikan awal aktivitas 16 minggu terakhir
    const sixteenWeeksAgo = Math.floor(Date.now() / 1000) - 16 * 7 * 24 * 60 * 60;
    const rawActivities = await fetchAthleteActivities(tokenData.access_token, sixteenWeeksAgo, 100);

    // Simpan aktivitas lari ke database
    for (const act of rawActivities) {
      const isRun = ["Run", "TrailRun", "VirtualRun"].includes(act.sport_type || act.type);
      if (!isRun) continue;

      await prisma.activity.upsert({
        where: { stravaId: BigInt(act.id) },
        update: {
          name: act.name,
          distance: act.distance,
          movingTime: act.moving_time,
          elapsedTime: act.elapsed_time,
          totalElevation: act.total_elevation_gain,
          averageSpeed: act.average_speed,
          maxSpeed: act.max_speed,
          averageHr: act.average_heartrate,
          maxHr: act.max_heartrate,
        },
        create: {
          userId: user.id,
          stravaId: BigInt(act.id),
          name: act.name,
          type: act.type === "TrailRun" ? "TRAIL_RUN" : "RUN",
          startDate: new Date(act.start_date),
          distance: act.distance,
          movingTime: act.moving_time,
          elapsedTime: act.elapsed_time,
          totalElevation: act.total_elevation_gain,
          averageSpeed: act.average_speed,
          maxSpeed: act.max_speed,
          averageHr: act.average_heartrate,
          maxHr: act.max_heartrate,
          rawPayload: act as any,
        },
      });
    }

    // Redirect kembali ke dashboard dengan cookie/session info
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("runhub_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 hari
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Strava OAuth Callback error:", err);
    return NextResponse.json(
      { error: "Failed to authenticate with Strava", details: err?.message },
      { status: 500 }
    );
  }
}
