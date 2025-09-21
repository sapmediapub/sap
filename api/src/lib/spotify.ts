import fetch from "node-fetch";
import { Buffer } from 'node:buffer';

type Token = { access_token: string; token_type: "Bearer"; expires_in: number; obtained_at: number };
let tokenCache: Token | null = null;
let refreshing: Promise<void> | null = null;

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env as Record<string,string>;
const TIMEOUT = Number(process.env.SPOTIFY_TIMEOUT_MS ?? 12000);
const MAX_RETRIES = Number(process.env.SPOTIFY_MAX_RETRIES ?? 3);

export function isISRC(x: string): boolean {
  return /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/i.test(x.trim());
}
export function extractTrackId(input: string): string {
  const s = input.trim();
  const url = s.match(/open\.spotify\.com\/track\/([A-Za-z0-9]{22})/);
  if (url) return url[1].split("?")[0];
  const uri = s.match(/^spotify:track:([A-Za-z0-9]{22})$/);
  if (uri) return uri[1];
  return s; // Assume it's a raw ID
}

export function extractArtistId(input: string): string {
    const s = input.trim();
    const url = s.match(/open\.spotify\.com\/artist\/([A-Za-z0-9]{22})/);
    if (url) return url[1].split("?")[0];
    const uri = s.match(/^spotify:artist:([A-Za-z0-9]{22})$/);
    if (uri) return uri[1];
    return s; // Assume it's a raw ID
}

async function getToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && now - tokenCache.obtained_at < (tokenCache.expires_in - 30) * 1000) {
    return tokenCache.access_token;
  }
  if (!refreshing) {
    refreshing = (async () => {
      const body = new URLSearchParams({ grant_type: "client_credentials" });
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64"),
        },
        body,
        // @ts-ignore AbortSignal.timeout is available in modern Node.js
        signal: AbortSignal.timeout(TIMEOUT),
      });
      if (!res.ok) throw new Error("SPOTIFY_TOKEN_FAIL");
      const j: any = await res.json();
      tokenCache = { ...j, obtained_at: Date.now() };
    })();
  }
  await refreshing;
  refreshing = null;
  return tokenCache!.access_token;
}

async function spotifyGET(path: string, retries = 0): Promise<any> {
  const token = await getToken();
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    // @ts-ignore
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (res.status === 429 && retries < MAX_RETRIES) {
    const ra = Number(res.headers.get("retry-after") ?? "1");
    await new Promise(r => setTimeout(r, (ra + 1) * 1000));
    return spotifyGET(path, retries + 1);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SPOTIFY_UPSTREAM_${res.status}:${text}`);
  }
  return res.json();
}

function normalizeTrack(t: any) {
  return {
    title: t?.name ?? null,
    artists: (t?.artists ?? []).map((a: any) => a?.name).filter(Boolean),
    duration_ms: t?.duration_ms ?? null,
    isrc: t?.external_ids?.isrc ?? null,
    album: t?.album?.name ?? null,
    release_date: t?.album?.release_date ?? null,
    preview_url: t?.preview_url ?? null,
    spotify_track_id: t?.id ?? null,
    spotify_url: t?.external_urls?.spotify ?? (t?.id ? `https://open.spotify.com/track/${t.id}` : null),
    cover_art_url: t?.album?.images?.[0]?.url ?? null,
  };
}

export async function fetchTrackById(id: string) {
  const data = await spotifyGET(`/tracks/${encodeURIComponent(id)}`);
  return normalizeTrack(data);
}

export async function fetchTrackByISRC(isrc: string, artistHint?: string) {
  const data = await spotifyGET(`/search?q=${encodeURIComponent(`isrc:${isrc}`)}&type=track&limit=5`);
  const items = data?.tracks?.items ?? [];
  if (!items.length) return null;
  if (artistHint) {
    const hint = artistHint.toLowerCase();
    const scored = items.map((t: any) => ({
      t, score: t.artists?.some((a: any) => a.name?.toLowerCase().includes(hint)) ? 2 : 0
    })).sort((a: any, b: any) => b.score - a.score);
    return normalizeTrack(scored[0].t);
  }
  return normalizeTrack(items[0]);
}

export async function fetchArtistTopTracks(artistId: string) {
    // A market country code is required by the Spotify API for this endpoint.
    const data = await spotifyGET(`/artists/${encodeURIComponent(artistId)}/top-tracks?market=US`);
    const tracks = data?.tracks ?? [];
    if (!tracks.length) return [];
    return tracks.map(normalizeTrack);
}

export async function importArtistCatalog(artistId: string): Promise<any[]> {
    // 1. Get artist's albums and singles (limit to 50 to avoid long waits/timeouts)
    const albumsResponse = await spotifyGET(`/artists/${artistId}/albums?include_groups=album,single&limit=50`);
    const albumItems = albumsResponse?.items ?? [];
    if (!albumItems.length) return [];

    const albumIds = albumItems.map((item: any) => item.id);

    // 2. Get tracks for each album
    const trackIds = new Set<string>();
    // In a real high-scale app, this loop could be parallelized.
    for (const albumId of albumIds) {
        const tracksResponse = await spotifyGET(`/albums/${albumId}/tracks?limit=50`);
        const trackItems = tracksResponse?.items ?? [];
        trackItems.forEach((item: any) => trackIds.add(item.id));
    }
    
    const uniqueTrackIds = Array.from(trackIds);
    if (!uniqueTrackIds.length) return [];

    // 3. Get full track details in batches of 50
    const allTracks = [];
    for (let i = 0; i < uniqueTrackIds.length; i += 50) {
        const chunk = uniqueTrackIds.slice(i, i + 50);
        const tracksResponse = await spotifyGET(`/tracks?ids=${chunk.join(',')}`);
        const trackItems = tracksResponse?.tracks ?? [];
        allTracks.push(...trackItems.filter(Boolean)); // Filter out any null responses from the API
    }

    // 4. Normalize and return
    return allTracks.map(normalizeTrack);
}