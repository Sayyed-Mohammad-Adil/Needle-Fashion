'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Password reset instructions have been sent to your email.');
        setEmail('');
      } else {
        throw new Error('Failed to send reset instructions');
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setMessage('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[82vh] bg-background text-foreground flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md border border-border p-8 sm:p-12 space-y-8">
        <div className="space-y-2 border-b border-border pb-6">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
            Account Recovery
          </p>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-xs font-light text-muted-foreground pt-1 leading-relaxed">
            Enter your email address to receive password reset instructions.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>

          {message && (
            <p className="text-xs font-light text-foreground border border-border p-3">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <Link href="/auth/login" className="text-foreground underline underline-offset-4">
            Return to Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
