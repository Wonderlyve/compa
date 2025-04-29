import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAudioStore } from '@/store/audioStore';

type SermonCardProps = {
  id: string;
  title: string;
  preacher: string;
  imageUrl?: string;
  audioUrl: string;
  compact?: boolean;
};

export default function SermonCard({ 
  id, 
  title, 
  preacher, 
  imageUrl, 
  audioUrl,
  compact = false
}: SermonCardProps) {
  const { playSermon, currentSermon, isPlaying, togglePlayPause } = useAudioStore();
  
  const isCurrentlyPlaying = currentSermon?.id === id && isPlaying;

  const handleNavigate = () => {
    router.push({
      pathname: '/(tabs)/sermon/[id]',
      params: { id }
    });
  };

  const handlePlay = (e: any) => {
    e.stopPropagation();
    if (currentSermon?.id === id) {
      togglePlayPause();
    } else {
      playSermon({
        id,
        title,
        preacher,
        imageUrl,
        audioUrl
      });
    }
  };

  const placeholderImage = 'https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        compact ? styles.compactContainer : {}
      ]} 
      onPress={handleNavigate}
    >
      <Image
        source={{ uri: imageUrl || placeholderImage }}
        style={[
          styles.image,
          compact ? styles.compactImage : {}
        ]}
        contentFit="cover"
        transition={200}
      />
      
      <View style={[
        styles.content,
        compact ? styles.compactContent : {}
      ]}>
        <View style={styles.textContainer}>
          <Text 
            style={styles.title}
            numberOfLines={compact ? 1 : 2}
          >
            {title}
          </Text>
          <Text style={styles.preacher}>{preacher}</Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.playButton,
            isCurrentlyPlaying ? styles.playingButton : {}
          ]}
          onPress={handlePlay}
        >
          <Play size={compact ? 16 : 20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  compactContainer: {
    flexDirection: 'row',
    height: 75,
  },
  image: {
    height: 110,
    width: '100%',
  },
  compactImage: {
    height: '100%',
    width: 88,
  },
  content: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactContent: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  preacher: {
    color: '#B3B3B3',
    fontSize: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  playingButton: {
    backgroundColor: '#4CAF50',
  },
});