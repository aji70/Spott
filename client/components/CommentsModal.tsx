import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  text: string;
  likes: number;
  timestamp: string;
  isLiked: boolean;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  videoId: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      username: 'sarah_tech',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isVerified: true,
    },
    text: 'This is amazing! Where can I get this?',
    likes: 45,
    timestamp: '2h',
    isLiked: false,
  },
  {
    id: '2',
    user: {
      username: 'tech_lover99',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      isVerified: false,
    },
    text: 'The quality looks incredible! 🔥',
    likes: 23,
    timestamp: '1h',
    isLiked: true,
  },
  {
    id: '3',
    user: {
      username: 'shopaholic_jane',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      isVerified: false,
    },
    text: 'Added to my wishlist! Thanks for the review',
    likes: 12,
    timestamp: '45m',
    isLiked: false,
  },
];

export const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  onClose,
  comments = mockComments,
  videoId,
}) => {
  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState(comments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          username: 'joseph_user',
          avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
          isVerified: false,
        },
        text: newComment,
        likes: 0,
        timestamp: 'now',
        isLiked: false,
      };
      setCommentsList([comment, ...commentsList]);
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    setCommentsList(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View className="flex-row px-4 py-3">
      <Image source={{ uri: item.user.avatar }} className="h-8 w-8 rounded-full" />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="font-PlusJakartaSansMedium text-sm text-dark-text">
            {item.user.username}
          </Text>
          {item.user.isVerified && (
            <FontAwesome name="check-circle" size={12} color="#1DA1F2" style={{ marginLeft: 4 }} />
          )}
          <Text className="ml-2 font-PlusJakartaSansRegular text-xs text-dark-text-secondary">
            {item.timestamp}
          </Text>
        </View>
        <Text className="mt-1 font-PlusJakartaSansRegular text-sm text-dark-text">
          {item.text}
        </Text>
        <View className="mt-2 flex-row items-center">
          <TouchableOpacity
            onPress={() => handleLikeComment(item.id)}
            className="flex-row items-center"
          >
            <FontAwesome
              name={item.isLiked ? 'heart' : 'heart-o'}
              size={14}
              color={item.isLiked ? '#FF3040' : '#787A80'}
            />
            <Text className="ml-1 font-PlusJakartaSansRegular text-xs text-dark-text-secondary">
              {formatNumber(item.likes)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="ml-4">
            <Text className="font-PlusJakartaSansRegular text-xs text-dark-text-secondary">
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-dark-bg rounded-t-3xl" style={{ height: screenHeight * 0.6 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-dark-border px-4 py-3">
          <Text className="font-PlusJakartaSansBold text-lg text-dark-text">
            {commentsList.length} comments
          </Text>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        <FlatList
          data={commentsList}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="border-t border-dark-border"
        >
          <View className="flex-row items-center px-4 py-3">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/10.jpg' }}
              className="h-8 w-8 rounded-full"
            />
            <View className="ml-3 flex-1 flex-row items-center rounded-full bg-dark-surface px-4 py-2">
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                placeholderTextColor="#787A80"
                className="flex-1 font-PlusJakartaSansRegular text-sm text-dark-text"
                multiline
                maxLength={500}
              />
              {newComment.trim() && (
                <TouchableOpacity onPress={handleAddComment} className="ml-2">
                  <FontAwesome name="send" size={16} color="#EBF755" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};
