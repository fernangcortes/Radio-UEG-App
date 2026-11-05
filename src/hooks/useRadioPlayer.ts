import { useEffect, useRef, useState, useCallback } from 'react';
import { ScheduleProgram } from '../types';

interface UseRadioPlayerOptions {
  streamUrl: string;
  zenoMountId: string;
  activeProgram: ScheduleProgram;
  autoplayOnOpen: boolean;
}

export function useRadioPlayer({
  streamUrl,
  zenoMountId,
  activeProgram,
  autoplayOnOpen,
}: UseRadioPlayerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const userWantedPlayRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [liveTrackTitle, setLiveTrackTitle] = useState<string>('');
  const [metadataSource, setMetadataSource] = useState<'zeno-live' | 'schedule'>('schedule');
  const [reconnectCount, setReconnectCount] = useState(0);

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const attemptReconnect = useCallback(() => {
    if (!userWantedPlayRef.current || !audioRef.current) return;
    clearReconnectTimer();
    setIsReconnecting(true);
    setIsBuffering(true);

    reconnectTimerRef.current = window.setTimeout(() => {
      if (!audioRef.current || !userWantedPlayRef.current) return;
      try {
        audioRef.current.src = streamUrl;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
            setIsReconnecting(false);
            setReconnectCount((c) => c + 1);
          })
          .catch(() => {
            attemptReconnect();
          });
      } catch {
        // ignore
      }
    }, 2200);
  }, [streamUrl]);

  // Initialize HTML5 Audio element without CORS restriction so Zeno 302 redirects play cleanly
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = volume;
    audioRef.current = audio;

    const onPlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setIsReconnecting(false);
    };

    const onWaiting = () => {
      if (userWantedPlayRef.current) {
        setIsBuffering(true);
      }
    };

    const onPause = () => {
      if (!userWantedPlayRef.current) {
        setIsPlaying(false);
        setIsBuffering(false);
      }
    };

    const onStalledOrError = () => {
      if (userWantedPlayRef.current) {
        attemptReconnect();
      }
    };

    const onEnded = () => {
      if (userWantedPlayRef.current) {
        attemptReconnect();
      }
    };

    const onOnline = () => {
      if (userWantedPlayRef.current && audio.paused) {
        attemptReconnect();
      }
    };

    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('stalled', onStalledOrError);
    audio.addEventListener('error', onStalledOrError);
    audio.addEventListener('ended', onEnded);
    window.addEventListener('online', onOnline);

    return () => {
      clearReconnectTimer();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('stalled', onStalledOrError);
      audio.removeEventListener('error', onStalledOrError);
      audio.removeEventListener('ended', onEnded);
      window.removeEventListener('online', onOnline);
      audio.pause();
      audio.src = '';
    };
  }, [attemptReconnect]);

  const playStream = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    userWantedPlayRef.current = true;
    setIsBuffering(true);
    setIsReconnecting(false);

    if (!audio.src || audio.paused) {
      audio.src = streamUrl;
      audio.load();
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsBuffering(false);
      })
      .catch(() => {
        attemptReconnect();
      });
  }, [streamUrl, attemptReconnect]);

  const stopStream = useCallback(() => {
    const audio = audioRef.current;
    userWantedPlayRef.current = false;
    clearReconnectTimer();
    setIsPlaying(false);
    setIsBuffering(false);
    setIsReconnecting(false);
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying || isBuffering || isReconnecting) {
      stopStream();
    } else {
      playStream();
    }
  }, [isPlaying, isBuffering, isReconnecting, stopStream, playStream]);

  // Handle URL query params (?autoplay=1) or user preference
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldAuto = params.get('autoplay') === '1' || autoplayOnOpen;
    if (shouldAuto && !userWantedPlayRef.current) {
      playStream();
    }
  }, [autoplayOnOpen, playStream]);

  // Update volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Subscribe to Zeno.fm SSE live metadata (only shows song title if Butt/Zeno actually sends one)
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let receivedRealMetadata = false;

    if (zenoMountId && typeof EventSource !== 'undefined') {
      try {
        eventSource = new EventSource(
          `https://api.zeno.fm/mounts/metadata/subscribe/${zenoMountId}`
        );
        eventSource.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            const rawTitle = parsed?.streamTitle || parsed?.title;
            if (rawTitle && typeof rawTitle === 'string' && rawTitle.trim().length > 1) {
              receivedRealMetadata = true;
              setLiveTrackTitle(rawTitle.trim());
              setMetadataSource('zeno-live');
            }
          } catch {
            // ignore
          }
        };
      } catch {
        // ignore
      }
    }

    if (!receivedRealMetadata) {
      setLiveTrackTitle('');
      setMetadataSource('schedule');
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [zenoMountId, activeProgram.id]);

  // Web Media Session API
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeProgram.title,
        artist: liveTrackTitle || activeProgram.subtitle,
        album: 'Rádio UEG Educativa • CriaLab|UEG',
        artwork: [
          {
            src: activeProgram.coverUrl,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => playStream());
      navigator.mediaSession.setActionHandler('pause', () => stopStream());
      navigator.mediaSession.setActionHandler('stop', () => stopStream());
    } catch {
      // ignore
    }
  }, [activeProgram, liveTrackTitle, playStream, stopStream]);

  return {
    isPlaying,
    isBuffering,
    isReconnecting,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    liveTrackTitle,
    metadataSource,
    reconnectCount,
    togglePlay,
    playStream,
    stopStream,
  };
}
