
import { User, UserRole, UserStatus, Song, SongStatus, Earning, EarningSource, Platform, WriterRole, Payout, PayoutStatus } from './types';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_CONTRACT_TEMPLATE } from './utils/legalTemplate';

export const MOCK_ADMIN_USER: User = {
  id: 'user-123',
  name: 'Fela Kuti (Admin)',
  email: 'fela.kuti@example.com',
  role: UserRole.ADMIN,
  country: 'Nigeria',
  ipi_cae: '00123456789',
  pro: 'PRS for Music',
  status: UserStatus.ACTIVE,
  payoutDetails: {
    preferredMethod: 'Bank',
    bankName: 'First Bank of Nigeria',
    accountNumber: '1234567890',
    swiftCode: 'FBNINGLA',
  },
};

export const MOCK_ARTIST_USER: User = {
  id: 'user-artist-01',
  name: 'Burna Boy',
  email: 'burna.boy@example.com',
  role: UserRole.ARTIST,
  country: 'Nigeria',
  pro: 'ASCAP',
  status: UserStatus.ACTIVE,
  payoutDetails: {
    preferredMethod: 'Bank',
    bankName: 'First Bank of Nigeria',
    accountNumber: '1234567890',
    swiftCode: 'FBNINGLA',
  },
};


export const MOCK_USERS: User[] = [
  MOCK_ARTIST_USER,
  {
    id: 'user-tems',
    name: 'Tems',
    email: 'tems@example.com',
    role: UserRole.WRITER,
    country: 'Nigeria',
    pro: 'BMI',
    status: UserStatus.ACTIVE,
    payoutDetails: {
      preferredMethod: 'PayPal',
      paypalEmail: 'tems@paypal.com',
    },
  },
  {
    id: uuidv4(),
    name: 'Mavin Records',
    email: 'contact@mavinrecords.com',
    role: UserRole.LABEL,
    country: 'Nigeria',
    pro: 'SESAC',
    status: UserStatus.ACTIVE,
  },
  {
    id: uuidv4(),
    name: 'Wizkid',
    email: 'wizkid@example.com',
    role: UserRole.ARTIST,
    country: 'Nigeria',
    pro: 'SOCAN',
    status: UserStatus.INACTIVE,
  },
    {
    id: 'user-sarkodie',
    name: 'Sarkodie',
    email: 'sarkodie@example.com',
    role: UserRole.ARTIST,
    country: 'Ghana',
    pro: 'SAMRO',
    status: UserStatus.ACTIVE,
    payoutDetails: {
      preferredMethod: 'MoMo',
      momoProvider: 'MTN',
      momoNumber: '233244123456',
    },
  },
  {
    id: uuidv4(),
    name: 'Angélique Kidjo',
    email: 'angelique.kidjo@example.com',
    role: UserRole.WRITER,
    country: 'Benin',
    pro: 'SACEM',
    status: UserStatus.ACTIVE,
  },
  { id: uuidv4(), name: 'Davido', email: 'davido@example.com', role: UserRole.ARTIST, country: 'Nigeria', pro: 'BMI', status: UserStatus.ACTIVE },
  { id: uuidv4(), name: 'Tiwa Savage', email: 'tiwa.savage@example.com', role: UserRole.ARTIST, country: 'Nigeria', pro: 'ASCAP', status: UserStatus.ACTIVE },
  { id: uuidv4(), name: 'Olamide', email: 'olamide@example.com', role: UserRole.LABEL, country: 'Nigeria', pro: 'COSON', status: UserStatus.ACTIVE },
  { id: uuidv4(), name: 'Yemi Alade', email: 'yemi.alade@example.com', role: UserRole.WRITER, country: 'Nigeria', pro: 'BMI', status: UserStatus.INACTIVE },
  { id: uuidv4(), name: 'Shatta Wale', email: 'shatta.wale@example.com', role: UserRole.ARTIST, country: 'Ghana', pro: 'GHAMRO', status: UserStatus.ACTIVE },
  { id: uuidv4(), name: 'Diamond Platnumz', email: 'diamond.platnumz@example.com', role: UserRole.ARTIST, country: 'Tanzania', pro: 'COSOTA', status: UserStatus.ACTIVE },
];

export const MOCK_PENDING_SONGS: Song[] = [
    {
        id: 'song-pending-1',
        ownerUserId: 'user-artist-01',
        ownerName: 'Burna Boy',
        title: 'Gbona',
        artists: ['Burna Boy'],
        duration_ms: 185000,
        genre: 'Afrobeats',
        isrc: 'NG-ABC-24-11111',
        cover_art_url: 'https://picsum.photos/seed/gbona/400',
        status: SongStatus.PENDING,
        available_for_sync: true,
        mood_tags: ['Confident', 'Groovy'],
        writers: [
            { id: 'w1', name: 'Damini Ogulu', ipi_cae: '123456789', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'PRS for Music' }
        ],
    },
    {
        id: 'song-pending-2',
        ownerUserId: 'user-tems',
        ownerName: 'Tems',
        title: 'Free Mind',
        artists: ['Tems'],
        duration_ms: 220000,
        genre: 'R&B',
        isrc: 'NG-ABC-24-22222',
        cover_art_url: 'https://picsum.photos/seed/freemind/400',
        status: SongStatus.PENDING,
        available_for_sync: false,
        mood_tags: ['Introspective', 'Soulful'],
        writers: [
            { id: 'w2', name: 'Temilade Openiyi', ipi_cae: '987654321', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'BMI' }
        ],
    },
    {
        id: 'song-pending-3',
        ownerUserId: 'user-sarkodie',
        ownerName: 'Sarkodie',
        title: 'Adonai',
        artists: ['Sarkodie', 'Castro'],
        duration_ms: 240000,
        genre: 'Highlife',
        isrc: 'GH-XYZ-24-33333',
        cover_art_url: 'https://picsum.photos/seed/adonai/400',
        status: SongStatus.PENDING,
        available_for_sync: true,
        mood_tags: ['Inspirational', 'Upbeat'],
        writers: [
            { id: 'w3a', name: 'Michael Owusu Addo', ipi_cae: '112233445', role: WriterRole.COMPOSER_AUTHOR, split_percent: 50, pro: 'GHAMRO' },
            { id: 'w3b', name: 'Theophilus Tagoe', ipi_cae: '554433221', role: WriterRole.COMPOSER, split_percent: 50, pro: 'GHAMRO' }
        ],
    },
    {
        id: 'song-pending-4',
        ownerUserId: 'user-wizkid',
        ownerName: 'Wizkid',
        title: 'Essence',
        artists: ['Wizkid', 'Tems'],
        duration_ms: 248000,
        genre: 'Afrobeats',
        isrc: 'NG-WIZ-21-00001',
        cover_art_url: 'https://picsum.photos/seed/essence/400',
        status: SongStatus.PENDING,
        available_for_sync: true,
        mood_tags: ['Smooth', 'Vibey', 'Summer'],
        writers: [
            { id: 'w4a', name: 'Ayodeji Balogun', ipi_cae: '223344556', role: WriterRole.COMPOSER_AUTHOR, split_percent: 50, pro: 'BMI' },
            { id: 'w4b', name: 'Temilade Openiyi', ipi_cae: '987654321', role: WriterRole.COMPOSER, split_percent: 50, pro: 'BMI' }
        ],
    },
    {
        id: 'song-pending-5',
        ownerUserId: 'user-mavin',
        ownerName: 'Mavin Records',
        title: 'Overloading (OVERDOSE)',
        artists: ['Mavins', 'Crayon', 'Ayra Starr'],
        duration_ms: 200000,
        genre: 'Amapiano',
        isrc: 'NG-MAV-22-00123',
        cover_art_url: 'https://picsum.photos/seed/overdose/400',
        status: SongStatus.PENDING,
        available_for_sync: true,
        mood_tags: ['Feel-good', 'Dance', 'Party'],
        writers: [
            { id: 'w5a', name: 'Don Jazzy', ipi_cae: '334455667', role: WriterRole.COMPOSER, split_percent: 40, pro: 'COSON' },
            { id: 'w5b', name: 'Oyinkansola Sarah Aderibigbe', ipi_cae: '445566778', role: WriterRole.COMPOSER_AUTHOR, split_percent: 30, pro: 'COSON' },
            { id: 'w5c', name: 'Charles Chibueze Chukwu', ipi_cae: '556677889', role: WriterRole.COMPOSER_AUTHOR, split_percent: 30, pro: 'COSON' },
        ],
    },
    { id: 'song-pending-6', ownerUserId: 'user-artist-01', ownerName: 'Burna Boy', title: 'Last Last', artists: ['Burna Boy'], duration_ms: 172000, genre: 'Afrobeats', isrc: 'US-ATL-22-01234', cover_art_url: 'https://picsum.photos/seed/lastlast/400', status: SongStatus.PENDING, available_for_sync: true, mood_tags: ['Heartbreak', 'Groovy', 'Reflective'], writers: [{ id: 'w6', name: 'Damini Ogulu', ipi_cae: '123456789', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'PRS for Music' }] },
    { id: 'song-pending-7', ownerUserId: 'user-sarkodie', ownerName: 'Sarkodie', title: 'Non-Living Thing', artists: ['Sarkodie', 'Oxlade'], duration_ms: 225000, genre: 'Hip Hop', isrc: 'GH-XYZ-21-98765', cover_art_url: 'https://picsum.photos/seed/nonliving/400', status: SongStatus.PENDING, available_for_sync: true, mood_tags: ['Emotional', 'Storytelling', 'Smooth'], writers: [{ id: 'w7', name: 'Michael Owusu Addo', ipi_cae: '112233445', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'GHAMRO' }] },
    { id: 'song-pending-8', ownerUserId: 'user-angelique', ownerName: 'Angélique Kidjo', title: 'Agolo', artists: ['Angélique Kidjo'], duration_ms: 215000, genre: 'World', isrc: 'FR-ABC-94-12345', cover_art_url: 'https://picsum.photos/seed/agolo/400', status: SongStatus.PENDING, available_for_sync: true, mood_tags: ['Classic', 'Energetic', 'African'], writers: [{ id: 'w8', name: 'Angélique Kidjo', ipi_cae: '667788990', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'SACEM' }] },
    { id: 'song-pending-9', ownerUserId: 'user-tems', ownerName: 'Tems', title: 'Damages', artists: ['Tems'], duration_ms: 170000, genre: 'R&B', isrc: 'NG-TEM-20-00001', cover_art_url: 'https://picsum.photos/seed/damages/400', status: SongStatus.PENDING, available_for_sync: true, mood_tags: ['Confident', 'Chill', 'Empowering'], writers: [{ id: 'w9', name: 'Temilade Openiyi', ipi_cae: '987654321', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'BMI' }] },
    { id: 'song-pending-10', ownerUserId: 'user-mavin', ownerName: 'Mavin Records', title: 'Dorobucci', artists: ['Mavins'], duration_ms: 230000, genre: 'Afrobeats', isrc: 'NG-MAV-14-00001', cover_art_url: 'https://picsum.photos/seed/dorobucci/400', status: SongStatus.PENDING, available_for_sync: false, mood_tags: ['Anthem', 'Party', 'Classic'], writers: [{ id: 'w10', name: 'Don Jazzy', ipi_cae: '334455667', role: WriterRole.COMPOSER, split_percent: 100, pro: 'COSON' }] },
    { id: 'song-pending-11', ownerUserId: 'user-wizkid', ownerName: 'Wizkid', title: 'Ojuelegba', artists: ['Wizkid'], duration_ms: 218000, genre: 'Afrobeats', isrc: 'NG-WIZ-14-00111', cover_art_url: 'https://picsum.photos/seed/ojuelegba/400', status: SongStatus.PENDING, available_for_sync: true, mood_tags: ['Inspirational', 'Hustle', 'Storytelling'], writers: [{ id: 'w11', name: 'Ayodeji Balogun', ipi_cae: '223344556', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'BMI' }] },
    { id: 'song-pending-12', ownerUserId: 'user-artist-01', ownerName: 'Burna Boy', title: 'On The Low', artists: ['Burna Boy'], duration_ms: 185000, genre: 'Afrobeats', isrc: 'US-ATL-18-12345', cover_art_url: 'https://picsum.photos/seed/onthelow/400', status: SongStatus.PENDING, available_for_sync: true, mood_tags: ['Romantic', 'Smooth', 'Dancehall'], writers: [{ id: 'w12', name: 'Damini Ogulu', ipi_cae: '123456789', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'PRS for Music' }] },
    { id: 'song-pending-13', ownerUserId: 'user-tems', ownerName: 'Tems', title: 'Try Me', artists: ['Tems'], duration_ms: 198000, genre: 'R&B', isrc: 'NG-TEM-19-00001', cover_art_url: 'https://picsum.photos/seed/tryme/400', status: SongStatus.PENDING, available_for_sync: true, mood_tags: ['Rebellious', 'Powerful', 'Soulful'], writers: [{ id: 'w13', name: 'Temilade Openiyi', ipi_cae: '987654321', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'BMI' }] },
    { id: 'song-pending-14', ownerUserId: 'user-sarkodie', ownerName: 'Sarkodie', title: 'U Go Kill Me', artists: ['Sarkodie', 'E.L.'], duration_ms: 245000, genre: 'Hip Hop', isrc: 'GH-XYZ-10-00001', cover_art_url: 'https://picsum.photos/seed/ugokillme/400', status: SongStatus.PENDING, available_for_sync: true, mood_tags: ['Azonto', 'Classic', 'Dance'], writers: [{ id: 'w14', name: 'Michael Owusu Addo', ipi_cae: '112233445', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'GHAMRO' }] },
    { id: 'song-pending-15', ownerUserId: 'user-angelique', ownerName: 'Angélique Kidjo', title: 'Wombo Lombo', artists: ['Angélique Kidjo'], duration_ms: 223000, genre: 'World', isrc: 'FR-ABC-96-54321', cover_art_url: 'https://picsum.photos/seed/wombolombo/400', status: SongStatus.PENDING, available_for_sync: false, mood_tags: ['Joyful', 'Dance', 'Celebratory'], writers: [{ id: 'w15', name: 'Angélique Kidjo', ipi_cae: '667788990', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'SACEM' }] }
];

export const MOCK_REGISTERED_SONGS: Song[] = [
  {
    id: 'song-reg-1',
    ownerUserId: 'user-artist-01',
    ownerName: 'AfroBeats Collective',
    title: 'Lagos Midnight',
    artists: ['AfroBeats Collective'],
    duration_ms: 180000,
    genre: 'Afrobeats',
    isrc: 'NG-ABC-24-00001',
    cover_art_url: 'https://picsum.photos/seed/lagos/400',
    status: SongStatus.REGISTERED,
    available_for_sync: true,
    mood_tags: ['Energetic', 'Vibrant', 'Nightlife'],
    writers: [
        { id: 'w-lm-1', name: 'Fela Kuti', ipi_cae: '111', role: WriterRole.COMPOSER_AUTHOR, split_percent: 100, pro: 'PRS for Music'}
    ],
    revisionHistory: [
        { timestamp: '2024-07-20T10:00:00Z', userId: 'admin-01', userName: 'Fela Kuti (Admin)', notes: 'Song status updated to REGISTERED.' },
        { timestamp: '2024-07-19T14:30:00Z', userId: 'user-afrobeats', userName: 'AfroBeats Collective', notes: 'Song submitted for review.' },
    ]
  },
  {
    id: 'song-reg-2',
    ownerUserId: 'u1',
    ownerName: 'Stellar Fusion',
    title: 'Cosmic Drift',
    artists: ['Stellar Fusion'],
    duration_ms: 210000,
    genre: 'Electronic',
    isrc: 'GB-LFP-24-12345',
    cover_art_url: 'https://picsum.photos/seed/cosmic/400',
    status: SongStatus.REGISTERED,
    available_for_sync: true,
    mood_tags: ['Uplifting', 'Driving', 'Synthwave'],
    writers: [],
  },
   {
    id: 'song-reg-3',
    ownerUserId: 'u3',
    ownerName: 'Einaudi Reworks',
    title: 'Quiet Reflection',
    artists: ['Einaudi Reworks'],
    duration_ms: 240000,
    genre: 'Classical',
    isrc: 'DE-CDE-24-54321',
    cover_art_url: 'https://picsum.photos/seed/quiet/400',
    status: SongStatus.REGISTERED,
    available_for_sync: false,
    mood_tags: ['Pensive', 'Emotional', 'Cinematic'],
    writers: [],
  },
  { id: 'song-reg-4', ownerUserId: 'user-artist-01', ownerName: 'Burna Boy', title: 'Ye', artists: ['Burna Boy'], duration_ms: 221000, genre: 'Afrobeats', isrc: 'NG-BUR-18-00001', cover_art_url: 'https://picsum.photos/seed/ye/400', status: SongStatus.REGISTERED, available_for_sync: true, mood_tags: ['Anthem', 'Reflective'], writers: [] },
  { id: 'song-reg-5', ownerUserId: 'user-wizkid', ownerName: 'Wizkid', title: 'Joro', artists: ['Wizkid'], duration_ms: 224000, genre: 'Afrobeats', isrc: 'NG-WIZ-19-00002', cover_art_url: 'https://picsum.photos/seed/joro/400', status: SongStatus.REGISTERED, available_for_sync: true, mood_tags: ['Romantic', 'Smooth'], writers: [] },
  { id: 'song-reg-6', ownerUserId: 'user-davido', ownerName: 'Davido', title: 'Fall', artists: ['Davido'], duration_ms: 240000, genre: 'Afrobeats', isrc: 'NG-DAV-17-00001', cover_art_url: 'https://picsum.photos/seed/fall/400', status: SongStatus.REGISTERED, available_for_sync: true, mood_tags: ['Love', 'Catchy'], writers: [] },
  { id: 'song-reg-7', ownerUserId: 'user-tiwa', ownerName: 'Tiwa Savage', title: 'All Over', artists: ['Tiwa Savage'], duration_ms: 212000, genre: 'Afrobeats', isrc: 'NG-TIW-17-00003', cover_art_url: 'https://picsum.photos/seed/allover/400', status: SongStatus.REGISTERED, available_for_sync: false, mood_tags: ['Energetic', 'Dance'], writers: [] },
  { id: 'song-reg-8', ownerUserId: 'user-yemi', ownerName: 'Yemi Alade', title: 'Johnny', artists: ['Yemi Alade'], duration_ms: 236000, genre: 'Afrobeats', isrc: 'NG-YEM-13-00001', cover_art_url: 'https://picsum.photos/seed/johnny/400', status: SongStatus.REGISTERED, available_for_sync: true, mood_tags: ['Storytelling', 'Upbeat'], writers: [] },
  { id: 'song-reg-9', ownerUserId: 'user-shatta', ownerName: 'Shatta Wale', title: 'My Level', artists: ['Shatta Wale'], duration_ms: 198000, genre: 'Dancehall', isrc: 'GH-SHA-18-00001', cover_art_url: 'https://picsum.photos/seed/mylevel/400', status: SongStatus.REGISTERED, available_for_sync: true, mood_tags: ['Inspirational', 'Celebratory'], writers: [] },
  { id: 'song-reg-10', ownerUserId: 'user-diamond', ownerName: 'Diamond Platnumz', title: 'Tetema', artists: ['Diamond Platnumz', 'Rayvanny'], duration_ms: 196000, genre: 'Bongo Flava', isrc: 'TZ-DIA-19-00001', cover_art_url: 'https://picsum.photos/seed/tetema/400', status: SongStatus.REGISTERED, available_for_sync: true, mood_tags: ['Dance', 'Party'], writers: [] },
  { id: 'song-reg-11', ownerUserId: 'user-sarkodie', ownerName: 'Sarkodie', title: 'Pain Killer', artists: ['Sarkodie', 'Runtown'], duration_ms: 220000, genre: 'Hip Hop', isrc: 'GH-SAR-17-00002', cover_art_url: 'https://picsum.photos/seed/painkiller/400', status: SongStatus.REGISTERED, available_for_sync: false, mood_tags: ['Smooth', 'Melodic'], writers: [] },
  { id: 'song-reg-12', ownerUserId: 'user-tems', ownerName: 'Tems', title: 'Higher', artists: ['Tems'], duration_ms: 195000, genre: 'R&B', isrc: 'NG-TEM-20-00002', cover_art_url: 'https://picsum.photos/seed/higher/400', status: SongStatus.REGISTERED, available_for_sync: true, mood_tags: ['Soulful', 'Emotional'], writers: [] },
];

export const MOCK_SONG_EARNINGS: Earning[] = [
  { id: uuidv4(), songId: 'song-reg-1', amount: 250.75, platform: 'Spotify', source: EarningSource.PERFORMANCE, date: '2024-06-01' },
  { id: uuidv4(), songId: 'song-reg-1', amount: 120.00, platform: 'Apple Music', source: EarningSource.MECHANICAL, date: '2024-06-01' },
  { id: uuidv4(), songId: 'song-reg-2', amount: 310.50, platform: 'YouTube', source: EarningSource.PERFORMANCE, date: '2024-06-05' },
  { id: uuidv4(), songId: 'song-reg-2', amount: 55.20, platform: 'Tidal', source: EarningSource.NEIGHBOURING_RIGHTS, date: '2024-06-08' },
  { id: uuidv4(), songId: 'song-reg-3', amount: 450.00, platform: 'Amazon Music', source: EarningSource.PERFORMANCE, date: '2024-06-10' },
  { id: uuidv4(), songId: 'song-reg-1', amount: 280.40, platform: 'Spotify', source: EarningSource.PERFORMANCE, date: '2024-07-01' },
];

export const MOCK_PAYOUTS: Payout[] = [
  // Existing Data
  { id: 'po1', userId: 'user-artist-01', userName: 'Burna Boy', amount: 1250.50, status: PayoutStatus.PAID, requestedDate: '2024-06-15T10:00:00Z', processedDate: '2024-06-18T14:00:00Z', payoutDetails: { preferredMethod: 'Bank', bankName: 'First Bank', accountNumber: '12345', swiftCode: 'FBNI' } },
  { id: 'po2', userId: 'user-tems', userName: 'Tems', amount: 800.00, status: PayoutStatus.PENDING, requestedDate: '2024-07-22T09:30:00Z', payoutDetails: { preferredMethod: 'PayPal', paypalEmail: 'tems@paypal.com' } },
  { id: 'po3', userId: 'user-sarkodie', userName: 'Sarkodie', amount: 2100.00, status: PayoutStatus.PENDING, requestedDate: '2024-07-21T18:00:00Z', payoutDetails: { preferredMethod: 'MoMo', momoProvider: 'MTN', momoNumber: '233244123456' } },
  { id: 'po4', userId: 'user-artist-01', userName: 'Burna Boy', amount: 700.00, status: PayoutStatus.REJECTED, requestedDate: '2024-05-10T11:00:00Z', processedDate: '2024-05-11T16:00:00Z', payoutDetails: { preferredMethod: 'Bank', bankName: 'First Bank', accountNumber: '12345', swiftCode: 'FBNI' }, rejectionReason: 'Incorrect SWIFT code provided. Please update your profile and resubmit.' },
  
  // Expanded Data for Pagination
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `po-pending-${i}`,
    userId: MOCK_USERS[i % 4].id,
    userName: MOCK_USERS[i % 4].name,
    amount: parseFloat((Math.random() * 1000 + 200).toFixed(2)),
    status: PayoutStatus.PENDING,
    requestedDate: new Date(Date.now() - (i + 1) * 24 * 3600 * 1000).toISOString(),
    payoutDetails: MOCK_USERS[i % 4].payoutDetails || { preferredMethod: 'Bank', bankName: 'Mock Bank' },
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `po-approved-${i}`,
    userId: MOCK_USERS[i % 4].id,
    userName: MOCK_USERS[i % 4].name,
    amount: parseFloat((Math.random() * 1500 + 300).toFixed(2)),
    status: PayoutStatus.APPROVED,
    requestedDate: new Date(Date.now() - (i + 15) * 24 * 3600 * 1000).toISOString(),
    processedDate: new Date(Date.now() - (i + 10) * 24 * 3600 * 1000).toISOString(),
    payoutDetails: MOCK_USERS[i % 4].payoutDetails || { preferredMethod: 'PayPal', paypalEmail: 'mock@test.com' },
  }))
];


const addContractTextToSong = (song: Song): Song => {
    const submissionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const writerNames = song.writers.map(w => w.name).join(', ') || 'N/A';
    const artistNames = song.artists.join(', ') || 'N/A';
    const submitterName = song.ownerName || 'N/A';
    const mockIpAddress = `192.168.1.${Math.floor(Math.random() * 254) + 1} (Simulated IP)`;

    const contractText = DEFAULT_CONTRACT_TEMPLATE
        .replace(/\[SONG_TITLE\]/g, song.title)
        .replace(/\[ARTIST_NAMES\]/g, artistNames)
        .replace(/\[WRITER_NAMES\]/g, writerNames)
        .replace(/\[SUBMITTER_NAME\]/g, submitterName)
        .replace(/\[SUBMISSION_DATE\]/g, submissionDate)
        .replace(/\[SIGNING_IP_ADDRESS\]/g, mockIpAddress);
    
    return { ...song, contract_text: contractText };
};

MOCK_PENDING_SONGS.forEach((song, index) => {
    MOCK_PENDING_SONGS[index] = addContractTextToSong(song);
});

MOCK_REGISTERED_SONGS.forEach((song, index) => {
    MOCK_REGISTERED_SONGS[index] = addContractTextToSong(song);
});
