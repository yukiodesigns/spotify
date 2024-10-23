// app/api/spotify/route.ts

import { NextResponse } from 'next/server';

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function POST() {

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.error('Missing CLIENT_ID or CLIENT_SECRET');
    return NextResponse.json({ error: 'Missing CLIENT_ID or CLIENT_SECRET' }, { status: 400 });
  }

  const now = Date.now();
  if (accessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return NextResponse.json({ access_token: accessToken });
  }

  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error fetching access token:', errorText);
    return NextResponse.json({ error: 'Failed to fetch access token' }, { status: response.status });
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000; // Convert seconds to milliseconds

  return NextResponse.json({ access_token: accessToken });
}
