'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 mb-4 shadow-sm">
          <span className="font-serif text-2xl font-black text-primary">N</span>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Atelier Notice</p>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground mt-2">
          An Interruption Occurred
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We apologize for the brief pause in your atelier journey. Our artisans have been notified.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="btn-luxury-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span>Retry Operation</span>
          </button>
          <Link
            href="/"
            className="btn-luxury-outline px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] w-full sm:w-auto text-center"
          >
            Atelier Homepage
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-[11px] text-muted-foreground font-mono">
            Digest Code: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}