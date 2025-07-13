import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface VendorCardProps {
  id: string;
  name: string;
  image: string;
  category?: string;
  isFeatured?: boolean;
  rating?: number;
  onPress?: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  id,
  name,
  image,
  category,
  isFeatured = false,
  rating,
  onPress,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default navigation behavior
      navigation.navigate(`/vendor/${id}` as never);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 overflow-hidden rounded-xl bg-white"
      style={styles.cardShadow}>
      <View className="relative">
        <Image
          source={{ uri: image }}
          className="h-[150px] w-full"
          resizeMode="cover"
        />
        {isFeatured && (
          <View className="absolute left-2 top-2 rounded-full bg-[#0066FF] px-3 py-1">
            <Text className="font-technor-medium text-xs text-white">Featured</Text>
          </View>
        )}
        {category && (
          <View className="absolute right-2 top-2 rounded-full bg-black/50 px-3 py-1">
            <Text className="font-technor-medium text-xs text-white">{category}</Text>
          </View>
        )}
      </View>

      <View className="p-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-technor-semibold text-base text-[#040405]" numberOfLines={1}>
            {name}
          </Text>
          {rating && (
            <View className="flex-row items-center">
              <FontAwesome name="star" size={14} color="#FFD700" />
              <Text className="ml-1 font-technor-medium text-xs text-gray-600">{rating}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});