import React, { useState } from "react";
import { useRouter } from "next/router";
import { useResumeStore } from "@/store/useResumeStore";
import { useTemplateStore } from "@/store/useTemplateStore";
import ATSMinimal from "@/components/templates/templates/ATSMinimal";
import { Experience, Education, Skill, Project, Certification } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToDocx } from "@/utils/exportDocx";
import { saveAs } from "file-saver";
import {
  Download,
  Undo2,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderRoot,
  Link,
  ChevronLeft,
  Monitor,
  Smartphone,
  Eye,
  FileText,
  Printer,
  FileDown,
  Loader2,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EditorPage: React.FC = () => {
  const router = useRouter();
  const { resume, updateData, canUndo, undo } = useResumeStore();
  const { selectedTemplateId } = useTemplateStore();
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!resume) return;
    setIsExporting(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const ATSMinimalPDF = (await import("@/components/templates/pdf/ATSMinimalPDF")).default;
      const blob = await pdf(
        React.createElement(ATSMinimalPDF, { data: resume.data }) as any // eslint-disable-line @typescript-eslint/no-explicit-any
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

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">No Resume Data Found</h2>
            <p className="text-slate-500">
              Please upload your CV or start from scratch to begin editing.
            </p>
          </div>
          <Button onClick={() => router.push("/")} className="w-full">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
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

  const updateExperience = (id: string, field: keyof Experience, value: unknown) => {
    updateData({
      experiences: resume.data.experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const deleteExperience = (id: string) => {
    updateData({
      experiences: resume.data.experiences.filter((exp) => exp.id !== id),
    });
  };

  const addResponsibility = (expId: string) => {
    updateData({
      experiences: resume.data.experiences.map((exp) =>
        exp.id === expId ? { ...exp, responsibilities: [...exp.responsibilities, ""] } : exp
      ),
    });
  };

  const updateResponsibility = (expId: string, index: number, value: string) => {
    updateData({
      experiences: resume.data.experiences.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((r, i) => (i === index ? value : r)),
            }
          : exp
      ),
    });
  };

  const deleteResponsibility = (expId: string, index: number) => {
    updateData({
      experiences: resume.data.experiences.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.filter((_, i) => i !== index),
            }
          : exp
      ),
    });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      achievements: [],
    };
    updateData({ education: [...resume.data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: unknown) => {
    updateData({
      education: resume.data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const deleteEducation = (id: string) => {
    updateData({
      education: resume.data.education.filter((edu) => edu.id !== id),
    });
  };

  // Skills handlers
  const addSkillCategory = () => {
    const newCategory: Skill = {
      id: Date.now().toString(),
      category: "",
      skills: [""],
    };
    updateData({ skills: [...resume.data.skills, newCategory] });
  };

  const updateSkillCategory = (id: string, field: keyof Skill, value: unknown) => {
    updateData({
      skills: resume.data.skills.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat)),
    });
  };

  const deleteSkillCategory = (id: string) => {
    updateData({
      skills: resume.data.skills.filter((cat) => cat.id !== id),
    });
  };

  const addSkill = (catId: string) => {
    updateData({
      skills: resume.data.skills.map((cat) =>
        cat.id === catId ? { ...cat, skills: [...cat.skills, ""] } : cat
      ),
    });
  };

  const updateSkill = (catId: string, index: number, value: string) => {
    updateData({
      skills: resume.data.skills.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              skills: cat.skills.map((s, i) => (i === index ? value : s)),
            }
          : cat
      ),
    });
  };

  const deleteSkill = (catId: string, index: number) => {
    updateData({
      skills: resume.data.skills.map((cat) =>
        cat.id === catId ? { ...cat, skills: cat.skills.filter((_, i) => i !== index) } : cat
      ),
    });
  };

  // Project handlers
  const addProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [""],
      highlights: [""],
      link: "",
    };
    updateData({ projects: [...resume.data.projects, newProj] });
  };

  const updateProject = (id: string, field: keyof Project, value: unknown) => {
    updateData({
      projects: resume.data.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const deleteProject = (id: string) => {
    updateData({
      projects: resume.data.projects.filter((proj) => proj.id !== id),
    });
  };

  const addProjectTech = (projId: string) => {
    updateData({
      projects: resume.data.projects.map((proj) =>
        proj.id === projId ? { ...proj, technologies: [...proj.technologies, ""] } : proj
      ),
    });
  };

  const updateProjectTech = (projId: string, index: number, value: string) => {
    updateData({
      projects: resume.data.projects.map((proj) =>
        proj.id === projId
          ? {
              ...proj,
              technologies: proj.technologies.map((t, i) => (i === index ? value : t)),
            }
          : proj
      ),
    });
  };

  const deleteProjectTech = (projId: string, index: number) => {
    updateData({
      projects: resume.data.projects.map((proj) =>
        proj.id === projId
          ? { ...proj, technologies: proj.technologies.filter((_, i) => i !== index) }
          : proj
      ),
    });
  };

  const addProjectHighlight = (projId: string) => {
    updateData({
      projects: resume.data.projects.map((proj) =>
        proj.id === projId ? { ...proj, highlights: [...proj.highlights, ""] } : proj
      ),
    });
  };

  const updateProjectHighlight = (projId: string, index: number, value: string) => {
    updateData({
      projects: resume.data.projects.map((proj) =>
        proj.id === projId
          ? {
              ...proj,
              highlights: proj.highlights.map((h, i) => (i === index ? value : h)),
            }
          : proj
      ),
    });
  };

  const deleteProjectHighlight = (projId: string, index: number) => {
    updateData({
      projects: resume.data.projects.map((proj) =>
        proj.id === projId
          ? { ...proj, highlights: proj.highlights.filter((_, i) => i !== index) }
          : proj
      ),
    });
  };

  // Certification handlers
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      credentialId: "",
    };
    updateData({ certifications: [...(resume.data.certifications || []), newCert] });
  };

  const updateCertification = (id: string, field: keyof Certification, value: unknown) => {
    updateData({
      certifications: (resume.data.certifications || []).map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const deleteCertification = (id: string) => {
    updateData({
      certifications: (resume.data.certifications || []).filter((cert) => cert.id !== id),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/templates")}
            className="hover:bg-slate-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-none">Resume Builder</h1>
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1.5 uppercase tracking-wider font-bold bg-slate-50"
              >
                Draft
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 hidden sm:block">
              Template:{" "}
              <span className="text-primary font-medium">
                {selectedTemplateId || "ATS Minimal"}
              </span>
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg">
          <Button
            variant={viewMode === "edit" ? "secondary" : "ghost"}
            size="sm"
            className={cn("px-3", viewMode === "edit" && "shadow-sm bg-white")}
            onClick={() => setViewMode("edit")}
          >
            Edit
          </Button>
          <Button
            variant={viewMode === "split" ? "secondary" : "ghost"}
            size="sm"
            className={cn("px-3", viewMode === "split" && "shadow-sm bg-white")}
            onClick={() => setViewMode("split")}
          >
            Split
          </Button>
          <Button
            variant={viewMode === "preview" ? "secondary" : "ghost"}
            size="sm"
            className={cn("px-3", viewMode === "preview" && "shadow-sm bg-white")}
            onClick={() => setViewMode("preview")}
          >
            Preview
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!canUndo} onClick={undo} className="h-9">
            <Undo2 className="h-4 w-4 mr-2" />
            Undo
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-9" disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                <FileDown className="h-4 w-4 mr-2 text-red-500" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportDocx} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                <span>Export as Word</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint} className="cursor-pointer">
                <Printer className="h-4 w-4 mr-2 text-slate-500" />
                <span>Print Document</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Section */}
        <div
          className={cn(
            "flex-1 overflow-y-auto px-6 py-8 transition-all duration-300",
            viewMode === "preview" ? "hidden" : "block",
            viewMode === "split" ? "md:w-1/2" : "w-full max-w-4xl mx-auto"
          )}
        >
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Resume Content</h2>
              <Badge variant="outline" className="font-normal text-slate-400">
                Changes saved automatically
              </Badge>
            </div>

            <Accordion type="single" collapsible defaultValue="personal" className="space-y-4">
              {/* Personal Info Section */}
              <AccordionItem
                value="personal"
                className="border rounded-xl bg-white overflow-hidden"
              >
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-bold text-slate-900">Personal Information</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 border-t border-slate-100 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        value={resume.data.personalInfo.fullName}
                        onChange={(e) =>
                          updateData({
                            personalInfo: { ...resume.data.personalInfo, fullName: e.target.value },
                          })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resume.data.personalInfo.email}
                        onChange={(e) =>
                          updateData({
                            personalInfo: { ...resume.data.personalInfo, email: e.target.value },
                          })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={resume.data.personalInfo.phone}
                        onChange={(e) =>
                          updateData({
                            personalInfo: { ...resume.data.personalInfo, phone: e.target.value },
                          })
                        }
                        placeholder="+1 234 567 890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resume.data.personalInfo.location}
                        onChange={(e) =>
                          updateData({
                            personalInfo: { ...resume.data.personalInfo, location: e.target.value },
                          })
                        }
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="summary">Professional Summary</Label>
                      <textarea
                        id="summary"
                        className="w-full min-h-[120px] p-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        value={resume.data.personalInfo.summary}
                        onChange={(e) =>
                          updateData({
                            personalInfo: { ...resume.data.personalInfo, summary: e.target.value },
                          })
                        }
                        placeholder="Tell us about your professional background..."
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Experience Section */}
              <AccordionItem
                value="experience"
                className="border rounded-xl bg-white overflow-hidden"
              >
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Briefcase className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="font-bold text-slate-900">Professional Experience</span>
                    <Badge variant="secondary" className="ml-2 bg-slate-100">
                      {resume.data.experiences.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 border-t border-slate-100 bg-white">
                  <div className="space-y-6 pt-6">
                    {resume.data.experiences.map((exp, idx) => (
                      <Card key={exp.id} className="relative group border-slate-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteExperience(exp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardHeader className="p-5 pb-2">
                          <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            Position #{idx + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Job Title</Label>
                              <Input
                                value={exp.position}
                                onChange={(e) =>
                                  updateExperience(exp.id, "position", e.target.value)
                                }
                                placeholder="Senior Software Engineer"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Company</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) =>
                                  updateExperience(exp.id, "company", e.target.value)
                                }
                                placeholder="Google Inc."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Dates</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Jan 2020"
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    updateExperience(exp.id, "startDate", e.target.value)
                                  }
                                />
                                <Input
                                  placeholder="Present"
                                  value={exp.endDate}
                                  onChange={(e) =>
                                    updateExperience(exp.id, "endDate", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Location</Label>
                              <Input
                                value={exp.location}
                                onChange={(e) =>
                                  updateExperience(exp.id, "location", e.target.value)
                                }
                                placeholder="Mountain View, CA"
                              />
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-3">
                            <Label>Responsibilities</Label>
                            {exp.responsibilities.map((resp, rIdx) => (
                              <div key={rIdx} className="flex gap-2">
                                <Input
                                  value={resp}
                                  onChange={(e) =>
                                    updateResponsibility(exp.id, rIdx, e.target.value)
                                  }
                                  placeholder="Key achievement or responsibility..."
                                  className="flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteResponsibility(exp.id, rIdx)}
                                >
                                  <Trash2 className="h-4 w-4 text-slate-300 hover:text-red-500" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => addResponsibility(exp.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Bullet Point
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      className="w-full py-8 border-2 border-dashed border-slate-200 bg-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                      onClick={addExperience}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Work Experience
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Education Section */}
              <AccordionItem
                value="education"
                className="border rounded-xl bg-white overflow-hidden"
              >
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-50 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-violet-600" />
                    </div>
                    <span className="font-bold text-slate-900">Education</span>
                    <Badge variant="secondary" className="ml-2 bg-slate-100">
                      {resume.data.education.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 border-t border-slate-100 bg-white">
                  <div className="space-y-6 pt-6">
                    {resume.data.education.map((edu) => (
                      <Card key={edu.id} className="relative group border-slate-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteEducation(edu.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardContent className="p-5 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Degree</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                placeholder="Bachelor of Science"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Field of Study</Label>
                              <Input
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                                placeholder="Computer Science"
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <Label>Institution</Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) =>
                                  updateEducation(edu.id, "institution", e.target.value)
                                }
                                placeholder="University of California, Berkeley"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Dates</Label>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  placeholder="Sept 2016"
                                  value={edu.startDate}
                                  onChange={(e) =>
                                    updateEducation(edu.id, "startDate", e.target.value)
                                  }
                                />
                                <Input
                                  placeholder="June 2020"
                                  value={edu.endDate}
                                  onChange={(e) =>
                                    updateEducation(edu.id, "endDate", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>GPA (Optional)</Label>
                              <Input
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                                placeholder="3.8/4.0"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full py-8 border-dashed"
                      onClick={addEducation}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Skills Section */}
              <AccordionItem value="skills" className="border rounded-xl bg-white overflow-hidden">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Wrench className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="font-bold text-slate-900">Skills & Competencies</span>
                    <Badge variant="secondary" className="ml-2 bg-slate-100">
                      {resume.data.skills.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 border-t border-slate-100 bg-white">
                  <div className="space-y-6 pt-6">
                    {resume.data.skills.map((cat) => (
                      <Card key={cat.id} className="relative group border-slate-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteSkillCategory(cat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardContent className="p-5 space-y-4">
                          <div className="space-y-2">
                            <Label>Skill Category</Label>
                            <Input
                              value={cat.category}
                              onChange={(e) =>
                                updateSkillCategory(cat.id, "category", e.target.value)
                              }
                              placeholder="Technical Skills, Languages, etc."
                              className="font-bold"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {cat.skills.map((skill, sIdx) => (
                              <div
                                key={sIdx}
                                className="group/item flex items-center bg-slate-100 rounded-full pl-3 pr-1 py-1"
                              >
                                <input
                                  autoFocus={skill === ""}
                                  className="bg-transparent border-none focus:outline-none text-sm min-w-[60px]"
                                  value={skill}
                                  onChange={(e) => updateSkill(cat.id, sIdx, e.target.value)}
                                  placeholder="Skill..."
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 rounded-full hover:bg-slate-200"
                                  onClick={() => deleteSkill(cat.id, sIdx)}
                                >
                                  <Trash2 className="h-3 w-3 text-slate-400 hover:text-red-500" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full h-8"
                              onClick={() => addSkill(cat.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full py-8 border-dashed"
                      onClick={addSkillCategory}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Skill Category
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Projects Section */}
              <AccordionItem
                value="projects"
                className="border rounded-xl bg-white overflow-hidden"
              >
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <FolderRoot className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-bold text-slate-900">Projects</span>
                    <Badge variant="secondary" className="ml-2 bg-slate-100">
                      {resume.data.projects.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 border-t border-slate-100 bg-white">
                  <div className="space-y-6 pt-6">
                    {resume.data.projects.map((proj, idx) => (
                      <Card key={proj.id} className="relative group border-slate-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteProject(proj.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardHeader className="p-5 pb-2">
                          <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            Project #{idx + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                              <Label>Project Name</Label>
                              <Input
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                                placeholder="Personal Portfolio Website"
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <Label>Description</Label>
                              <textarea
                                className="w-full min-h-[80px] p-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                value={proj.description}
                                onChange={(e) =>
                                  updateProject(proj.id, "description", e.target.value)
                                }
                                placeholder="Describe what the project is about..."
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <Label>Project Link (Optional)</Label>
                              <div className="flex items-center gap-2">
                                <Link className="h-4 w-4 text-slate-400" />
                                <Input
                                  value={proj.link}
                                  onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                                  placeholder="https://github.com/yourusername/project"
                                />
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-3">
                            <Label>Technologies Used</Label>
                            <div className="flex flex-wrap gap-2">
                              {proj.technologies.map((tech, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="flex items-center bg-slate-100 rounded-full pl-3 pr-1 py-1"
                                >
                                  <input
                                    className="bg-transparent border-none focus:outline-none text-sm min-w-[80px]"
                                    value={tech}
                                    onChange={(e) =>
                                      updateProjectTech(proj.id, tIdx, e.target.value)
                                    }
                                    placeholder="React, Node.js..."
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={() => deleteProjectTech(proj.id, tIdx)}
                                  >
                                    <Trash2 className="h-3 w-3 text-slate-400" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full h-8"
                                onClick={() => addProjectTech(proj.id)}
                              >
                                <Plus className="h-4 w-4 mr-1" /> Add
                              </Button>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-3">
                            <Label>Key Highlights</Label>
                            {proj.highlights.map((high, hIdx) => (
                              <div key={hIdx} className="flex gap-2">
                                <Input
                                  value={high}
                                  onChange={(e) =>
                                    updateProjectHighlight(proj.id, hIdx, e.target.value)
                                  }
                                  placeholder="Implemented OAuth2 authentication..."
                                  className="flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteProjectHighlight(proj.id, hIdx)}
                                >
                                  <Trash2 className="h-4 w-4 text-slate-300 hover:text-red-500" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => addProjectHighlight(proj.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Highlight
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full py-8 border-dashed"
                      onClick={addProject}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Certifications Section */}
              <AccordionItem
                value="certifications"
                className="border rounded-xl bg-white overflow-hidden"
              >
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-bold text-slate-900">Certifications</span>
                    <Badge variant="secondary" className="ml-2 bg-slate-100">
                      {(resume.data.certifications || []).length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 border-t border-slate-100 bg-white">
                  <div className="space-y-6 pt-6">
                    {(resume.data.certifications || []).map((cert, idx) => (
                      <Card key={cert.id} className="relative group border-slate-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteCertification(cert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardHeader className="p-5 pb-2">
                          <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                            Certification #{idx + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                              <Label>Certification Name</Label>
                              <Input
                                value={cert.name}
                                onChange={(e) =>
                                  updateCertification(cert.id, "name", e.target.value)
                                }
                                placeholder="AWS Certified Solutions Architect"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Issuer</Label>
                              <Input
                                value={cert.issuer}
                                onChange={(e) =>
                                  updateCertification(cert.id, "issuer", e.target.value)
                                }
                                placeholder="Amazon Web Services"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Date</Label>
                              <Input
                                value={cert.date}
                                onChange={(e) =>
                                  updateCertification(cert.id, "date", e.target.value)
                                }
                                placeholder="May 2024"
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <Label>Credential ID / URL (Optional)</Label>
                              <div className="flex items-center gap-2">
                                <Link className="h-4 w-4 text-slate-400" />
                                <Input
                                  value={cert.credentialId}
                                  onChange={(e) =>
                                    updateCertification(cert.id, "credentialId", e.target.value)
                                  }
                                  placeholder="Credential ID or URL"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full py-8 border-dashed"
                      onClick={addCertification}
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Preview Section */}
        <div
          className={cn(
            "bg-slate-200/50 flex flex-col transition-all duration-300",
            viewMode === "edit" ? "hidden" : "block",
            viewMode === "split" ? "md:w-1/2 border-l border-slate-300" : "w-full"
          )}
        >
          <div className="p-4 border-b border-slate-300 bg-white/50 backdrop-blur flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                Live Preview
              </span>
            </div>
            <div className="flex bg-slate-200/50 p-1 rounded-md">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Monitor className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 flex justify-center bg-slate-500/10">
            <Card
              className="w-[210mm] min-h-[297mm] shadow-2xl origin-top transition-transform duration-500"
              style={{ transform: viewMode === "split" ? "scale(0.8)" : "scale(1)" }}
            >
              <div className="p-0">
                <ATSMinimal data={resume.data} />
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Empty footer spacing for mobile */}
      <footer className="h-16 md:hidden" />
    </div>
  );
};

export default EditorPage;
