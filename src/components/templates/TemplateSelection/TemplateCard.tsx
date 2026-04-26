import React from "react";
import { Check } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ATSMinimal from "@/components/templates/templates/ATSMinimal";
import { ResumeData } from "@/types/resume";
import { TemplateId } from "@/types/template";

interface TemplateCardProps {
  template: {
    id: TemplateId;
    name: string;
    description: string;
    atsScore: number;
    recommended?: boolean;
  };
  isSelected: boolean;
  onSelect: (id: TemplateId) => void;
  previewData: ResumeData;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  previewData,
}) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl group border-2",
        isSelected
          ? "border-blue-500 dark:border-white ring-1 ring-secondary/20 bg-secondary/5 dark:bg-secondary/10"
          : "border-border hover:border-border/80 dark:border-border/50 dark:hover:border-border/30"
      )}
      onClick={() => onSelect(template.id)}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 z-10 bg-secondary text-white rounded-full p-1.5 shadow-lg">
          <Check className="h-4 w-4" />
        </div>
      )}

      <div className="aspect-[3/4] overflow-hidden bg-white relative border-b border-border">
        <div className="scale-[0.22] origin-top-left w-[454%] h-[454%] p-10">
          <ATSMinimal data={previewData} />
        </div>

        {template.recommended && (
          <Badge className="absolute top-4 left-4 bg-primary text-white hover:bg-primary/90 border-none shadow-md text-[10px] font-bold uppercase tracking-wider px-3 py-1">
            Best Fit
          </Badge>
        )}
      </div>

      <CardHeader className="p-6">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-bold text-foreground">{template.name}</CardTitle>
          <Badge
            variant="outline"
            className="text-[10px] font-bold text-secondary border-secondary/30 bg-secondary/5"
          >
            {template.atsScore}% ATS
          </Badge>
        </div>
        <CardDescription className="text-sm font-medium leading-relaxed">
          {template.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
