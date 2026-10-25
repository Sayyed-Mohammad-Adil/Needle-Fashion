'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface SearchSuggestion {
  id: string;
  name: string;
  category?: string;
  badge?: string;
}

const LUXURY_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', name: 'Imperial Ivory Zardozi Sherwani', category: 'Royal Wedding', badge: 'Haute Couture' },
  { id: '2', name: 'Tailored Slate Grey Silk Bandhgala', category: 'Atelier Jodhpuri', badge: 'Bespoke Fit' },
  { id: '3', name: 'Pure Chanderi Handloom Cream Kurta', category: 'Handwoven Silk', badge: 'Heritage' },
  { id: '4', name: 'Gala Indo-Western Brocade Tuxedo', category: 'Evening Couture', badge: 'Limited' },
  { id: '5', name: 'Cashmere Royal Doshala Shawl with Zari', category: 'Heirloom Shawls', badge: 'Pure Pashmina' },
  { id: '6', name: 'Charcoal Silk Achkan with Antique Buttons', category: 'Sovereign Menswear', badge: 'Handcrafted' },
];

export default function ResponsiveSearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when mobile search opens
  useEffect(() => {
    if (isMobileSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      const filtered = LUXURY_SUGGESTIONS.filter(
        item => item.name.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q)
      );
      setSuggestions(filtered.length > 0 ? filtered : LUXURY_SUGGESTIONS.slice(0, 4));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    router.push(`/new-arrivals`);
    setQuery('');
    setIsOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <>
      {/* Desktop Frosted Glass Search Bar */}
      <div className="hidden lg:block relative" ref={searchRef}>
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative flex items-center glass-pill bg-white/75 dark:bg-[#16181F]/80 border border-[#BF953F]/35 pl-3 pr-1 py-1 focus-within:border-[#B38728] dark:focus-within:border-[#FCF6BA] focus-within:shadow-[0_0_15px_rgba(179,135,40,0.25)] transition-all backdrop-blur-md">
            <MagnifyingGlassIcon className="h-4 w-4 text-[#B38728] dark:text-[#FCF6BA] flex-shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.length > 0) setIsOpen(true);
                else {
                  setSuggestions(LUXURY_SUGGESTIONS.slice(0, 4));
                  setIsOpen(true);
                }
              }}
              className="bg-transparent border-0 px-2 py-1 text-xs text-[#18191D] dark:text-[#FAF8F5] placeholder:text-[#6F6960] dark:placeholder:text-[#A8A9AD] focus:outline-none w-32 focus:w-48 xl:w-44 xl:focus:w-60 transition-all duration-300 tracking-wide font-medium"
              placeholder="Search couture..."
              aria-label="Search menswear masterpieces"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.14em] font-bold text-[#141518] shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)' }}
            >
              Search
            </button>
          </div>
        </form>

        {/* Frosted Glass Suggestions Popover */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-96 rounded-2xl glass-panel-gold p-3 shadow-2xl border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-border/50 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Atelier Menswear Archive</span>
              </span>
              <span className="text-[9px] text-muted-foreground">Select to Inspect</span>
            </div>

            <div className="py-2 space-y-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="group flex w-full items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-primary/10 transition-colors"
                >
                  <div>
                    <p className="font-serif text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {suggestion.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{suggestion.category}</p>
                  </div>
                  {suggestion.badge && (
                    <span className="text-[9px] uppercase tracking-wider text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25">
                      {suggestion.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Trigger Button for Mobile Screen */}
      <button
        type="button"
        className="p-2 text-[#1F2026] dark:text-[#E0DDD5] hover:text-[#B38728] dark:hover:text-[#FCF6BA] lg:hidden rounded-full bg-white/75 dark:bg-[#16181F]/80 border border-[#BF953F]/35 hover:border-[#B38728] transition-colors backdrop-blur-md"
        onClick={() => setIsMobileSearchOpen(true)}
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-4.5 w-4.5" aria-hidden="true" />
      </button>

      {/* Search Overlay with Frosted Glass */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 glass-panel backdrop-blur-2xl p-4 lg:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <form onSubmit={handleSubmit} className="flex-grow mr-2">
              <div className="relative flex items-center glass-pill pl-3 pr-2 py-1.5">
                <MagnifyingGlassIcon className="h-4 w-4 text-primary" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent border-0 px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
                  placeholder="Search sherwanis, kurtas, bandhgalas..."
                  aria-label="Search menswear masterpieces"
                />
              </div>
            </form>
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-card transition-colors"
              onClick={() => setIsMobileSearchOpen(false)}
            >
              <span className="sr-only">Close search</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary px-2">
              Featured Royal Curations
            </p>
            {LUXURY_SUGGESTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSuggestionClick(item)}
                className="w-full text-left p-3 rounded-2xl glass-card flex items-center justify-between"
              >
                <div>
                  <p className="font-serif text-sm font-bold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{item.badge}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}