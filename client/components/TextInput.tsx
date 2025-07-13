import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View, Text, TouchableOpacity } from 'react-native';
import { cn } from '~/lib/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>((
  {
    label,
    error,
    rightIcon,
    onRightIconPress,
    isPassword,
    showPassword,
    onTogglePassword,
    className,
    ...props
  },
  ref
) => {
  const inputStyles = cn(
    'bg-gray-50 rounded-2xl px-4 py-3 font-technor-regular',
    error ? 'border-2 border-red-500' : 'border-2 border-transparent',
    (rightIcon || isPassword) && 'pr-12',
    className
  );

  return (
    <View className="w-full">
      {label && (
        <Text className="font-technor-medium text-gray-700 mb-2">
          {label}
        </Text>
      )}
      
      <View className="relative">
        <RNTextInput
          ref={ref}
          className={inputStyles}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <TouchableOpacity
            onPress={isPassword ? onTogglePassword : onRightIconPress}
            className="absolute right-4 top-3"
          >
            {isPassword ? (
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#666"
              />
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-1 font-technor-regular">
          {error}
        </Text>
      )}
    </View>
  );
});

TextInput.displayName = 'TextInput';