

import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Song, SongStatus, Revision, UserRole } from '../types';
import { MOCK_PENDING_SONGS, MOCK_REGISTERED_SONGS } from '../mockData';
import { useAuth } from '../hooks/useAuth';

interface SongContextType {
  pendingSongs: Song[];
  registeredSongs: Song[];
  approveSong: (songId: string) => void;
  rejectSong: (songId: string, reason: string) => void;
  addSong: (song: Song) => void;
  getUserSongs: (userId: string) => { pending: Song[]; registered: Song[] };
  getSongById: (songId: string) => Song | undefined;
  updateSong: (songId: string, updates: Partial<Song>, revisionNote: string) => void;
  bulkAddRegisteredSongs: (songs: Song[]) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingSongs, setPendingSongs] = useState<Song[]>(MOCK_PENDING_SONGS);
  const [registeredSongs, setRegisteredSongs] = useState<Song[]>(MOCK_REGISTERED_SONGS);
  const { user } = useAuth(); // We need the admin user for revision history

  const addSong = (song: Song) => {
    setPendingSongs(prev => [...prev, song]);
  };
  
  const bulkAddRegisteredSongs = (songs: Song[]) => {
    setRegisteredSongs(prev => [...prev, ...songs]);
  };

  const approveSong = (songId: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;

    const songToApprove = pendingSongs.find(s => s.id === songId);
    if (!songToApprove) return;
    
    const newRevision: Revision = {
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        notes: 'Song status updated to REGISTERED.'
    };

    const updatedSong = {
      ...songToApprove,
      status: SongStatus.REGISTERED,
      revisionHistory: [...(songToApprove.revisionHistory || []), newRevision],
    };
    
    setRegisteredSongs(prev => [...prev, updatedSong]);
    setPendingSongs(prev => prev.filter(s => s.id !== songId));
  };

  const rejectSong = (songId: string, reason: string) => {
    if (!user || user.role !== UserRole.ADMIN) return;

    const songToReject = pendingSongs.find(s => s.id === songId);
    if (!songToReject) return;
    
    const newRevision: Revision = {
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        notes: `Song status updated to REJECTED. Reason: ${reason}`
    };

    const updatedSong = {
        ...songToReject,
        status: SongStatus.REJECTED,
        rejection_reason: reason,
        revisionHistory: [...(songToReject.revisionHistory || []), newRevision]
    };
    
    // In a real app, this might go to a different list. For now, we just remove it from pending.
    console.log("Rejected song, moving out of pending list:", updatedSong);
    setPendingSongs(prev => prev.filter(s => s.id !== songId));
  };

  const getUserSongs = useMemo(() => (userId: string) => {
    return {
      pending: pendingSongs.filter(s => s.ownerUserId === userId),
      registered: registeredSongs.filter(s => s.ownerUserId === userId)
    };
  }, [pendingSongs, registeredSongs]);

  const getSongById = useCallback((songId: string): Song | undefined => {
    return [...pendingSongs, ...registeredSongs].find(s => s.id === songId);
  }, [pendingSongs, registeredSongs]);

  const updateSong = useCallback((songId: string, updates: Partial<Song>, revisionNote: string) => {
    if (!user || user.role !== UserRole.ADMIN) {
      console.error("Unauthorized attempt to update song.");
      return;
    }

    // Automatically create a new revision entry for the audit trail.
    // This ensures every admin change is logged with a timestamp, the admin's details,
    // and a descriptive note of what was changed.
    const newRevision: Revision = {
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      notes: revisionNote,
    };

    const updater = (songs: Song[]) => songs.map(s => {
      if (s.id === songId) {
        // Apply the updates and append the new revision to the history.
        return {
          ...s,
          ...updates,
          revisionHistory: [...(s.revisionHistory || []), newRevision],
        };
      }
      return s;
    });

    setPendingSongs(updater);
    setRegisteredSongs(updater);
  }, [user]);

  return (
    <SongContext.Provider value={{ pendingSongs, registeredSongs, approveSong, rejectSong, addSong, getUserSongs, getSongById, updateSong, bulkAddRegisteredSongs }}>
      {children}
    </SongContext.Provider>
  );
};

export const useSongs = (): SongContextType => {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSongs must be used within a SongProvider');
  }
  return context;
};