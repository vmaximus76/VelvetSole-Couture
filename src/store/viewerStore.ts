import { create } from "zustand";

export type VariantKey = "nails" | "stilettos" | "nylons" | null;

interface ViewerState {
  activeVariant: VariantKey;
  selectedSwatches: Record<string, string>;
  setActiveVariant: (variant: VariantKey) => void;
  selectSwatch: (category: string, swatchId: string) => void;
}

export const useViewerStore = create<ViewerState>()((set) => ({
  activeVariant: null,
  selectedSwatches: {},
  setActiveVariant: (variant) => set({ activeVariant: variant }),
  selectSwatch: (category, swatchId) =>
    set((state) => ({
      selectedSwatches: { ...state.selectedSwatches, [category]: swatchId },
    })),
}));
