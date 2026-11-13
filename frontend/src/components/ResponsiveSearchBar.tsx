'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
  href: string;
}

const LUXURY_SUGGESTIONS: SearchSuggestion[] = [
  { id: '1', name: 'Mughal Jaali Ivory Tailored Suit', category: 'Suits', href: '/product/1' },
  { id: '2', name: 'Sage Heritage Embroidered Suit', category: 'Suits', href: '/product/2' },
  { id: '4', name: 'Handloom Linen Dress Shirt', category: 'Shirts', href: '/product/4' },
  { id: '6', name: 'Ivory Pleated Tailored Trousers', category: 'Pants', href: '/product/6' },
  { id: '8', name: 'Kashmir Tilla Pashmina Doshala', category: 'Accessories', href: '/product/8' },
  { id: '11', name: 'Varanasi Chanderi Kurta Pyjama Set', category: 'Indian Wear', href: '/product/11' },
  { id: '12', name: 'Imperial Ivory Zardozi Sherwani', category: 'Indian Wear', href: '/product/12' },
];

export default function ResponsiveSearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const q = query.toLowerCase();
      const filtered = LUXURY_SUGGESTIONS.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
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
    router.push(suggestion.href);
    setQuery('');
    setIsOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden lg:block relative" ref={searchRef}>
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="relative flex items-center border-b border-border focus-within:border-foreground transition-colors pb-1">
            <MagnifyingGlassIcon
              className="h-4 w-4 text-muted-foreground flex-shrink-0"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-36 xl:w-44 bg-transparent pl-2.5 pr-2 py-0.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {isOpen && suggestions.length > 0 && (
          <div className="absolute right-0 z-50 mt-3 w-80 bg-background border border-border p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground pb-2 mb-2 border-b border-border">
              Suggestions
            </p>
            <div className="divide-y divide-border">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full text-left py-2.5 flex items-center justify-between gap-3 hover:text-accent transition-colors"
                >
                  <span className="text-xs text-foreground truncate">{item.name}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex-shrink-0">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Trigger */}
      <button
        type="button"
        onClick={() => setIsMobileSearchOpen(true)}
        className="p-1.5 text-foreground/80 hover:text-foreground transition-colors lg:hidden"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
      </button>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background p-6 lg:hidden overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Search
            </span>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              aria-label="Close search"
              className="p-1 text-foreground"
            >
              <XMarkIcon className="h-5 w-5 stroke-[1.5]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex items-center border-b border-foreground pb-2">
              <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suits, shirts, pants, kurta..."
                className="w-full bg-transparent pl-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </form>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              {suggestions.length > 0 ? 'Results' : 'Popular Searches'}
            </p>
            <div className="divide-y divide-border border-y border-border">
              {(suggestions.length > 0 ? suggestions : LUXURY_SUGGESTIONS).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full text-left py-3.5 flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-light text-foreground">{item.name}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex-shrink-0">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
