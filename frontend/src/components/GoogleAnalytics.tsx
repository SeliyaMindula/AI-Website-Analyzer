'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function sendPageView(measurementId: string, pathname: string) {
  window.gtag?.('event', 'page_view', {
    send_to: measurementId,
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function GoogleAnalyticsPageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (typeof window.gtag === 'function') {
      sendPageView(measurementId, pathname);
      return;
    }

    // gtag loads afterInteractive — retry until ready (fixes missing first pageview)
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (typeof window.gtag === 'function') {
        sendPageView(measurementId, pathname);
        clearInterval(timer);
        return;
      }
      if (++attempts > 50) clearInterval(timer);
    }, 100);

    return () => clearInterval(timer);
  }, [pathname, measurementId]);

  return null;
}
