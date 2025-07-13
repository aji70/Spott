import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { VendorCard } from './VendorCard';
import { Vendor } from '~/types/vendor';

interface VendorGridProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  vendors: Vendor[];
  columns?: number;
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
}

export const VendorGrid: React.FC<VendorGridProps> = ({
  title,
  subtitle,
  tagline,
  vendors,
  columns = 2,
  showSeeAll = true,
  onSeeAllPress,
}) => {
  return (
    <View className="mb-6">
      <View className="mb-3">
        <Text className="font-technor-bold text-xl text-[#040405]">{title}</Text>
        {subtitle && (
          <Text className="font-technor-medium text-sm text-gray-600">{subtitle}</Text>
        )}
        {tagline && (
          <Text className="font-technor-medium text-sm text-[#0066FF]">{tagline}</Text>
        )}
      </View>

      <View className="flex-row flex-wrap justify-between">
        {vendors.map((vendor) => (
          <View key={vendor.id} style={[styles.gridCard, { width: `${100 / columns - 2}%` }]}>
            <VendorCard
              id={vendor.id}
              name={vendor.name}
              image={vendor.image}
              category={vendor.category}
              isFeatured={vendor.isFeatured}
              rating={vendor.rating}
            />
          </View>
        ))}
      </View>

      {showSeeAll && (
        <View className="items-center mt-4">
          <Text 
            className="font-technor-medium text-sm text-[#0066FF]"
            onPress={onSeeAllPress}
          >
            See all vendors
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridCard: {
    marginBottom: 16,
  },
});