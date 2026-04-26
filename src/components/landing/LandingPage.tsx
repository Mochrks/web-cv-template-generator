import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Github,
  CloudUpload,
  Edit3,
  Brain,
  ClipboardCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [processingStep, setProcessingStep] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PDF or DOCX file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setUploading(true);
      setError("");
      setProcessingStep("Uploading file...");

      try {
        const formData = new FormData();
        formData.append("file", file);

        setProcessingStep("Analyzing document structure...");

        const response = await fetch("/api/upload-cv", {
          method: "POST",
          body: formData,
        });

        setProcessingStep("Extracting resume data...");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Upload failed");
        }

        setProcessingStep("Preparing templates...");

        const data = await response.json();
        localStorage.setItem("extractedData", JSON.stringify(data));

        setProcessingStep("Redirecting...");

        setTimeout(() => {
          router.push("/templates");
        }, 500);
      } catch (error) {
        console.error("Upload error:", error);
        setError(error instanceof Error ? error.message : "Failed to upload CV. Please try again.");
        setUploading(false);
        setProcessingStep("");
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const scrollToUpload = () => {
    const el = document.getElementById("upload-zone");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="text-xl font-bold tracking-tighter text-primary flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            ATS Resume
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a
              aria-label="GitHub Repository"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center"
              href="https://github.com/mochrks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-widest">
              Career-Success Engineering
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight">
              Build Your Perfect{" "}
              <span className="text-secondary dark:text-white">ATS-Optimized</span> Resume
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Beat the tracking systems and land more interviews. Our tool analyzes your experience
              to craft a high-performance professional resume in minutes.
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary fill-secondary/10" />
                <span className="font-semibold text-foreground">98% ATS Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-secondary fill-secondary/10" />
                <span className="font-semibold text-foreground">Professional Layouts</span>
              </div>
            </div>
          </div>

          {/* Upload Card */}
          <div className="relative" id="upload-zone">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-card border border-border p-8 md:p-12 rounded-2xl shadow-xl">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed border-border rounded-xl p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-6 hover:border-secondary transition-all group cursor-pointer",
                  isDragActive && "border-secondary bg-secondary/5",
                  uploading && "pointer-events-none opacity-50"
                )}
              >
                <input {...getInputProps()} />
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {uploading ? (
                    <Loader2 className="h-10 w-10 animate-spin" />
                  ) : (
                    <CloudUpload className="h-10 w-10" />
                  )}
                </div>

                {uploading ? (
                  <div className="space-y-2">
                    <p className="text-xl font-bold">{processingStep}</p>
                    <p className="text-sm text-muted-foreground">Almost ready...</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-2xl font-bold text-foreground">Drop your CV here</p>
                      <p className="text-muted-foreground">
                        or click to browse your files (PDF, DOCX)
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-secondary hover:bg-secondary/90 text-white px-10 py-6 rounded-xl font-bold text-base transition-all active:scale-95 shadow-lg shadow-secondary/20"
                    >
                      Select File
                    </Button>
                  </>
                )}
              </div>

              {!uploading && (
                <Button
                  variant="outline"
                  className="mt-6 w-full py-6 rounded-xl font-bold border-2 border-border text-foreground hover:bg-accent transition-all active:scale-95 flex items-center justify-center gap-2"
                  onClick={() => router.push("/templates")}
                >
                  <Edit3 className="h-5 w-5" />
                  Create From Scratch
                </Button>
              )}

              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-border pt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background bg-accent overflow-hidden relative"
                    >
                      <Image
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Joined by 12,000+ job seekers this week
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="bg-accent/30 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Why use ATS Resume?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Precision engineering for your professional future.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Analysis",
                  description:
                    "Our engine scans your history to extract high-impact achievements recruiters love.",
                  icon: Brain,
                },
                {
                  title: "ATS Checker",
                  description:
                    "Simulate Applicant Tracking Systems to ensure your resume never gets filtered out for formatting.",
                  icon: ClipboardCheck,
                },
                {
                  title: "Instant Editing",
                  description:
                    "One-click changes to templates, colors, and layout without losing your content structure.",
                  icon: Zap,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 order-2 lg:order-1 relative">
              <div className="p-4 bg-card rounded-2xl shadow-2xl border border-border">
                <div className="aspect-[4/3] rounded-lg bg-accent/50 overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
                    alt="Resume Layout"
                    fill
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="absolute -bottom-10 -right-6 md:-right-10 bg-primary p-6 rounded-2xl shadow-2xl text-white max-w-[280px]">
                  <p className="text-[10px] font-bold uppercase opacity-70 mb-2 tracking-widest">
                    PRO SUGGESTION
                  </p>
                  <p className="text-sm font-semibold italic">
                    {
                      "“Rephrased 'Managed team' to 'Directed 15+ cross-functional experts' for 40% more impact.”"
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2 space-y-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">How it works</h2>
              <div className="space-y-10">
                {[
                  {
                    step: 1,
                    title: "Upload & Import",
                    description: "Import your existing PDF resume to get started in seconds.",
                  },
                  {
                    step: 2,
                    title: "Smart Optimization",
                    description:
                      "Our tools suggest keywords and bullet points tailored to your professional background.",
                  },
                  {
                    step: 3,
                    title: "Download & Apply",
                    description:
                      "Export as a high-quality PDF that is guaranteed to be readable by all major ATS platforms.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="bg-primary text-primary-foreground p-12 md:p-20 rounded-[2.5rem] text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]"></div>

            <h2 className="text-4xl md:text-5xl font-extrabold max-w-3xl mx-auto relative z-10 leading-tight dark:text-white">
              Ready to land your dream job?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 dark:text-white max-w-xl mx-auto relative z-10 leading-relaxed">
              Join thousands of professionals who have accelerated their career search with ATS
              Resume.
            </p>
            <div className="flex justify-center relative z-10">
              <Button
                size="lg"
                onClick={scrollToUpload}
                className="bg-white text-primary hover:bg-white/90 px-12 py-8 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95"
              >
                Build My Resume Now
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xl font-bold text-primary">
            <FileText className="h-6 w-6" />
            ATS Resume
          </div>

          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} ATS Resume. Crafted by{" "}
            <a
              href="https://github.com/mochrks"
              className="font-bold text-foreground hover:underline"
            >
              @mochrks
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
