import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Play, Pause, Download, Share, Clock } from 'lucide-react-native';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { useAudioStore } from '@/store/audioStore';

type SermonDetails = {
  id: string;
  title: string;
  preacher: string;
  description: string | null;
  audio_url: string;
  image_url: string | null;
  duration: number | null;
};

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sermon, setSermon] = useState<SermonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    currentSermon, 
    isPlaying, 
    playSermon, 
    togglePlayPause 
  } = useAudioStore();
  
  const isCurrentSermon = currentSermon?.id === id;

  useEffect(() => {
    async function fetchSermonDetails() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('sermons')
          .select(`
            id,
            title,
            preacher,
            description,
            audio_url,
            image_url,
            duration
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setSermon(data);
      } catch (error) {
        console.error('Error fetching sermon details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSermonDetails();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  // Demo sermon if none is available
  const demoSermon = {
    id: '1',
    title: 'Le pouvoir transformant de l\'amour divin',
    preacher: 'Pasteur Emmanuel',
    description: 'Dans ce message puissant, nous explorons comment l\'amour de Dieu peut transformer nos vies, nos relations et notre impact dans le monde. Découvrez les principes bibliques pour manifester cet amour divin dans votre quotidien.',
    audio_url: 'https://example.com/sermon1.mp3',
    image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    duration: 1845, // 30:45 in seconds
  };
  
  const sermonToShow = sermon || demoSermon;
  
  // Format duration as mm:ss
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    if (isCurrentSermon) {
      togglePlayPause();
    } else {
      playSermon({
        id: sermonToShow.id,
        title: sermonToShow.title,
        preacher: sermonToShow.preacher,
        imageUrl: sermonToShow.image_url || undefined,
        audioUrl: sermonToShow.audio_url
      });
    }
  };

  const handleShare = () => {
    // Implement share functionality
    alert('Partage non implémenté dans ce MVP');
  };

  const handleDownload = () => {
    // Implement download functionality
    alert('Téléchargement non implémenté dans ce MVP');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail du sermon</Text>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.audioPlayerSection}>
          {sermonToShow.image_url && (
            <Image
              source={{ uri: sermonToShow.image_url }}
              style={styles.sermonImage}
              contentFit="cover"
            />
          )}
          
          <View style={styles.audioControls}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              {isCurrentSermon && isPlaying ? (
                <Pause size={40} color="#FFF" />
              ) : (
                <Play size={40} color="#FFF" />
              )}
            </TouchableOpacity>
            
            {sermonToShow.duration && (
              <View style={styles.durationBadge}>
                <Clock size={14} color="#FFFFFF" />
                <Text style={styles.durationText}>
                  {formatDuration(sermonToShow.duration)}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.sermonDetails}>
          <Text style={styles.sermonTitle}>{sermonToShow.title}</Text>
          <Text style={styles.preacherName}>{sermonToShow.preacher}</Text>
          
          {sermonToShow.description && (
            <Text style={styles.description}>{sermonToShow.description}</Text>
          )}
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDownload}
            >
              <Download size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Télécharger</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Partager</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 16,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for audio player
  },
  audioPlayerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sermonImage: {
    width: '100%',
    height: 200,
  },
  audioControls: {
    alignItems: 'center',
    marginTop: -40,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    position: 'absolute',
    top: -160,
    right: 20,
  },
  durationText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  sermonDetails: {
    paddingHorizontal: 24,
  },
  sermonTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  preacherName: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#B3B3B3',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#DDDDDD',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 24,
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
});