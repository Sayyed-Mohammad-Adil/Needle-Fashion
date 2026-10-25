'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { SparklesIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && !isLoading) {
      router.push(redirect);
    }
  }, [isAuthenticated, isLoading, router, redirect]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      toast.success('Welcome back to The Needle Atelier!');
      router.push(redirect);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials. Please verify your email & password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Opening Atelier Portal...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* =========================================================================
          ROYAL MUGHAL PALACE ARCHITECTURAL BACKGROUND
          Colonnade corridor with Makrana marble arches, lanterns, and candlelight
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
              The Haute Atelier • شاہی کارخانہ
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1A120B] mt-0.5">
              Welcome to Needle Fashion
            </h2>
            <p className="text-xs text-[#6B5E51] mt-1 max-w-sm mx-auto leading-relaxed">
              Access your bespoke bridal orders, custom measurement logs, and private commissions.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#3D3226] mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="patron@domain.com"
                {...register('email')}
                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-[#1C1510] placeholder:text-[#A39686] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 shadow-sm transition-all ${
                  errors.email ? 'border-red-400' : 'border-[#D9CDBF]'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#3D3226]">
                  Secret Key / Password
                </label>
                <Link href="/auth/forgot-password" className="text-[11px] text-[#8C6B28] hover:text-[#5E4717] transition-colors underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-[#1C1510] placeholder:text-[#A39686] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 shadow-sm transition-all ${
                  errors.password ? 'border-red-400' : 'border-[#D9CDBF]'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-[11px] text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B89248] via-[#C5A059] to-[#9E7934] text-[#120D0A] font-serif font-semibold text-xs uppercase tracking-[0.18em] shadow-[0_6px_18px_rgba(197,160,89,0.3)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  'Verifying Credentials...'
                ) : (
                  <>
                    <LockClosedIcon className="w-4 h-4 text-[#120D0A]" />
                    <span>Enter Atelier Portal</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-[#E8DEC8] text-center">
            <p className="text-xs text-[#6B5E51]">
              New patron?{' '}
              <Link href="/auth/register" className="font-semibold text-[#8C6B28] hover:text-[#5E4717] transition-colors underline-offset-4 hover:underline">
                Create Member Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}