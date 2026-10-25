'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  address: z.object({
    street: z.string().min(1, { message: 'Street address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    postalCode: z.string().min(6, { message: 'Please enter a valid postal code' }),
    country: z.string().min(1, { message: 'Country is required' }),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: user || {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      },
    },
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/auth/login?redirect=/customer/profile');
      return;
    }

    // Reset form with user data when available
    if (user) {
      reset(user);
    }
  }, [user, isAuthenticated, loading, router, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, send to API
      // await updateUserProfile(data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-background">
      <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-foreground">Profile Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Personal details and preferences</p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="border-t border-border px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      {...register('name')}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border bg-input text-foreground rounded-md transition-colors"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border bg-input text-foreground rounded-md transition-colors"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="phone"
                      {...register('phone')}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border bg-input text-foreground rounded-md transition-colors"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="street" className="block text-sm font-medium text-muted-foreground">
                    Street Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="street"
                      {...register('address.street')}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border bg-input text-foreground rounded-md transition-colors"
                    />
                  </div>
                  {errors.address?.street && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-muted-foreground">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      {...register('address.city')}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border bg-input text-foreground rounded-md transition-colors"
                    />
                  </div>
                  {errors.address?.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium text-muted-foreground">
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="state"
                      {...register('address.state')}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border bg-input text-foreground rounded-md transition-colors"
                    />
                  </div>
                  {errors.address?.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-muted-foreground">
                    Postal Code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postalCode"
                      {...register('address.postalCode')}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border bg-input text-foreground rounded-md transition-colors"
                    />
                  </div>
                  {errors.address?.postalCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.postalCode.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="country" className="block text-sm font-medium text-muted-foreground">
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      {...register('address.country')}
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border bg-input text-foreground rounded-md transition-colors"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                  {errors.address?.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    reset(user || {
                      name: '',
                      email: '',
                      phone: '',
                      address: {
                        street: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: 'India',
                      },
                    });
                  }}
                  className="bg-card py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="border-t border-border">
            <dl>
              <div className="bg-muted/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-muted-foreground">Full name</dt>
                <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                  {user?.name || 'Not provided'}
                </dd>
              </div>
              <div className="bg-card px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-muted-foreground">Email address</dt>
                <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                  {user?.email || 'Not provided'}
                </dd>
              </div>
              <div className="bg-muted/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-muted-foreground">Phone number</dt>
                <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                  {user?.phone || 'Not provided'}
                </dd>
              </div>
              <div className="bg-card px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd className="mt-1 text-sm text-foreground sm:mt-0 sm:col-span-2">
                  <address className="not-italic">
                    {(user?.address as any)?.street || 'Not provided'}<br />
                    {(user?.address as any)?.city || ''}, {(user?.address as any)?.state || ''} {(user?.address as any)?.postalCode || ''}<br />
                    {(user?.address as any)?.country || ''}
                  </address>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Password Change Section */}
      <div className="mt-8 bg-card shadow overflow-hidden sm:rounded-lg border border-border">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-foreground">Security</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Update your password</p>
        </div>
        <div className="border-t border-border px-4 py-5 sm:p-6">
          <button
            type="button"
            onClick={() => router.push('/customer/change-password')}
            className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}