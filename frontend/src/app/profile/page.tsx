'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import apiClient from '@/lib/api-client';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
    } else {
      fetchChatHistory();
    }
  }, [isAuthenticated, router]);

  const fetchChatHistory = async () => {
    try {
      setLoadingHistory(true);
      const { data }: any = await apiClient.get('/api/chat/history');
      setChatHistory(data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Opening Patron Dossier...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Patron Profile', icon: UserIcon },
    { id: 'orders', name: 'Commissions', icon: ShoppingBagIcon },
    { id: 'wishlist', name: 'Bridal Wishlist', icon: HeartIcon },
    { id: 'chat', name: 'Stylist Transcripts', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header Strip */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-serif font-black text-xl shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'N'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Patron Dossier</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {user?.name || 'Esteemed Patron'}
              </h1>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="btn-luxury-outline px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] flex items-center gap-2"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden mb-6">
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-xl border-border bg-card text-foreground px-4 py-3 text-xs focus:border-primary focus:ring-primary"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <nav className="space-y-1.5 p-2 rounded-2xl bg-card border border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      isActive
                        ? 'btn-luxury-gold shadow-md'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    } group flex w-full items-center rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all`}
                  >
                    <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="bg-card shadow-sm rounded-3xl p-6 sm:p-8 border border-border space-y-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Account Particulars</span>
                  <h2 className="font-serif text-xl font-bold text-foreground mt-1">Patron Specifications</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-2">
                  <div className="p-4 rounded-xl bg-background border border-border">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Full Legal Name</label>
                    <div className="mt-1 font-serif text-base font-bold text-foreground">{user?.name || 'Not provided'}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Patron Email</label>
                    <div className="mt-1 text-sm text-foreground">{user?.email || 'Not provided'}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Membership Tier</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${
                        user?.role === 'admin'
                          ? 'bg-amber-500/10 text-primary border-primary/30'
                          : 'bg-primary/10 text-primary border-primary/30'
                      }`}>
                        {user?.role === 'admin' ? 'Imperial Administrator' : 'Royal Patron Member'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-background border border-border">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Consultation Preference</label>
                    <div className="mt-1 text-xs text-muted-foreground">Private Atelier Salon &amp; Video Consults</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="btn-luxury-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em]"
                  >
                    Book Stylist Consultation
                  </Link>
                  <Link
                    href="/category/sherwani"
                    className="btn-luxury-outline px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em]"
                  >
                    View Wedding Catalogue
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-card shadow-sm rounded-3xl p-6 sm:p-8 border border-border">
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Atelier Log</span>
                  <h2 className="font-serif text-xl font-bold text-foreground mt-1">Commission History</h2>
                </div>

                <div className="text-center py-12 rounded-2xl bg-background border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary mb-3">
                    <ShoppingBagIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground">No Current Commissions</h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                    Your bespoke commissions and ready-to-wear orders will appear here with live tracking.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/new-arrivals"
                      className="btn-luxury-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] inline-block"
                    >
                      Explore New Arrivals
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-card shadow-sm rounded-3xl p-6 sm:p-8 border border-border">
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Saved Creations</span>
                  <h2 className="font-serif text-xl font-bold text-foreground mt-1">Bridal &amp; Festive Wishlist</h2>
                </div>

                <div className="text-center py-12 rounded-2xl bg-background border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary mb-3">
                    <HeartIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground">Your Wishlist is Empty</h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                    Save your favorite sherwanis, kurtas, and jacket sets for your wedding consultation.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/category/kurta"
                      className="btn-luxury-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] inline-block"
                    >
                      Explore Menswear Collections
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="bg-card shadow-sm rounded-3xl p-6 sm:p-8 border border-border">
                <div className="mb-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Concierge Consultations</span>
                  <h2 className="font-serif text-xl font-bold text-foreground mt-1">Stylist Transcripts</h2>
                </div>

                {loadingHistory ? (
                  <div className="py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                  </div>
                ) : chatHistory.length > 0 ? (
                  <div className="divide-y divide-border rounded-2xl overflow-hidden border border-border bg-background">
                    {chatHistory.map((session) => (
                      <div
                        key={session._id}
                        className="py-4 px-5 flex justify-between items-center group cursor-pointer hover:bg-card transition-colors"
                      >
                        <div>
                          <p className="font-serif text-sm font-bold text-foreground">
                            Session: {session.sessionId}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-md mt-0.5">
                            {session.lastMessage?.content || 'No messages'}
                          </p>
                          <p className="text-[10px] text-primary mt-1 font-mono">
                            {new Date(session.updatedAt).toLocaleString()}
                          </p>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-2xl bg-background border border-border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary mb-3">
                      <ChatBubbleLeftRightIcon className="h-6 w-6" />
                    </div>
                    <h3 className="font-serif text-base font-bold text-foreground">No Transcripts Recorded</h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                      Interact with our Atelier AI Concierge via the bottom right widget to initiate styling advice.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}