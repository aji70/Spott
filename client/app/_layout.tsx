import '../global.css';

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    PlusJakartaSansBold: require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    PlusJakartaSansLight: require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    PlusJakartaSansMedium: require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    PlusJakartaSansRegular: require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    TankerRegular: require('../assets/fonts/Tanker-Regular.otf'),
  });
  
  return (
    <View style={{ flex: 1, backgroundColor: '#040405' }}>
      <StatusBar style="light" backgroundColor="#040405" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: '#040405' },
          headerShown: false,
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}
