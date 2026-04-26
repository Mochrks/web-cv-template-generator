import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PersonalInfo } from "@/types/resume";

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ data, onChange }) => {
  const fields = ["fullName", "email", "phone", "location", "linkedin"] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
      {fields.map((f) => (
        <div key={f} className="space-y-2">
          <Label className="capitalize font-semibold text-xs text-muted-foreground">
            {f.replace(/([A-Z])/g, " $1")}
          </Label>
          <Input
            value={data[f] || ""}
            onChange={(e) => onChange({ [f]: e.target.value })}
            placeholder={
              f === "fullName"
                ? "e.g. John Doe"
                : f === "email"
                  ? "e.g. john@example.com"
                  : f === "phone"
                    ? "e.g. +1 234 567 890"
                    : f === "location"
                      ? "e.g. Jakarta, Indonesia"
                      : "e.g. linkedin.com/in/johndoe"
            }
            className="rounded-xl h-11 bg-muted/20 border-border/40 focus:bg-background transition-all"
          />
        </div>
      ))}
      <div className="sm:col-span-2 space-y-2">
        <Label>Summary</Label>
        <textarea
          className="w-full min-h-[140px] p-4 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          value={data.summary || ""}
          onChange={(e) => onChange({ summary: e.target.value })}
          placeholder="Write a brief professional summary about yourself..."
        />
      </div>
    </div>
  );
};
