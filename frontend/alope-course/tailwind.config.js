const forms = require('@tailwindcss/forms');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],

                spartan: [
                    'League Spartan',
                    ...defaultTheme.fontFamily.sans,
                ],
            },

            colors: {
                primary: '#2B7FFF',
                grey: '#737373',
            },

            animation: {
                'scale-pulse':
                    'scalePulse 2s ease-in-out infinite',
            },

            keyframes: {
                scalePulse: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: '0.5',
                    },

                    '50%': {
                        transform: 'scale(1.1)',
                        opacity: '1',
                    },
                },
            },
        },
    },

    plugins: [forms],
};