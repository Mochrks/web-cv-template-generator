import { create } from "zustand";
import { ATSScore, SmartSuggestion } from "@/types/ai";

interface AIStore {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;

  atsScore: ATSScore | null;
  setATSScore: (score: ATSScore) => void;

  suggestions: SmartSuggestion[];
  addSuggestion: (suggestion: SmartSuggestion) => void;
  removeSuggestion: (id: string) => void;
  clearSuggestions: () => void;

  jobDescription: string;
  setJobDescription: (description: string) => void;
}

export const useAIStore = create<AIStore>((set) => ({
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),

  atsScore: null,
  setATSScore: (score) => set({ atsScore: score }),

  suggestions: [],
  addSuggestion: (suggestion) =>
    set((state) => ({
      suggestions: [...state.suggestions, suggestion],
    })),
  removeSuggestion: (id) =>
    set((state) => ({
      suggestions: state.suggestions.filter((s) => s.id !== id),
    })),
  clearSuggestions: () => set({ suggestions: [] }),

  jobDescription: "",
  setJobDescription: (description) => set({ jobDescription: description }),
}));
