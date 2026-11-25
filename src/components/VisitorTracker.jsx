import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function VisitorTracker() {
  const { pathname } = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    void fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname, referrer: document.referrer }),
      credentials: 'omit',
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
