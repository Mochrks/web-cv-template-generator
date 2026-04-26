import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink,
} from "docx";
import { saveAs } from "file-saver";
import { ResumeData } from "@/types/resume";

export const exportToDocx = async (data: ResumeData) => {
  const {
    personalInfo,
    experiences = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    organizations = [],
    publications = [],
  } = data;

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
                font: "Arial",
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
                size: 18,
                color: "333333",
                font: "Arial",
              }),
            ],
          }),

          // Summary
          ...(personalInfo.summary
            ? [
                new Paragraph({ text: "", spacing: { before: 200 } }),
                new Paragraph({
                  children: [new TextRun({ text: personalInfo.summary, size: 20, font: "Arial" })],
                  alignment: AlignmentType.JUSTIFIED,
                }),
              ]
            : []),

          // Experience
          ...(experiences.length > 0
            ? [
                new Paragraph({
                  text: "PROFESSIONAL EXPERIENCE",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 240, after: 120 },
                  border: {
                    bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
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
                        size: 18,
                        color: "333333",
                        font: "Arial",
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  ...exp.responsibilities.map(
                    (resp) =>
                      new Paragraph({
                        children: [new TextRun({ text: resp, size: 20 })],
                        bullet: { level: 0 },
                        spacing: { before: 20, after: 20 },
                      })
                  ),
                ]),
              ]
            : []),

          // Education
          ...(education.length > 0
            ? [
                new Paragraph({
                  text: "EDUCATION",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 240, after: 120 },
                  border: {
                    bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
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
                    ? [
                        new Paragraph({
                          children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 20 })],
                          spacing: { after: 50 },
                        }),
                      ]
                    : []),
                ]),
              ]
            : []),

          // Skills
          ...(skills.length > 0
            ? [
                new Paragraph({
                  text: "SKILLS",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 240, after: 120 },
                  border: {
                    bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
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
                  spacing: { before: 240, after: 120 },
                  border: {
                    bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
                }),
                ...projects.flatMap((proj) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: proj.name, bold: true, size: 24, font: "Arial" }),
                      new TextRun({
                        text: `\t${proj.startDate} - ${proj.endDate}`,
                        bold: true,
                        font: "Arial",
                      }),
                    ],
                    tabStops: [{ type: "right", position: 9000 }],
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
                        children: [new TextRun({ text: high, size: 20 })],
                        bullet: { level: 0 },
                        spacing: { before: 20, after: 20 },
                      })
                  ),
                ]),
              ]
            : []),

          // Licenses & Certifications
          ...(certifications.length > 0
            ? [
                new Paragraph({
                  text: "LICENSE & CERTIFICATION",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 240, after: 120 },
                  border: {
                    bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
                }),
                ...certifications.flatMap((cert) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: cert.name, bold: true }),
                      new TextRun({ text: ` - ${cert.issuer} (${cert.date})` }),
                    ],
                  }),
                  ...(cert.credentialId
                    ? [
                        new Paragraph({
                          children: [
                            new ExternalHyperlink({
                              children: [
                                new TextRun({
                                  text: cert.credentialId,
                                  style: "Hyperlink",
                                }),
                              ],
                              link: cert.credentialId.startsWith("http")
                                ? cert.credentialId
                                : `https://${cert.credentialId}`,
                            }),
                          ],
                          spacing: { before: 50 },
                        }),
                      ]
                    : []),
                ]),
              ]
            : []),
          // Organizations
          ...(organizations.length > 0
            ? [
                new Paragraph({
                  text: "ORGANIZATIONS",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 240, after: 120 },
                  border: {
                    bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
                }),
                ...organizations.flatMap((org) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: org.name, bold: true, size: 24 }),
                      new TextRun({
                        text: `\t${org.startDate} - ${org.endDate}`,
                        bold: true,
                      }),
                    ],
                    tabStops: [{ type: "right", position: 9000 }],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: org.role,
                        italics: true,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  ...(org.description
                    ? [
                        new Paragraph({
                          children: [new TextRun({ text: org.description, size: 20 })],
                        }),
                      ]
                    : []),
                  new Paragraph({ text: "", spacing: { before: 200 } }),
                ]),
              ]
            : []),

          // Publications
          ...(publications.length > 0
            ? [
                new Paragraph({
                  text: "PUBLICATIONS",
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 240, after: 120 },
                  border: {
                    bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 },
                  },
                }),
                ...publications.flatMap((pub) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: pub.title, bold: true, size: 24 }),
                      new TextRun({ text: `\t${pub.date}`, bold: true }),
                    ],
                    tabStops: [{ type: "right", position: 9000 }],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: pub.publisher,
                        italics: true,
                        size: 20,
                      }),
                    ],
                  }),
                  ...(pub.description
                    ? [
                        new Paragraph({
                          children: [new TextRun({ text: pub.description, size: 20 })],
                        }),
                      ]
                    : []),
                  ...(pub.link
                    ? [
                        new Paragraph({
                          children: [
                            new ExternalHyperlink({
                              children: [
                                new TextRun({
                                  text: pub.link,
                                  style: "Hyperlink",
                                }),
                              ],
                              link: pub.link.startsWith("http") ? pub.link : `https://${pub.link}`,
                            }),
                          ],
                          spacing: { before: 50 },
                        }),
                      ]
                    : []),
                  new Paragraph({ text: "", spacing: { before: 200 } }),
                ]),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${personalInfo.fullName?.replace(/\s+/g, "_") || "Resume"}_CV.docx`);
};
