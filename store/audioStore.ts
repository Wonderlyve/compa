import { create } from 'zustand';
import { Audio } from 'expo-av';

type Sermon = {
  id: string;
  title: string;
  preacher: string;
  imageUrl?: string;
  audioUrl: string;
};

interface AudioState {
  currentSermon: Sermon | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  sound: Audio.Sound | null;
  isLoading: boolean;
  isMinimized: boolean;
  
  // Actions
  playSermon: (sermon: Sermon) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  stopPlayback: () => Promise<void>;
  setMinimized: (value: boolean) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentSermon: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  sound: null,
  isLoading: false,
  isMinimized: false,

  playSermon: async (sermon) => {
    const { sound: currentSound } = get();
    set({ isLoading: true });

    try {
      // Unload previous sound if it exists
      if (currentSound) {
        await currentSound.unloadAsync();
      }

      // Load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: sermon.audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            set({
              isPlaying: status.isPlaying,
              position: status.positionMillis,
              duration: status.durationMillis || 0,
            });
          }
        }
      );

      // Set state with new sound and sermon
      set({
        sound: newSound,
        currentSermon: sermon,
        isPlaying: true,
        isLoading: false,
        isMinimized: false,
      });
    } catch (error) {
      console.error('Error playing sermon:', error);
      set({ isLoading: false });
    }
  },

  togglePlayPause: async () => {
    const { sound, isPlaying } = get();
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling play state:', error);
    }
  },

  seekTo: async (position) => {
    const { sound } = get();
    if (!sound) return;

    try {
      await sound.setPositionAsync(position);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  },

  stopPlayback: async () => {
    const { sound } = get();
    if (!sound) return;

    try {
      await sound.stopAsync();
      await sound.unloadAsync();
      set({
        sound: null,
        currentSermon: null,
        isPlaying: false,
        position: 0,
        duration: 0,
      });
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  },

  setMinimized: (value) => {
    set({ isMinimized: value });
  },
}));