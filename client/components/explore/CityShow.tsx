import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { VendorList, VendorGrid } from '~/components/vendors';
import { TagIcon } from '~/components/ui';
import { topVendors, localVendors } from '~/data/mockVendors';

const CityShow = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Top Vendors Section with Tag Icon */}
      <View className="mb-6">
        <TagIcon 
          title="15 Restaurants To Make You Fall In Love With New York Again"
          subtitle="Discover the best dining experiences"
          iconName="tag"
          iconColor="#0066FF"
        />

        {/* Grid layout for top vendors */}
        <VendorGrid
          title=""
          vendors={topVendors.slice(0, 4)}
          columns={2}
          showSeeAll={false}
        />
      </View>

      {/* Local Favorites Section */}
      <VendorList
        title="Local Favorites"
        subtitle="Discover local businesses"
        vendors={localVendors}
        horizontal={true}
        showCount={true}
      />

      {/* Popular Near You Section */}
      <VendorList
        title="Popular Near You"
        subtitle="Trending in your area"
        vendors={[...topVendors].reverse().slice(0, 4)}
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

export default CityShow;
