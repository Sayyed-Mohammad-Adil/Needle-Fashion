'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, SparklesIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do custom bespoke measurements work?',
    answer: 'When placing an order for a bespoke ensemble, you can select "Custom Measurement" and input your precise proportions, or connect with our master stylist via live video consultation. We ensure an anatomical 48-point check for flawless fit.',
    category: 'Bespoke Tailoring',
  },
  {
    question: 'What is the creation and delivery timeframe?',
    answer: 'Ready-to-wear pieces ship within 24-48 business hours. Hand-embroidered bespoke sherwanis and bridal commissions require 2 to 3 weeks of intensive karigar handwork, followed by insured express dispatch.',
    category: 'Orders & Dispatch',
  },
  {
    question: 'Do you deliver internationally?',
    answer: 'Yes, Needle Fashion provides white-glove insured global delivery to over 45 countries including USA, UK, UAE, Canada, and Australia in custom preservation trunks.',
    category: 'Orders & Dispatch',
  },
  {
    question: 'Can I request fabric swatches prior to commissioning?',
    answer: 'Absolutely. For royal wedding sherwanis and bespoke bridal parties, our concierge will dispatch a curated swatching archive of pure Banarasi, Chanderi, and Raw Tussar silks to your residence.',
    category: 'Bespoke Tailoring',
  },
  {
    question: 'How should I store and care for my heirloom garments?',
    answer: 'Each creation includes an unbleached cotton muslin preservation bag. We advise storing pieces horizontally in low-humidity environments and opting strictly for professional dry cleaning to protect antique zari threads.',
    category: 'Fabric & Care',
  },
  {
    question: 'How do I contact the Atelier styling team?',
    answer: 'Our private styling desk is open Tuesday through Sunday from 10:00 AM to 8:30 PM IST via concierge@needlefashion.com, telephone at +91 (022) 8800-NEEDLE, or through the Atelier Concierge live widget.',
    category: 'General',
  },
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    [faqs[0].question]: true,
  });

  const toggleItem = (question: string) => {
    setOpenItems(prev => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="bg-background text-foreground min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/5 mb-4">
            <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Needle Atelier Knowledge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Frequently Asked Inquiries
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 mb-3" />
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Guidance regarding our artisanal fabrics, bespoke custom fittings, and international dispatch protocols.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${
                activeCategory === category
                  ? 'btn-luxury-gold shadow-md'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.question];
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-border/80 bg-background/50 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleItem(faq.question)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif text-sm sm:text-base font-semibold text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-primary flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Concierge Card */}
        <div className="mt-12 rounded-3xl p-8 sm:p-10 border border-primary/30 bg-gradient-to-r from-card via-background to-card text-center shadow-lg">
          <SparklesIcon className="w-6 h-6 text-primary mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Require Bespoke Assistance?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Our atelier concierge is available to guide you through fabric selections, fit trials, or custom bridal party commissions.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="btn-luxury-gold px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Contact Stylist
            </Link>
            <a
              href="tel:+91022880063335"
              className="btn-luxury-outline px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Call +91 (022) 8800-NEEDLE
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}