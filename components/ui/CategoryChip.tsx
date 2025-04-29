import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

type CategoryChipProps = {
  id: string;
  name: string;
  isSelected?: boolean;
};

export default function CategoryChip({ id, name, isSelected = false }: CategoryChipProps) {
  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/category/[id]',
      params: { id, name }
    });
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : {}
      ]}
      onPress={handlePress}
    >
      <Text 
        style={[
          styles.text,
          isSelected ? styles.selectedText : {}
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedContainer: {
    backgroundColor: '#FF6B6B',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});