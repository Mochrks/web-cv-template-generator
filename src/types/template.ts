// Template Types

export type TemplateId =
  | "ats-minimal"
  | "professional-clean"
  | "modern-minimal"
  | "executive"
  | "creative-light";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  category: "ATS-Optimized" | "Professional" | "Creative";
  preview: string;
  features: string[];
  atsScore: number;
  recommended: boolean;
}

export const TEMPLATES: Template[] = [
  {
    id: "ats-minimal",
    name: "ATS Minimal",
    description: "Ultra-clean, ATS-optimized format with maximum compatibility",
    category: "ATS-Optimized",
    preview: "/templates/ats-minimal.png",
    features: ["100% ATS Compatible", "Clean Structure", "Keyword Optimized"],
    atsScore: 100,
    recommended: true,
  },
  {
    id: "professional-clean",
    name: "Professional Clean",
    description: "Balanced design with professional aesthetics and ATS compatibility",
    category: "Professional",
    preview: "/templates/professional-clean.png",
    features: ["ATS-Friendly", "Professional Look", "Versatile"],
    atsScore: 95,
    recommended: false,
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Contemporary design with minimalist approach",
    category: "Professional",
    preview: "/templates/modern-minimal.png",
    features: ["Modern Design", "Clean Layout", "ATS-Safe"],
    atsScore: 90,
    recommended: false,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Premium template for senior-level positions",
    category: "Professional",
    preview: "/templates/executive.png",
    features: ["Executive Level", "Professional", "ATS-Compatible"],
    atsScore: 92,
    recommended: false,
  },
  {
    id: "creative-light",
    name: "Creative Light",
    description: "Subtle creative touches while maintaining ATS compatibility",
    category: "Creative",
    preview: "/templates/creative-light.png",
    features: ["Creative Design", "ATS-Safe", "Unique Layout"],
    atsScore: 85,
    recommended: false,
  },
];
