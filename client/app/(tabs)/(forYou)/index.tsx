import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Image,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { CommentsModal } from '../../../components/CommentsModal';
import { ShareModal } from '../../../components/ShareModal';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mock data for video content
const mockVideos = [
  {
    id: '1',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=800&fit=crop',
    user: {
      id: 'user1',
      username: 'techstore_nyc',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isVerified: true,
    },
    description: 'Check out this amazing iPhone 15 Pro Max! #iPhone15ProMax #TechReview #Gadgets',
    likes: 12500,
    comments: 890,
    shares: 234,
    isLiked: false,
    pinnedProduct: {
      id: 'prod1',
      name: 'iPhone 15 Pro Max',
      price: '$1,199',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop',
      store: 'TechStore NYC',
    },
  },
  {
    id: '2',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=800&fit=crop',
    user: {
      id: 'user2',
      username: 'fashionista_sarah',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      isVerified: false,
    },
    description: 'Summer vibes with this amazing dress! Perfect for beach days ☀️ #SummerFashion #BeachVibes',
    likes: 8900,
    comments: 456,
    shares: 123,
    isLiked: true,
    pinnedProduct: {
      id: 'prod2',
      name: 'Summer Beach Dress',
      price: '$89',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop',
      store: 'Fashion Forward',
    },
  },
  {
    id: '3',
    videoUrl: 'https://example.com/video3.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=800&fit=crop',
    user: {
      id: 'user3',
      username: 'sneakerhead_mike',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      isVerified: true,
    },
    description: 'These Jordan 4s are fire! 🔥 Copped them from the drop. #Jordan4 #Sneakers #Hypebeast',
    likes: 15600,
    comments: 1200,
    shares: 567,
    isLiked: false,
    pinnedProduct: {
      id: 'prod3',
      name: 'Air Jordan 4 Retro',
      price: '$210',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      store: 'Sneaker Palace',
    },
  },
];

const ForYouScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('forYou'); // 'forYou' or 'live'
  const [videos, setVideos] = useState(mockVideos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const flatListRef = useRef(null);
  const tabAnimation = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLike = (videoId) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId
          ? {
              ...video,
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1,
            }
          : video
      )
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    Animated.spring(tabAnimation, {
      toValue: tab === 'forYou' ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderVideoItem = ({ item, index }) => {
    return (
      <View style={{ width: screenWidth, height: screenHeight }}>
        {/* Video Background */}
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(4,4,5,0.8)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
          }}
        />

        {/* Right Side Actions */}
        <View className="absolute bottom-32 right-4 items-center space-y-6">
          {/* Profile Avatar */}
          <TouchableOpacity
            onPress={() => {
              router.push(`/profile/${item.user.id}`);
            }}
            className="relative"
          >
            <Image
              source={{ uri: item.user.avatar }}
              className="h-12 w-12 rounded-full border-2 border-white"
            />
            <View className="absolute -bottom-2 -right-1 h-6 w-6 items-center justify-center rounded-full bg-[#EBF755]">
              <FontAwesome name="plus" size={12} color="#040405" />
            </View>
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity
            onPress={() => handleLike(item.id)}
            className="items-center space-y-1"
          >
            <View className="rounded-full bg-black/20 p-3">
              <FontAwesome
                name={item.isLiked ? 'heart' : 'heart-o'}
                size={24}
                color={item.isLiked ? '#FF3040' : '#FFFFFF'}
              />
            </View>
            <Text className="font-PlusJakartaSansMedium text-xs text-white">
              {formatNumber(item.likes)}
            </Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity
            onPress={() => {
              setSelectedVideoId(item.id);
              setCommentsModalVisible(true);
            }}
            className="items-center space-y-1"
          >
            <View className="rounded-full bg-black/20 p-3">
              <FontAwesome name="comment-o" size={24} color="#FFFFFF" />
            </View>
            <Text className="font-PlusJakartaSansMedium text-xs text-white">
              {formatNumber(item.comments)}
            </Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            onPress={() => {
              setSelectedVideoId(item.id);
              setShareModalVisible(true);
            }}
            className="items-center space-y-1"
          >
            <View className="rounded-full bg-black/20 p-3">
              <FontAwesome name="share" size={24} color="#FFFFFF" />
            </View>
            <Text className="font-PlusJakartaSansMedium text-xs text-white">
              {formatNumber(item.shares)}
            </Text>
          </TouchableOpacity>

          {/* More Options */}
          <TouchableOpacity>
            <View className="rounded-full bg-black/20 p-3">
              <MaterialIcons name="more-horiz" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Content */}
        <View className="absolute bottom-40 left-4 right-20">
          {/* User Info */}
          <TouchableOpacity
            onPress={() => {
              router.push(`/profile/${item.user.id}`);
            }}
            className="mb-3 flex-row items-center space-x-2"
          >
            <Text className="font-PlusJakartaSansBold text-base text-white">
              @{item.user.username}
            </Text>
            {item.user.isVerified && (
              <FontAwesome name="check-circle" size={16} color="#1DA1F2" />
            )}
          </TouchableOpacity>

          {/* Description */}
          <Text className="mb-4 font-PlusJakartaSansRegular text-sm leading-5 text-white">
            {item.description}
          </Text>

          {/* Pinned Product */}
          {item.pinnedProduct && (
            <TouchableOpacity className="mb-4">
              <View className="flex-row items-center rounded-xl bg-black/40 p-3 backdrop-blur-sm">
                <Image
                  source={{ uri: item.pinnedProduct.image }}
                  className="h-12 w-12 rounded-lg"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-PlusJakartaSansMedium text-sm text-white">
                    {item.pinnedProduct.name}
                  </Text>
                  <Text className="font-PlusJakartaSansRegular text-xs text-gray-300">
                    {item.pinnedProduct.store}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-PlusJakartaSansBold text-sm text-[#EBF755]">
                    {item.pinnedProduct.price}
                  </Text>
                  <TouchableOpacity className="mt-1 rounded-full bg-[#EBF755] px-4 py-1">
                    <Text className="font-PlusJakartaSansMedium text-xs text-[#040405]">
                      Shop
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-dark-bg">
      <StatusBar barStyle="light-content" backgroundColor="#040405" />

      {/* Top Tab Bar */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-center">
        <View className="flex-row rounded-full bg-black/20 p-1">
          <TouchableOpacity
            onPress={() => handleTabChange('forYou')}
            className={`rounded-full px-6 py-2 ${
              activeTab === 'forYou' ? 'bg-white/20' : ''
            }`}
          >
            <Text
              className={`font-PlusJakartaSansMedium text-base ${
                activeTab === 'forYou' ? 'text-white' : 'text-white/60'
              }`}
            >
              For You
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabChange('live')}
            className={`flex-row items-center rounded-full px-6 py-2 ${
              activeTab === 'live' ? 'bg-white/20' : ''
            }`}
          >
            <View className="mr-2 h-2 w-2 rounded-full bg-red-500" />
            <Text
              className={`font-PlusJakartaSansMedium text-base ${
                activeTab === 'live' ? 'text-white' : 'text-white/60'
              }`}
            >
              Live
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Video Content */}
      {activeTab === 'forYou' ? (
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={screenHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.y / screenHeight);
            setCurrentVideoIndex(index);
          }}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <FontAwesome5 name="video" size={60} color="#666" />
          <Text className="mt-4 font-PlusJakartaSansMedium text-lg text-gray-400">
            No live streams available
          </Text>
          <Text className="mt-2 font-PlusJakartaSansRegular text-sm text-gray-500">
            Check back later for live content
          </Text>
        </View>
      )}

      {/* Modals */}
      <CommentsModal
        visible={commentsModalVisible}
        onClose={() => setCommentsModalVisible(false)}
        videoId={selectedVideoId}
        comments={[]}
      />

      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        videoId={selectedVideoId}
      />

    </View>
  );
};

export default ForYouScreen;
