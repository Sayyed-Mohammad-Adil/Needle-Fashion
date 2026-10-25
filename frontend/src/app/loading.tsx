'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/90 backdrop-blur-md z-50 transition-colors">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <span className="font-serif text-lg font-bold text-primary">N</span>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">
          Curating Needle Atelier...
        </p>
      </div>
    </div>
  );
}