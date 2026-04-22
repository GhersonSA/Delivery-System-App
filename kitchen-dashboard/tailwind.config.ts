import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',
        accent: '#f97316',
        ink: '#e2e8f0',
      },
    },
  },
  plugins: [],
};

export default config;
