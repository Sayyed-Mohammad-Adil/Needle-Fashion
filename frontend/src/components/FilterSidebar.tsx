'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { filterService } from '@/lib/api';

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

interface FilterSidebarProps {
  filters: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  onClearFilters: () => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
}

export default function FilterSidebar({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  mobileFiltersOpen,
  setMobileFiltersOpen
}: FilterSidebarProps) {
  return (
    <>
      {/* Mobile filter dialog */}
      <div className="relative z-40 lg:hidden">
        <div className={`fixed inset-0 bg-black bg-opacity-25 transition-opacity ${mobileFiltersOpen ? 'block' : 'hidden'}`} />
        
        <div className={`fixed inset-0 z-40 overflow-y-auto transition ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                  
                  <div className="mt-4 border-t border-gray-200">
                    {filters.map((section) => (
                      <div key={section.id} className="border-b border-gray-200 py-6">
                        <h3 className="-my-3 flow-root">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                            aria-controls={`filter-section-${section.id}`}
                          >
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </button>
                        </h3>
                        
                        <div className="pt-6" id={`filter-section-${section.id}`}>
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex items-center">
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  checked={selectedFilters[section.id]?.includes(option.value) || false}
                                  onChange={(e) => onFilterChange(section.id, option.value, e.target.checked)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                  {option.count !== undefined && (
                                    <span className="ml-1 text-gray-400">({option.count})</span>
                                  )}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 flex space-x-3">
                <button
                  type="button"
                  className="flex-1 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={onClearFilters}
                >
                  Clear all
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply
                </button>
              </div>
              
              <div className="mt-4 text-center sm:hidden">
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop filter sidebar */}
      <div className="hidden lg:block">
        <div className="space-y-6 divide-y divide-gray-200">
          {filters.map((section) => (
            <div key={section.id} className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{section.name}</h3>
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                  onClick={() => onClearFilters()}
                >
                  Clear
                </button>
              </div>
              
              <div className="mt-4 space-y-4">
                {section.options.map((option, optionIdx) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`filter-${section.id}-${optionIdx}`}
                      name={`${section.id}[]`}
                      defaultValue={option.value}
                      type="checkbox"
                      checked={selectedFilters[section.id]?.includes(option.value) || false}
                      onChange={(e) => onFilterChange(section.id, option.value, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`filter-${section.id}-${optionIdx}`}
                      className="ml-3 text-sm text-gray-600"
                    >
                      {option.label}
                      {option.count !== undefined && (
                        <span className="ml-1 text-gray-400">({option.count})</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}