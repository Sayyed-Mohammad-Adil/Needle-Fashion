'use client';

import React from 'react';

interface ShahiFarmanTriggerProps {
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export default function ShahiFarmanTrigger({
  className = '',
  label,
  children,
}: ShahiFarmanTriggerProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('openShahiFarman'));
        }
      }}
      className={className}
      title="Unroll Royal Mughal Farman"
    >
      {children || <span>{label || '📜 शाही फ़रमान (Royal Farman)'}</span>}
    </button>
  );
}
