import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
const recentVisits = new Map();

export default function VisitorTracker() {
  const { pathname } = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const now = Date.now();
    for (const [path,time] of recentVisits) if (now-time>=60000) recentVisits.delete(path);
    if (recentVisits.has(pathname)) return;
    recentVisits.set(pathname,now);
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch {}
    void fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname, referrer }),
      credentials: 'omit',
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
