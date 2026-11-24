/**
 * Race Readiness Evaluation Engine
 * Menganalisis riwayat aktivitas lari terhadap target event
 */

export interface ActivityMetric {
  distance: number; // meters
  movingTime: number; // seconds
  totalElevation: number; // meters
  startDate: Date;
  averageSpeed: number; // m/s
}

export interface EventTarget {
  name: string;
  category: string;
  distance: number; // meters (e.g. 42195 for FM, 21097.5 for HM)
  cutOffTime: number; // seconds
  elevationGain: number; // meters
  eventType: string; // ROAD, TRAIL
}

export interface AssessmentResult {
  readinessScore: number; // 0 - 100
  verdict: "READY" | "RISKY" | "NOT_READY";
  predictedFinishTime: number; // seconds (formula Peter Riegel)
  minRequiredPace: number; // minutes per km (COT pace)
  userAvgPace: number; // minutes per km
  longestRunKm: number; // km
  weeklyMileageAvgKm: number; // km
  gapAnalysisNotes: string[];
}

/**
 * Peter Riegel Formula: T2 = T1 * (D2 / D1)^1.06
 */
function predictFinishTimeRiegel(
  baseDistance: number,
  baseTime: number,
  targetDistance: number
): number {
  if (baseDistance <= 0 || baseTime <= 0) return 0;
  return Math.round(baseTime * Math.pow(targetDistance / baseDistance, 1.06));
}

export function evaluateRaceReadiness(
  activities: ActivityMetric[],
  event: EventTarget
): AssessmentResult {
  const notes: string[] = [];

  if (activities.length === 0) {
    return {
      readinessScore: 0,
      verdict: "NOT_READY",
      predictedFinishTime: 0,
      minRequiredPace: (event.cutOffTime / 60) / (event.distance / 1000),
      userAvgPace: 0,
      longestRunKm: 0,
      weeklyMileageAvgKm: 0,
      gapAnalysisNotes: ["Tidak ada data aktivitas lari dalam 16 minggu terakhir."],
    };
  }

  // 1. Longest Run
  const longestRunMeters = Math.max(...activities.map((a) => a.distance));
  const longestRunKm = parseFloat((longestRunMeters / 1000).toFixed(2));

  // 2. Weekly Mileage (rata-rata 8-12 minggu terakhir)
  const totalDistanceMeters = activities.reduce((acc, curr) => acc + curr.distance, 0);
  const totalMovingTimeSeconds = activities.reduce((acc, curr) => acc + curr.movingTime, 0);

  // Estimasi rentang minggu
  const now = new Date().getTime();
  const oldest = Math.min(...activities.map((a) => new Date(a.startDate).getTime()));
  const totalWeeks = Math.max(1, Math.round((now - oldest) / (7 * 24 * 60 * 60 * 1000)));
  const weeklyMileageAvgKm = parseFloat(((totalDistanceMeters / 1000) / totalWeeks).toFixed(2));

  // 3. User Average Pace (min/km)
  const userAvgSpeed = totalMovingTimeSeconds > 0 ? totalDistanceMeters / totalMovingTimeSeconds : 0;
  const userAvgPace = userAvgSpeed > 0 ? 1000 / userAvgSpeed / 60 : 0; // min/km

  // 4. Required Pace for Event COT (min/km)
  const targetKm = event.distance / 1000;
  const minRequiredPace = (event.cutOffTime / 60) / targetKm; // min/km

  // 5. Prediksi Finish Time menggunakan lari terpanjang yang representatif
  const bestLongRun = activities
    .filter((a) => a.distance >= Math.min(5000, event.distance * 0.2))
    .sort((a, b) => b.distance - a.distance)[0] || activities[0];

  const predictedFinishTime = predictFinishTimeRiegel(
    bestLongRun.distance,
    bestLongRun.movingTime,
    event.distance
  );

  // =====================
  // SCORING ALGORITHM (0 - 100)
  // =====================
  let score = 0;

  // A. Rasio Long Run (Bobot: 40 poin)
  // Minimal syarat long run:
  // FM (42K) -> ideal long run >= 30K (70% distance)
  // HM (21K) -> ideal long run >= 16K (75% distance)
  // 10K -> ideal long run >= 8K (80% distance)
  const recommendedLongRunRatio = targetKm >= 42 ? 0.70 : targetKm >= 21 ? 0.75 : 0.8;
  const targetLongRunKm = targetKm * recommendedLongRunRatio;
  const longRunRatio = Math.min(1, longestRunKm / targetLongRunKm);
  const longRunPoints = longRunRatio * 40;
  score += longRunPoints;

  if (longestRunKm < targetLongRunKm) {
    notes.push(
      `Lari terjauh Anda saat ini ${longestRunKm} km. Target aman minimal adalah ${targetLongRunKm.toFixed(
        1
      )} km sebelum hari perlombaan.`
    );
  } else {
    notes.push(`Lari terjauh Anda (${longestRunKm} km) sudah memenuhi ambang aman.`);
  }

  // B. Weekly Volume / Consistency (Bobot: 30 poin)
  // Target volume mingguan: minimal 1.2x - 1.5x dari jarak event
  const targetWeeklyMileage = targetKm * 1.2;
  const weeklyRatio = Math.min(1, weeklyMileageAvgKm / targetWeeklyMileage);
  const weeklyPoints = weeklyRatio * 30;
  score += weeklyPoints;

  if (weeklyMileageAvgKm < targetWeeklyMileage) {
    notes.push(
      `Volume mingguan Anda rata-rata ${weeklyMileageAvgKm} km/minggu. Disarankan meningkatkan hingga ~${targetWeeklyMileage.toFixed(
        1
      )} km/minggu agar tubuh terbiasa dengan beban jarak.`
    );
  } else {
    notes.push(`Volume mingguan Anda (${weeklyMileageAvgKm} km/minggu) sangat konsisten.`);
  }

  // C. Pace vs Cut-Off Time Buffer (Bobot: 30 poin)
  // Apakah prediksi waktu lebih cepat dari COT dengan buffer keamanan 10-15%?
  const cotBufferRatio = event.cutOffTime / Math.max(1, predictedFinishTime);
  let pacePoints = 0;
  if (cotBufferRatio >= 1.2) {
    pacePoints = 30; // Sangat aman (20% lebih cepat dari batas waktu)
    notes.push(`Pace latihan Anda sangat aman terhadap Cut-Off Time (COT).`);
  } else if (cotBufferRatio >= 1.05) {
    pacePoints = 22; // Cukup aman
    notes.push(`Pace latihan memenuhi batas COT, namun selisih waktu finish dengan COT cukup tipis.`);
  } else if (cotBufferRatio >= 0.95) {
    pacePoints = 12; // Rawan DNF
    notes.push(`Prediksi waktu finish mendekati batas COT. Beresiko terkena sweep/DNF jika ada kendala di rute.`);
  } else {
    pacePoints = 0; // Lewat dari COT
    notes.push(`Prediksi waktu finish Anda melebihi Cut-Off Time event. Perlu peningkatan daya tahan dan pace.`);
  }
  score += pacePoints;

  // Final Verdict
  const roundedScore = Math.round(score);
  let verdict: "READY" | "RISKY" | "NOT_READY" = "NOT_READY";

  if (roundedScore >= 75 && cotBufferRatio >= 1.05) {
    verdict = "READY";
  } else if (roundedScore >= 50) {
    verdict = "RISKY";
  } else {
    verdict = "NOT_READY";
  }

  return {
    readinessScore: roundedScore,
    verdict,
    predictedFinishTime,
    minRequiredPace: parseFloat(minRequiredPace.toFixed(2)),
    userAvgPace: parseFloat(userAvgPace.toFixed(2)),
    longestRunKm,
    weeklyMileageAvgKm,
    gapAnalysisNotes: notes,
  };
}
