import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Zap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

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

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload-cv", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || "Upload failed");
        }

        const data = await response.json();
        localStorage.setItem("extractedData", JSON.stringify(data));
        router.push("/templates");
      } catch (error) {
        console.error("Upload error:", error);
        setError(error instanceof Error ? error.message : "Failed to upload CV. Please try again.");
        setUploading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            ATS CV Generator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your CV and let AI transform it into an ATS-optimized resume in seconds
          </p>
        </div>

        {/* Upload Card */}
        <Card className="border-2">
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`
                p-16 text-center cursor-pointer transition-all duration-200
                ${isDragActive ? "bg-blue-50 border-blue-500" : "hover:bg-slate-50"}
                ${uploading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input {...getInputProps()} />

              <div className="flex flex-col items-center space-y-6">
                <div
                  className={`p-6 rounded-full ${isDragActive ? "bg-blue-100" : "bg-slate-100"}`}
                >
                  <Upload
                    className={`h-16 w-16 ${isDragActive ? "text-blue-600" : "text-slate-400"}`}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-semibold text-slate-900">
                    {isDragActive ? "Drop your CV here" : "Drag & drop your CV here"}
                  </p>
                  <p className="text-slate-500">or click to browse files</p>
                </div>

                <Button size="lg" disabled={uploading} className="px-8">
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-5 w-5" />
                      Choose File
                    </>
                  )}
                </Button>

                <p className="text-sm text-slate-400">
                  Supported formats: PDF, DOCX • Max size: 10MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500 font-medium">
              or start from scratch
            </span>
          </div>
        </div>

        {/* Start from Scratch */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/templates")}
            className="px-8"
          >
            <FileText className="mr-2 h-5 w-5" />
            Create New CV
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 pt-4">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-2 p-3 bg-blue-100 rounded-full w-fit">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">AI-Powered</CardTitle>
              <CardDescription>Auto extract & optimize content</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-2 p-3 bg-green-100 rounded-full w-fit">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Lightning Fast</CardTitle>
              <CardDescription>Convert in seconds</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-2 p-3 bg-violet-100 rounded-full w-fit">
                <CheckCircle2 className="h-6 w-6 text-violet-600" />
              </div>
              <CardTitle className="text-lg">ATS Ready</CardTitle>
              <CardDescription>100% compatible</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
