import { useState, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Platform } from 'react-native';

export type AudioStatus = {
  isLoaded: boolean;
  isBuffering: boolean;
  isPlaying: boolean;
  position: number;
  duration: number;
  isMuted: boolean;
  volume: number;
  isError: boolean;
  errorMessage?: string;
};

const initialStatus: AudioStatus = {
  isLoaded: false,
  isBuffering: false,
  isPlaying: false,
  position: 0,
  duration: 0,
  isMuted: false,
  volume: 1.0,
  isError: false,
};

export default function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState<AudioStatus>(initialStatus);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Handle status updates from the Audio object
  const updateStatus = (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        setStatus({
          ...initialStatus,
          isError: true,
          errorMessage: playbackStatus.error,
        });
      }
      return;
    }

    setStatus({
      isLoaded: true,
      isBuffering: playbackStatus.isBuffering || false,
      isPlaying: playbackStatus.isPlaying,
      position: playbackStatus.positionMillis,
      duration: playbackStatus.durationMillis || 0,
      isMuted: playbackStatus.isMuted || false,
      volume: playbackStatus.volume,
      isError: false,
    });
  };

  // Load an audio file
  const loadAudio = async (uri: string) => {
    try {
      // Unload any existing audio
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        updateStatus
      );

      setSound(newSound);
      setAudioUrl(uri);
    } catch (error) {
      setStatus({
        ...initialStatus,
        isError: true,
        errorMessage: (error as Error).message,
      });
    }
  };

  // Play the loaded audio
  const play = async () => {
    if (!sound) return;
    try {
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Pause the audio
  const pause = async () => {
    if (!sound) return;
    try {
      await sound.pauseAsync();
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  // Seek to a specific position
  const seekTo = async (position: number) => {
    if (!sound) return;
    try {
      await sound.setPositionAsync(position);
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  // Set volume
  const setVolume = async (volume: number) => {
    if (!sound) return;
    try {
      await sound.setVolumeAsync(Math.max(0, Math.min(1, volume)));
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  // Toggle mute
  const toggleMute = async () => {
    if (!sound) return;
    try {
      await sound.setIsMutedAsync(!status.isMuted);
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  // Stop and unload audio
  const stopAudio = async () => {
    if (!sound) return;
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setAudioUrl(null);
      setStatus(initialStatus);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (!sound) return;
    if (status.isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  // Set up audio session
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error setting audio mode:', error);
      }
    };

    setupAudio();

    // Cleanup on unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return {
    sound,
    status,
    audioUrl,
    loadAudio,
    play,
    pause,
    seekTo,
    setVolume,
    toggleMute,
    stopAudio,
    togglePlayPause,
  };
}