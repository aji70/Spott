import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
  return <Stack
    screenOptions={{
        contentStyle: { backgroundColor: '#040405' },
        headerShown: true,
        headerTintColor: "#FFFFFF",
        headerStyle: {
          backgroundColor: '#040405',
        },
        headerBackTitleVisible: false,
      }}
   />;
};

export default _layout;
