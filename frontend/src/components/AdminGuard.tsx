'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ShieldExclamationIcon, ArrowLeftIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setHasChecked(true);
      }
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading || !hasChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-lg font-bold text-primary">N</span>
          </div>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">
          Verifying Royal Atelier Credentials...
        </p>
      </div>
    );
  }

  // If authenticated but not an admin
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 select-none">
        <div className="max-w-md w-full bg-card rounded-3xl p-8 sm:p-10 border border-primary/30 shadow-2xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-500">
            <ShieldExclamationIcon className="w-8 h-8" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-primary block mb-1">
            Royal Atelier Security Protocol
          </span>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Restricted Admin Portal
          </h2>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            The Needle Fashion Administrative Portal is restricted strictly to authorized master cutters, curatorial directors, and salon managers. Your account (<span className="text-foreground font-semibold">{user?.email}</span>) does not possess executive clearance.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/"
              className="btn-luxury-gold py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center"
            >
              Return to Storefront
            </Link>
            <button
              onClick={logout}
              className="py-3 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary transition-all"
            >
              Sign In with Different Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
