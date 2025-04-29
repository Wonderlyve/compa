import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import CategoryChip from '@/components/ui/CategoryChip';

type Category = {
  id: string;
  name: string;
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        if (isMounted) {
          setCategories(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  // Demo categories if none are available
  const demoCategories = [
    { id: '1', name: 'Amour' },
    { id: '2', name: 'Sainteté' },
    { id: '3', name: 'Puissance' },
    { id: '4', name: 'Équilibre' },
    { id: '5', name: 'Développement' },
    { id: '6', name: 'Changement de Mentalité' },
    { id: '7', name: 'Foi' },
    { id: '8', name: 'Guérison' },
    { id: '9', name: 'Famille' },
    { id: '10', name: 'Croissance Spirituelle' },
    { id: '11', name: 'Leadership' },
    { id: '12', name: 'Jeunesse' },
  ];

  const categoriesToShow = categories.length > 0 ? categories : demoCategories;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.screenTitle}>Catégories</Text>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesGrid}>
          {categoriesToShow.map(category => (
            <CategoryChip 
              key={category.id} 
              id={category.id} 
              name={category.name}
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Extra space for audio player
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});