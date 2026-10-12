'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import FloatingWidget from './FloatingWidget';

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
