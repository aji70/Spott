import '../global.css';

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThirdwebProvider } from 'thirdweb/react';
import { AuthProvider } from '~/providers/AuthProvider';
import { client, citreaTestnet } from '~/lib/thirdweb';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

const App = () => {
  const [loaded, error] = useFonts({
    'Technor-Black': require('~/assets/fonts/Technor-Black.otf'),
    'Technor-Bold': require('~/assets/fonts/Technor-Bold.otf'),
    'Technor-Extralight': require('~/assets/fonts/Technor-Extralight.otf'),
    'Technor-Regular': require('~/assets/fonts/Technor-Regular.otf'),
    'Technor-Light': require('~/assets/fonts/Technor-Light.otf'),
    'Technor-medium': require('~/assets/fonts/Technor-Medium.otf'),
    'Technor-Semibold': require('~/assets/fonts/Technor-Semibold.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThirdwebProvider>
          <BottomSheetModalProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BottomSheetModalProvider>
        </ThirdwebProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
