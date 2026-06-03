import type { Mood } from './steps';

/** Сладко SVG мече-талисман „Комсе" с няколко настроения. */
export function Bear({ mood = 'happy', size = 132 }: { mood?: Mood; size?: number }) {
  const FUR = '#A56B43';
  const FUR_DARK = '#8B5A36';
  const MUZZLE = '#E8C9A8';
  const DARK = '#3A2A1A';
  const wave = mood === 'wave';
  const talk = mood === 'talking' || mood === 'cheer';
  const cheer = mood === 'cheer';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className="bear-bob"
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      {/* ушички */}
      <circle cx="58" cy="48" r="26" fill={FUR_DARK} />
      <circle cx="142" cy="48" r="26" fill={FUR_DARK} />
      <circle cx="58" cy="48" r="13" fill={MUZZLE} />
      <circle cx="142" cy="48" r="13" fill={MUZZLE} />

      {/* ръчичка, която маха */}
      <g
        className={wave ? 'bear-arm-wave' : ''}
        style={{ transformOrigin: '150px 140px' }}
      >
        <circle cx="166" cy="120" r="17" fill={FUR_DARK} />
      </g>
      <circle cx="34" cy="140" r="17" fill={FUR_DARK} />

      {/* глава */}
      <circle cx="100" cy="100" r="62" fill={FUR} />

      {/* очи */}
      {cheer ? (
        <>
          <path d="M70 92 q8 -10 16 0" fill="none" stroke={DARK} strokeWidth="5" strokeLinecap="round" />
          <path d="M114 92 q8 -10 16 0" fill="none" stroke={DARK} strokeWidth="5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="78" cy="92" r="7" fill={DARK} />
          <circle cx="122" cy="92" r="7" fill={DARK} />
          <circle cx="80" cy="90" r="2.4" fill="#fff" />
          <circle cx="124" cy="90" r="2.4" fill="#fff" />
        </>
      )}

      {/* муцунка */}
      <ellipse cx="100" cy="124" rx="34" ry="27" fill={MUZZLE} />
      {/* носле */}
      <ellipse cx="100" cy="112" rx="9" ry="6.5" fill={DARK} />

      {/* устичка */}
      {talk ? (
        <ellipse className="bear-mouth-talk" cx="100" cy="132" rx="8" ry="7" fill={DARK} />
      ) : (
        <path
          d="M100 118 v8 M100 126 q-11 12 -20 2 M100 126 q11 12 20 2"
          fill="none"
          stroke={DARK}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}

      {/* бузки */}
      <circle cx="64" cy="118" r="8" fill="#F2A9A0" opacity="0.6" />
      <circle cx="136" cy="118" r="8" fill="#F2A9A0" opacity="0.6" />
    </svg>
  );
}
