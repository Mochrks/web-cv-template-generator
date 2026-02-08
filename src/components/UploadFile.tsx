import React, { useEffect, useRef, useState } from "react";
import { CloudUpload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileItem {
  name: string;
  content: string;
  size: number;
}

interface UploadFileProps {
  onDataReceived: (data: Record<string, unknown>) => void;
}

export default function UploadFile({ onDataReceived }: UploadFileProps) {
  const [files, setFiles] = useState<FileItem | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [template, setTemplate] = useState("");

  useEffect(() => {
    setTemplate(localStorage.getItem("template") || "");
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles?.[0]) {
      await processFile(droppedFiles[0]);
    }
  };

  const handleFileUpload = async (fileList: FileList | null) => {
    if (fileList?.[0]) {
      await processFile(fileList[0]);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFiles({
        name: file.name,
        content: e.target?.result as string,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const extractToJson = async () => {
    if (!files) return;

    setIsLoading(true);
    try {
      const processResponse = await fetch("/api/process-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileContent: files.content }),
      });

      if (!processResponse.ok) throw new Error("Failed to process PDF");

      const { text } = await processResponse.json();

      const jsonResponse = await fetch("/api/generate-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, template }),
      });

      if (!jsonResponse.ok) throw new Error("Failed to generate JSON");

      const result = await jsonResponse.json();
      onDataReceived(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Upload Your Resume</h2>
        <p className="text-slate-500">Supported format: PDF (Max 10MB)</p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center",
          dragActive
            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
            : "border-slate-200 hover:border-slate-300 bg-white"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <CloudUpload
              className={cn("h-8 w-8", dragActive ? "text-primary" : "text-slate-400")}
            />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-semibold text-slate-900">
              {dragActive ? "Drop to upload" : "Click or drag and drop"}
            </p>
            <p className="text-slate-500 text-sm">to select your resume file</p>
          </div>
        </div>

        {files && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{files.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    {formatFileSize(files.size)}
                  </p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={extractToJson}
          disabled={isLoading || !files}
          className="min-w-[200px] h-12 shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            "Generate Resume Data"
          )}
        </Button>
      </div>
    </div>
  );
}
