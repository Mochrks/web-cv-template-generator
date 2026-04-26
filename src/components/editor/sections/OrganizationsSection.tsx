import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Organization } from "@/types/resume";

interface OrganizationsSectionProps {
  organizations: Organization[];
  onUpdate: <K extends keyof Organization>(id: string, field: K, value: Organization[K]) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const OrganizationsSection: React.FC<OrganizationsSectionProps> = ({
  organizations,
  onUpdate,
  onAdd,
  onDelete,
}) => {
  return (
    <div className="space-y-6 pt-4">
      {organizations.map((o) => (
        <Card key={o.id} className="bg-accent/20 border-none rounded-2xl p-6 relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(o.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["name", "role", "startDate", "endDate"] as const).map((f) => (
              <div key={f} className="space-y-2">
                <Label className="capitalize font-semibold text-xs text-muted-foreground">
                  {f.replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  value={o[f] || ""}
                  onChange={(e) => onUpdate(o.id, f, e.target.value)}
                  placeholder={
                    f === "name"
                      ? "e.g. IEEE Student Branch"
                      : f === "role"
                        ? "e.g. Lead Coordinator"
                        : f === "startDate"
                          ? "e.g. 2021"
                          : "e.g. Present"
                  }
                  className="rounded-xl h-11"
                />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-2">
              <Label>Description</Label>
              <textarea
                className="w-full min-h-[80px] p-4 rounded-xl border border-input bg-background text-sm"
                value={o.description || ""}
                onChange={(e) => onUpdate(o.id, "description", e.target.value)}
                placeholder="Describe your involvement or achievements in this organization..."
              />
            </div>
          </div>
        </Card>
      ))}
      <Button variant="outline" className="w-full py-10 rounded-2xl border-dashed" onClick={onAdd}>
        <Plus className="h-5 w-5 mr-2" />
        Add Organization
      </Button>
    </div>
  );
};
