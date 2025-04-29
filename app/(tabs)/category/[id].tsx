import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import SermonCard from '@/components/ui/SermonCard';

type Sermon = {
  id: string;
  title: string;
  preacher: string;
  audio_url: string;
  image_url: string | null;
};

export default function CategoryScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryName, setCategoryName] = useState(name || '');

  useEffect(() => {
    async function fetchCategorySermons() {
      try {
        setIsLoading(true);
        
        // If name wasn't passed as a param, fetch it
        if (!name) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('name')
            .eq('id', id)
            .single();
            
          if (categoryError) throw categoryError;
          if (categoryData) setCategoryName(categoryData.name);
        }
        
        // Fetch sermons for this category
        const { data, error } = await supabase
          .from('sermons')
          .select(`
            id,
            title,
            preacher,
            audio_url,
            image_url
          `)
          .eq('category_id', id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setSermons(data);
      } catch (error) {
        console.error('Error fetching category sermons:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCategorySermons();
  }, [id, name]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  // Demo sermons if none are available
  const demoSermons = [
    {
      id: '1',
      title: 'Le pouvoir de l\'amour dans le mariage',
      preacher: 'Pasteur Emmanuel',
      audio_url: 'https://example.com/sermon1.mp3',
      image_url: 'https://images.pexels.com/photos/1486064/pexels-photo-1486064.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '2',
      title: 'Aimer son prochain comme soi-même',
      preacher: 'Pasteur Marie',
      audio_url: 'https://example.com/sermon2.mp3',
      image_url: 'https://images.pexels.com/photos/1727484/pexels-photo-1727484.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '3',
      title: 'L\'amour qui pardonne',
      preacher: 'Évangéliste Jean',
      audio_url: 'https://example.com/sermon3.mp3',
      image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
  ];
  
  const sermonsToShow = sermons.length > 0 ? sermons : demoSermons;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sermonsToShow.map(sermon => (
          <SermonCard
            key={sermon.id}
            id={sermon.id}
            title={sermon.title}
            preacher={sermon.preacher}
            imageUrl={sermon.image_url || undefined}
            audioUrl={sermon.audio_url}
          />
        ))}
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
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Extra space for audio player
  },
});