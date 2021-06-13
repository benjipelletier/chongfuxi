const colors = require('tailwindcss/colors')
const { colors: defaultColors } = require('tailwindcss/defaultTheme')


module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      ...defaultColors,
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.gray,
      orange: colors.orange,
    },
    minWidth: {
      '96': '24rem',
    },
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      backgroundOpacity: ['active'],
      borderRadius: ['first', 'last'],
      borderWidth: ['first', 'last'],
      opacity: ['active', 'disabled'],
      ringWidth: ['hover', 'active'],
      outline: ['hover', 'active'],
      backgroundColor: ['odd'],
    },
  },
  plugins: [],
}
