import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Animated.View 
        entering={FadeIn.duration(300)}
        className="flex-1 items-center justify-center"
      >
        <View className="bg-white rounded-2xl p-8 shadow-lg">
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}