import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TemplateId } from "@/types/template";

interface TemplateStore {
  selectedTemplateId: TemplateId | null;
  setSelectedTemplate: (templateId: TemplateId) => void;
  clearSelectedTemplate: () => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      selectedTemplateId: null,

      setSelectedTemplate: (templateId) => set({ selectedTemplateId: templateId }),

      clearSelectedTemplate: () => set({ selectedTemplateId: null }),
    }),
    {
      name: "template-storage",
    }
  )
);
