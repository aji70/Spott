import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Button } from '../components/Button';
import { Pagination } from '../components/Pagination';
import { theme } from '~/constant/theme';
import { data, Data } from '~/data/screen';
import { router } from 'expo-router';
import { useAuth } from '~/hooks/useAuth';

const RenderItem = ({ item, index, x }: { item: Data; index: number; x: SharedValue<number> }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      width: SCREEN_WIDTH * 0.9 * 1.1,
      height: SCREEN_WIDTH * 0.9 * 1.2,
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <Animated.Image source={item.image} style={imageAnimatedStyle} />
      <Animated.View style={textAnimatedStyle} className={'items-start px-[24px]'}>
        <Text className={'items-start font-technor-bold text-[24px] text-[#040405]'}>
          {item.title}
        </Text>
        <Text className="text-start font-technor-medium text-[16px]">{item.text}</Text>
      </Animated.View>
      <Pagination data={data} screenWidth={SCREEN_WIDTH} x={x} />
    </View>
  );
};

const Index = () => {
  const flatListRef = useAnimatedRef<FlatList>();
  const { signInWithGoogle, signInWithApple, isLoading } = useAuth();

  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      console.error('Apple sign in error:', error);
    }
  };

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
    flatListIndex.value = viewableItems[0].index ?? 0;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef as any}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => <RenderItem index={index} item={item} x={x} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
      />

      <View style={styles.footerContainer} className="gap-y-[24px]">
        <View>
          <TouchableOpacity 
            className="w-full items-center justify-center rounded-lg bg-[#0066FF] py-[16px]"
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Text className="font-technor-medium text-[16px] text-white">
              {isLoading ? 'Connecting...' : 'Sign up with Google'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="mt-2 w-full items-center justify-center rounded-lg border-2 border-[#0066FF] py-[16px]"
            onPress={handleAppleSignIn}
            disabled={isLoading}
          >
            <Text className="font-technor-medium text-[16px] text-[#0066FF]">
              {isLoading ? 'Connecting...' : 'Sign up with Apple'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemTitle: {
    color: theme.colors.textColor,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemText: {
    color: theme.colors.textColor,
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 30,
  },
  footerContainer: {
    margin: 20,
  },
});
