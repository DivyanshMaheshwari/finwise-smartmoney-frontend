// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
      extend: {
        animation: {
          'fade-in': 'fadeIn 1s ease-in-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
        },
      },
    },
    plugins: [],
  }
  