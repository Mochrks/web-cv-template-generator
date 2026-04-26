import React from "react";
import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateFooterProps {
  selectedTemplateName: string | undefined;
  onContinue: () => void;
  disabled: boolean;
}

export const TemplateFooter: React.FC<TemplateFooterProps> = ({
  selectedTemplateName,
  onContinue,
  disabled,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">
              Selected Style
            </p>
            <p className="text-lg font-extrabold text-foreground leading-none">
              {selectedTemplateName || "Choose a template above"}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          disabled={disabled}
          onClick={onContinue}
          className="w-full sm:w-auto px-12 py-7 text-base font-bold bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-xl shadow-secondary/20 transition-all active:scale-95"
        >
          Continue to Editor
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
