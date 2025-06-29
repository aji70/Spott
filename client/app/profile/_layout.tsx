import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#040405' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="[userId]" />
    </Stack>
  );
}
