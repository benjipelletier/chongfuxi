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
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      backgroundOpacity: ['active'],
      borderRadius: ['first', 'last'],
      opacity: ['active'],
      ringWidth: ['hover', 'active'],
      outline: ['hover', 'active'],
    },
  },
  plugins: [],
}
