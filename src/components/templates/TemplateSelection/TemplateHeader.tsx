import React from "react";
import { LayoutTemplate } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TemplateHeaderProps {
  hasRealData: boolean;
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({ hasRealData }) => {
  return (
    <div className="mb-12 space-y-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
        Choose Your Template
      </h1>
      <div className="flex items-center gap-3">
        <p className="text-muted-foreground text-base flex items-center gap-2 font-medium">
          <LayoutTemplate className="h-5 w-5 text-secondary dark:text-white" />
          Select a professional layout optimized for ATS compatibility
        </p>
        {!hasRealData && (
          <Badge
            variant="secondary"
            className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-3 py-1"
          >
            Preview with sample data
          </Badge>
        )}
      </div>
    </div>
  );
};
