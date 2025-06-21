import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Assuming this is correct import for Tailwind CSS

// Make sure to load environment variables. Vite usually does this automatically.
// If you need specific environment variables for development only, consider .env.development or .env.local

export default defineConfig({
  // Configure the development server, including proxy rules
  server: {
    proxy: {
      // Proxy requests from '/api/currency' to the ExchangeRate-API endpoint
      // This helps bypass CORS issues in development
      '/api/currency': {
        target: 'https://v6.exchangerate-api.com', // The actual API domain
        changeOrigin: true, // Needed for virtual hosted sites
        // Rewrite the path: '/api/currency/pair/USD/INR' becomes '/v6/<API_KEY>/pair/USD/INR'
        rewrite: (path) => {
          // Access the API key from environment variables (Vite automatically exposes VITE_ prefixed ones)
          const apiKey = process.env.VITE_EXCHANGE_RATE_API_KEY;
          if (!apiKey) {
            console.error("VITE_EXCHANGE_RATE_API_KEY is not defined in your .env file!");
            // You might want to throw an error or handle this more gracefully
          }
          return path.replace(/^\/api\/currency/, `/v6/${apiKey}`);
        },
        secure: false, // Set to true for production if target uses HTTPS and has valid certs. For dev, sometimes false helps.
      },
      // You might also want a proxy for your backend API (localhost:5000)
      // This will prevent ERR_CONNECTION_REFUSED if you forget to start your backend sometimes
      // For example, if your backend is at http://localhost:5000/api-v1
      '/api-v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api-v1/, '/api-v1') // Not strictly necessary if target matches
      },
    },
  },

  // Plugins configuration
  plugins: [
    react(),
    tailwindcss({
      config: {
        darkMode: "class",
        content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        theme: {
          extend: {
            colors: {
              border: "hsl(var(--border))",
              input: "hsl(var(--input))",
              ring: "hsl(var(--ring))",
              background: "hsl(var(--background))",
              foreground: "hsl(var(--foreground))",
              primary: {
                DEFAULT: "hsl(var(--primary))",
                foreground: "hsl(var(--primary-foreground))",
              },
              secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))",
              },
              destructive: {
                DEFAULT: "hsl(var(--destructive))",
                foreground: "hsl(var(--destructive-foreground))",
              },
              muted: {
                DEFAULT: "hsl(var(--muted))",
                foreground: "hsl(var(--muted-foreground))",
              },
              accent: {
                DEFAULT: "hsl(var(--accent))",
                foreground: "hsl(var(--accent-foreground))",
              },
              popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
              },
              card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
              },
            },
          },
        },
        plugins: [], // Ensure this is inside `config` if it's a Tailwind CSS plugin config
      },
    }),
  ],
});