import { forwardRef } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  /**
   * Button text content
   */
  title: string;
  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * Size variant
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether button is in loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Whether button is full width
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * Icon to display before the text
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display after the text
   */
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<View, ButtonProps>((
  { 
    title, 
    variant = 'primary', 
    size = 'medium', 
    isLoading = false, 
    isFullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    ...touchableProps 
  }, 
  ref
) => {
  // Determine style classes based on props
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-200 border border-gray-300';
      case 'outline':
        return 'bg-transparent border border-indigo-500';
      case 'ghost':
        return 'bg-transparent';
      case 'primary':
      default:
        return 'bg-indigo-500 shadow-sm';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'py-1.5 px-3';
      case 'large':
        return 'py-4 px-6';
      case 'medium':
      default:
        return 'py-2.5 px-4';
    }
  };

  const getTextColorClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'text-gray-800';
      case 'outline':
      case 'ghost':
        return 'text-indigo-600';
      case 'primary':
      default:
        return 'text-white';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      case 'medium':
      default:
        return 'text-base';
    }
  };

  const getWidthClass = () => isFullWidth ? 'w-full' : '';
  const getDisabledClass = () => (disabled || isLoading) ? 'opacity-50' : '';

  return (
    <TouchableOpacity
      ref={ref}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading }}
      accessibilityLabel={title}
      {...touchableProps}
      className={`
        flex-row items-center justify-center
        rounded-[28px]
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getWidthClass()}
        ${getDisabledClass()}
        ${touchableProps.className || ''}
      `}
    >
      {isLoading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? 'white' : '#4f46e5'} 
          className="mr-2" 
        />
      )}
      
      {!isLoading && leftIcon && <View className="mr-2">{leftIcon}</View>}
      
      <Text 
        className={`font-semibold ${getTextColorClasses()} ${getTextSizeClasses()}`}
        numberOfLines={1}
      >
        {title}
      </Text>
      
      {!isLoading && rightIcon && <View className="ml-2">{rightIcon}</View>}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';
