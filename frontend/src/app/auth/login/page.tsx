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
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Monogram */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 mb-4 shadow-sm">
          <span className="font-serif text-2xl font-black text-primary">N</span>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">The Haute Atelier</p>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground mt-1">
          Welcome to Needle Fashion
        </h2>
        <p className="text-xs text-muted-foreground mt-2">
          Enter your credentials to access your bespoke orders &amp; bridal wishlist.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-xl">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                Email Address
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="patron@domain.com"
                  {...register('email')}
                  className={`w-full rounded-xl border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                    errors.email ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-[11px] text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground">
                  Secret Key / Password
                </label>
                <Link href="/auth/forgot-password" className="text-[11px] text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full rounded-xl border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                    errors.password ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1.5 text-[11px] text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-luxury-gold py-3.5 text-xs font-semibold uppercase tracking-[0.18em] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Verifying Credentials...'
                ) : (
                  <>
                    <LockClosedIcon className="w-4 h-4" />
                    <span>Enter Atelier Portal</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              New patron?{' '}
              <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                Create Member Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}