'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { SparklesIcon } from '@heroicons/react/24/outline';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      await registerUser(data.email, data.password, {
        name: data.name,
        phone: data.phone,
      });
      toast.success('Registration successful! Welcome to Needle Fashion.');
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preparing Atelier Membership...</p>
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0806]/80 via-[#0C0806]/65 to-[#0C0806]/85 backdrop-blur-[2px]" />
        {/* Subtle Luxury Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(12,8,6,0.9)_100%)]" />
      </div>

      {/* Header Monogram & Subtitle */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Monogram Badge */}
        <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-[#1A130E]/90 border border-[#C5A059]/30 mb-3 shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <span className="font-serif text-2xl font-bold text-[#E8DAC5]">N</span>
        </div>
        <p className="text-[10px] sm:text-[11px] font-serif font-medium uppercase tracking-[0.26em] text-[#C5A059]/90">
          Private Patron Club • شاہی حلقہ
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[#F5EDD6] mt-1 drop-shadow-sm">
          Create Atelier Account
        </h2>
        <p className="text-xs text-[#B8A790] mt-1.5 max-w-sm mx-auto leading-relaxed">
          Bespoke bridal consults, private preview salons, and master karigar garment records.
        </p>
      </div>

      {/* Glassmorphic Luxury Patron Card */}
      <div className="relative z-10 mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#120D0A]/85 sm:bg-[#120D0A]/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-3xl border border-[#C5A059]/30 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4C4A8] mb-1.5">
                Full Name
              </label>
              <div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Vikramaditya Rathore"
                  {...register('name')}
                  className={`w-full rounded-xl border bg-[#1C1612]/75 px-4 py-2.5 text-xs text-[#F5EDD6] placeholder:text-[#8C7A68] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 transition-all ${
                    errors.name ? 'border-red-400/80' : 'border-[#C5A059]/25'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4C4A8] mb-1.5">
                Email Address
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="patron@domain.com"
                  {...register('email')}
                  className={`w-full rounded-xl border bg-[#1C1612]/75 px-4 py-2.5 text-xs text-[#F5EDD6] placeholder:text-[#8C7A68] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 transition-all ${
                    errors.email ? 'border-red-400/80' : 'border-[#C5A059]/25'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4C4A8] mb-1.5">
                Phone / WhatsApp Number
              </label>
              <div>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                  className={`w-full rounded-xl border bg-[#1C1612]/75 px-4 py-2.5 text-xs text-[#F5EDD6] placeholder:text-[#8C7A68] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 transition-all ${
                    errors.phone ? 'border-red-400/80' : 'border-[#C5A059]/25'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4C4A8] mb-1.5">
                Password
              </label>
              <div>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  {...register('password')}
                  className={`w-full rounded-xl border bg-[#1C1612]/75 px-4 py-2.5 text-xs text-[#F5EDD6] placeholder:text-[#8C7A68] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 transition-all ${
                    errors.password ? 'border-red-400/80' : 'border-[#C5A059]/25'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D4C4A8] mb-1.5">
                Confirm Password
              </label>
              <div>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  {...register('confirmPassword')}
                  className={`w-full rounded-xl border bg-[#1C1612]/75 px-4 py-2.5 text-xs text-[#F5EDD6] placeholder:text-[#8C7A68] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/40 transition-all ${
                    errors.confirmPassword ? 'border-red-400/80' : 'border-[#C5A059]/25'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B89248] via-[#C5A059] to-[#A88035] text-[#120D0A] font-serif font-semibold text-xs uppercase tracking-[0.18em] shadow-[0_8px_25px_rgba(197,160,89,0.25)] hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  'Enrolling Patron...'
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4 text-[#120D0A]" />
                    <span>Join Atelier Membership</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#C5A059]/20 text-center">
            <p className="text-xs text-[#B8A790]">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-[#C5A059] hover:text-[#E8DAC5] transition-colors underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}