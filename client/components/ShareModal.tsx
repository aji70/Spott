import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  videoId: string;
  videoUrl?: string;
}

const shareOptions = [
  {
    id: 'copy',
    name: 'Copy Link',
    icon: 'copy',
    iconSet: 'FontAwesome',
    color: '#FFFFFF',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'whatsapp',
    iconSet: 'FontAwesome',
    color: '#25D366',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    iconSet: 'FontAwesome',
    color: '#1877F2',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'twitter',
    iconSet: 'FontAwesome',
    color: '#1DA1F2',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    iconSet: 'FontAwesome',
    color: '#E4405F',
  },
  {
    id: 'messenger',
    name: 'Messenger',
    icon: 'facebook-messenger',
    iconSet: 'FontAwesome5',
    color: '#0084FF',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'telegram',
    iconSet: 'FontAwesome5',
    color: '#0088CC',
  },
  {
    id: 'email',
    name: 'Email',
    icon: 'email',
    iconSet: 'MaterialIcons',
    color: '#EA4335',
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: 'sms',
    iconSet: 'MaterialIcons',
    color: '#34A853',
  },
];

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  videoId,
  videoUrl = `https://spott.app/video/${videoId}`,
}) => {
  const handleShare = (platform: string) => {
    switch (platform) {
      case 'copy':
        // In a real app, you'd use Clipboard from react-native
        Alert.alert('Link Copied', 'Video link has been copied to clipboard!');
        break;
      case 'whatsapp':
        Alert.alert('WhatsApp', 'Opening WhatsApp to share...');
        break;
      case 'facebook':
        Alert.alert('Facebook', 'Opening Facebook to share...');
        break;
      case 'twitter':
        Alert.alert('Twitter', 'Opening Twitter to share...');
        break;
      case 'instagram':
        Alert.alert('Instagram', 'Opening Instagram to share...');
        break;
      default:
        Alert.alert('Share', `Sharing via ${platform}...`);
    }
    onClose();
  };

  const renderIcon = (option: any) => {
    const iconProps = {
      name: option.icon,
      size: 24,
      color: option.color,
    };

    switch (option.iconSet) {
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      default:
        return <FontAwesome {...iconProps} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-dark-bg rounded-t-3xl" style={{ height: screenHeight * 0.5 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-dark-border px-4 py-4">
          <Text className="font-PlusJakartaSansBold text-lg text-dark-text">
            Share Video
          </Text>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Share Options */}
        <ScrollView className="flex-1 px-4 py-6">
          <View className="flex-row flex-wrap justify-between">
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleShare(option.id)}
                className="mb-6 w-1/4 items-center"
              >
                <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-dark-surface">
                  {renderIcon(option)}
                </View>
                <Text className="text-center font-PlusJakartaSansRegular text-xs text-dark-text">
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Options */}
          <View className="mt-6 border-t border-dark-border pt-6">
            <TouchableOpacity
              onPress={() => handleShare('report')}
              className="flex-row items-center py-4"
            >
              <FontAwesome name="flag" size={20} color="#FF3040" />
              <Text className="ml-4 font-PlusJakartaSansRegular text-base text-dark-text">
                Report Content
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleShare('not-interested')}
              className="flex-row items-center py-4"
            >
              <FontAwesome name="eye-slash" size={20} color="#787A80" />
              <Text className="ml-4 font-PlusJakartaSansRegular text-base text-dark-text">
                Not Interested
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
