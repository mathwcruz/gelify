module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('tw-elements/dist/plugin'),
  ],
}
