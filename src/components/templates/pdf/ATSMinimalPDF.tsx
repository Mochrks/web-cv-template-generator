import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#000000",
  },
  header: {
    marginBottom: 15,
    textAlign: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: "#333333",
  },
  section: {
    marginTop: 15,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
    marginBottom: 8,
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
  },
  entrySubHeader: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#444444",
    marginBottom: 3,
  },
  bulletPointContainer: {
    flexDirection: "row",
    marginLeft: 15,
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  summary: {
    fontSize: 10,
    textAlign: "justify",
    marginBottom: 10,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  skillCategory: {
    fontWeight: "bold",
  },
});

interface ATSMinimalPDFProps {
  data: ResumeData;
}

const ATSMinimalPDF: React.FC<ATSMinimalPDFProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || "Your Name"}</Text>
          <Text style={styles.contact}>
            {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin]
              .filter(Boolean)
              .join(" | ")}
          </Text>
        </View>

        {/* Summary */}
        {personalInfo.summary && <Text style={styles.summary}>{personalInfo.summary}</Text>}

        {/* Experience */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={{ fontWeight: "bold" }}>{exp.position}</Text>
                  <Text>
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.entrySubHeader}>
                  {exp.company} | {exp.location}
                </Text>
                {exp.responsibilities.map((resp, idx) => (
                  <View key={idx} style={styles.bulletPointContainer}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{resp}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={{ fontWeight: "bold" }}>
                    {edu.degree} in {edu.field}
                  </Text>
                  <Text>
                    {edu.startDate} - {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.entrySubHeader}>
                  {edu.institution} | {edu.location}
                </Text>
                {edu.gpa && <Text>GPA: {edu.gpa}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skillGroup) => (
              <Text key={skillGroup.id} style={{ marginBottom: 3 }}>
                <Text style={styles.skillCategory}>{skillGroup.category}: </Text>
                <Text>{skillGroup.skills.join(", ")}</Text>
              </Text>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.entry}>
                <Text style={{ fontWeight: "bold" }}>{proj.name}</Text>
                <Text style={{ fontSize: 9 }}>{proj.description}</Text>
                <Text style={{ fontSize: 9, fontStyle: "italic", marginTop: 2 }}>
                  Technologies: {proj.technologies.join(", ")}
                </Text>
                {proj.highlights?.map((high, idx) => (
                  <View key={idx} style={styles.bulletPointContainer}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{high}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <Text key={cert.id}>
                <Text style={{ fontWeight: "bold" }}>{cert.name}</Text>
                <Text>
                  {" "}
                  - {cert.issuer} ({cert.date})
                </Text>
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ATSMinimalPDF;
