import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site-config';

export default function Manifest() {
  return {
    name: SITE_NAME,
    short_name: 'WebPulses',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
