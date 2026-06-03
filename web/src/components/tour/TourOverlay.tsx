'use client';

import { useTour } from './TourContext';
import { Bear } from './Bear';

const PAD = 8;

export function TourOverlay() {
  const { active, index, total, paused, rect, step, next, prev, stop, togglePause } = useTour();

  if (!active || !step) return null;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className="fixed inset-0 z-[9998]" aria-live="polite">
      {/* затъмнение + прожектор (клик навсякъде → напред) */}
      <button
        type="button"
        onClick={next}
        aria-label="Следваща стъпка"
        className="absolute inset-0 h-full w-full cursor-pointer border-0 bg-transparent p-0"
      >
        {rect ? (
          <span
            className="tour-spot"
            style={{
              left: rect.left - PAD,
              top: rect.top - PAD,
              width: rect.width + PAD * 2,
              height: rect.height + PAD * 2,
            }}
          />
        ) : (
          <span className="absolute inset-0 block bg-slate-900/55" />
        )}
      </button>

      {/* мечето + балончето */}
      <div
        className="tour-dock"
        onClick={(e) => e.stopPropagation()}
      >
        <div key={index} className="tour-bubble">
          <div className="mb-1.5 text-lg font-bold text-brand-dark">{step.title}</div>
          <p className="text-[15px] leading-relaxed text-slate-700">{step.text}</p>

          {/* прогрес лента */}
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              key={`${index}-${paused}`}
              className="h-full rounded-full bg-brand"
              style={{
                animation: paused || isLast ? 'none' : 'tour-progress 8.5s linear forwards',
                width: paused || isLast ? '100%' : undefined,
              }}
            />
          </div>

          {/* контроли */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">
              {index + 1} / {total}
            </span>
            <div className="flex items-center gap-1.5">
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
                  Край 🎉
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
  children,
  onClick,
  disabled,
  title,
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
