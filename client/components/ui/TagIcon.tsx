import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface TagIconProps {
  title: string;
  subtitle?: string;
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
}

export const TagIcon: React.FC<TagIconProps> = ({
  title,
  subtitle,
  iconName = 'tag',
  iconColor = '#0066FF',
  iconSize = 18,
}) => {
  return (
    <View className="mb-3">
      <View className="flex-row items-center">
        <FontAwesome name={iconName} size={iconSize} color={iconColor} style={styles.icon} />
        <Text className="font-technor-bold text-xl text-[#040405]">{title}</Text>
      </View>
      {subtitle && (
        <Text className="font-technor-medium text-sm text-gray-600 mt-1">{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 8,
  },
});