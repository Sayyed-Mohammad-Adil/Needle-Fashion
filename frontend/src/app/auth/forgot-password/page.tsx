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
        {/* Soft, Calming Architectural Scrim for Flawless Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* Main Luxury Patron Card with Integrated Header */}
      <div className="relative z-10 w-full sm:max-w-md mx-auto my-auto">
        <div className="bg-[#FAF7F2]/96 sm:bg-[#FAF7F2]/98 backdrop-blur-2xl py-7 px-6 sm:px-9 rounded-3xl border border-[#C5A059]/40 shadow-[0_24px_70px_rgba(0,0,0,0.45),0_0_25px_rgba(197,160,89,0.12)]">
          {/* Card Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-[#C5A059]/40 mb-2.5 shadow-sm">
              <span className="font-serif text-2xl font-bold text-[#8C6B28]">N</span>
            </div>
            <p className="text-[10px] font-serif font-semibold uppercase tracking-[0.24em] text-[#9E7A32]">
              Credential Recovery • بازیابی چابی
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A120B] mt-0.5">
              Forgot Your Password?
            </h2>
            <p className="text-xs text-[#6B5E51] mt-1 max-w-sm mx-auto leading-relaxed">
              Enter your registered patron email address to receive secure reset instructions.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#3D3226] mb-1">
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
                placeholder="patron@domain.com"
                className="w-full rounded-xl border border-[#D9CDBF] bg-white px-3.5 py-2.5 text-xs text-[#1C1510] placeholder:text-[#A39686] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 shadow-sm transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B89248] via-[#C5A059] to-[#9E7934] text-[#120D0A] font-serif font-semibold text-xs uppercase tracking-[0.18em] shadow-[0_6px_18px_rgba(197,160,89,0.3)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? 'Transmitting Instructions...' : 'Send Reset Instructions'}
              </button>
            </div>

            {message && (
              <div className={`text-xs text-center p-3 rounded-xl border ${
                message.includes('Failed')
                  ? 'border-red-400/40 bg-red-50 text-red-700'
                  : 'border-[#C5A059]/40 bg-[#FAF3E0] text-[#7A5B20]'
              }`}>
                {message}
              </div>
            )}
          </form>

          <div className="mt-5 pt-4 border-t border-[#E8DEC8] text-center">
            <p className="text-xs text-[#6B5E51]">
              Remember your secret key?{' '}
              <Link href="/auth/login" className="font-semibold text-[#8C6B28] hover:text-[#5E4717] transition-colors underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}