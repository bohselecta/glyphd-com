/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./app/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'ui-monospace',
  				'SFMono-Regular',
  				'monospace'
  			]
  		},
  		fontSize: {
  			display: [
  				'2.25rem',
  				{
  					lineHeight: '1.1',
  					fontWeight: '600'
  				}
  			],
  			h1: [
  				'1.875rem',
  				{
  					lineHeight: '1.2',
  					fontWeight: '600'
  				}
  			],
  			h2: [
  				'1.5rem',
  				{
  					lineHeight: '1.25',
  					fontWeight: '600'
  				}
  			],
  			h3: [
  				'1.25rem',
  				{
  					lineHeight: '1.3',
  					fontWeight: '600'
  				}
  			],
  			h4: [
  				'1.125rem',
  				{
  					lineHeight: '1.35',
  					fontWeight: '500'
  				}
  			],
  			bodylg: [
  				'1.0625rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			body: [
  				'1rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			ui: [
  				'0.9375rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			caption: [
  				'0.8125rem',
  				{
  					lineHeight: '1.4'
  				}
  			]
  		},
  		screens: {
  			md: '768px',
  			lg: '1024px'
  		},
  		colors: {
  			glass: 'rgba(255,255,255,0.06)',
  			'text-primary': '#E6F1FF',
  			'text-secondary': '#9FB3C8',
  			'text-muted': '#6C7A89',
  			'accent-pink': '#FF2DAA',
  			'accent-cyan': '#33FFF2',
  			base: {
  				dark: '#0B0C10'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		letterSpacing: {
  			tight: '-0.01em',
  			tighter: '-0.005em'
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
