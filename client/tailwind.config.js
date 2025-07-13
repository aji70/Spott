/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066FF', // The blue color used in splash screen
          dark: '#0052CC',
          light: '#4D94FF',
        },
        secondary: {
          DEFAULT: '#333333',
          light: '#666666',
        },
        background: {
          DEFAULT: '#FFFFFF',
          alt: '#F5F5F5',
          dark: '#111318',
        },
        text: {
          DEFAULT: '#333333',
          light: '#666666',
          inverse: '#FFFFFF',
          muted: '#787A80',
        },
        success: '#34C759',
        error: '#FF3B30',
        warning: '#FF9500',
        info: '#007AFF',
        border: {
          DEFAULT: '#E5E5E5',
          dark: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        'technor-black': ['Technor-Black'],
        'technor-bold': ['Technor-Bold'],
        'technor-extralight': ['Technor-Extralight'],
        'technor-regular': ['Technor-Regular'],
        'technor-light': ['Technor-Light'],
        'technor-medium': ['Technor-medium'],
        'technor-semibold': ['Technor-Semibold'],
      },
    },
  },
  plugins: [],
};
