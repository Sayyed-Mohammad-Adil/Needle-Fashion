'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon, Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  navigation: {
    brandName?: string;
    brandHref?: string;
    categories: {
      id: string;
      name: string;
      href?: string;
      featured: {
        name: string;
        href: string;
        imageSrc: string;
        imageAlt: string;
        desc?: string;
      }[];
      sections: {
        id: string;
        name: string;
        items: {
          name: string;
          href: string;
        }[];
      }[];
    }[];
    pages: {
      id?: string;
      name: string;
      href: string;
    }[];
  };
}

export default function MobileMenu({ navigation }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      <button
        type="button"
        className="p-1.5 text-foreground hover:text-accent transition-colors lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Bars3Icon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs sm:max-w-sm bg-background border-r border-border flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <Link
                href={navigation.brandHref || '/'}
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium uppercase tracking-[0.26em] text-foreground"
              >
                {navigation.brandName || 'Needle Fashion'}
              </Link>
              <button
                type="button"
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <XMarkIcon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="divide-y divide-border">
                {navigation.categories.map((category) => {
                  const isExpanded = openCategory === category.id;
                  return (
                    <div key={category.id} className="py-4">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between text-left py-1"
                      >
                        <span className="text-xs uppercase tracking-[0.22em] text-foreground">
                          {category.name}
                        </span>
                        <ChevronDownIcon
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-4 space-y-5 pl-1">
                          {category.sections.map((section) => (
                            <div key={section.id} className="space-y-2.5">
                              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                                {section.name}
                              </p>
                              <ul className="space-y-2.5">
                                {section.items.map((item) => (
                                  <li key={item.name}>
                                    <Link
                                      href={item.href}
                                      onClick={() => setIsOpen(false)}
                                      className="block text-sm font-light text-foreground/85 hover:text-foreground"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            {category.featured.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="group block"
                              >
                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted mb-2">
                                  <Image
                                    src={item.imageSrc}
                                    alt={item.imageAlt}
                                    fill
                                    sizes="140px"
                                    className="object-cover object-top"
                                  />
                                </div>
                                <p className="text-[11px] font-light text-foreground leading-snug">
                                  {item.name}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pages */}
              <div className="space-y-3 border-t border-border pt-6 mt-2">
                {navigation.pages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-1 text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>

              {/* Account Actions */}
              <div className="space-y-3 border-t border-border pt-6 mt-6">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="block py-1 text-xs uppercase tracking-[0.2em] text-foreground"
                    >
                      My Account
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="block py-1 text-xs uppercase tracking-[0.2em] text-foreground"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="block py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setIsOpen(false)}
                      className="block py-1 text-xs uppercase tracking-[0.2em] text-foreground"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsOpen(false)}
                      className="block py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
