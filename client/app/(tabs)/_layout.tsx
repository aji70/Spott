import { Link, Tabs } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#EBF755',
        tabBarInactiveTintColor: '#787A80',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#040405',
          height: Platform.OS === 'android' ? 70 : 80,
          borderTopWidth: 0,
        },
        tabBarIconStyle: { marginTop: Platform.OS === 'android' ? 10 : 8 },
        headerStyle: {
          backgroundColor: '#040405',
          height: 109,
          borderBottomColor: '#1D2029',
        },
        tabBarPosition: 'bottom',
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(forYou)"
        options={{
          title: 'For you',
          tabBarIcon: ({ color }) => <FontAwesome name="play" size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(marketplace)"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => <FontAwesome6 name="shop" size={18} color={color} />,
        }}
      />
    </Tabs>
  );
}
