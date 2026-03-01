import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Resume, ResumeData, ResumeMetadata } from "@/types/resume";

interface ResumeStore {
  resume: Resume | null;
  setResume: (resume: Resume) => void;
  updateMetadata: (metadata: Partial<ResumeMetadata>) => void;
  updateData: (data: Partial<ResumeData>) => void;
  clearResume: () => void;

  // Version history
  history: Resume[];
  addToHistory: () => void;
  undo: () => void;
  canUndo: boolean;
}

// Helper function to generate UUID
const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const createDefaultResume = (): Resume => ({
  metadata: {
    id: generateUUID(),
    templateId: "ats-minimal",
    generatorType: "ats-resume",
    language: "en",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  },
  data: {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      summary: "",
    },
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    organizations: [],
    publications: [],
  },
});

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: null,
      history: [],
      canUndo: false,

      setResume: (resume) =>
        set({
          resume: {
            ...resume,
            metadata: {
              ...resume.metadata,
              updatedAt: new Date().toISOString(),
            },
          },
        }),

      updateMetadata: (metadata) =>
        set((state) => {
          if (!state.resume) return state;

          // Add to history before updating
          const newHistory = [...state.history, { ...state.resume }];
          if (newHistory.length > 20) newHistory.shift();

          return {
            history: newHistory,
            canUndo: true,
            resume: {
              ...state.resume,
              metadata: {
                ...state.resume.metadata,
                ...metadata,
                updatedAt: new Date().toISOString(),
                version: state.resume.metadata.version + 1,
              },
            },
          };
        }),

      updateData: (data) =>
        set((state) => {
          if (!state.resume) {
            const newResume = createDefaultResume();
            return {
              resume: {
                ...newResume,
                data: {
                  ...newResume.data,
                  ...data,
                },
              },
            };
          }

          // Add to history before updating
          const newHistory = [...state.history, { ...state.resume }];
          if (newHistory.length > 20) newHistory.shift();

          return {
            history: newHistory,
            canUndo: true,
            resume: {
              ...state.resume,
              data: {
                ...state.resume.data,
                ...data,
              },
              metadata: {
                ...state.resume.metadata,
                updatedAt: new Date().toISOString(),
                version: state.resume.metadata.version + 1,
              },
            },
          };
        }),

      clearResume: () =>
        set({
          resume: null,
          history: [],
          canUndo: false,
        }),

      addToHistory: () =>
        set((state) => {
          if (!state.resume) return state;
          const newHistory = [...state.history, { ...state.resume }];
          if (newHistory.length > 20) {
            newHistory.shift();
          }
          return {
            history: newHistory,
            canUndo: true,
          };
        }),

      undo: () =>
        set((state) => {
          if (state.history.length === 0) return state;
          const newHistory = [...state.history];
          const previousResume = newHistory.pop();
          return {
            resume: previousResume || null,
            history: newHistory,
            canUndo: newHistory.length > 0,
          };
        }),
    }),
    {
      name: "resume-storage",
      partialize: (state) => ({
        resume: state.resume,
        history: state.history,
      }),
    }
  )
);
