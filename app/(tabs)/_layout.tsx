import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Chrome as Home, Radio, List } from 'lucide-react-native';
import AudioPlayer from '@/components/ui/AudioPlayer';
import { useAudioStore } from '@/store/audioStore';

export default function TabLayout() {
  const { currentSermon } = useAudioStore();

  return (
    <View style={styles.container}>
      {currentSermon && <AudioPlayer />}
      
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: '#B3B3B3',
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: 'Catégories',
            tabBarIcon: ({ color, size }) => (
              <List size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="radio"
          options={{
            title: 'Radio',
            tabBarIcon: ({ color, size }) => (
              <Radio size={size} color={color} />
            ),
          }}
        />
        
        {/* Hidden tabs for navigation */}
        <Tabs.Screen
          name="sermon/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="category/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  tabBar: {
    backgroundColor: '#2A2A2A',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 0,
    paddingTop: 0,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});