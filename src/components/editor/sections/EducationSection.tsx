import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Education } from "@/types/resume";

interface EducationSectionProps {
  education: Education[];
  onUpdate: <K extends keyof Education>(id: string, field: K, value: Education[K]) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  onUpdate,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-6 pt-4">
      {education.map((edu) => (
        <Card key={edu.id} className="bg-accent/20 border-none rounded-2xl p-6 relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(edu.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              ["institution", "degree", "field", "location", "startDate", "endDate", "gpa"] as const
            ).map((f) => (
              <div key={f} className="space-y-2">
                <Label className="capitalize font-semibold text-xs text-muted-foreground">
                  {f.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  value={edu[f as keyof Education] || ""}
                  onChange={(e) => onUpdate(edu.id, f as keyof Education, e.target.value)}
                  placeholder={
                    f === "institution"
                      ? "e.g. University of Oxford"
                      : f === "degree"
                        ? "e.g. Bachelor of Science"
                        : f === "field"
                          ? "e.g. Computer Science"
                          : f === "location"
                            ? "e.g. London, UK"
                            : f === "startDate"
                              ? "e.g. 2018"
                              : f === "endDate"
                                ? "e.g. 2022"
                                : "e.g. 3.8/4.0"
                  }
                  className="rounded-xl h-11"
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
      <Button variant="outline" className="w-full py-10 rounded-2xl border-dashed" onClick={onAdd}>
        <Plus className="h-5 w-5 mr-2" />
        Add Education
      </Button>
    </div>
  );
};
