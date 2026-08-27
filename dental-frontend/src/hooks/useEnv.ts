'use client';

import { useState, useEffect } from 'react';

interface EnvConfig {
  STRAPI_URL: string;
  NEXT_PUBLIC_STRAPI_URL?: string;
}

/**
 * Custom Hook: useEnv
 * 
 * Fetches environment configuration from the /api/env endpoint.
 * Provides a safe way for client components to access server-side
 * environment variables without using NEXT_PUBLIC_ prefixes.
 * 
 * @returns EnvConfig object and loading state
 */
export function useEnv() {
  const [env, setEnv] = useState<EnvConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnv() {
      try {
        const response = await fetch('/api/env');
        const data = await response.json();
        setEnv(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    fetchEnv();
  }, []);

  return { env, loading };
}
