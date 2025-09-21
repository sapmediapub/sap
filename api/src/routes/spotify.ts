import { Router } from "express";
import { 
    extractTrackId, 
    isISRC, 
    fetchTrackById, 
    fetchTrackByISRC,
    extractArtistId,
    fetchArtistTopTracks,
    importArtistCatalog
} from "../lib/spotify.js";

export const spotifyRouter = Router();

spotifyRouter.post("/fetch", async (req, res) => {
  try {
    const { spotifyUrlOrId, isrc, artistHint } = req.body ?? {};
    if (!spotifyUrlOrId && !isrc) {
      return res.status(400).json({ code: "SPOTIFY_INVALID_INPUT", message: "Provide spotifyUrlOrId or isrc." });
    }
    if (spotifyUrlOrId) {
      const id = extractTrackId(spotifyUrlOrId);
      const track = await fetchTrackById(id);
      return res.json(track);
    }
    if (isrc) {
      if (!isISRC(isrc)) return res.status(400).json({ code: "SPOTIFY_INVALID_INPUT", message: "Bad ISRC." });
      const track = await fetchTrackByISRC(isrc.toUpperCase(), artistHint);
      if (!track) return res.status(404).json({ code: "SPOTIFY_NOT_FOUND", message: "Track not found for the given ISRC." });
      return res.json(track);
    }
  } catch (e: any) {
    console.error("Spotify fetch error:", e);
    const msg = String(e.message || e);
    if (msg.startsWith("SPOTIFY_UPSTREAM_404")) return res.status(404).json({ code: "SPOTIFY_NOT_FOUND", message: "Track not found for the given ID." });
    if (msg.startsWith("SPOTIFY_UPSTREAM_400")) return res.status(400).json({ code: "SPOTIFY_INVALID_INPUT", message: "Invalid Spotify ID provided." });
    if (msg.startsWith("SPOTIFY_UPSTREAM_429")) return res.status(429).json({ code: "SPOTIFY_RATE_LIMIT", message: "Rate limit exceeded. Please try again later." });
    if (msg.includes("SPOTIFY_TOKEN_FAIL")) return res.status(503).json({ code: "SPOTIFY_AUTH_ERROR", message: "Could not authenticate with Spotify." });
    return res.status(502).json({ code: "SPOTIFY_UPSTREAM_ERROR", message: "An unexpected error occurred with the Spotify API." });
  }
});

spotifyRouter.post("/fetch-artist-tracks", async (req, res) => {
    try {
        const { spotifyArtistUrlOrId } = req.body ?? {};
        if (!spotifyArtistUrlOrId) {
            return res.status(400).json({ code: "SPOTIFY_INVALID_INPUT", message: "Provide a Spotify Artist URL or ID." });
        }

        const artistId = extractArtistId(spotifyArtistUrlOrId);
        const tracks = await fetchArtistTopTracks(artistId);

        if (!tracks.length) {
            return res.status(404).json({ code: "SPOTIFY_NOT_FOUND", message: "No top tracks found for the given artist ID." });
        }
        
        return res.json(tracks);

    } catch (e: any) {
        console.error("Spotify artist fetch error:", e);
        const msg = String(e.message || e);
        if (msg.startsWith("SPOTIFY_UPSTREAM_404")) return res.status(404).json({ code: "SPOTIFY_NOT_FOUND", message: "Artist not found for the given ID." });
        if (msg.startsWith("SPOTIFY_UPSTREAM_400")) return res.status(400).json({ code: "SPOTIFY_INVALID_INPUT", message: "Invalid Spotify Artist ID provided." });
        if (msg.startsWith("SPOTIFY_UPSTREAM_429")) return res.status(429).json({ code: "SPOTIFY_RATE_LIMIT", message: "Rate limit exceeded. Please try again later." });
        if (msg.includes("SPOTIFY_TOKEN_FAIL")) return res.status(503).json({ code: "SPOTIFY_AUTH_ERROR", message: "Could not authenticate with Spotify." });
        return res.status(502).json({ code: "SPOTIFY_UPSTREAM_ERROR", message: "An unexpected error occurred with the Spotify API." });
    }
});

spotifyRouter.post("/import-catalog", async (req, res) => {
    try {
        const { spotifyArtistUrlOrId } = req.body ?? {};
        if (!spotifyArtistUrlOrId) {
            return res.status(400).json({ code: "SPOTIFY_INVALID_INPUT", message: "Provide a Spotify Artist URL or ID." });
        }

        const artistId = extractArtistId(spotifyArtistUrlOrId);
        const tracks = await importArtistCatalog(artistId);

        if (!tracks.length) {
            return res.status(404).json({ code: "SPOTIFY_NOT_FOUND", message: "No tracks found for the given artist ID." });
        }
        
        return res.json(tracks);

    } catch (e: any) {
        console.error("Spotify catalog import error:", e);
        const msg = String(e.message || e);
        if (msg.startsWith("SPOTIFY_UPSTREAM_404")) return res.status(404).json({ code: "SPOTIFY_NOT_FOUND", message: "Artist not found for the given ID." });
        if (msg.startsWith("SPOTIFY_UPSTREAM_400")) return res.status(400).json({ code: "SPOTIFY_INVALID_INPUT", message: "Invalid Spotify Artist ID provided." });
        if (msg.startsWith("SPOTIFY_UPSTREAM_429")) return res.status(429).json({ code: "SPOTIFY_RATE_LIMIT", message: "Rate limit exceeded. Please try again later." });
        if (msg.includes("SPOTIFY_TOKEN_FAIL")) return res.status(503).json({ code: "SPOTIFY_AUTH_ERROR", message: "Could not authenticate with Spotify." });
        return res.status(502).json({ code: "SPOTIFY_UPSTREAM_ERROR", message: "An unexpected error occurred with the Spotify API." });
    }
});