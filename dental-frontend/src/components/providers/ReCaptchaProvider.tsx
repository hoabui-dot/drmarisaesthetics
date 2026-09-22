'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface ReCaptchaProviderProps {
  children: React.ReactNode;
}

/**
 * ReCaptcha Provider Component
 * 
 * Wraps the application with Google reCAPTCHA v3 provider.
 * This enables invisible reCAPTCHA protection for forms.
 * 
 * The site key is loaded from environment variables.
 */
export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const recaptchaEnabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED !== 'false';
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaEnabled) {
    return <>{children}</>;
  }

  // If no site key is configured, render children without reCAPTCHA
  // This allows development without reCAPTCHA setup
  if (!recaptchaSiteKey) {
    console.warn('[ReCaptcha] Site key not configured. reCAPTCHA is disabled.');
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
