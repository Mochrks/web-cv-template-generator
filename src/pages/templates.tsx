import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TEMPLATES, TemplateId } from "@/types/template";
import { useTemplateStore } from "@/store/useTemplateStore";
import { useResumeStore } from "@/store/useResumeStore";
import ATSMinimal from "@/components/templates/templates/ATSMinimal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Check, Sparkles, AlertCircle, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const TemplateSelection: React.FC = () => {
  const router = useRouter();
  const { selectedTemplateId, setSelectedTemplate } = useTemplateStore();
  const { updateData, resume } = useResumeStore();
  const [localSelection, setLocalSelection] = useState<TemplateId | null>(selectedTemplateId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const extractedDataStr = localStorage.getItem("extractedData");
    if (extractedDataStr) {
      try {
        const extractedData = JSON.parse(extractedDataStr);
        if (extractedData.data) {
          updateData(extractedData.data);
        }
      } catch (error) {
        console.error("Error loading extracted data:", error);
      }
    }
    setLoading(false);
  }, [updateData]);

  const handleTemplateSelect = (templateId: TemplateId) => {
    setLocalSelection(templateId);
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (localSelection) {
      router.push("/editor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-slate-600 font-medium">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Upload
          </Button>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Choose Your Template
            </h1>
            <p className="text-lg text-slate-600 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Select a professional, ATS-optimized layout for your new resume
            </p>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group",
                localSelection === template.id
                  ? "ring-2 ring-primary border-primary bg-primary/5"
                  : "border-slate-200 hover:border-slate-300"
              )}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {/* Selected Checkmark */}
              {localSelection === template.id && (
                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                  <Check className="h-4 w-4" />
                </div>
              )}

              {/* Template Preview Container */}
              <div className="aspect-[3/4] overflow-hidden bg-white border-b border-slate-100 relative grayscale group-hover:grayscale-0 transition-all duration-500">
                {resume && resume.data ? (
                  <div className="scale-[0.2] origin-top-left w-[500%] h-[500%] p-8">
                    <ATSMinimal data={resume.data} />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50">
                    <AlertCircle className="h-10 w-10 opacity-20" />
                    <p className="text-sm font-medium">Preview is being prepared...</p>
                  </div>
                )}

                {template.recommended && (
                  <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-md">
                    Best Fit
                  </Badge>
                )}
              </div>

              <CardHeader className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {template.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  >
                    {template.atsScore}% ATS
                  </Badge>
                </div>
                <CardDescription className="text-slate-500 line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0">
                <div className="space-y-2">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-6 shadow-2xl z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Currently Selected
                </p>
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  {localSelection
                    ? TEMPLATES.find((t) => t.id === localSelection)?.name
                    : "Please select a template above"}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              disabled={!localSelection}
              onClick={handleContinue}
              className="w-full sm:w-auto px-10 py-6 text-lg font-bold shadow-teal-500/20"
            >
              Continue to Personalize
              <Check className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;
