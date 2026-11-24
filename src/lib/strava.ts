/**
 * Strava API Service Client
 * Handles token exchange, token refresh, and activity fetching.
 */

const STRAVA_API_BASE = "https://www.strava.com/api/v3";
const STRAVA_OAUTH_TOKEN_URL = "https://www.strava.com/oauth/token";

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: {
    id: number;
    username?: string;
    firstname?: string;
    lastname?: string;
    profile?: string;
  };
}

export interface StravaRawActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  type: string;
  sport_type?: string;
  start_date: string;
  start_date_local: string;
  average_speed: number; // m/s
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
}

export function getStravaAuthorizeUrl(): string {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  const scope = "read,activity:read_all";

  return `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri || ""
  )}&approval_prompt=auto&scope=${encodeURIComponent(scope)}`;
}

export async function exchangeStravaCode(code: string): Promise<StravaTokenResponse> {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  const response = await fetch(STRAVA_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to exchange Strava code: ${response.status} ${errorBody}`);
  }

  return response.json();
}

export async function refreshStravaToken(refreshToken: string): Promise<StravaTokenResponse> {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  const response = await fetch(STRAVA_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to refresh Strava token: ${response.status} ${errorBody}`);
  }

  return response.json();
}

export async function fetchAthleteActivities(
  accessToken: string,
  afterTimestamp?: number,
  perPage = 100
): Promise<StravaRawActivity[]> {
  const url = new URL(`${STRAVA_API_BASE}/athlete/activities`);
  url.searchParams.set("per_page", String(perPage));
  if (afterTimestamp) {
    url.searchParams.set("after", String(afterTimestamp));
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch Strava activities: ${response.status} ${errorBody}`);
  }

  return response.json();
}
