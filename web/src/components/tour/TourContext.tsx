'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TOUR_STEPS, type TourStep } from './steps';

const STEP_DURATION_MS = 8500;

type TourState = {
  active: boolean;
  index: number;
  paused: boolean;
  ready: boolean;
  rect: DOMRect | null;
  step: TourStep | null;
  total: number;
  speed: number;
  voice: boolean;
  duration: number;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  togglePause: () => void;
  cycleSpeed: () => void;
  toggleVoice: () => void;
};

const TourCtx = createContext<TourState | null>(null);

export function useTour(): TourState {
  const ctx = useContext(TourCtx);
  if (!ctx) throw new Error('useTour трябва да е вътре в <TourProvider>');
  return ctx;
}

export function TourProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [speed, setSpeed] = useState(1);
  const [voice, setVoice] = useState(false);

  const step = active ? TOUR_STEPS[index] : null;
  const duration = (step?.durationMs ?? STEP_DURATION_MS) / speed;

  const cycleSpeed = useCallback(() => setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1)), []);
  const toggleVoice = useCallback(() => {
    setVoice((v) => {
      const nv = !v;
      try {
        localStorage.setItem('komsed-tour-voice', nv ? '1' : '0');
      } catch {}
      if (!nv && typeof window !== 'undefined') window.speechSynthesis?.cancel();
      return nv;
    });
  }, []);

  const start = useCallback(() => {
    setIndex(0);
    setPaused(false);
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    setRect(null);
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i >= TOUR_STEPS.length - 1 ? i : i + 1));
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goTo = useCallback((i: number) => {
    setIndex(Math.min(TOUR_STEPS.length - 1, Math.max(0, i)));
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  // Навигация към страницата на стъпката + намиране на целевия елемент
  useEffect(() => {
    if (!active) return;
    const current = TOUR_STEPS[index];
    if (pathnameRef.current !== current.path) {
      router.push(current.path);
    }

    let cancelled = false;
    let raf = 0;
    let t1 = 0;
    let t2 = 0;
    let tries = 0;
    setReady(false);
    setRect(null);

    const tick = () => {
      if (cancelled) return;
      if (!current.selector) {
        setReady(true);
        return;
      }
      const el = document.querySelector(current.selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        t2 = window.setTimeout(() => {
          if (cancelled) return;
          setRect(el.getBoundingClientRect());
          setReady(true);
        }, 480);
        return;
      }
      if (tries++ < 150) {
        raf = requestAnimationFrame(tick);
      } else {
        setReady(true); // елементът не е намерен — показваме само балончето
      }
    };
    t1 = window.setTimeout(tick, 120);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active, index, router]);

  // Преизчисляване на прожектора при скрол/resize
  useEffect(() => {
    if (!active) return;
    const current = TOUR_STEPS[index];
    if (!current.selector) return;
    const update = () => {
      const el = document.querySelector(current.selector!);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [active, index]);

  // Авто-прелистване
  useEffect(() => {
    if (!active || paused || !ready) return;
    if (index >= TOUR_STEPS.length - 1) return; // на последната спираме
    const t = window.setTimeout(() => next(), duration);
    return () => clearTimeout(t);
  }, [active, paused, ready, index, next, duration]);

  // Жив SQL демо — изпраща заявката към страницата
  useEffect(() => {
    if (!active || !ready) return;
    const current = TOUR_STEPS[index];
    if (!current.demoSql) return;
    const t = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('komsed:run-sql', { detail: { sql: current.demoSql } }));
    }, 700);
    return () => clearTimeout(t);
  }, [active, ready, index]);

  // Гласов разказ (TTS)
  useEffect(() => {
    if (!active || !ready || !voice || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(`${TOUR_STEPS[index].title}. ${TOUR_STEPS[index].text}`);
    const bg = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith('bg'));
    if (bg) u.voice = bg;
    u.lang = 'bg-BG';
    u.rate = 1;
    synth.speak(u);
    return () => synth.cancel();
  }, [active, ready, index, voice]);

  // Зареждане на предпочитанието за глас + авто-старт при ?tour=1
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem('komsed-tour-voice') === '1') setVoice(true);
    } catch {}
    if (new URLSearchParams(window.location.search).get('tour') === '1') {
      const t = window.setTimeout(start, 600);
      return () => clearTimeout(t);
    }
  }, [start]);

  // Клавиатура
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Escape') stop();
      else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, next, prev, stop, togglePause]);

  return (
    <TourCtx.Provider
      value={{
        active,
        index,
        paused,
        ready,
        rect,
        step,
        total: TOUR_STEPS.length,
        speed,
        voice,
        duration,
        start,
        stop,
        next,
        prev,
        goTo,
        togglePause,
        cycleSpeed,
        toggleVoice,
      }}
    >
      {children}
    </TourCtx.Provider>
  );
}
