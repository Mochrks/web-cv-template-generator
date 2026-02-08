import React from "react";
import { ResumeData } from "@/types/resume";

interface ATSMinimalProps {
  data: ResumeData;
}

/**
 * ATS Minimal Template
 * Ultra-clean, 100% ATS-compatible format
 * No tables, no columns, no graphics - pure text hierarchy
 * Now using pure HTML/Tailwind instead of MUI
 */
const ATSMinimal: React.FC<ATSMinimalProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;

  return (
    <div className="max-w-[8.5in] min-h-[11in] mx-auto p-[0.75in] bg-white text-black font-['Arial',sans-serif] text-[11pt] leading-relaxed">
      {/* Header - Personal Info */}
      <div className="mb-6 text-center">
        <h1 className="font-bold text-[18pt] mb-1 uppercase tracking-wide">
          {personalInfo.fullName || "Your Name"}
        </h1>

        <p className="text-[10pt] text-gray-700">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <p className="text-[11pt] text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[12pt] font-bold uppercase mb-2 border-b-2 border-black pb-1">
            Professional Experience
          </h2>

          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-[11pt]">{exp.position}</span>
                <span className="text-[10pt] text-gray-600">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>

              <p className="text-[10pt] italic mb-2 text-gray-600">
                {exp.company} | {exp.location}
              </p>

              <ul className="mt-1 mb-0 pl-6 list-disc">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-[10pt] mb-1">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[12pt] font-bold uppercase mb-2 border-b-2 border-black pb-1">
            Education
          </h2>

          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-[11pt]">
                  {edu.degree} in {edu.field}
                </span>
                <span className="text-[10pt] text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>

              <p className="text-[10pt] italic text-gray-600">
                {edu.institution} | {edu.location}
              </p>

              {edu.gpa && <p className="text-[10pt] mt-1">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[12pt] font-bold uppercase mb-2 border-b-2 border-black pb-1">
            Skills
          </h2>

          {skills.map((skillGroup) => (
            <div key={skillGroup.id} className="mb-2">
              <p className="text-[10pt]">
                <strong>{skillGroup.category}:</strong> {skillGroup.skills.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[12pt] font-bold uppercase mb-2 border-b-2 border-black pb-1">
            Projects
          </h2>

          {projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="font-bold text-[11pt] mb-1">{project.name}</h3>

              <p className="text-[10pt] mb-1">{project.description}</p>

              <p className="text-[10pt] italic text-gray-600">
                Technologies: {project.technologies.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[12pt] font-bold uppercase mb-2 border-b-2 border-black pb-1">
            Certifications
          </h2>

          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <p className="text-[10pt]">
                <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ATSMinimal;
