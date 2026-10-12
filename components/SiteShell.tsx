'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';

// Defer live-chat and floating widget loading until client hydration to optimize TBT & INP
const FloatingWidget = dynamic(() => import('./FloatingWidget'), {
  ssr: false,
});

interface SiteShellProps {
  children: React.ReactNode;
}

export default function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // If in /admin route, don't render public header, footer, or floating widget
  if (isAdmin) {
    return <main className="admin-root-viewport">{children}</main>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingWidget />
    </>
  );
}
