import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useAudioStore } from '@/store/audioStore';
import SermonCard from '@/components/ui/SermonCard';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // Full width minus padding
const SPACING = 10;

type CarouselItem = {
  id: string;
  title: string;
  preacher: string;
  imageUrl?: string;
  audioUrl: string;
};

type CarouselProps = {
  items: CarouselItem[];
};

export default function Carousel({ items }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  // Timer for auto-scrolling
  useEffect(() => {
    const timer = setInterval(() => {
      if (items.length <= 1) return;
      
      const nextIndex = (activeIndex + 1) % items.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (CARD_WIDTH + SPACING),
        animated: true,
      });
    }, 5000);
    
    return () => clearInterval(timer);
  }, [activeIndex, items.length]);

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / (CARD_WIDTH + SPACING));
    setActiveIndex(index);
  };

  const handlePress = (id: string) => {
    router.push({
      pathname: '/(tabs)/sermon/[id]',
      params: { id }
    });
  };

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handlePress(item.id)}
            activeOpacity={0.9}
          >
            <SermonCard
              id={item.id}
              title={item.title}
              preacher={item.preacher}
              imageUrl={item.imageUrl}
              audioUrl={item.audioUrl}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {items.length > 1 && (
        <View style={styles.pagination}>
          {items.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex ? styles.paginationDotActive : {},
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: SPACING,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A4A4A',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FF6B6B',
    width: 16,
  },
});