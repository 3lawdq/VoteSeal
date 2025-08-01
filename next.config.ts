
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Create the NextIntl plugin instance
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       { // Add pattern for Web3Auth avatars if needed (example: vercel avatars)
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/**',
      },
      { // Add pattern for Pinata IPFS Gateway
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**', // Allow paths starting with /ipfs/
      },
    ],
  },
   webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module, etc.
    // See https://github.com/vercel/next.js/issues/7755
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Required for Web3Auth libraries which might use older Buffer or crypto patterns
     config.resolve.fallback = {
       ...config.resolve.fallback, // Spread existing fallbacks
       buffer: require.resolve('buffer/'), // Provide a Buffer polyfill
       crypto: require.resolve('crypto-browserify'), // Provide a crypto polyfill
       stream: require.resolve('stream-browserify'), // Provide a stream polyfill
       assert: require.resolve('assert/'), // Provide an assert polyfill
       http: require.resolve('stream-http'), // Provide an http polyfill
       https: require.resolve('https-browserify'), // Provide an https polyfill
       os: require.resolve('os-browserify/browser'), // Provide an os polyfill
       url: require.resolve('url/'), // Provide a url polyfill
     };

      // Expose buffer globally, needed by some Web3Auth dependencies
     config.plugins = [
       ...(config.plugins || []),
       new (require('webpack').ProvidePlugin)({
         Buffer: ['buffer', 'Buffer'],
         process: 'process/browser', // Provide a process polyfill
       }),
     ];


    return config;
  },
};

// Wrap the config with the next-intl plugin
export default withNextIntl(nextConfig);
