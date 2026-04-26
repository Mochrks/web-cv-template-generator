import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Project } from "@/types/resume";
import { cn } from "@/lib/utils";

interface ProjectsSectionProps {
  projects: Project[];
  onUpdate: <K extends keyof Project>(id: string, field: K, value: Project[K]) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onUpdate,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-6 pt-4">
      {projects.map((p) => (
        <Card key={p.id} className="bg-accent/20 border-none rounded-2xl p-6 relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(p.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["name", "link", "startDate", "endDate", "technologies", "description"] as const).map(
              (f) => (
                <div
                  key={f}
                  className={cn(
                    "space-y-2",
                    (f === "description" || f === "technologies") && "sm:col-span-2"
                  )}
                >
                  <Label className="capitalize font-semibold text-xs text-muted-foreground">
                    {f.replace(/([A-Z])/g, " $1")}
                  </Label>
                  {f === "description" ? (
                    <textarea
                      className="w-full min-h-[80px] p-4 rounded-xl border border-input bg-background text-sm"
                      value={p[f]}
                      onChange={(e) => onUpdate(p.id, f, e.target.value)}
                      placeholder="e.g. Developed a full-stack e-commerce application using Next.js and Stripe..."
                    />
                  ) : f === "technologies" ? (
                    <Input
                      value={p.technologies.join(", ")}
                      onChange={(e) =>
                        onUpdate(
                          p.id,
                          "technologies",
                          e.target.value.split(",").map((t) => t.trim())
                        )
                      }
                      placeholder="e.g. React, Next.js, TailwindCSS"
                      className="rounded-xl h-11"
                    />
                  ) : (
                    <Input
                      value={(p[f] as string) || ""}
                      onChange={(e) => onUpdate(p.id, f, e.target.value)}
                      placeholder={
                        f === "name"
                          ? "e.g. Portfolio Website"
                          : f === "link"
                            ? "e.g. github.com/username/project"
                            : f === "startDate"
                              ? "e.g. Jan 2023"
                              : "e.g. Present"
                      }
                      className="rounded-xl h-11"
                    />
                  )}
                </div>
              )
            )}
          </div>
        </Card>
      ))}
      <Button variant="outline" className="w-full py-10 rounded-2xl border-dashed" onClick={onAdd}>
        <Plus className="h-5 w-5 mr-2" />
        Add Project
      </Button>
    </div>
  );
};
