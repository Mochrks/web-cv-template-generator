import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Skill } from "@/types/resume";

interface SkillsSectionProps {
  skills: Skill[];
  onUpdate: <K extends keyof Skill>(id: string, field: K, value: Skill[K]) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onUpdate,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-6 pt-4">
      {skills.map((s) => (
        <Card key={s.id} className="bg-accent/20 border-none rounded-2xl p-6 relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(s.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={s.category}
                onChange={(e) => onUpdate(s.id, "category", e.target.value)}
                placeholder="e.g. Programming Languages"
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Skills (Comma separated)</Label>
              <Input
                value={s.skills.join(", ")}
                onChange={(e) =>
                  onUpdate(
                    s.id,
                    "skills",
                    e.target.value.split(",").map((sk) => sk.trim())
                  )
                }
                placeholder="e.g. React, Next.js, TypeScript"
                className="rounded-xl h-11"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" className="w-full py-10 rounded-2xl border-dashed" onClick={onAdd}>
        <Plus className="h-5 w-5 mr-2" />
        Add Skill Category
      </Button>
    </div>
  );
};
