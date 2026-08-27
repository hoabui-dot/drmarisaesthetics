const { mergeConfig } = require('vite');

module.exports = (config) => {
  // Determine if we're using Cloudflare tunnel
  const isCloudflare = process.env.CLOUDFLARE_TUNNEL_HOST && 
                       process.env.CLOUDFLARE_TUNNEL_HOST !== 'localhost';
  
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      host: process.env.HOST || '0.0.0.0',
      strictPort: false,
      // Disable HMR when using Cloudflare tunnel to prevent connection issues
      hmr: isCloudflare ? false : true,
      // Allow all hosts for Cloudflare tunnels
      allowedHosts: true
    },
  });
};
