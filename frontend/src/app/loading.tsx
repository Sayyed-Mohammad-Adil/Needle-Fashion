'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/95 z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border border-border border-t-foreground rounded-full animate-spin" />
        <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
          Needle Fashion
        </p>
      </div>
    </div>
  );
}
