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
      // Make API call to request password reset
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
    <div className="relative min-h-[92vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* =========================================================================
          ROYAL MUGHAL PALACE ARCHITECTURAL BACKGROUND
      ========================================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <picture>
          <source srcSet="/mughal_palace_auth_bg.webp" type="image/webp" />
          <img
            src="/mughal_palace_auth_bg.jpg"
            alt="Royal Mughal Palace Atelier"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0806]/80 via-[#0C0806]/65 to-[#0C0806]/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(12,8,6,0.9)_100%)]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-[#1A130E]/90 border border-[#C5A059]/30 mb-3 shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <span className="font-serif text-2xl font-bold text-[#E8DAC5]">N</span>
        </div>
        <p className="text-[10px] sm:text-[11px] font-serif font-medium uppercase tracking-[0.26em] text-[#C5A059]/90">
          Credential Recovery • بازیابی چابی
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[#F5EDD6] mt-1 drop-shadow-sm">
          Forgot Your Password?
        </h2>
        <p className="text-xs text-[#B8A790] mt-1.5 max-w-sm mx-auto leading-relaxed">
          Enter your registered patron email address to receive secure reset instructions.
        </p>
      </div>

      <div className="relative z-10 mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#120D0A]/85 sm:bg-[#120D0A]/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-[#C5A059]/30 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4C4A8] mb-1.5">
                Email Address
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@domain.com"
                  className="w-full rounded-xl border border-[#C5A059]/25 bg-[#1C1612]/75 px-4 py-3 text-xs text-[#F5EDD6] placeholder:text-[#8C7A68] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B89248] via-[#C5A059] to-[#A88035] text-[#120D0A] font-serif font-semibold text-xs uppercase tracking-[0.18em] shadow-[0_8px_25px_rgba(197,160,89,0.25)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? 'Transmitting Instructions...' : 'Send Reset Instructions'}
              </button>
            </div>

            {message && (
              <div className={`text-xs text-center p-3 rounded-xl border ${
                message.includes('Failed')
                  ? 'border-red-400/30 bg-red-950/40 text-red-300'
                  : 'border-[#C5A059]/40 bg-[#1A130E] text-[#F5EDD6]'
              }`}>
                {message}
              </div>
            )}
          </form>

          <div className="mt-6 pt-5 border-t border-[#C5A059]/20 text-center">
            <p className="text-xs text-[#B8A790]">
              Remember your secret key?{' '}
              <Link href="/auth/login" className="font-semibold text-[#C5A059] hover:text-[#E8DAC5] transition-colors underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}