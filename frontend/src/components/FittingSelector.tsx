'use client';

import { useState } from 'react';

interface FittingSelectorProps {
  selectedFitting: 'Loose' | 'Medium' | 'Fit';
  onFittingChange: (fitting: 'Loose' | 'Medium' | 'Fit') => void;
}

export default function FittingSelector({ selectedFitting, onFittingChange }: FittingSelectorProps) {
  const fittings = [
    { id: 'Loose', name: 'Loose', description: 'Comfortable, roomy fit' },
    { id: 'Medium', name: 'Medium', description: 'Standard fit (default)' },
    { id: 'Fit', name: 'Fit', description: 'Snug, tailored fit' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium text-gray-900">Fitting Preference</h3>
        <p className="text-sm text-gray-500">Select your preferred fit</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {fittings.map((fitting) => (
          <div
            key={fitting.id}
            onClick={() => onFittingChange(fitting.id as 'Loose' | 'Medium' | 'Fit')}
            className={`relative rounded-lg border p-4 cursor-pointer focus:outline-none ${
              selectedFitting === fitting.id
                ? 'border-primary ring-2 ring-primary'
                : 'border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                selectedFitting === fitting.id ? 'border-primary bg-primary' : 'border-gray-300'
              }`}>
                {selectedFitting === fitting.id && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{fitting.name}</p>
                <p className="text-xs text-gray-500">{fitting.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}