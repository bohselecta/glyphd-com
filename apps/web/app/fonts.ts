import { Inter, JetBrains_Mono } from 'next/font/google';

export const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  display: 'swap',
  preload: true
});

export const jetmono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono', 
  display: 'swap',
  preload: true
});

