'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import apiClient from '@/lib/api-client';

interface ChatSession {
  _id: string;
  sessionId: string;
  lastMessage?: { content?: string };
  updatedAt: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
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
      const { data } = (await apiClient.get('/api/chat/history')) as {
        data: { sessions?: ChatSession[] };
      };
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
        <div className="w-8 h-8 border border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'orders', name: 'Orders' },
    { id: 'wishlist', name: 'Wishlist' },
    { id: 'chat', name: 'Consultations' },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground mb-2">
              Client Account
            </p>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-foreground">
              {user?.name || 'Client Profile'}
            </h1>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-6 py-2.5 border border-border text-xs uppercase tracking-[0.2em] text-foreground hover:border-foreground transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-6 border-b border-border mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs uppercase tracking-[0.2em] border-b transition-colors ${
                activeTab === tab.id
                  ? 'border-foreground text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-border pb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Full Name
                </p>
                <p className="text-base text-foreground">{user?.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Email Address
                </p>
                <p className="text-base text-foreground">{user?.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Account Type
                </p>
                <p className="text-sm text-foreground">
                  {user?.role === 'admin' ? 'Administrator' : 'Private Client'}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Consultation Preference
                </p>
                <p className="text-sm font-light text-muted-foreground">
                  In-Salon &amp; Private Video Appointments
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-7 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Book Appointment
              </Link>
              <Link
                href="/new-arrivals"
                className="px-7 py-3.5 border border-border text-foreground text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors"
              >
                Explore New Arrivals
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="py-16 border-b border-border text-center space-y-4">
            <h2 className="text-xl font-light text-foreground">No Orders Yet</h2>
            <p className="text-xs font-light text-muted-foreground max-w-sm mx-auto">
              Your bespoke commissions and ready-to-wear orders will appear here.
            </p>
            <div className="pt-2">
              <Link
                href="/new-arrivals"
                className="inline-block px-7 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em]"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="py-16 border-b border-border text-center space-y-4">
            <h2 className="text-xl font-light text-foreground">Your Wishlist is Empty</h2>
            <p className="text-xs font-light text-muted-foreground max-w-sm mx-auto">
              Save suits, shirts, trousers, and Indian wear to review during your consultation.
            </p>
            <div className="pt-2">
              <Link
                href="/category/suits"
                className="inline-block px-7 py-3.5 bg-foreground text-background text-xs uppercase tracking-[0.2em]"
              >
                Browse Suits
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            {loadingHistory ? (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border border-border border-t-foreground rounded-full animate-spin" />
              </div>
            ) : chatHistory.length > 0 ? (
              <div className="divide-y divide-border border-y border-border">
                {chatHistory.map((session) => (
                  <div
                    key={session._id}
                    className="py-5 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-normal text-foreground">
                        Session {session.sessionId}
                      </p>
                      <p className="text-xs font-light text-muted-foreground truncate max-w-md mt-1">
                        {session.lastMessage?.content || 'No messages'}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                        {new Date(session.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 border-b border-border text-center space-y-2">
                <h2 className="text-xl font-light text-foreground">No Consultation Records</h2>
                <p className="text-xs font-light text-muted-foreground max-w-sm mx-auto">
                  Your private styling conversations will appear here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
