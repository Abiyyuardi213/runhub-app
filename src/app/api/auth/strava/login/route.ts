import { NextRequest, NextResponse } from "next/server";
import { getStravaAuthorizeUrl } from "@/lib/strava";

export async function GET(request: NextRequest) {
  const url = getStravaAuthorizeUrl();
  return NextResponse.redirect(url);
}
