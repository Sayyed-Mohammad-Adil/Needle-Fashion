'use client';

import { useState } from 'react';
import Link from 'next/link';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  navigation: {
    categories: {
      id: string;
      name: string;
      featured: {
        name: string;
        href: string;
        imageSrc: string;
        imageAlt: string;
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
      {/* Mobile menu button */}
      <button
        type="button"
        className="relative rounded-md bg-muted p-2 text-muted-foreground lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <span className="absolute -inset-0.5" />
        <span className="sr-only">Open menu</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-over menu */}
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-background shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-6 bg-card">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#DFB76C] via-[#C5A059] to-[#99752D] flex items-center justify-center text-[#141518] font-serif font-bold text-base shadow-sm">
                    N
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-black tracking-tight text-foreground flex items-center gap-1.5 leading-none">
                      <span className="text-foreground font-black tracking-wider">
                        NEEDLE
                      </span>{' '}
                      <span className="text-[#C5A059] font-black tracking-wider">
                        FASHION
                      </span>
                    </span>
                    <span className="text-[8px] tracking-[0.25em] uppercase text-muted-foreground font-semibold">
                      ATELIER
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Menu content */}
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {/* Categories */}
                <div className="space-y-6">
                  {navigation.categories.map((category) => (
                    <div key={category.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-foreground">{category.name}</h3>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => toggleCategory(category.id)}
                        >
                          <span className="sr-only">Toggle {category.name}</span>
                          <svg
                            className={`h-5 w-5 transform transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      {openCategory === category.id && (
                        <div className="mt-4 space-y-6">
                          {/* Featured items */}
                          <div className="grid grid-cols-2 gap-4">
                            {category.featured.map((item) => (
                              <div key={item.name} className="group relative text-sm">
                                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                  <div className="h-24 flex items-center justify-center">
                                    <span className="text-xs text-gray-500">{item.name}</span>
                                  </div>
                                </div>
                                <Link
                                  href={item.href}
                                  className="mt-2 block font-medium text-gray-900"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span className="absolute inset-0 z-10" aria-hidden="true" />
                                  {item.name}
                                </Link>
                              </div>
                            ))}
                          </div>

                          {/* Sections */}
                          {category.sections.map((section) => (
                            <div key={section.id}>
                              <p id={`${category.id}-${section.id}-heading-mobile`} className="font-medium text-foreground">
                                {section.name}
                              </p>
                              <ul
                                role="list"
                                aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                className="mt-4 space-y-4"
                              >
                                {section.items.map((item) => (
                                  <li key={item.name} className="flow-root">
                                    <Link
                                      href={item.href}
                                      className="-m-2 block p-2 text-muted-foreground"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Pages */}
                  <div className="space-y-6 border-t border-gray-200 pt-6">
                    {navigation.pages.map((page) => (
                      <div key={page.name} className="flow-root">
                        <Link
                          href={page.href}
                          className="-m-2 block p-2 font-medium text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          {page.name}
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* User actions */}
                  <div className="space-y-6 border-t border-gray-200 pt-6">
                    {isAuthenticated ? (
                      <>
                        <div className="flow-root">
                          <Link
                            href="/profile"
                            className="-m-2 block p-2 font-medium text-gray-900"
                            onClick={() => setIsOpen(false)}
                          >
                            My Account
                          </Link>
                        </div>
                        <div className="flow-root">
                          <button
                            onClick={() => {
                              logout();
                              setIsOpen(false);
                            }}
                            className="-m-2 block w-full text-left p-2 font-medium text-foreground"
                          >
                            Logout
                          </button>
                        </div>
                        {isAdmin && (
                          <div className="flow-root">
                            <Link
                              href="/admin"
                              className="-m-2 block p-2 font-medium text-foreground"
                              onClick={() => setIsOpen(false)}
                            >
                              Admin Dashboard
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flow-root">
                          <Link
                            href="/auth/login"
                            className="-m-2 block p-2 font-medium text-foreground hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign in
                          </Link>
                        </div>
                        <div className="flow-root">
                          <Link
                            href="/auth/register"
                            className="-m-2 block p-2 font-medium text-foreground hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            Create account
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}