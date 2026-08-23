import React, { useState, useEffect } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { useTemplateStore } from "@/store/useTemplateStore";
import {
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Organization,
  Publication,
} from "@/types/resume";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderRoot,
  Award,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { saveAs } from "file-saver";
import { exportToDocx } from "@/utils/exportDocx";

// Components
import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorPreview } from "@/components/editor/EditorPreview";

// Sections
import { PersonalInfoSection } from "@/components/editor/sections/PersonalInfoSection";
import { ExperienceSection } from "@/components/editor/sections/ExperienceSection";
import { EducationSection } from "@/components/editor/sections/EducationSection";
import { SkillsSection } from "@/components/editor/sections/SkillsSection";
import { ProjectsSection } from "@/components/editor/sections/ProjectsSection";
import { CertificationsSection } from "@/components/editor/sections/CertificationsSection";
import { OrganizationsSection } from "@/components/editor/sections/OrganizationsSection";
import { PublicationsSection } from "@/components/editor/sections/PublicationsSection";

const EditorPage: React.FC = () => {
  const { resume, updateData, canUndo, undo, loadDummyData } = useResumeStore();
  const { selectedTemplateId } = useTemplateStore();
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!resume) {
      loadDummyData();
    }
  }, [resume, loadDummyData]);

  const handleExportPDF = async () => {
    if (!resume) return;
    setIsExporting(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const ATSMinimalPDF = (await import("@/components/templates/pdf/ATSMinimalPDF")).default;
      const blob = await pdf(
        React.createElement(ATSMinimalPDF, { data: resume.data }) as React.ReactElement
      ).toBlob();
      saveAs(blob, `${resume.data.personalInfo.fullName?.replace(/\s+/g, "_") || "Resume"}_CV.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDocx = async () => {
    if (!resume) return;
    setIsExporting(true);
    try {
      await exportToDocx(resume.data);
    } catch (error) {
      console.error("DOCX Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mounted || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Update helpers
  const updateExperience = <K extends keyof Experience>(
    id: string,
    field: K,
    value: Experience[K]
  ) => {
    updateData({
      experiences: resume.data.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: [""],
    };
    updateData({ experiences: [...resume.data.experiences, newExp] });
  };

  const deleteExperience = (id: string) => {
    updateData({ experiences: resume.data.experiences.filter((exp) => exp.id !== id) });
  };

  const addResponsibility = (expId: string) => {
    updateData({
      experiences: resume.data.experiences.map((exp) =>
        exp.id === expId ? { ...exp, responsibilities: [...exp.responsibilities, ""] } : exp
      ),
    });
  };

  const updateResponsibility = (expId: string, idx: number, value: string) => {
    updateData({
      experiences: resume.data.experiences.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((r, i) => (i === idx ? value : r)),
            }
          : exp
      ),
    });
  };

  const deleteResponsibility = (expId: string, idx: number) => {
    updateData({
      experiences: resume.data.experiences.map((exp) =>
        exp.id === expId
          ? { ...exp, responsibilities: exp.responsibilities.filter((_, i) => i !== idx) }
          : exp
      ),
    });
  };

  const updateEducation = <K extends keyof Education>(
    id: string,
    field: K,
    value: Education[K]
  ) => {
    updateData({
      education: resume.data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
    };
    updateData({ education: [...resume.data.education, newEdu] });
  };

  const deleteEducation = (id: string) => {
    updateData({ education: resume.data.education.filter((edu) => edu.id !== id) });
  };

  const updateSkillCategory = <K extends keyof Skill>(id: string, field: K, value: Skill[K]) => {
    updateData({
      skills: resume.data.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  const addSkillCategory = () => {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      category: "",
      skills: [""],
    };
    updateData({ skills: [...resume.data.skills, newSkill] });
  };

  const deleteSkillCategory = (id: string) => {
    updateData({ skills: resume.data.skills.filter((s) => s.id !== id) });
  };

  const updateProject = <K extends keyof Project>(id: string, field: K, value: Project[K]) => {
    updateData({
      projects: resume.data.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const addProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: [""],
      link: "",
      startDate: "",
      endDate: "",
      highlights: [""],
    };
    updateData({ projects: [...resume.data.projects, newProj] });
  };

  const deleteProject = (id: string) => {
    updateData({ projects: resume.data.projects.filter((p) => p.id !== id) });
  };

  const updateCertification = <K extends keyof Certification>(
    id: string,
    field: K,
    value: Certification[K]
  ) => {
    updateData({
      certifications: (resume.data.certifications || []).map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
      credentialId: "",
    };
    updateData({ certifications: [...(resume.data.certifications || []), newCert] });
  };

  const deleteCertification = (id: string) => {
    updateData({ certifications: (resume.data.certifications || []).filter((c) => c.id !== id) });
  };

  const updateOrganization = <K extends keyof Organization>(
    id: string,
    field: K,
    value: Organization[K]
  ) => {
    updateData({
      organizations: (resume.data.organizations || []).map((o) =>
        o.id === id ? { ...o, [field]: value } : o
      ),
    });
  };

  const addOrganization = () => {
    const newOrg: Organization = {
      id: crypto.randomUUID(),
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    updateData({ organizations: [...(resume.data.organizations || []), newOrg] });
  };

  const deleteOrganization = (id: string) => {
    updateData({ organizations: (resume.data.organizations || []).filter((o) => o.id !== id) });
  };

  const updatePublication = <K extends keyof Publication>(
    id: string,
    field: K,
    value: Publication[K]
  ) => {
    updateData({
      publications: (resume.data.publications || []).map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const addPublication = () => {
    const newPub: Publication = {
      id: crypto.randomUUID(),
      title: "",
      publisher: "",
      date: "",
      link: "",
      description: "",
    };
    updateData({ publications: [...(resume.data.publications || []), newPub] });
  };

  const deletePublication = (id: string) => {
    updateData({ publications: (resume.data.publications || []).filter((p) => p.id !== id) });
  };

  const SECTIONS = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
      color: "blue",
      bg: "bg-blue-500/10",
      hover: "group-hover/item:bg-blue-500/20",
      text: "text-blue-500",
    },
    {
      id: "experience",
      label: "Experience",
      icon: Briefcase,
      color: "emerald",
      bg: "bg-emerald-500/10",
      hover: "group-hover/item:bg-emerald-500/20",
      text: "text-emerald-500",
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      color: "violet",
      bg: "bg-violet-500/10",
      hover: "group-hover/item:bg-violet-500/20",
      text: "text-violet-500",
    },
    {
      id: "skills",
      label: "Skills",
      icon: Wrench,
      color: "amber",
      bg: "bg-amber-500/10",
      hover: "group-hover/item:bg-amber-500/20",
      text: "text-amber-500",
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderRoot,
      color: "indigo",
      bg: "bg-indigo-500/10",
      hover: "group-hover/item:bg-indigo-500/20",
      text: "text-indigo-500",
    },
    {
      id: "certifications",
      label: "License & Certifications",
      icon: Award,
      color: "orange",
      bg: "bg-orange-500/10",
      hover: "group-hover/item:bg-orange-500/20",
      text: "text-orange-500",
    },
    {
      id: "organizations",
      label: "Organizations",
      icon: Users,
      color: "rose",
      bg: "bg-rose-500/10",
      hover: "group-hover/item:bg-rose-500/20",
      text: "text-rose-500",
    },
    {
      id: "publications",
      label: "Publications",
      icon: BookOpen,
      color: "cyan",
      bg: "bg-cyan-500/10",
      hover: "group-hover/item:bg-cyan-500/20",
      text: "text-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <EditorHeader
        selectedTemplateId={selectedTemplateId}
        viewMode={viewMode}
        setViewMode={setViewMode}
        canUndo={canUndo}
        onUndo={undo}
        isExporting={isExporting}
        onExportPDF={handleExportPDF}
        onExportDocx={handleExportDocx}
        onPrint={handlePrint}
      />

      <main className="flex-1 flex overflow-hidden">
        <div
          className={cn(
            "flex-1 overflow-y-auto px-6 py-10 transition-all duration-300",
            viewMode === "preview" ? "hidden" : "block",
            viewMode === "split" ? "w-1/2" : "max-w-4xl mx-auto"
          )}
        >
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Resume Content
              </h2>
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold px-3 py-1 animate-pulse hover:bg-emerald-500/20 dark:hover:bg-emerald-500/20 transition-colors cursor-default"
              >
                Saved Automatically
              </Badge>
            </div>

            <Accordion type="single" collapsible defaultValue="personal" className="space-y-6">
              {SECTIONS.map((section) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border border-border/60 rounded-2xl bg-card shadow-sm overflow-hidden transition-all hover:shadow-md group/item"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2.5 rounded-xl transition-colors",
                            section.bg,
                            section.hover
                          )}
                        >
                          <section.icon className={cn("h-5 w-5", section.text)} />
                        </div>
                        <span className="text-lg font-bold text-foreground">{section.label}</span>
                      </div>
                      {section.id !== "personal" && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/5 text-primary border-primary/10 font-bold px-2 py-0.5"
                        >
                          {section.id === "experience"
                            ? resume.data.experiences.length
                            : section.id === "education"
                              ? resume.data.education.length
                              : section.id === "skills"
                                ? resume.data.skills.length
                                : section.id === "projects"
                                  ? resume.data.projects.length
                                  : section.id === "certifications"
                                    ? (resume.data.certifications || []).length
                                    : section.id === "organizations"
                                      ? (resume.data.organizations || []).length
                                      : section.id === "publications"
                                        ? (resume.data.publications || []).length
                                        : 0}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2 border-t border-border/40">
                    {section.id === "personal" && (
                      <PersonalInfoSection
                        data={resume.data.personalInfo}
                        onChange={(data) =>
                          updateData({ personalInfo: { ...resume.data.personalInfo, ...data } })
                        }
                      />
                    )}
                    {section.id === "experience" && (
                      <ExperienceSection
                        experiences={resume.data.experiences}
                        onUpdate={updateExperience}
                        onAdd={addExperience}
                        onDelete={deleteExperience}
                        onAddResponsibility={addResponsibility}
                        onUpdateResponsibility={updateResponsibility}
                        onDeleteResponsibility={deleteResponsibility}
                      />
                    )}
                    {section.id === "education" && (
                      <EducationSection
                        education={resume.data.education}
                        onUpdate={updateEducation}
                        onAdd={addEducation}
                        onDelete={deleteEducation}
                      />
                    )}
                    {section.id === "skills" && (
                      <SkillsSection
                        skills={resume.data.skills}
                        onUpdate={updateSkillCategory}
                        onAdd={addSkillCategory}
                        onDelete={deleteSkillCategory}
                      />
                    )}
                    {section.id === "projects" && (
                      <ProjectsSection
                        projects={resume.data.projects}
                        onUpdate={updateProject}
                        onAdd={addProject}
                        onDelete={deleteProject}
                      />
                    )}
                    {section.id === "certifications" && (
                      <CertificationsSection
                        certifications={resume.data.certifications || []}
                        onUpdate={updateCertification}
                        onAdd={addCertification}
                        onDelete={deleteCertification}
                      />
                    )}
                    {section.id === "organizations" && (
                      <OrganizationsSection
                        organizations={resume.data.organizations || []}
                        onUpdate={updateOrganization}
                        onAdd={addOrganization}
                        onDelete={deleteOrganization}
                      />
                    )}
                    {section.id === "publications" && (
                      <PublicationsSection
                        publications={resume.data.publications || []}
                        onUpdate={updatePublication}
                        onAdd={addPublication}
                        onDelete={deletePublication}
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <EditorPreview
          data={resume.data}
          viewMode={viewMode}
          previewDevice={previewDevice}
          setPreviewDevice={setPreviewDevice}
        />
      </main>
    </div>
  );
};

export default EditorPage;
