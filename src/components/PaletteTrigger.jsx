import { usePalette } from "../contexts/PaletteContext";

export default function PaletteTrigger() {
  const { openPalette } = usePalette();

  return (
    <button
      type="button"
      onClick={openPalette}
      className="w-full max-w-xl flex items-center gap-3 h-12 px-4 rounded-full border border-[var(--border-medium)] bg-[var(--surface-3)] hover:bg-[var(--surface-4)] hover:border-[rgba(244,196,48,0.4)] transition-all duration-200 group"
      aria-label="Open command palette"
    >
      <svg
        className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-gold)] transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <span className="flex-1 text-left text-[13px] text-[var(--text-placeholder)]">
        Search companies, roles, locations...
      </span>
      <span className="hidden sm:flex items-center gap-1">
        <span className="kbd">⌘</span>
        <span className="kbd">K</span>
      </span>
    </button>
  );
}