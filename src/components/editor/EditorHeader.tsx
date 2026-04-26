import React from "react";
import { useRouter } from "next/router";
import { Download, Undo2, ChevronLeft, Loader2, FileDown, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  selectedTemplateId: string | null;
  viewMode: "split" | "edit" | "preview";
  setViewMode: (mode: "split" | "edit" | "preview") => void;
  canUndo: boolean;
  onUndo: () => void;
  isExporting: boolean;
  onExportPDF: () => void;
  onExportDocx: () => void;
  onPrint: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  selectedTemplateId,
  viewMode,
  setViewMode,
  canUndo,
  onUndo,
  isExporting,
  onExportPDF,
  onExportDocx,
  onPrint,
}) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 md:px-8 py-3 flex items-center justify-between shadow-sm no-print">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/templates")}
          className="hover:bg-accent rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold leading-none flex items-center gap-2">
            Editor{" "}
            <Badge variant="outline" className="text-[10px] h-4 bg-muted/50 border-none">
              BETA
            </Badge>
          </h1>
          <p className="text-[10px] text-muted-foreground font-medium mt-1">
            Template: {selectedTemplateId || "ATS Minimal"}
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center bg-muted/20 p-1 rounded-xl border border-border/50 w-64">
        {(["edit", "split", "preview"] as const).map((mode) => (
          <button
            key={mode}
            className={cn(
              "flex-1 h-8 text-[11px] font-bold rounded-lg transition-all capitalize flex items-center justify-center",
              viewMode === mode
                ? "bg-background shadow-sm text-primary border border-border/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            )}
            onClick={() => setViewMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button
          variant="outline"
          size="sm"
          disabled={!canUndo}
          onClick={onUndo}
          className="h-9 px-4 rounded-xl border-border/60 hover:bg-accent"
        >
          <Undo2 className="h-4 w-4 mr-2" />
          Undo
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="h-9 px-5 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
            <DropdownMenuItem onClick={onExportPDF} className="rounded-lg cursor-pointer py-2">
              <FileDown className="h-4 w-4 mr-2 text-red-500" /> Export PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportDocx} className="rounded-lg cursor-pointer py-2">
              <FileText className="h-4 w-4 mr-2 text-blue-500" /> Export Word
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onPrint}
              className="rounded-lg cursor-pointer py-2 text-emerald-600 dark:text-emerald-400"
            >
              <Printer className="h-4 w-4 mr-2" /> Print Resume
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
