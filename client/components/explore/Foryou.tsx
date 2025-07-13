import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { VendorList } from '~/components/vendors';
import { TagIcon } from '~/components/ui';
import { featuredVendors, topVendors } from '~/data/mockVendors';

const Foryou = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Featured Vendors Section */}
      <VendorList
        title="Featured Vendors"
        subtitle="Popular places to explore"
        vendors={featuredVendors}
        horizontal={true}
      />

      {/* Top Rated Section */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between">
          <TagIcon 
            title="Top Rated"
            iconName="trophy"
            iconColor="#FFD700"
          />
          <Text className="font-technor-medium text-sm text-[#0066FF]">See all</Text>
        </View>

        <VendorList
          title=""
          vendors={topVendors.slice(0, 3)}
          horizontal={true}
          showCount={false}
        />
      </View>

      {/* Nearby Vendors Section */}
      <VendorList
        title="Nearby Vendors"
        subtitle="Discover places around you"
        vendors={[...featuredVendors].reverse()}
        horizontal={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120, // Extra padding at bottom for the tab bar
  },
});

export default Foryou;
