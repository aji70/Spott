import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import MapView from 'react-native-maps';
import { Dimensions, Pressable, TextInput, TouchableOpacity, Text, View, Image, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Home() {
  const navigation = useNavigation();
  const screenHeight = Dimensions.get('window').height;

  const statusProfiles = [
    { id: 1, image: 'https://randomuser.me/api/portraits/women/1.jpg', name: 'Sarah Store' },
    { id: 2, image: 'https://randomuser.me/api/portraits/men/1.jpg', name: 'John' },
    { id: 3, image: 'https://randomuser.me/api/portraits/women/2.jpg', name: 'Emma' },
    { id: 4, image: 'https://randomuser.me/api/portraits/men/2.jpg', name: 'Mike' },
    { id: 5, image: 'https://randomuser.me/api/portraits/women/3.jpg', name: 'Lisa' },
    { id: 6, image: 'https://randomuser.me/api/portraits/men/3.jpg', name: 'Tom' },
    { id: 7, image: 'https://randomuser.me/api/portraits/women/4.jpg', name: 'Anna' },
    { id: 8, image: 'https://randomuser.me/api/portraits/men/4.jpg', name: 'James' },
    { id: 9, image: 'https://randomuser.me/api/portraits/women/5.jpg', name: 'Kate' },
    { id: 10, image: 'https://randomuser.me/api/portraits/men/5.jpg', name: 'Peter' },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Text className="font-TankerRegular text-[34px] text-dark-text">HI!  JOSEPH</Text>
      ),
      headerRight: () => (
        <View className="flex-row items-center gap-x-2">
          <FontAwesome name="bell" size={20} color="#FFFFFF" />
          <FontAwesome name="shopping-basket" size={20} color="#FFFFFF" />
        </View>
      ),
      title: '',
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.0021,
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        userInterfaceStyle="dark"
      />

      {/* Status Circles Container */}
      <View style={{ position: 'absolute', top: 20, width: '100%' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {/* Add Story Button */}
          <TouchableOpacity
            style={{
              marginRight: 15,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
                backgroundColor: '#ffffff40',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontAwesome name="plus" size={34} color="white" />
            </View>
            <Text className="mt-1 font-PlusJakartaSansMedium text-[12px] text-white">
              Add Story
            </Text>
          </TouchableOpacity>

          {statusProfiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={{
                marginRight: 15,
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 2,
                  borderRadius: 35,
                  backgroundColor: '#040405',
                }}>
                <Image
                  source={{ uri: profile.image }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#fff',
                  }}
                />
              </View>
              <Text className="mt-1 font-PlusJakartaSansMedium text-[12px] text-white">
                {profile.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: screenHeight * 0.2,
          backgroundColor: '#040405',
          padding: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}>
        <Text className="mb-4 font-TankerRegular text-[24px] text-dark-text">
          What would you love to buy today?
        </Text>

        <Pressable className="mb-4 h-[40px] w-full flex-row items-center gap-x-4 rounded-[10px] border border-dark-border bg-dark-surface pl-[16px]">
          <TextInput
            placeholder="Enter name of store or product you would love buy/from"
            placeholderTextColor="#B0B0B0"
            className="w-full font-PlusJakartaSansMedium text-[16px] text-dark-text"
          />
        </Pressable>

        <TouchableOpacity className="h-[60px] w-full flex-row items-center justify-center rounded-[10px] bg-[#EBF755]">
          <Text className="text-center font-PlusJakartaSansBold text-[16px] text-[#040405]">
            Search
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
