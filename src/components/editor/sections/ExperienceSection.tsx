import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Experience } from "@/types/resume";

interface ExperienceSectionProps {
  experiences: Experience[];
  onUpdate: <K extends keyof Experience>(id: string, field: K, value: Experience[K]) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onAddResponsibility: (id: string) => void;
  onUpdateResponsibility: (id: string, index: number, value: string) => void;
  onDeleteResponsibility: (id: string, index: number) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onUpdate,
  onAdd,
  onDelete,
  onAddResponsibility,
  onUpdateResponsibility,
  onDeleteResponsibility,
}) => {
  return (
    <div className="space-y-6 pt-4">
      {experiences.map((exp) => (
        <Card key={exp.id} className="bg-accent/20 border-none rounded-2xl p-6 relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(exp.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["position", "company", "location", "startDate", "endDate"] as const).map((f) => (
              <div key={f} className="space-y-2">
                <Label className="capitalize font-semibold text-xs text-muted-foreground">
                  {f.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  value={exp[f]}
                  onChange={(e) => onUpdate(exp.id, f, e.target.value)}
                  placeholder={
                    f === "position"
                      ? "e.g. Software Developer"
                      : f === "company"
                        ? "e.g. PT Tech Global"
                        : f === "location"
                          ? "e.g. Remote"
                          : f === "startDate"
                            ? "e.g. Jan 2020"
                            : "e.g. Present"
                  }
                  className="rounded-xl h-11"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <Label>Responsibilities</Label>
            {exp.responsibilities.map((r, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={r}
                  onChange={(e) => onUpdateResponsibility(exp.id, i, e.target.value)}
                  className="rounded-xl"
                  placeholder="e.g. Led a team of 5 developers to build a scalable API..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteResponsibility(exp.id, i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddResponsibility(exp.id)}
              className="w-full rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Responsibility
            </Button>
          </div>
        </Card>
      ))}
      <Button variant="outline" className="w-full py-10 rounded-2xl border-dashed" onClick={onAdd}>
        <Plus className="h-5 w-5 mr-2" />
        Add Experience
      </Button>
    </div>
  );
};
