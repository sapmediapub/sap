import { SpotifyTrackData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Checks if the provided string is a valid ISRC.
 * @param identifier The string to check.
 * @returns True if it's an ISRC, false otherwise.
 */
const isISRC = (identifier: string): boolean => {
  return /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/i.test(identifier.trim());
};

/**
 * Fetches track data from the backend API.
 * The backend handles the actual communication with the Spotify API.
 * @param identifier A Spotify URL, track ID, or ISRC.
 * @param artistHint An optional artist name to help disambiguate ISRC searches.
 * @returns A promise that resolves to the Spotify track data.
 */
export const fetchTrackData = async (identifier: string, artistHint?: string): Promise<SpotifyTrackData> => {
  console.log(`Fetching data from backend for: "${identifier}" with hint: "${artistHint}"`);

  const requestBody: { spotifyUrlOrId?: string; isrc?: string; artistHint?: string } = {};

  if (isISRC(identifier)) {
    requestBody.isrc = identifier.trim();
  } else {
    requestBody.spotifyUrlOrId = identifier.trim();
  }

  if (artistHint && artistHint.trim() !== '') {
    requestBody.artistHint = artistHint.trim();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/integrations/spotify/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      // The backend provides a user-friendly message in the 'message' field
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    // The backend normalizes the data, but we do a sanity check.
    if (!data.title) {
        throw new Error("Received malformed data from the backend.");
    }

    return data as SpotifyTrackData;
  } catch (error) {
    console.error("Error in fetchTrackData service:", error);
    
    // Check for a network error (server is down or unreachable) and provide a helpful message.
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(
        "Connection Error: Could not reach the backend API at http://localhost:3001. Please ensure the API server is running. Refer to api/README.md for setup instructions."
      );
    }

    // Re-throw other errors to be caught by the component.
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown communication error occurred.");
  }
};

/**
 * Fetches an artist's top tracks from the backend API.
 * @param artistUrlOrId A Spotify Artist URL or ID.
 * @returns A promise that resolves to an array of Spotify track data.
 */
export const fetchArtistTracks = async (artistUrlOrId: string): Promise<SpotifyTrackData[]> => {
    console.log(`Fetching artist tracks from backend for: "${artistUrlOrId}"`);
    try {
        const response = await fetch(`${API_BASE_URL}/integrations/spotify/fetch-artist-tracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ spotifyArtistUrlOrId: artistUrlOrId }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data as SpotifyTrackData[];
    } catch (error) {
        console.error("Error in fetchArtistTracks service:", error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error("Connection Error: Could not reach the backend API. Please ensure the server is running.");
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown communication error occurred.");
    }
};

/**
 * Fetches an artist's entire catalog from the backend API.
 * @param artistUrlOrId A Spotify Artist URL or ID.
 * @returns A promise that resolves to an array of Spotify track data.
 */
export const importArtistCatalog = async (artistUrlOrId: string): Promise<SpotifyTrackData[]> => {
    console.log(`Importing artist catalog from backend for: "${artistUrlOrId}"`);
    try {
        const response = await fetch(`${API_BASE_URL}/integrations/spotify/import-catalog`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ spotifyArtistUrlOrId: artistUrlOrId }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data as SpotifyTrackData[];
    } catch (error) {
        console.error("Error in importArtistCatalog service:", error);
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error(
              "Connection Error: Could not reach the backend API at http://localhost:3001. Please ensure the API server is running. Refer to api/README.md for setup instructions."
            );
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown communication error occurred.");
    }
};