'use client';

import { useState } from 'react';
import { XMarkIcon, SparklesIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSection {
  id: string;
  name: string;
  options: FilterOption[];
}

interface ResponsiveFilterProps {
  filters: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  onClearFilters: () => void;
}

export default function ResponsiveFilter({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters
}: ResponsiveFilterProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const totalSelected = Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <>
      {/* Mobile filter button */}
      <div className="flex items-center justify-between lg:hidden mb-4">
        <button
          type="button"
          className="glass-pill px-5 py-2.5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground hover:border-[#C5A059]/60 transition-all shadow-sm active:scale-95"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-[#C5A059]" aria-hidden="true" />
          <span>Curate Selection</span>
          {totalSelected > 0 && (
            <span className="ml-1.5 h-4 w-4 rounded-full bg-[#C5A059] text-[10px] text-white flex items-center justify-center font-bold">
              {totalSelected}
            </span>
          )}
        </button>
        {totalSelected > 0 && (
          <button
            type="button"
            className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-[#C5A059] transition-colors"
            onClick={onClearFilters}
          >
            Reset
          </button>
        )}
      </div>

      {/* Mobile filter dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Glass backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-3 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-3xl glass-panel-gold text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 w-full border border-[#C5A059]/30">
                <div className="absolute top-4 right-4 z-10">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full glass-pill flex items-center justify-center text-foreground hover:text-[#C5A059] transition-colors"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059]">Atelier Curation</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mt-1">Refine Menswear</h3>
                  
                  <div className="mt-5 max-h-[60vh] overflow-y-auto space-y-6 pr-2">
                    {filters.map((section) => (
                      <div key={section.id} className="border-b border-border/40 pb-5">
                        <h4 className="font-serif text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                          <span className="text-[#C5A059] text-xs">✦</span>
                          {section.name}
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {section.options.map((option, optionIdx) => {
                            const isChecked = selectedFilters[section.id]?.includes(option.value) || false;
                            return (
                              <label
                                key={option.value}
                                className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                                  isChecked
                                    ? 'bg-[#C5A059]/15 border-[#C5A059] text-foreground font-semibold shadow-sm'
                                    : 'border-border/40 hover:bg-secondary/40 text-muted-foreground'
                                }`}
                              >
                                <input
                                  id={`filter-m-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => onFilterChange(section.id, option.value, e.target.checked)}
                                  className="h-3.5 w-3.5 rounded border-border text-[#C5A059] focus:ring-[#C5A059] accent-[#C5A059]"
                                />
                                <span className="text-xs">{option.label}</span>
                                {option.count !== undefined && (
                                  <span className="ml-auto text-[10px] text-muted-foreground font-mono">({option.count})</span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex space-x-3 pt-4 border-t border-border/40">
                    <button
                      type="button"
                      className="flex-1 glass-pill py-3 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground hover:bg-secondary/40 transition-all text-center"
                      onClick={onClearFilters}
                    >
                      Reset All
                    </button>
                    <button
                      type="button"
                      className="flex-1 btn-glass-gold py-3 px-4 text-xs font-bold uppercase tracking-[0.16em] text-center"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      View Pieces
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop filter sidebar */}
      <aside className="hidden lg:block glass-panel p-6 rounded-3xl sticky top-28 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A059] block">
              Atelier Filter
            </span>
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2 mt-0.5">
              <span>⚜</span> Curate Collection
            </h2>
          </div>
          {totalSelected > 0 && (
            <button
              type="button"
              className="text-[11px] uppercase tracking-wider font-semibold text-[#C5A059] hover:underline"
              onClick={onClearFilters}
            >
              Reset ({totalSelected})
            </button>
          )}
        </div>

        <div className="space-y-6 divide-y divide-border/40 mt-2">
          {filters.map((section) => (
            <div key={section.id} className="pt-5 first:pt-3">
              <h3 className="font-serif text-xs font-bold text-foreground mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="text-[#C5A059] text-[10px]">✦</span> {section.name}
              </h3>
              
              <div className="space-y-2">
                {section.options.map((option, optionIdx) => {
                  const isChecked = selectedFilters[section.id]?.includes(option.value) || false;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-[#C5A059]/15 border-[#C5A059]/70 text-foreground font-semibold shadow-sm backdrop-blur-sm'
                          : 'border-transparent hover:border-border/50 hover:bg-secondary/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => onFilterChange(section.id, option.value, e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-border text-[#C5A059] focus:ring-[#C5A059] accent-[#C5A059]"
                        />
                        <span className="text-xs tracking-tight">{option.label}</span>
                      </div>
                      {option.count !== undefined && (
                        <span className="text-[10px] text-muted-foreground/70">
                          {option.count}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bespoke concierge card inside sidebar */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="glass-panel-gold p-4 rounded-2xl text-center border border-[#C5A059]/30">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
              Needle Bespoke
            </span>
            <p className="font-serif text-xs font-bold text-foreground">
              Looking for a custom wedding ensemble?
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
              Book a private virtual fitting with our master royal karigar.
            </p>
            <a
              href="/contact"
              className="mt-3 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#C5A059] hover:underline"
            >
              Request Private Consultation &rarr;
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}