'use client';

import { useTour } from './TourContext';

export function TourButton() {
  const { start, active } = useTour();
  return (
    <button
      type="button"
      onClick={start}
      disabled={active}
      title="Гледай водена презентация на сайта"
      className="ml-1 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/25 disabled:opacity-50"
    >
      <span className="tour-btn-bear">🧸</span> Презентация
    </button>
  );
}
