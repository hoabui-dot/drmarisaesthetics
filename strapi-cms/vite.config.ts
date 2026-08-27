import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Determine if we're using Cloudflare tunnel
  const isCloudflare = process.env.CLOUDFLARE_TUNNEL_HOST && 
                       process.env.CLOUDFLARE_TUNNEL_HOST !== 'localhost';
  
  return mergeConfig(config, {
    server: {
      host: process.env.HOST || '0.0.0.0',
      strictPort: false,
      // Disable HMR when using Cloudflare tunnel to prevent connection issues
      hmr: isCloudflare ? false : true,
      // Allow all hosts for Cloudflare tunnels
      allowedHosts: true,
    },
  });
};
