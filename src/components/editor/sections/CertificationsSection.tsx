import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Certification } from "@/types/resume";

interface CertificationsSectionProps {
  certifications: Certification[];
  onUpdate: <K extends keyof Certification>(id: string, field: K, value: Certification[K]) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  onUpdate,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-6 pt-4">
      {certifications.map((c) => (
        <Card key={c.id} className="bg-accent/20 border-none rounded-2xl p-6 relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(c.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["name", "issuer", "date", "credentialId"] as const).map((f) => (
              <div key={f} className="space-y-2">
                <Label className="capitalize">{f.replace(/([A-Z])/g, " $1")}</Label>
                <Input
                  value={c[f] || ""}
                  onChange={(e) => onUpdate(c.id, f, e.target.value)}
                  placeholder={
                    f === "name"
                      ? "e.g. AWS Solutions Architect"
                      : f === "issuer"
                        ? "e.g. Amazon Web Services"
                        : f === "date"
                          ? "e.g. March 2023"
                          : "e.g. AWS-123456"
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
        Add Certification
      </Button>
    </div>
  );
};
