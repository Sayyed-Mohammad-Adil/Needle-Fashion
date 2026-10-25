'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Success
      toast.success('Your consultation request has been received by our atelier.');
      reset();
    } catch (error) {
      toast.error('Failed to dispatch message. Please contact our concierge directly.');
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
      {/* Header Banner */}
      <div className="border-b border-border bg-card/60 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <SparklesIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Private Atelier Service</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Bespoke Styling Concierge
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Whether inquiring about our royal wedding collections, custom measurements, or worldwide diplomatic dispatch, our master stylists are at your disposal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Atelier Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl bg-card border border-border shadow-sm">
              <h2 className="font-serif text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span>Flagship Couture Salons</span>
              </h2>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground">Mumbai Flagship</h3>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      Needle Atelier, Heritage Heritage Mile, Colaba, Mumbai 400001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground">New Delhi Salon</h3>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      Needle Heritage Gallery, Defence Colony Main Ring, New Delhi 110024
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground">Private Stylist Desk</h3>
                    <p className="text-muted-foreground text-xs mt-1">+91 (022) 8800-NEEDLE (633353)</p>
                    <p className="text-[11px] text-primary mt-0.5">Complimentary WhatsApp Video Fitting Available</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground">Bespoke Concierge</h3>
                    <p className="text-muted-foreground text-xs mt-1">concierge@needlefashion.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
                    <ClockIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-foreground">Salon Hours</h3>
                    <p className="text-muted-foreground text-xs mt-1">Tuesday – Sunday: 11:00 AM – 8:30 PM IST</p>
                    <p className="text-[11px] text-muted-foreground">Private appointments accommodated on Mondays</p>
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Guarantee Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-background border border-primary/30 shadow-sm">
              <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-[0.14em]">Global White-Glove Dispatch</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                All bespoke wedding ensembles are hand-steamed, wrapped in archival muslin preservation cases, and accompanied by insured express diplomatic transit across 45 countries.
              </p>
            </div>
          </div>
          
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-card border border-border shadow-md">
              <div className="mb-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Online Inquiries</span>
                <h2 className="font-serif text-2xl font-bold text-foreground mt-1">Request an Atelier Appointment</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Complete the form below. An atelier stylist will connect with you within 4 business hours.
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      autoComplete="name"
                      placeholder="e.g. Maharaja Vikramaditya"
                      className={`w-full rounded-xl border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.name ? 'border-red-400' : 'border-border'}`}
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-[11px] text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="e.g. vikram@regal.in"
                      className={`w-full rounded-xl border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.email ? 'border-red-400' : 'border-border'}`}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-[11px] text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                      Contact Number / WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      className={`w-full rounded-xl border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.phone ? 'border-red-400' : 'border-border'}`}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-[11px] text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                      Inquiry Category
                    </label>
                    <input
                      type="text"
                      id="subject"
                      placeholder="e.g. Wedding Sherwani Consultation"
                      className={`w-full rounded-xl border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.subject ? 'border-red-400' : 'border-border'}`}
                      {...register('subject')}
                    />
                    {errors.subject && (
                      <p className="mt-1.5 text-[11px] text-red-500">{errors.subject.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-[0.1em] text-foreground mb-1.5">
                    Your Requirements & Timeline
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Provide details about event dates, preferred color tones (slate, cream, ivory, antique gold), and bespoke customization..."
                    className={`w-full rounded-xl border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all ${errors.message ? 'border-red-400' : 'border-border'}`}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-[11px] text-red-500">{errors.message.message}</p>
                  )}
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-luxury-gold py-4 text-xs font-semibold uppercase tracking-[0.18em] flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      'Dispatching Consultation Request...'
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" />
                        <span>Submit Consultation Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}