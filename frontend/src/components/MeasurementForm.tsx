'use client';

import { useState } from 'react';
import { MeasurementDetails } from '@/lib/types';

interface MeasurementFormProps {
  onSubmit: (measurements: MeasurementDetails) => void;
  onCancel: () => void;
  initialMeasurements?: MeasurementDetails;
}

export default function MeasurementForm({ onSubmit, onCancel, initialMeasurements }: MeasurementFormProps) {
  const [measurements, setMeasurements] = useState<MeasurementDetails>(
    initialMeasurements || {
      chest: 0,
      waist: 0,
      hips: 0,
      shoulder: 0,
      armLength: 0,
      inseam: 0,
      neck: 0,
      photo: '',
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements({
      ...measurements,
      [name]: name === 'photo' ? value : parseFloat(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(measurements);
  };

  const fields = [
    { id: 'chest', label: 'Chest (inches)', placeholder: 'e.g. 40.5' },
    { id: 'waist', label: 'Waist (inches)', placeholder: 'e.g. 34.0' },
    { id: 'shoulder', label: 'Shoulder Span (inches)', placeholder: 'e.g. 18.5' },
    { id: 'armLength', label: 'Sleeve Length (inches)', placeholder: 'e.g. 25.0' },
    { id: 'neck', label: 'Band Collar / Neck (inches)', placeholder: 'e.g. 16.0' },
    { id: 'inseam', label: 'Churidar / Trouser Inseam (inches)', placeholder: 'e.g. 32.0' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fields.map((f) => (
          <div key={f.id} className="p-3 rounded-2xl glass-panel border border-border/50">
            <label htmlFor={f.id} className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              {f.label}
            </label>
            <input
              type="number"
              id={f.id}
              name={f.id}
              min="0"
              step="0.5"
              value={(measurements as any)[f.id] || ''}
              onChange={handleInputChange}
              placeholder={f.placeholder}
              className="w-full bg-background/50 border border-border/60 rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground focus:border-[#C5A059] focus:outline-none"
              required
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="glass-pill px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-glass-gold px-6 py-2 text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          Save Custom Docket
        </button>
      </div>
    </form>
  );
}