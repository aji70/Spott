import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Market = () => {
  const navigation = useNavigation();
  // Example state for basket items count - replace with actual basket state management
  const [basketItemsCount, setBasketItemsCount] = useState(3);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Text className="text-dark-text font-TankerRegular text-[34px]">MARKETPLACE</Text>
      ),
      headerRight: () => (
        <View className="flex-row items-center gap-x-2">
          <View className="relative">
            <FontAwesome name="shopping-basket" size={20} color="#FFFFFF" />
            {basketItemsCount > 0 && (
              <View className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#EBF755]">
                <Text className="font-PlusJakartaSansMedium text-[10px] font-bold text-[#040405]">
                  {basketItemsCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      ),
      title: '',
    });
  });
  return (
    <SafeAreaView className="bg-dark-bg flex-1">
      <ScrollView className="flex-1">
      
      </ScrollView>
    </SafeAreaView>
  );
};

export default Market;
