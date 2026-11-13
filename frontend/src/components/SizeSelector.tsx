'use client';

import { useState } from 'react';
import MeasurementForm from '@/components/MeasurementForm';
import { MeasurementDetails } from '@/lib/types';

interface SizeSelectorProps {
  sizes: number[];
  isMakeToOrder: boolean;
  selectedSize: number | 'custom';
  selectedFitting: 'Loose' | 'Medium' | 'Fit';
  customMeasurements?: MeasurementDetails;
  onSizeChange: (size: number | 'custom') => void;
  onFittingChange: (fitting: 'Loose' | 'Medium' | 'Fit') => void;
  onMeasurementsChange: (measurements: MeasurementDetails) => void;
}

const EU_TO_INTL: Record<number, string> = {
  38: 'XS',
  40: 'S',
  42: 'M',
  44: 'L',
  46: 'S',
  48: 'M',
  50: 'L',
  52: 'XL',
  54: 'XXL',
};

export default function SizeSelector({
  sizes,
  isMakeToOrder,
  selectedSize,
  selectedFitting,
  customMeasurements,
  onSizeChange,
  onFittingChange,
  onMeasurementsChange,
}: SizeSelectorProps) {
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);

  const handleCustomMeasurements = (measurements: MeasurementDetails) => {
    onMeasurementsChange(measurements);
    setShowMeasurementForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Size (EU)
        </span>
        <span className="text-[11px] text-muted-foreground">
          European &amp; Bespoke
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const intl = EU_TO_INTL[size];
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSizeChange(size)}
              className={`py-2.5 px-2 text-xs transition-colors border flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-foreground hover:border-foreground'
              }`}
            >
              <span>{size}</span>
              {intl && (
                <span className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}>
                  {intl}
                </span>
              )}
            </button>
          );
        })}

        {isMakeToOrder && (
          <button
            type="button"
            onClick={() => onSizeChange('custom')}
            className={`col-span-3 sm:col-span-2 py-2.5 px-3 text-xs uppercase tracking-[0.16em] transition-colors border ${
              selectedSize === 'custom'
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-foreground hover:border-foreground'
            }`}
          >
            Bespoke
          </button>
        )}
      </div>

      {selectedSize === 'custom' && isMakeToOrder && (
        <div className="border-t border-border pt-6">
          {showMeasurementForm ? (
            <div className="border border-border p-5 space-y-4">
              <h4 className="text-xs uppercase tracking-[0.2em] text-foreground">
                48-Point Measurements
              </h4>
              <MeasurementForm
                onSubmit={handleCustomMeasurements}
                onCancel={() => setShowMeasurementForm(false)}
                initialMeasurements={customMeasurements}
              />
            </div>
          ) : (
            <div className="border border-border p-5 space-y-4">
              <div className="flex justify-between items-center gap-4">
                <h4 className="text-xs uppercase tracking-[0.2em] text-foreground">
                  Custom Measurements
                </h4>
                <button
                  type="button"
                  onClick={() => setShowMeasurementForm(true)}
                  className="text-xs uppercase tracking-[0.18em] text-foreground border-b border-border pb-0.5 hover:border-foreground transition-colors"
                >
                  {customMeasurements ? 'Edit' : 'Enter Measurements'}
                </button>
              </div>

              {customMeasurements ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Chest</span>
                    <span className="text-foreground">{customMeasurements.chest}&quot;</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Waist</span>
                    <span className="text-foreground">{customMeasurements.waist}&quot;</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Shoulder</span>
                    <span className="text-foreground">{customMeasurements.shoulder}&quot;</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Arm</span>
                    <span className="text-foreground">{customMeasurements.armLength}&quot;</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs font-light text-muted-foreground leading-relaxed">
                  Enter your chest, waist, shoulder, and sleeve measurements for a pattern drafted to your proportions.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {selectedSize !== 'custom' && (
        <div className="border-t border-border pt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Fit
            </span>
            <span className="text-xs text-foreground">{selectedFitting}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['Loose', 'Medium', 'Fit'] as const).map((fit) => (
              <button
                key={fit}
                type="button"
                onClick={() => onFittingChange(fit)}
                className={`py-2.5 px-3 text-xs transition-colors border text-center ${
                  selectedFitting === fit
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {fit === 'Loose' ? 'Relaxed' : fit === 'Medium' ? 'Classic' : 'Tailored'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
