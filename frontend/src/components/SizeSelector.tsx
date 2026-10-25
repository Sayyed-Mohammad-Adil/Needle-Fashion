'use client';

import { useState } from 'react';
import MeasurementForm from '@/components/MeasurementForm';
import { MeasurementDetails } from '@/lib/types';
import { SparklesIcon, ScissorsIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

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
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A059] block">
            Royal Tailoring
          </span>
          <h3 className="font-serif text-base font-bold text-foreground mt-0.5">
            Select Size or Bespoke Fit
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">Standard & Made-to-Measure</span>
      </div>

      {/* Size Pills */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSizeChange(size)}
              className={`relative py-3 px-2 rounded-2xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'btn-glass-gold shadow-md'
                  : 'glass-pill text-foreground/80 hover:text-foreground hover:border-[#C5A059]/40'
              }`}
            >
              <span>{size}</span>
            </button>
          );
        })}

        {isMakeToOrder && (
          <button
            type="button"
            onClick={() => onSizeChange('custom')}
            className={`col-span-2 relative py-3 px-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
              selectedSize === 'custom'
                ? 'btn-glass-gold shadow-md'
                : 'glass-pill text-foreground/80 hover:text-foreground hover:border-[#C5A059]/50'
            }`}
          >
            <ScissorsIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Bespoke 48-Pt</span>
          </button>
        )}
      </div>

      {/* Custom measurements card */}
      {selectedSize === 'custom' && isMakeToOrder && (
        <div className="border-t border-border/50 pt-6">
          {showMeasurementForm ? (
            <div className="glass-panel p-5 rounded-3xl border border-[#C5A059]/40 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-[#C5A059]" />
                <h4 className="font-serif text-sm font-bold text-foreground">
                  48-Point Atelier Measurements
                </h4>
              </div>
              <MeasurementForm
                onSubmit={handleCustomMeasurements}
                onCancel={() => setShowMeasurementForm(false)}
                initialMeasurements={customMeasurements}
              />
            </div>
          ) : (
            <div className="glass-panel-gold p-5 rounded-3xl border border-[#C5A059]/30 shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-[#C5A059]" />
                  <h4 className="font-serif text-sm font-bold text-foreground">
                    Custom Karigar Docket
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMeasurementForm(true)}
                  className="text-xs font-bold text-[#C5A059] uppercase tracking-wider hover:underline"
                >
                  {customMeasurements ? 'Modify Docket ✎' : '+ Input Measurements'}
                </button>
              </div>

              {customMeasurements ? (
                <div className="glass-panel p-4 rounded-2xl border border-border/40">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 rounded-xl bg-background/40">
                      <span className="text-[10px] text-muted-foreground uppercase block">Chest</span>
                      <span className="font-bold text-foreground">{customMeasurements.chest}&quot;</span>
                    </div>
                    <div className="p-2 rounded-xl bg-background/40">
                      <span className="text-[10px] text-muted-foreground uppercase block">Waist</span>
                      <span className="font-bold text-foreground">{customMeasurements.waist}&quot;</span>
                    </div>
                    <div className="p-2 rounded-xl bg-background/40">
                      <span className="text-[10px] text-muted-foreground uppercase block">Shoulder</span>
                      <span className="font-bold text-foreground">{customMeasurements.shoulder}&quot;</span>
                    </div>
                    <div className="p-2 rounded-xl bg-background/40">
                      <span className="text-[10px] text-muted-foreground uppercase block">Arm Length</span>
                      <span className="font-bold text-foreground">{customMeasurements.armLength}&quot;</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Provide your precision chest, shoulder, and length metrics. Our master cutting master will draft a custom wooden paper pattern exclusively for your body.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fitting preference selector */}
      {selectedSize !== 'custom' && (
        <div className="border-t border-border/50 pt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Silhouette Fitting
            </span>
            <span className="text-xs font-bold text-[#C5A059]">{selectedFitting} Silhouette</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['Loose', 'Medium', 'Fit'] as const).map((fit) => (
              <button
                key={fit}
                type="button"
                onClick={() => onFittingChange(fit)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-center ${
                  selectedFitting === fit
                    ? 'btn-glass-gold shadow-sm'
                    : 'glass-pill text-muted-foreground hover:text-foreground'
                }`}
              >
                {fit === 'Loose' ? 'Royal Flared' : fit === 'Medium' ? 'Aristocratic' : 'Sculpted Fit'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}