import React from 'react';
import { View, TouchableOpacity, Text, Platform, Image } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { MapPinIcon, UserGroup02Icon } from '@hugeicons/core-free-icons';
import { MapPinnedIcon } from 'lucide-react-native';
import { Settings } from 'lucide-react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface TabBarIconProps {
  route: string;
  focused: boolean;
  color: string;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused, color }) => {
  const iconProps = {
    size: 24,
    color,
    variant: 'solid',
  };

  switch (route) {
    // case '(overview)':
    //   return <HugeiconsIcon icon={Home01Icon} {...iconProps} />;
    // case '(music)':
    //   return <HugeiconsIcon icon={HeadphonesIcon} {...iconProps} />;
    case '(explore)':
      return <FontAwesome name="map-marker" {...iconProps} />;
    case 'store':
      return <HugeiconsIcon icon={UserGroup02Icon} {...iconProps} />;
    case 'settings':
      return <Settings {...iconProps} />;
    // case '(profile)':
    //   return (
    //     <Image
    //       source={require('@/assets/images/rema.jpg')}
    //       style={{
    //         width: 24,
    //         height: 24,
    //         borderRadius: 12,
    //         tintColor: color,
    //       }}
    //     />
    //   );
    default:
      return null;
  }
};

const getTabTitle = (routeName: string): string => {
  switch (routeName) {
    case '(explore)':
      return 'Overview';
    case 'store':
      return 'Store';
    case 'settings':
      return 'Settings';
    // case 'uploadMusic':
    //   return 'Upload';
    // case '(tribes)':
    //   return 'Tribes';
    // case '(profile)':
    //   return 'Profile';
    default:
      return '';
  }
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const focusedIndex = state.index;

  // Animation values for scale effect - create at top level
  const scaleValue0 = useSharedValue(1);
  const scaleValue1 = useSharedValue(1);
  const scaleValue2 = useSharedValue(1);
  const scaleValue3 = useSharedValue(1);
  const scaleValue4 = useSharedValue(1);

  const scaleValues = React.useMemo(
    () =>
      [scaleValue0, scaleValue1, scaleValue2, scaleValue3, scaleValue4].slice(
        0,
        state.routes.length
      ),
    [scaleValue0, scaleValue1, scaleValue2, scaleValue3, scaleValue4, state.routes.length]
  );

  const handleTabPress = (index: number, route: any) => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Scale animation
    scaleValues[index].value = withSpring(0.8, { duration: 100 }, () => {
      scaleValues[index].value = withSpring(1, { duration: 100 });
    });

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  // Create animated styles at top level
  const animatedStyle0 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue0.value }],
  }));
  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue1.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue2.value }],
  }));
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue3.value }],
  }));
  const animatedStyle4 = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue4.value }],
  }));

  const animatedStyles = React.useMemo(
    () =>
      [animatedStyle0, animatedStyle1, animatedStyle2, animatedStyle3, animatedStyle4].slice(
        0,
        state.routes.length
      ),
    [
      animatedStyle0,
      animatedStyle1,
      animatedStyle2,
      animatedStyle3,
      animatedStyle4,
      state.routes.length,
    ]
  );

  return (
    <View
      style={{
        position: 'absolute',
        bottom: insets.bottom + 16,
        left: 24,
        right: 24,
        backgroundColor: '#111318',
        borderRadius: 55,
        paddingHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        height: 80,
        justifyContent: 'center',
      }}>
      {/* Tab buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          return (
            <Animated.View key={route.key} style={[animatedStyles[index]]}>
              <TouchableOpacity
                onPress={() => handleTabPress(index, route)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 22,
                  paddingHorizontal: isFocused ? 28 : 16,
                  backgroundColor: isFocused ? '#FFFFFF' : 'transparent',
                  borderRadius: 55,
                }}
                activeOpacity={0.7}>
                <TabBarIcon
                  route={route.name}
                  focused={isFocused}
                  color={isFocused ? 'blue' : '#787A80'}
                />

                {/* Tab label - only show for focused tab */}
                {isFocused && (
                  <Text className="ml-2 font-technor-semibold text-[14px]">
                    {getTabTitle(route.name)}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
