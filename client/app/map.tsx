import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCallback, useMemo, useRef, useState } from 'react';
import Foryou from '~/components/explore/Foryou';
import CityShow from '~/components/explore/CityShow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-elements';

const Index = () => {
  const [activetab, setActiveTab] = useState('for you');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // Set up snap points for the bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.1022,
          longitudeDelta: 0.0021,
        }}
        style={styles.map}
      />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { top: insets.top + 20 }]}>
        <AntDesign name="search1" size={24} color="#0066FF" />
        <TextInput
          placeholder="What are you looking for"
          placeholderTextColor="#333333"
          style={styles.searchInput}
        />
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        enablePanDownToClose={false}>
        <View style={styles.headerContainer}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-technor-bold text-[32px] text-[#040405]">Good Morning</Text>
              <Text className="font-technor-medium text-[20px] text-[#040405]">Joseph Omotade</Text>
            </View>

            <Avatar
              rounded
              source={{
                uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
              }}
              title="MT"
              avatarStyle={{
                borderWidth: 2,
                borderRadius: 50,
                borderColor: '#0066FF',
              }}
            />
          </View>

          <View className="my-[16px] flex-row items-center gap-x-2">
            <Pressable onPress={() => setActiveTab('for you')}>
              <Text
                className={
                  activetab === 'for you'
                    ? 'border-b-4 border-[#0066FF] p-[12px] font-technor-bold text-[#040405]'
                    : 'font-technor-medium text-[#040405]'
                }>
                For you
              </Text>
            </Pressable>

            <Pressable onPress={() => setActiveTab('lagos')}>
              <Text
                className={
                  activetab === 'lagos'
                    ? 'border-b-4 border-[#0066FF] p-[12px] font-technor-bold text-[#040405]'
                    : 'font-technor-medium text-[#040405]'
                }>
                Lagos
              </Text>
            </Pressable>
          </View>
        </View>
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          {activetab === 'for you' && <Foryou />}
          {activetab === 'lagos' && <CityShow />}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '90%',
    borderRadius: 55,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
  },
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
  },
  bottomSheetIndicator: {
    backgroundColor: '#0066FF',
    width: 40,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Extra padding for bottom tab bar
  },
});

export default Index;
