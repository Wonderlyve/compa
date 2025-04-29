import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Carousel from '@/components/ui/Carousel';
import SermonCard from '@/components/ui/SermonCard';
import CategoryChip from '@/components/ui/CategoryChip';

type Sermon = {
  id: string;
  title: string;
  preacher: string;
  audio_url: string;
  image_url: string | null;
};

type Category = {
  id: string;
  name: string;
};

export default function HomeScreen() {
  const [featuredSermons, setFeaturedSermons] = useState<Sermon[]>([]);
  const [recentSermons, setRecentSermons] = useState<Sermon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        
        // Fetch featured sermons
        const { data: featuredData, error: featuredError } = await supabase
          .from('sermons')
          .select(`
            id,
            title,
            preacher,
            audio_url,
            image_url
          `)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (featuredError) throw featuredError;
        
        // Fetch recent sermons
        const { data: recentData, error: recentError } = await supabase
          .from('sermons')
          .select(`
            id,
            title,
            preacher,
            audio_url,
            image_url
          `)
          .order('created_at', { ascending: false })
          .range(5, 10);
          
        if (recentError) throw recentError;
        
        setCategories(categoriesData);
        setFeaturedSermons(featuredData);
        setRecentSermons(recentData);
      } catch (error) {
        console.error('Error fetching home screen data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  // For demo purposes, if no data is available
  const demoSermons = [
    {
      id: '1',
      title: 'Le pouvoir de l\'amour dans la vie chrétienne',
      preacher: 'Pasteur Emmanuel',
      audio_url: 'https://example.com/sermon1.mp3',
      image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '2',
      title: 'Comment développer une foi authentique',
      preacher: 'Pasteur Marie',
      audio_url: 'https://example.com/sermon2.mp3',
      image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '3',
      title: 'La puissance de la prière et l\'exaucement',
      preacher: 'Évangéliste Jean',
      audio_url: 'https://example.com/sermon3.mp3',
      image_url: 'https://images.pexels.com/photos/2559749/pexels-photo-2559749.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '4',
      title: 'Le pouvoir de l\'amour dans la vie chrétienne',
      preacher: 'Pasteur Emmanuel',
      audio_url: 'https://example.com/sermon1.mp3',
      image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '5',
      title: 'Comment développer une foi authentique',
      preacher: 'Pasteur Marie',
      audio_url: 'https://example.com/sermon2.mp3',
      image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      id: '6',
      title: 'La puissance de la prière et l\'exaucement',
      preacher: 'Évangéliste Jean',
      audio_url: 'https://example.com/sermon3.mp3',
      image_url: 'https://images.pexels.com/photos/2559749/pexels-photo-2559749.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
  ];
  
  const demoCategories = [
    { id: '1', name: 'Amour' },
    { id: '2', name: 'Sainteté' },
    { id: '3', name: 'Puissance' },
    { id: '4', name: 'Équilibre' },
    { id: '5', name: 'Développement' },
    { id: '6', name: 'Changement' },
  ];

  const sermonsToShow = featuredSermons.length > 0 ? featuredSermons : demoSermons;
  const recentToShow = recentSermons.length > 0 ? recentSermons : demoSermons;
  const categoriesToShow = categories.length > 0 ? categories : demoCategories;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.appTitle}>Compa</Text>
        
        <View style={styles.categoryContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categoriesToShow.map(category => (
              <CategoryChip 
                key={category.id} 
                id={category.id} 
                name={category.name} 
              />
            ))}
          </ScrollView>
        </View>
        
        <Text style={styles.sectionTitle}>À découvrir</Text>
        <Carousel
          items={sermonsToShow.map(sermon => ({
            id: sermon.id,
            title: sermon.title,
            preacher: sermon.preacher,
            imageUrl: sermon.image_url || undefined,
            audioUrl: sermon.audio_url
          }))}
        />
        
        <Text style={styles.sectionTitle}>Sermons récents</Text>
        <View style={styles.recentSermonsContainer}>
          {recentToShow.map(sermon => (
            <SermonCard
              key={sermon.id}
              id={sermon.id}
              title={sermon.title}
              preacher={sermon.preacher}
              imageUrl={sermon.image_url || undefined}
              audioUrl={sermon.audio_url}
              compact
            />
          ))}
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
  scrollContent: {
    paddingBottom: 10, // Extra space for the audio player
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
  },
  appTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 23,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 24,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 16,
    marginLeft: 24,
  },
  recentSermonsContainer: {
    paddingHorizontal: 24,
  },
});