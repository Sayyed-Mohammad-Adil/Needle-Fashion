'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  CurrencyRupeeIcon,
  CubeIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  RectangleStackIcon,
  PhotoIcon,
  InboxStackIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products & Pricing', href: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Client Requests', href: '/admin/inquiries', icon: InboxStackIcon, badge: 'New' },
  { name: 'Media & Photos', href: '/admin/media', icon: PhotoIcon },
  { name: 'Orders & Bespoke', href: '/admin/orders', icon: CreditCardIcon },
  { name: 'Customers', href: '/admin/customers', icon: UserGroupIcon },
  { name: 'Categories', href: '/admin/categories', icon: RectangleStackIcon },
  { name: 'Inventory', href: '/admin/inventory', icon: CubeIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Expenses', href: '/admin/expenses', icon: CurrencyRupeeIcon },
  { name: 'Themes', href: '/admin/themes', icon: CogIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  { name: 'Chat', href: '/admin/chat', icon: ChatBubbleLeftRightIcon },
];

export default function ResponsiveAdminDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card border-r border-border h-full shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-3">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white hover:text-primary focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pt-6 pb-4 px-4">
              {/* Brand Logo */}
              <div className="flex items-center gap-3 px-2 mb-6 pb-4 border-b border-border/80">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-serif font-black text-xl shadow-sm">
                  N
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-lg font-bold tracking-tight text-foreground">Needle</span>
                    <span className="font-serif text-lg font-bold tracking-tight text-primary">Fashion</span>
                  </div>
                  <span className="text-[9.5px] uppercase font-bold tracking-[0.22em] text-[#C5A059]">
                    Royal Haute Atelier
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`h-4.5 w-4.5 flex-shrink-0 ${
                            isActive ? 'text-primary-foreground' : 'text-primary'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C5A059]/20 text-[#C5A059]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-border bg-card/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-30">
        <div className="flex min-h-0 flex-1 flex-col border-r border-border bg-card shadow-lg">
          <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4 px-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 px-2 mb-6 pb-5 border-b border-border/80">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-serif font-black text-2xl shadow-sm">
                N
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-bold tracking-tight text-foreground">Needle</span>
                  <span className="font-serif text-lg font-bold tracking-tight text-primary">Fashion</span>
                </div>
                <div className="flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-[0.22em] text-[#C5A059]">
                  <SparklesIcon className="w-2.5 h-2.5" />
                  <span>Admin Curatorial Suite</span>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`h-4.5 w-4.5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-primary-foreground' : 'text-primary'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C5A059]/20 text-[#C5A059]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User profile & Storefront exit */}
          <div className="p-4 border-t border-border bg-card/60 space-y-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl border border-border text-[11px] font-semibold text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span>View Storefront</span>
              </span>
              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                  {user?.name ? user.name[0] : 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email || 'admin@needle.in'}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col lg:pl-72">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-20 flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground hover:bg-card focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-foreground">Needle</span>
            <span className="font-serif font-bold text-primary">Fashion</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#C5A059] px-2 py-0.5 rounded bg-primary/10">
              Admin
            </span>
          </div>

          <Link
            href="/"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
            title="Storefront"
          >
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          </Link>
        </div>

        <main className="flex-1">
          <div className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}