'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do custom bespoke measurements work?',
    answer:
      'When commissioning a garment, select Custom Measurement to enter your proportions or schedule a live video fitting with our master tailor. We draft every suit, shirt, trouser, and sherwani across 48 anatomical checkpoints.',
    category: 'Bespoke Tailoring',
  },
  {
    question: 'What is the creation and delivery timeframe?',
    answer:
      'Ready-to-wear pieces dispatch within 24 to 48 business hours. Bespoke suits, hand-embroidered jackets, and ceremonial Indian wear require 2 to 3 weeks of karigar handwork prior to insured express shipping.',
    category: 'Orders & Dispatch',
  },
  {
    question: 'Do you deliver internationally?',
    answer:
      'Yes. Needle Fashion provides insured white-glove delivery to over 45 countries including the USA, UK, UAE, Canada, and Australia.',
    category: 'Orders & Dispatch',
  },
  {
    question: 'Can I request fabric swatches before commissioning?',
    answer:
      'Yes. For bespoke suits, coats, and wedding ensembles, our concierge can dispatch a curated archive of Banarasi, Chanderi, linen, and wool-silk swatches.',
    category: 'Bespoke Tailoring',
  },
  {
    question: 'How should I care for hand-embroidered garments?',
    answer:
      'Each piece is delivered with an unbleached cotton muslin garment bag. Store horizontally away from direct humidity and opt exclusively for specialist dry cleaning.',
    category: 'Fabric & Care',
  },
  {
    question: 'How do I reach the Atelier styling team?',
    answer:
      'Our private client desk is available Tuesday through Sunday, 10:00 AM to 8:30 PM IST at concierge@needlefashion.com or +91 (022) 8800-NEEDLE.',
    category: 'General',
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    [faqs[0].question]: true,
  });

  const toggleItem = (question: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  const filteredFaqs = faqs.filter((faq) => faq.category === activeCategory);

  return (
    <main className="bg-background text-foreground min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="border-b border-border pb-10 mb-10">
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-3">
            Client Services
          </p>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-sm font-light text-muted-foreground mt-3 max-w-xl leading-relaxed">
            Guidance on bespoke measurements, handloom fabric care, and international dispatch.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-6 border-b border-border mb-10">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`pb-3 text-xs uppercase tracking-[0.2em] border-b transition-colors ${
                activeCategory === category
                  ? 'border-foreground text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="divide-y divide-border border-b border-border">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.question];
            return (
              <div key={faq.question} className="py-5">
                <button
                  type="button"
                  onClick={() => toggleItem(faq.question)}
                  className="w-full flex items-center justify-between gap-6 text-left py-1"
                >
                  <span className="text-sm sm:text-base font-normal text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm font-light text-muted-foreground leading-relaxed pr-8">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
          <p className="text-xs text-muted-foreground font-light">
            Require further assistance with sizing or a private commission?
          </p>
          <Link
            href="/contact"
            className="text-xs uppercase tracking-[0.2em] text-foreground border-b border-border pb-1 hover:text-accent transition-colors self-start sm:self-auto"
          >
            Contact Concierge
          </Link>
        </div>
      </div>
    </main>
  );
}
