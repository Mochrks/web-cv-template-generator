import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TEMPLATES, TemplateId } from "@/types/template";
import { useTemplateStore } from "@/store/useTemplateStore";
import { useResumeStore } from "@/store/useResumeStore";
import { JOHN_DOE_DUMMY } from "@/utils/dummyData";
import { Loader2 } from "lucide-react";

// Sub-components
import { TemplateNav } from "@/components/templates/TemplateSelection/TemplateNav";
import { TemplateHeader } from "@/components/templates/TemplateSelection/TemplateHeader";
import { TemplateCard } from "@/components/templates/TemplateSelection/TemplateCard";
import { TemplateFooter } from "@/components/templates/TemplateSelection/TemplateFooter";

const TemplateSelection: React.FC = () => {
  const router = useRouter();
  const { selectedTemplateId, setSelectedTemplate } = useTemplateStore();
  const { updateData, resume, loadDummyData } = useResumeStore();
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
      if (!resume || !resume.data || !resume.data.personalInfo.fullName) {
        loadDummyData();
      }
      router.push("/editor");
    }
  };

  const previewData = resume?.data || JOHN_DOE_DUMMY;
  const hasRealData = !!(resume && resume.data && resume.data.personalInfo.fullName);
  const selectedTemplate = TEMPLATES.find((t) => t.id === localSelection);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-300">
      <TemplateNav />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <TemplateHeader hasRealData={hasRealData} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={localSelection === template.id}
              onSelect={handleTemplateSelect}
              previewData={previewData}
            />
          ))}
        </div>

        <TemplateFooter
          selectedTemplateName={selectedTemplate?.name}
          onContinue={handleContinue}
          disabled={!localSelection}
        />
      </div>
    </div>
  );
};

export default TemplateSelection;
