import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useAudioStore } from '@/store/audioStore';

const { width } = Dimensions.get('window');

const MIN_PLAYER_HEIGHT = 60;
const MAX_PLAYER_HEIGHT = 250;

export default function AudioPlayer() {
  const { 
    currentSermon, 
    isPlaying, 
    position, 
    duration,
    isMinimized,
    togglePlayPause,
    seekTo,
    setMinimized
  } = useAudioStore();

  const [playerHeight] = useState(new Animated.Value(MIN_PLAYER_HEIGHT));
  const [progressWidth, setProgressWidth] = useState(0);

  // Update progress width based on position and duration
  useEffect(() => {
    if (duration > 0) {
      const progress = (position / duration) * 100;
      setProgressWidth(progress);
    } else {
      setProgressWidth(0);
    }
  }, [position, duration]);

  // Animate player height based on minimized state
  useEffect(() => {
    Animated.timing(playerHeight, {
      toValue: isMinimized ? MIN_PLAYER_HEIGHT : MAX_PLAYER_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isMinimized, playerHeight]);

  if (!currentSermon) return null;

  // Format time in mm:ss
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle seeking when user taps on progress bar
  const handleSeek = (event: any) => {
    const { locationX } = event.nativeEvent;
    const percent = locationX / (width - 32); // 32 is padding
    const newPosition = percent * duration;
    seekTo(newPosition);
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { height: playerHeight }
      ]}
    >
      <TouchableOpacity 
        style={styles.minimizedHeader}
        onPress={() => setMinimized(!isMinimized)}
      >
        <View style={styles.minimizedContent}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSermon.title}
          </Text>
          <Text style={styles.preacher} numberOfLines={1}>
            {currentSermon.preacher}
          </Text>
        </View>
        
        <TouchableOpacity onPress={togglePlayPause}>
          <View style={styles.playButton}>
            {isPlaying ? (
              <Pause size={24} color="#FFF" />
            ) : (
              <Play size={24} color="#FFF" />
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>

      {!isMinimized && (
        <View style={styles.expandedContent}>
          {currentSermon.imageUrl && (
            <Image
              source={{ uri: currentSermon.imageUrl }}
              style={styles.sermonImage}
              contentFit="cover"
            />
          )}
          
          <View style={styles.controls}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.progressBar}
              onPress={handleSeek}
              activeOpacity={1}
            >
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressWidth}%` }
                ]} 
              />
            </TouchableOpacity>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.controlButton}>
                <SkipBack size={24} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.mainButton}
                onPress={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause size={28} color="#FFF" />
                ) : (
                  <Play size={28} color="#FFF" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton}>
                <SkipForward size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Progress indicator for minimized state */}
      {isMinimized && (
        <View style={styles.miniProgress}>
          <View 
            style={[
              styles.miniProgressFill, 
              { width: `${progressWidth}%` }
            ]} 
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70, // Space for tab bar
    left: 0,
    right: 0,
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  minimizedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minimizedContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  preacher: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedContent: {
    marginTop: 16,
  },
  sermonImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 16,
  },
  controls: {
    marginTop: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#4A4A4A',
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  miniProgress: {
    height: 2,
    backgroundColor: '#4A4A4A',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  miniProgressFill: {
    height: 2,
    backgroundColor: '#FF6B6B',
  },
});