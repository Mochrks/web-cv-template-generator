import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Publication } from "@/types/resume";

interface PublicationsSectionProps {
  publications: Publication[];
  onUpdate: <K extends keyof Publication>(id: string, field: K, value: Publication[K]) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({
  publications,
  onUpdate,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-6 pt-4">
      {publications.map((p) => (
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
            {(["title", "publisher", "date", "link"] as const).map((f) => (
              <div key={f} className="space-y-2">
                <Label className="capitalize">{f}</Label>
                <Input
                  value={p[f] || ""}
                  onChange={(e) => onUpdate(p.id, f, e.target.value)}
                  placeholder={
                    f === "title"
                      ? "e.g. Scalable Architecture Patterns"
                      : f === "publisher"
                        ? "e.g. Medium / Tech Journal"
                        : f === "date"
                          ? "e.g. Oct 2022"
                          : "e.g. medium.com/@user/article"
                  }
                  className="rounded-xl h-11"
                />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-2">
              <Label>Description</Label>
              <textarea
                className="w-full min-h-[80px] p-4 rounded-xl border border-input bg-background text-sm"
                value={p.description || ""}
                onChange={(e) => onUpdate(p.id, "description", e.target.value)}
                placeholder="Summary of your publication or research paper..."
              />
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" className="w-full py-10 rounded-2xl border-dashed" onClick={onAdd}>
        <Plus className="h-5 w-5 mr-2" />
        Add Publication
      </Button>
    </div>
  );
};
