'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { inquiryService } from '@/lib/api/inquiry-service';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid contact number' }),
  type: z.enum([
    'Bespoke Commission',
    'Atelier Fitting',
    'Custom Measurement',
    'Order Inquiry',
    'General',
  ]),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      type: 'Bespoke Commission',
      subject: '',
      message: '',
      preferredDate: '',
      preferredTime: '',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const res = await inquiryService.createInquiry({
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type,
        subject: data.subject,
        message: data.message,
        preferredDate: data.preferredDate || undefined,
        preferredTime: data.preferredTime || undefined,
      });

      const newId = res.inquiry?._id || 'PATRON-REQUEST';
      setSubmittedInquiryId(newId);
      toast.success('Your consultation request has been received.');
      reset();
    } catch (error) {
      toast.error('Failed to send request. Please contact our concierge directly.');
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="border-b border-border py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
            Private Client Services
          </p>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
            Private Salon &amp; Concierge
          </h1>
          <p className="text-sm sm:text-base font-light text-muted-foreground mt-3 max-w-2xl leading-relaxed">
            Schedule an in-person fitting, request handloom fabric swatches, or arrange a private video consultation with our master tailors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
          {/* Salon Details */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6 border-t border-border pt-6">
              <h2 className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Flagship Salons
              </h2>

              <div className="space-y-1">
                <h3 className="text-sm font-normal text-foreground">Mumbai Flagship</h3>
                <p className="text-xs font-light text-muted-foreground leading-relaxed">
                  Needle Atelier, Heritage Mile, Colaba, Mumbai 400001
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-normal text-foreground">New Delhi Salon</h3>
                <p className="text-xs font-light text-muted-foreground leading-relaxed">
                  Needle Heritage Gallery, Defence Colony Main Ring, New Delhi 110024
                </p>
              </div>
            </div>

            <div className="space-y-6 border-t border-border pt-6">
              <h2 className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Direct Desk
              </h2>

              <div className="space-y-1">
                <p className="text-sm text-foreground">+91 (022) 8800-NEEDLE</p>
                <p className="text-xs font-light text-muted-foreground">
                  concierge@needlefashion.com
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-foreground">Tuesday – Sunday · 11:00 AM – 8:30 PM IST</p>
                <p className="text-xs font-light text-muted-foreground">
                  Monday appointments available by prior request.
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Form */}
          <div className="lg:col-span-7 border-t border-border pt-6">
            <div className="mb-8">
              <h2 className="text-2xl font-light tracking-tight text-foreground">
                Request an Appointment
              </h2>
              <p className="text-xs font-light text-muted-foreground mt-2">
                Our master tailor or client advisor will respond within one business day.
              </p>
            </div>

            {submittedInquiryId ? (
              <div className="border border-border p-8 space-y-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-accent">
                  Request Confirmed
                </p>
                <h3 className="text-xl font-light text-foreground">
                  Reference: {submittedInquiryId}
                </h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  Thank you for contacting Needle Fashion. A private client advisor will reach out shortly to confirm your consultation details.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedInquiryId(null)}
                  className="px-6 py-3 border border-border text-xs uppercase tracking-[0.2em] text-foreground hover:border-foreground transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="Your name"
                      className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="name@example.com"
                      className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="+91 98000 00000"
                      className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Consultation Type
                    </label>
                    <select
                      {...register('type')}
                      className="w-full bg-background border-b border-border py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                    >
                      <option value="Bespoke Commission">Bespoke Commission</option>
                      <option value="Atelier Fitting">Atelier Fitting</option>
                      <option value="Custom Measurement">Custom Measurement</option>
                      <option value="Order Inquiry">Order Inquiry</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>
                </div>

                {(selectedType === 'Atelier Fitting' || selectedType === 'Bespoke Commission') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Preferred Date (Optional)
                      </label>
                      <input
                        type="date"
                        {...register('preferredDate')}
                        className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Preferred Time (Optional)
                      </label>
                      <input
                        type="text"
                        {...register('preferredTime')}
                        placeholder="e.g. 4:00 PM IST"
                        className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    placeholder="Bespoke suit fitting, fabric swatch request, etc."
                    className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Share your occasion, preferred silhouettes, or sizing notes."
                    className="w-full bg-transparent border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-foreground text-background text-xs uppercase tracking-[0.22em] hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Send Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
