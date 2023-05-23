/** @type {import('tailwindcss').Config} */
export default {
  content: ['*.html', './pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      textColor: {
        skin: { base: 'var(--color-text-base)', muted: 'var(--color-text-muted)', inverse: 'var(--color-text-inverse)' },
      },
      backgroundColor: {
        skin: {
          fill: 'var(--color-fill)',
          muted: 'var(--color-fill-muted)',
          hover: 'var(--color-fill-hover)',
          'button-accent': 'teal-500',
          'button-accent-hover': 'teal-600',
          'button-accent-active': 'teal-600',
          receiver: '#212121',
          sender: '#beff82',
        },
      },
      outlineColor: {
        skin: {
          fill: 'var(--color-fill)',
          muted: 'var(--color-fill-muted)',
          hover: 'var(--color-fill-hover)',
        },
      },
      borderColor: {
        skin: {
          base: 'var(--color-text-base)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        },
      },
      gap: {
        tiny: '0.25rem',
        xs: '.5rem',
        sm: '1rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
        '2xl': '5rem',
        '3xl': '6rem',
        '4xl': '7rem',
        '5xl': '8rem',
        '6xl': '9rem',
      },
      padding: {
        // padding should be in pixel values with small.
        xs: '1px',
        sm: '2px',
        md: '4px',
        lg: '8px',
        xl: '16px',
        '2xl': '32px',
        '3xl': '64px',
        '4xl': '128px',
      },
      margin: {
        sm: '1rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
        '2xl': '5rem',
        '3xl': '6rem',
        '4xl': '7rem',
        '5xl': '8rem',
        '6xl': '9rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        default: 'rgba(0, 0, 0, 0.04) 0px 3px 5px;',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        liftup: 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
        'left-bottom': '-0px 0px 2px rgba(0, 0, 0, 0.2);',
      },
      fontFamily: {
        sans: 'var(--font-face-body)',
        code: 'var(--font-face-code)',
      },
      fontSize: {
        tiny: '0.5rem',
        '2xs': '0.625rem',
        xs: '.75rem',
        sm: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      flexGrow: {
        sm: '1',
        md: '2',
        lg: '3',
        xl: '4',
      },
      animation: {
        animatedBox: 'animatedBox 1s ease-in-out infinite alternate',
      },

      keyframes: {
        animatedBox: {
          '0%': { backgroundColor: 'red' },
          '100%': { backgroundColor: 'green' },
        },
      },
    },

    plugins: [],
  },
};

// backgroundImage: {
//   'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
//   'gradient-conic':
//     'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
// },
//2s infinite alternate
// textColor: {
//   skin: {
//     base: 'var(--color-text-base)',
//     muted: 'var(--color-text-muted)',
//     inverse: 'var(--color-text-inverse)',
//   },
// },

/*@keyframes animatedBox {
  0% {
    background-color: #c3cdd3;
  }
  100% {
    background-color: #c8e7c8;
  }
}

*/
