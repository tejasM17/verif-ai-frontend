import { createContext, useContext, useState, useCallback } from "react";

const PaletteContext = createContext(null);

// `paletteEnabled` gates the entire command palette experience.
// For the recruiter dashboard this is false, so:
// - The trigger button is not rendered in the header
// - The Ctrl/Cmd+K shortcut does nothing
// - The modal is never mounted
export function PaletteProvider({ paletteEnabled = true, children }) {
  const [open, setOpen] = useState(false);

  const openPalette = useCallback(() => {
    if (!paletteEnabled) return;
    setOpen(true);
  }, [paletteEnabled]);

  const closePalette = useCallback(() => setOpen(false), []);
  const togglePalette = useCallback(() => {
    if (!paletteEnabled) return;
    setOpen((o) => !o);
  }, [paletteEnabled]);

  return (
    <PaletteContext.Provider value={{ open, openPalette, closePalette, togglePalette, paletteEnabled }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within a PaletteProvider");
  return ctx;
}