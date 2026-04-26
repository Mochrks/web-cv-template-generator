import { ResumeData } from "@/types/resume";

export const JOHN_DOE_DUMMY: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    portfolio: "johndoe.dev",
    summary:
      "Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean code, performance optimization, and delivering exceptional user experiences. Proven track record of shipping products that serve millions of users.",
  },
  experiences: [
    {
      id: "exp-1",
      company: "Google",
      position: "Senior Software Engineer",
      location: "Mountain View, CA",
      startDate: "Jan 2021",
      endDate: "",
      current: true,
      responsibilities: [
        "Lead a team of 6 engineers to deliver a next-generation search feature used by 500M+ users",
        "Architected and implemented a microservices platform reducing latency by 40%",
        "Mentored 4 junior engineers, with 2 receiving promotions within 12 months",
        "Drove adoption of TypeScript across 15+ repositories, improving code quality by 35%",
      ],
    },
    {
      id: "exp-2",
      company: "Meta",
      position: "Software Engineer",
      location: "Menlo Park, CA",
      startDate: "Jun 2018",
      endDate: "Dec 2020",
      current: false,
      responsibilities: [
        "Built and maintained React-based dashboards serving 10M+ daily active users",
        "Optimized GraphQL APIs resulting in 50% reduction in page load times",
        "Collaborated with product and design teams to ship 3 major product launches",
      ],
    },
    {
      id: "exp-3",
      company: "Stripe",
      position: "Junior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Aug 2016",
      endDate: "May 2018",
      current: false,
      responsibilities: [
        "Developed payment processing features handling $2B+ in annual transaction volume",
        "Implemented automated testing pipeline reducing bug reports by 60%",
        "Created internal developer tools adopted by 200+ engineers company-wide",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science",
      location: "Stanford, CA",
      startDate: "Sep 2014",
      endDate: "Jun 2016",
      gpa: "3.9",
      achievements: [
        "Dean's List — All semesters",
        "Published research on distributed systems in ACM",
      ],
    },
    {
      id: "edu-2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "Sep 2010",
      endDate: "Jun 2014",
      gpa: "3.7",
      achievements: ["Summa Cum Laude", "ACM Programming Competition — 2nd Place"],
    },
  ],
  skills: [
    {
      id: "skill-1",
      category: "Programming Languages",
      skills: ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java"],
    },
    {
      id: "skill-2",
      category: "Frontend",
      skills: ["React", "Next.js", "Vue.js", "Tailwind CSS", "HTML5", "CSS3"],
    },
    {
      id: "skill-3",
      category: "Backend & Cloud",
      skills: ["Node.js", "GraphQL", "REST APIs", "AWS", "GCP", "Docker", "Kubernetes"],
    },
    {
      id: "skill-4",
      category: "Tools & Practices",
      skills: ["Git", "CI/CD", "Agile/Scrum", "TDD", "System Design", "Microservices"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "DevFlow — Open Source Developer Platform",
      description:
        "A full-stack developer collaboration platform with real-time code editing, project management, and CI/CD integration. 2,500+ GitHub stars.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
      link: "github.com/johndoe/devflow",
      highlights: [
        "Built real-time collaboration engine using WebSockets",
        "Implemented OAuth 2.0 authentication with 5 providers",
      ],
    },
    {
      id: "proj-2",
      name: "SpeedTrack — Performance Monitoring Tool",
      description:
        "A lightweight web performance monitoring library that tracks Core Web Vitals and custom metrics with zero dependencies.",
      technologies: ["TypeScript", "Web APIs", "Rollup", "Vitest"],
      link: "github.com/johndoe/speedtrack",
      highlights: ["Used by 150+ projects in production", "< 2KB gzipped bundle size"],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "Mar 2023",
      credentialId: "https://aws.amazon.com/verification",
    },
    {
      id: "cert-2",
      name: "Google Cloud Professional Cloud Architect",
      issuer: "Google Cloud",
      date: "Sep 2022",
      credentialId: "https://cloud.google.com/certification",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native" },
    { id: "lang-2", language: "Spanish", proficiency: "Professional" },
    { id: "lang-3", language: "Japanese", proficiency: "Intermediate" },
  ],
  organizations: [
    {
      id: "org-1",
      name: "Open Source Initiative",
      role: "Board Member & Maintainer",
      startDate: "Jan 2020",
      endDate: "Present",
      description:
        "Contributing to and maintaining popular open source projects, organizing community events and code reviews.",
    },
  ],
  publications: [
    {
      id: "pub-1",
      title: "Scaling Distributed Systems for Real-Time Applications",
      publisher: "ACM Digital Library",
      date: "Nov 2022",
      link: "https://dl.acm.org/doi/example",
      description:
        "Research paper on novel approaches to scaling WebSocket connections across distributed server clusters.",
    },
  ],
};
