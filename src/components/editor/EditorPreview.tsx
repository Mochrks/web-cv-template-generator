import React from "react";
import { Monitor, Smartphone, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ATSMinimal from "@/components/templates/templates/ATSMinimal";
import { ResumeData } from "@/types/resume";

interface EditorPreviewProps {
  data: ResumeData;
  viewMode: "split" | "edit" | "preview";
  previewDevice: "desktop" | "mobile";
  setPreviewDevice: (device: "desktop" | "mobile") => void;
}

export const EditorPreview: React.FC<EditorPreviewProps> = ({
  data,
  viewMode,
  previewDevice,
  setPreviewDevice,
}) => {
  return (
    <div
      className={cn(
        "bg-muted/30 flex flex-col transition-all duration-300",
        viewMode === "edit" ? "hidden" : "flex flex-1",
        viewMode === "split" ? "w-1/2 border-l border-border" : "w-full"
      )}
    >
      <div className="px-6 py-4 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Live Preview
          </span>
        </div>
        <div className="flex bg-muted/80 p-1 rounded-xl border border-border/40">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg transition-all",
              previewDevice === "desktop"
                ? "bg-background shadow-sm text-primary"
                : "text-muted-foreground"
            )}
            onClick={() => setPreviewDevice("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-lg transition-all",
              previewDevice === "mobile"
                ? "bg-background shadow-sm text-primary"
                : "text-muted-foreground"
            )}
            onClick={() => setPreviewDevice("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto pb-10 px-4 md:px-8 flex justify-center items-start bg-accent/20 dark:bg-zinc-900/20">
        <div
          className={cn(
            "transition-all duration-500 flex justify-center",
            previewDevice === "desktop" ? "w-full" : "w-[360px]"
          )}
        >
          <Card
            className={cn(
              "min-h-[297mm] shadow-2xl border-none bg-white overflow-hidden transition-transform origin-top",
              previewDevice === "desktop" ? "w-[210mm]" : "w-full"
            )}
            style={{
              transform:
                viewMode === "split" && previewDevice === "desktop" ? "scale(0.8)" : "scale(1)",
            }}
          >
            <ATSMinimal data={data} />
          </Card>
        </div>
      </div>
    </div>
  );
};
