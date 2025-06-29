import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  followers: number;
  following: number;
  likes: number;
  bio: string;
  rating: number;
  totalOrders: number;
  responseTime: string;
  joinedDate: string;
}

const mockUserVideos = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=300&fit=crop',
    likes: 12500,
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=300&fit=crop',
    likes: 8900,
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=300&fit=crop',
    likes: 15600,
  },
];

const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: '$1,199',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
    stock: 15,
    sold: 89,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    price: '$899',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop',
    stock: 8,
    sold: 45,
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    price: '$1,999',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
    stock: 3,
    sold: 23,
  },
];

const mockReviews = [
  {
    id: '1',
    user: {
      username: 'sarah_buyer',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    rating: 5,
    comment: 'Amazing seller! Product exactly as described and shipped super fast!',
    date: '2 days ago',
    product: 'iPhone 15 Pro Max',
  },
  {
    id: '2',
    user: {
      username: 'tech_enthusiast',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    rating: 4,
    comment: 'Great quality and excellent customer service. Highly recommend!',
    date: '1 week ago',
    product: 'Samsung Galaxy S24',
  },
  {
    id: '3',
    user: {
      username: 'digital_nomad',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    rating: 5,
    comment: 'Perfect condition MacBook! Fast delivery and great packaging.',
    date: '2 weeks ago',
    product: 'MacBook Pro M3',
  },
];

const mockUser: UserProfile = {
  id: '1',
  username: 'techstore_nyc',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  isVerified: true,
  followers: 45600,
  following: 1250,
  likes: 892300,
  bio: '🏪 NYC\'s Premium Tech Store\n📱 Latest gadgets & electronics\n🚚 Fast shipping nationwide\n💬 DM for custom orders',
  rating: 4.8,
  totalOrders: 1247,
  responseTime: '< 1 hour',
  joinedDate: 'March 2022',
};

export default function UserProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('videos'); // 'videos', 'products', 'reviews'

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={12}
          color="#EBF755"
        />
      );
    }
    return stars;
  };

  const renderVideoItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={{
        width: (screenWidth - 48) / 3,
        height: 180,
        marginRight: index % 3 !== 2 ? 8 : 0,
        marginBottom: 8,
      }}
      className="relative rounded-lg overflow-hidden"
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
        }}
      />
      <View className="absolute bottom-2 left-2 flex-row items-center">
        <FontAwesome name="heart" size={12} color="#FFFFFF" />
        <Text className="ml-1 font-PlusJakartaSansMedium text-xs text-white">
          {formatNumber(item.likes)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={{
        width: (screenWidth - 48) / 2,
        marginRight: index % 2 !== 1 ? 16 : 0,
        marginBottom: 16,
      }}
      className="bg-dark-surface rounded-lg p-3"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-32 rounded-lg"
        resizeMode="cover"
      />
      <Text className="mt-2 font-PlusJakartaSansMedium text-sm text-dark-text">
        {item.name}
      </Text>
      <Text className="mt-1 font-PlusJakartaSansBold text-lg text-[#EBF755]">
        {item.price}
      </Text>
      <View className="mt-2 flex-row justify-between">
        <Text className="font-PlusJakartaSansRegular text-xs text-dark-text-secondary">
          Stock: {item.stock}
        </Text>
        <Text className="font-PlusJakartaSansRegular text-xs text-dark-text-secondary">
          Sold: {item.sold}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }: { item: any }) => (
    <View className="bg-dark-surface rounded-lg p-4 mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Image
            source={{ uri: item.user.avatar }}
            className="w-8 h-8 rounded-full"
          />
          <View className="ml-3">
            <Text className="font-PlusJakartaSansMedium text-sm text-dark-text">
              {item.user.username}
            </Text>
            <Text className="font-PlusJakartaSansRegular text-xs text-dark-text-secondary">
              {item.date}
            </Text>
          </View>
        </View>
        <View className="flex-row">{renderStars(item.rating)}</View>
      </View>
      <Text className="font-PlusJakartaSansRegular text-sm text-dark-text leading-5 mb-2">
        {item.comment}
      </Text>
      <Text className="font-PlusJakartaSansRegular text-xs text-[#EBF755]">
        Product: {item.product}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-dark-border">
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="font-PlusJakartaSansBold text-lg text-dark-text">
          @{mockUser.username}
        </Text>
        <TouchableOpacity>
          <FontAwesome name="ellipsis-h" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Info */}
        <View className="items-center px-4 py-6">
          <Image
            source={{ uri: mockUser.avatar }}
            className="h-24 w-24 rounded-full border-2 border-[#EBF755]"
          />
          
          <View className="mt-4 flex-row items-center">
            <Text className="font-PlusJakartaSansBold text-xl text-dark-text">
              @{mockUser.username}
            </Text>
            {mockUser.isVerified && (
              <FontAwesome name="check-circle" size={20} color="#1DA1F2" style={{ marginLeft: 8 }} />
            )}
          </View>

          <Text className="mt-2 text-center font-PlusJakartaSansRegular text-sm text-dark-text-secondary leading-5">
            {mockUser.bio}
          </Text>

          {/* Stats */}
          <View className="mt-6 flex-row justify-between w-full px-4">
            <View className="items-center flex-1">
              <Text className="font-PlusJakartaSansBold text-lg text-dark-text">
                {formatNumber(mockUser.following)}
              </Text>
              <Text className="font-PlusJakartaSansRegular text-sm text-dark-text-secondary">
                Following
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="font-PlusJakartaSansBold text-lg text-dark-text">
                {formatNumber(mockUser.followers)}
              </Text>
              <Text className="font-PlusJakartaSansRegular text-sm text-dark-text-secondary">
                Followers
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="font-PlusJakartaSansBold text-lg text-dark-text">
                {formatNumber(mockUser.likes)}
              </Text>
              <Text className="font-PlusJakartaSansRegular text-sm text-dark-text-secondary">
                Likes
              </Text>
            </View>
          </View>

          {/* Business Stats */}
          <View className="mt-6 flex-row justify-between w-full px-4">
            <View className="items-center flex-1">
              <View className="flex-row items-center">
                <FontAwesome name="star" size={16} color="#EBF755" />
                <Text className="ml-1 font-PlusJakartaSansBold text-lg text-dark-text">
                  {mockUser.rating}
                </Text>
              </View>
              <Text className="font-PlusJakartaSansRegular text-sm text-dark-text-secondary">
                Rating
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="font-PlusJakartaSansBold text-lg text-dark-text">
                {formatNumber(mockUser.totalOrders)}
              </Text>
              <Text className="font-PlusJakartaSansRegular text-sm text-dark-text-secondary">
                Orders
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="font-PlusJakartaSansBold text-lg text-dark-text">
                {mockUser.responseTime}
              </Text>
              <Text className="font-PlusJakartaSansRegular text-sm text-dark-text-secondary">
                Response
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="mt-6 flex-row space-x-4 w-full">
            <TouchableOpacity
              onPress={() => setIsFollowing(!isFollowing)}
              className={`flex-1 rounded-lg py-3 ${
                isFollowing ? 'bg-dark-surface border border-dark-border' : 'bg-[#EBF755]'
              }`}
            >
              <Text
                className={`text-center font-PlusJakartaSansBold text-sm ${
                  isFollowing ? 'text-dark-text' : 'text-[#040405]'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="rounded-lg border border-dark-border bg-dark-surface px-6 py-3">
              <FontAwesome name="comment" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="rounded-lg border border-dark-border bg-dark-surface px-6 py-3">
              <FontAwesome name="share" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Tabs */}
        <View className="flex-row border-b border-dark-border">
          <TouchableOpacity
            onPress={() => setActiveTab('videos')}
            className={`flex-1 py-4 ${
              activeTab === 'videos' ? 'border-b-2 border-[#EBF755]' : ''
            }`}
          >
            <Text
              className={`text-center font-PlusJakartaSansMedium text-sm ${
                activeTab === 'videos' ? 'text-[#EBF755]' : 'text-dark-text-secondary'
              }`}
            >
              Videos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('products')}
            className={`flex-1 py-4 ${
              activeTab === 'products' ? 'border-b-2 border-[#EBF755]' : ''
            }`}
          >
            <Text
              className={`text-center font-PlusJakartaSansMedium text-sm ${
                activeTab === 'products' ? 'text-[#EBF755]' : 'text-dark-text-secondary'
              }`}
            >
              Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('reviews')}
            className={`flex-1 py-4 ${
              activeTab === 'reviews' ? 'border-b-2 border-[#EBF755]' : ''
            }`}
          >
            <Text
              className={`text-center font-PlusJakartaSansMedium text-sm ${
                activeTab === 'reviews' ? 'text-[#EBF755]' : 'text-dark-text-secondary'
              }`}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="p-4">
          {activeTab === 'videos' && (
            <FlatList
              data={mockUserVideos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}

          {activeTab === 'products' && (
            <FlatList
              data={mockProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}

          {activeTab === 'reviews' && (
            <FlatList
              data={mockReviews}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
