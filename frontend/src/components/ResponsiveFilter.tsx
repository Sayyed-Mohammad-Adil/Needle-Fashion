'use client';

import { useState } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

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
  onClearFilters,
}: ResponsiveFilterProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const totalSelected = Object.values(selectedFilters).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  const renderFilterSections = (idPrefix: string) => (
    <div className="divide-y divide-border">
      {filters.map((section) => (
        <div key={section.id} className="py-5 first:pt-0">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-foreground font-medium mb-3">
            {section.name}
          </h3>
          <div className="space-y-2.5">
            {section.options.map((option, optionIdx) => {
              const isChecked = (selectedFilters[section.id] || []).includes(option.value);
              const inputId = `${idPrefix}-${section.id}-${optionIdx}`;
              return (
                <label
                  key={option.value}
                  htmlFor={inputId}
                  className="flex items-center justify-between gap-2 text-xs font-light text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        onFilterChange(section.id, option.value, e.target.checked)
                      }
                      className="h-3.5 w-3.5 border border-border accent-foreground rounded-none"
                    />
                    <span className={isChecked ? 'text-foreground font-normal' : ''}>
                      {option.label}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="flex items-center justify-between lg:hidden mb-6">
        <button
          type="button"
          className="px-4 py-2.5 border border-border inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground hover:border-foreground transition-colors"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
          <span>Filter</span>
          {totalSelected > 0 && (
            <span className="text-[11px] text-accent">({totalSelected})</span>
          )}
        </button>
        {totalSelected > 0 && (
          <button
            type="button"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
            onClick={onClearFilters}
          >
            Reset
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background border-l border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <span className="text-xs uppercase tracking-[0.22em] text-foreground">
                Filters
              </span>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {renderFilterSections('mobile')}

            <div className="mt-6 pt-4 border-t border-border flex gap-3">
              {totalSelected > 0 && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="flex-1 py-3 border border-border text-xs uppercase tracking-[0.18em] text-foreground"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-foreground text-background text-xs uppercase tracking-[0.18em]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
          <span className="text-xs uppercase tracking-[0.22em] text-foreground">
            Filter By
          </span>
          {totalSelected > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {renderFilterSections('desktop')}
      </aside>
    </>
  );
}
