import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { VendorCard } from './VendorCard';

interface Vendor {
  id: string;
  name: string;
  image: string;
  category?: string;
  isFeatured?: boolean;
  rating?: number;
}

interface VendorListProps {
  title: string;
  subtitle?: string;
  vendors: Vendor[];
  horizontal?: boolean;
  showCount?: boolean;
}

export const VendorList: React.FC<VendorListProps> = ({
  title,
  subtitle,
  vendors,
  horizontal = true,
  showCount = false,
}) => {
  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-end justify-between">
        <View>
          <Text className="font-technor-bold text-xl text-[#040405]">{title}</Text>
          {subtitle && (
            <Text className="font-technor-medium text-sm text-gray-600">{subtitle}</Text>
          )}
          {showCount && (
            <Text className="font-technor-medium text-sm text-[#0066FF]">
              {vendors.length} vendors
            </Text>
          )}
        </View>
        <Text className="font-technor-medium text-sm text-[#0066FF]">See all</Text>
      </View>

      <FlatList
        data={vendors}
        keyExtractor={(item) => item.id}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={horizontal ? styles.horizontalList : styles.gridList}
        renderItem={({ item }) => (
          <View style={horizontal ? styles.horizontalCard : styles.gridCard}>
            <VendorCard
              id={item.id}
              name={item.name}
              image={item.image}
              category={item.category}
              isFeatured={item.isFeatured}
              rating={item.rating}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalList: {
    paddingRight: 16,
  },
  gridList: {
    paddingBottom: 8,
  },
  horizontalCard: {
    width: 200,
    marginRight: 12,
  },
  gridCard: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 8,
  },
});