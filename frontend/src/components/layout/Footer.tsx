'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

export default function Footer() {
  const { footer } = useSiteConfig();
  const [inviteEmail, setInviteEmail] = useState('');
  const [invited, setInvited] = useState(false);

  const footerColumns = footer.columns || [];
  const socialLinks = footer.socialLinks || [];
  const bottomLinks = footer.bottomLinks || [];

  const handleSalonInvite = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inviteEmail.trim();
    if (!trimmed) return;
    setInvited(true);
    setInviteEmail('');
    toast.success(`Invitation registered for ${trimmed}`);
  };

  return (
    <footer
      aria-labelledby="footer-heading"
      className="bg-background text-foreground border-t border-border transition-colors"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12">
          {/* Maison Statement */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/"
              className="text-sm font-medium uppercase tracking-[0.28em] text-foreground block"
            >
              {footer.brandName || 'Needle Fashion'}
            </Link>
            <p className="text-xs leading-6 text-muted-foreground max-w-xs font-light">
              {footer.brandBio}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-6 pt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {socialLinks.map((soc, idx) => (
                  <a
                    key={idx}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    {soc.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Columns & Private Newsletter */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-10">
            {footerColumns.map((col) => (
              <div key={col.id}>
                <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium text-muted-foreground mb-5">
                  {col.title}
                </h3>
                <ul role="list" className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-xs text-foreground/80 hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Minimalist Private Circle Form */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium text-muted-foreground mb-5">
                {footer.newsletterTitle || 'Private Salon'}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground font-light mb-5">
                {footer.newsletterSubtitle}
              </p>
              <form onSubmit={handleSalonInvite} className="space-y-4">
                <label htmlFor="footer-salon-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-salon-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (invited) setInvited(false);
                  }}
                  className="w-full bg-transparent border-0 border-b border-border pb-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                  placeholder={footer.newsletterPlaceholder || 'Email address'}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 border border-foreground bg-foreground text-background text-[10px] uppercase tracking-[0.22em] font-medium hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
                >
                  {invited ? 'Subscribed' : footer.newsletterButtonLabel || 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {footer.copyrightText || 'Needle Fashion. All rights reserved.'}
          </p>
          <div className="flex items-center gap-6">
            {bottomLinks.map((lnk, idx) => (
              <Link key={idx} href={lnk.href} className="hover:text-foreground transition-colors">
                {lnk.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
