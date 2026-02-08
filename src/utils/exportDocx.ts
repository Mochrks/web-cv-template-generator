import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "@/types/resume";

export const exportToDocx = async (data: ResumeData) => {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: personalInfo.fullName || "Your Name",
                bold: true,
                size: 36,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: [
                  personalInfo.email,
                  personalInfo.phone,
                  personalInfo.location,
                  personalInfo.linkedin,
                ]
                  .filter(Boolean)
                  .join(" | "),
                size: 20,
              }),
            ],
          }),

          // Summary
          ...(personalInfo.summary
            ? [
                new Paragraph({ text: "", spacing: { before: 200 } }),
                new Paragraph({
                  children: [new TextRun({ text: personalInfo.summary, size: 22 })],
                  alignment: AlignmentType.JUSTIFY,
                }),
              ]
            : []),

          // Experience
          ...(experiences.length > 0
            ? [
                new Paragraph({
                  text: "PROFESSIONAL EXPERIENCE",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                  border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
                }),
                ...experiences.flatMap((exp) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: exp.position, bold: true, size: 24 }),
                      new TextRun({
                        text: `\t${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`,
                        bold: true,
                      }),
                    ],
                    tabStops: [{ type: "right", position: 9000 }],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${exp.company} | ${exp.location}`,
                        italics: true,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  ...exp.responsibilities.map(
                    (resp) =>
                      new Paragraph({
                        text: resp,
                        bullet: { level: 0 },
                        spacing: { before: 50 },
                      })
                  ),
                  new Paragraph({ text: "", spacing: { before: 200 } }),
                ]),
              ]
            : []),

          // Education
          ...(education.length > 0
            ? [
                new Paragraph({
                  text: "EDUCATION",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                  border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
                }),
                ...education.flatMap((edu) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 24 }),
                      new TextRun({ text: `\t${edu.startDate} - ${edu.endDate}`, bold: true }),
                    ],
                    tabStops: [{ type: "right", position: 9000 }],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${edu.institution} | ${edu.location}`,
                        italics: true,
                        size: 20,
                      }),
                    ],
                  }),
                  ...(edu.gpa
                    ? [new Paragraph({ text: `GPA: ${edu.gpa}`, spacing: { after: 100 } })]
                    : []),
                  new Paragraph({ text: "", spacing: { before: 100 } }),
                ]),
              ]
            : []),

          // Skills
          ...(skills.length > 0
            ? [
                new Paragraph({
                  text: "SKILLS",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                  border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
                }),
                ...skills.map(
                  (skillGroup) =>
                    new Paragraph({
                      children: [
                        new TextRun({ text: `${skillGroup.category}: `, bold: true }),
                        new TextRun({ text: skillGroup.skills.join(", ") }),
                      ],
                    })
                ),
              ]
            : []),

          // Projects
          ...(projects.length > 0
            ? [
                new Paragraph({
                  text: "PROJECTS",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                  border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
                }),
                ...projects.flatMap((proj) => [
                  new Paragraph({
                    children: [new TextRun({ text: proj.name, bold: true, size: 24 })],
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: proj.description, size: 20 })],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Technologies: ", bold: true }),
                      new TextRun({ text: proj.technologies.join(", "), italics: true }),
                    ],
                    spacing: { after: 100 },
                  }),
                  ...proj.highlights.map(
                    (high) =>
                      new Paragraph({
                        text: high,
                        bullet: { level: 0 },
                      })
                  ),
                  new Paragraph({ text: "", spacing: { before: 200 } }),
                ]),
              ]
            : []),

          // Certifications
          ...(certifications.length > 0
            ? [
                new Paragraph({
                  text: "CERTIFICATIONS",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                  border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
                }),
                ...certifications.map(
                  (cert) =>
                    new Paragraph({
                      children: [
                        new TextRun({ text: cert.name, bold: true }),
                        new TextRun({ text: ` - ${cert.issuer} (${cert.date})` }),
                      ],
                    })
                ),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.fullName?.replace(/\s+/g, "_") || "Resume"}_CV.docx`);
};
