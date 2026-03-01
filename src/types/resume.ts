// Resume Data Types

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
  summary?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic";
}

export interface Organization {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  link: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  organizations: Organization[];
  publications: Publication[];
}

export interface ResumeMetadata {
  id: string;
  templateId: string;
  generatorType: "cv" | "ats-resume" | "cover-letter";
  language: "en" | "id";
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Resume {
  metadata: ResumeMetadata;
  data: ResumeData;
}
