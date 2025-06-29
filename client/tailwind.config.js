/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        PlusJakartaSansBold: ['PlusJakartaSans-Bold'],
        PlusJakartaSansLight: ['PlusJakartaSans-Light'],
        PlusJakartaSansExtraBold: ['PlusJakartaSans-ExtraBold'],
        PlusJakartaSansMedium: ['PlusJakartaSans-Medium'],
        PlusJakartaSansRegular: ['PlusJakartaSans-Regular'],
        TankerRegular: ['Tanker-Regular'],
      },
      colors: {
        'Orange/08': '#FF6D1B',
        'Orange/07': '#FF8A49',
        'Orange/06': '#FFA776',
        'Orange/05': '#FFA776',
        'Green/09': '#32BD76',
        'Green/07': '#57E09A',
        'Green/o8': '#2DD881',
        'Green/01': '#FBFEFC',
        'Purple/09': '#6B3C88',
        'Purple/08': '#8D4FB4',
        'Purple/07': '#A187B5',
        'Grey/06': '#787A80',
        'Grey/07': '#12141B',
        'Grey/08': '#ffffff30',
        'Grey/04': '#D2D3D5',
        // Dark theme colors
        'dark-bg': '#040405',
        'dark-surface': '#1A1A1A',
        'dark-card': '#252525',
        'dark-text': '#FFFFFF',
        'dark-text-secondary': '#B0B0B0',
        'dark-border': '#333333',
      },
    },
  },
  plugins: [],
};
