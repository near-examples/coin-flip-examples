import { useEffect } from 'react';
import { NearProvider } from '@/components/near-provider';

import { Navigation } from '@/components/Navigation';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  // Keep Bootstrap's color mode in sync with the system preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () =>
      document.documentElement.setAttribute('data-bs-theme', mq.matches ? 'dark' : 'light');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <NearProvider>
      <Navigation />
      <Component {...pageProps} />
    </NearProvider>
  );
}
