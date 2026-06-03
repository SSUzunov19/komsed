'use client';

import { useEffect, useState } from 'react';
import { useTour } from './TourContext';
import { Bear } from './Bear';
import { confetti } from './fx';

const PAD = 8;

/** Изписва текста буква по буква; при изключено — показва целия наведнъж. */
function useTypewriter(text: string, enabled: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, 22);
    return () => window.clearInterval(id);
  }, [text, enabled]);
  return text.slice(0, n);
}

export function TourOverlay() {
  const {
    active, index, total, paused, rect, step, duration,
    speed, next, prev, stop, togglePause, goTo, cycleSpeed,
  } = useTour();

  const typed = useTypewriter(step?.text ?? '', active);

  // Конфети на финалната стъпка
  useEffect(() => {
    if (active && index === total - 1) confetti();
  }, [active, index, total]);

  if (!active || !step) return null;

  const isFirst = index === 0;
  const isLast = index === total - 1;
  const dim = step.dim !== false;

  return (
    <div className="fixed inset-0 z-[9998]" aria-live="polite">
      {/* затъмнение + прожектор (клик навсякъде → напред) */}
      <button
        type="button"
        onClick={next}
        aria-label="Следваща стъпка"
        className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0"
      >
        {dim && rect ? (
          <span
            className="tour-spot"
            style={{
              left: rect.left - PAD,
              top: rect.top - PAD,
              width: rect.width + PAD * 2,
              height: rect.height + PAD * 2,
            }}
          />
        ) : dim ? (
          <span className="absolute inset-0 block bg-slate-900/55" />
        ) : null}
      </button>

      {/* мечето + балончето */}
      <div className="tour-dock" onClick={(e) => e.stopPropagation()}>
        <div key={index} className="tour-bubble">
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <div className="text-lg font-bold text-brand-dark">{step.title}</div>
            <div className="flex shrink-0 gap-1">
              <Mini onClick={cycleSpeed} title="Скорост">
                {speed}×
              </Mini>
            </div>
          </div>

          <p className="min-h-[60px] text-[15px] leading-relaxed text-slate-700">
            {typed}
            {typed.length < step.text.length && <span className="tour-caret">▌</span>}
          </p>

          {/* прогрес лента */}
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              key={`${index}-${paused}-${speed}`}
              className="h-full rounded-full bg-brand"
              style={{
                animation: paused || isLast ? 'none' : `tour-progress ${duration}ms linear forwards`,
                width: paused || isLast ? '100%' : undefined,
              }}
            />
          </div>

          {/* точки за прогрес + контроли */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  title={`Стъпка ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-5 bg-brand' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Ctrl onClick={prev} disabled={isFirst} title="Назад">
                ⏮
              </Ctrl>
              {!isLast && (
                <Ctrl onClick={togglePause} title={paused ? 'Продължи' : 'Пауза'}>
                  {paused ? '▶' : '⏸'}
                </Ctrl>
              )}
              {isLast ? (
                <button
                  type="button"
                  onClick={stop}
                  className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                >
                  Опитай сам 🎉
                </button>
              ) : (
                <Ctrl onClick={next} title="Напред">
                  ⏭
                </Ctrl>
              )}
              <Ctrl onClick={stop} title="Затвори">
                ✕
              </Ctrl>
            </div>
          </div>

          <span className="tour-bubble-tail" />
        </div>

        <div className="tour-bear">
          <Bear mood={step.mood} size={188} />
        </div>
      </div>
    </div>
  );
}

function Ctrl({
  children, onClick, disabled, title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs text-slate-600 transition-colors hover:border-brand hover:text-brand disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Mini({
  children, onClick, title, active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[11px] transition-colors ${
        active ? 'bg-brand/15 text-brand' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}
