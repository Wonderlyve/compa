import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Play, Pause } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { supabase } from '@/lib/supabase';

type RadioStream = {
  id: string;
  title: string;
  description: string | null;
  stream_url: string;
  image_url: string | null;
};

export default function RadioScreen() {
  const [radioStreams, setRadioStreams] = useState<RadioStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRadioStreams() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('radio_streams')
          .select('*')
          .eq('is_active', true);
          
        if (error) throw error;
        
        setRadioStreams(data);
      } catch (error) {
        console.error('Error fetching radio streams:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRadioStreams();
    
    // Clean up sound when component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Placeholder for demo
  const demoRadioStream = {
    id: '1',
    title: 'Compa Radio En Direct',
    description: 'Écoutez notre radio en direct 24/7 avec des prédications inspirantes, de la musique chrétienne et des enseignements bibliques.',
    stream_url: 'https://example.com/radio-stream',
    image_url: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  };

  const streamToShow = radioStreams.length > 0 ? radioStreams[0] : demoRadioStream;

  const handlePlayPause = async () => {
    try {
      if (sound && isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        return;
      }
      
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
        return;
      }
      
      // If no sound is loaded, load and play
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: streamToShow.stream_url },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
          }
        }
      );
      
      setSound(newSound);
      setCurrentStreamId(streamToShow.id);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing radio stream:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Radio En Direct</Text>
      
      <View style={styles.radioCard}>
        <Image
          source={{ uri: streamToShow.image_url || 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }}
          style={styles.radioImage}
          contentFit="cover"
        />
        
        <View style={styles.radioInfo}>
          <Text style={styles.radioTitle}>{streamToShow.title}</Text>
          
          {streamToShow.description && (
            <Text style={styles.radioDescription}>
              {streamToShow.description}
            </Text>
          )}
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            {isPlaying ? (
              <Pause size={32} color="#FFF" />
            ) : (
              <Play size={32} color="#FFF" />
            )}
          </TouchableOpacity>
          
          <Text style={styles.liveIndicator}>
            {isPlaying ? '● EN DIRECT' : 'ÉCOUTER EN DIRECT'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  screenTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 24,
    marginLeft: 24,
  },
  radioCard: {
    margin: 24,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  radioImage: {
    height: 200,
    width: '100%',
  },
  radioInfo: {
    padding: 20,
    alignItems: 'center',
  },
  radioTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  radioDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  liveIndicator: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: isPlaying => isPlaying ? '#FF6B6B' : '#FFFFFF',
    textTransform: 'uppercase',
  },
});