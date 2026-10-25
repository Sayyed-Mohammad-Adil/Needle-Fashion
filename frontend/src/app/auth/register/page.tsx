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
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Monogram */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 mb-4 shadow-sm">
          <span className="font-serif text-2xl font-black text-primary">N</span>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Private Patron Club</p>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground mt-1">
          Create Atelier Account
        </h2>
        <p className="text-xs text-muted-foreground mt-2">
          Enjoy bespoke bridal consults, private preview events, and tailored garment logs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-xl">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                Full Name
              </label>
              <div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Vikramaditya Rathore"
                  {...register('name')}
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                    errors.name ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>

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
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                    errors.email ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                Phone / WhatsApp Number
              </label>
              <div>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  {...register('phone')}
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                    errors.phone ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                Password
              </label>
              <div>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  {...register('password')}
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                    errors.password ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                Confirm Password
              </label>
              <div>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  {...register('confirmPassword')}
                  className={`w-full rounded-xl border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                    errors.confirmPassword ? 'border-red-400' : 'border-border'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-red-500">{errors.confirmPassword.message}</p>
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
                  'Enrolling Patron...'
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    <span>Join Atelier Membership</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}