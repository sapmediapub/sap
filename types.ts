export enum UserRole {
  ARTIST = 'ARTIST',
  LABEL = 'LABEL',
  WRITER = 'WRITER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SongStatus {
  PENDING = 'PENDING',
  REGISTERED = 'REGISTERED',
  REJECTED = 'REJECTED',
}

export enum WriterRole {
  COMPOSER_AUTHOR = 'CA',
  COMPOSER = 'CO',
  PUBLISHER_ADMIN = 'PA',
}

export enum EarningSource {
  MECHANICAL = 'Mechanical',
  PERFORMANCE = 'Performance',
  NEIGHBOURING_RIGHTS = 'Neighbouring',
}

export type Platform = 'Spotify' | 'Apple Music' | 'YouTube' | 'Tidal' | 'Amazon Music' | 'Deezer';
export type PaymentMethod = 'Bank' | 'PayPal' | 'MoMo';

export interface Earning {
  id: string;
  songId: string;
  amount: number;
  platform: Platform;
  source: EarningSource;
  date: string; // YYYY-MM-DD
}

export interface PayoutDetails {
  preferredMethod?: PaymentMethod;
  bankName?: string;
  accountNumber?: string;
  swiftCode?: string;
  paypalEmail?: string;
  momoProvider?: string;
  momoNumber?: string;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  country: string;
  ipi_cae?: string;
  pro?: string;
  status: UserStatus;
  payoutDetails?: PayoutDetails;
}

export interface Writer {
  id: string;
  name: string;
  ipi_cae: string;
  role: WriterRole;
  split_percent: number;
  pro: string;
}

export interface Revision {
  timestamp: string; // ISO 8601 date string
  userId: string;
  userName: string;
  notes: string; // e.g., "Approved song", "Updated ISRC"
}

export interface Song {
  id: string;
  ownerUserId: string;
  ownerName?: string; // Added to show who submitted the song
  title: string;
  duration_ms: number;
  genre: string;
  isrc: string;
  cover_art_url: string;
  spotify_track_id?: string;
  album?: string;
  release_date?: string;
  status: SongStatus;
  available_for_sync: boolean;
  mood_tags: string[];
  tempo?: number;
  writers: Writer[];
  artists: string[];
  preview_url?: string | null;
  rejection_reason?: string; // Added for rejection feedback
  revisionHistory?: Revision[];
  contract_text?: string;
}

export interface SpotifyTrackData {
  title: string;
  artists: string[];
  duration_ms: number;
  isrc: string;
  album: string;
  release_date: string;
  preview_url: string | null;
  spotify_track_id: string;
  spotify_url: string;
  cover_art_url: string;
}