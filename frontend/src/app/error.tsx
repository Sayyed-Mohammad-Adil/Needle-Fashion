'use client';

import { useEffect } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
          Notice
        </p>
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm font-light text-muted-foreground leading-relaxed">
          We encountered a brief interruption while loading this page. Please try again.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-7 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-auto"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-7 py-3.5 border border-border text-foreground text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors w-full sm:w-auto text-center"
          >
            Return Home
          </Link>
        </div>

        {error.digest && (
          <p className="text-[11px] text-muted-foreground font-mono pt-2">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
