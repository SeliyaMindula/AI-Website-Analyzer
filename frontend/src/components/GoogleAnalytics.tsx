'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function GoogleAnalyticsPageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || typeof window.gtag !== 'function') return;
    window.gtag('config', measurementId, { page_path: pathname });
  }, [pathname, measurementId]);

  return null;
}
