"use client";

import type { ReactNode } from "react";

import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";

/**
 * A selectable card that toggles a checkbox, with a title and optional
 * description. The whole card is the label, so clicking anywhere toggles it;
 * the border and background highlight while checked.
 */
function CheckboxCard({
  checked,
  onCheckedChange,
  title,
  description,
  disabled,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-xs/5 outline-none transition-colors has-data-checked:border-primary has-data-checked:bg-primary/4 has-data-disabled:cursor-not-allowed has-data-disabled:opacity-64",
        className,
      )}
      data-slot="checkbox-card"
    >
      <Checkbox
        checked={checked}
        className="mt-0.5"
        disabled={disabled}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm leading-none">{title}</span>
        {description ? (
          <span className="text-muted-foreground text-sm">{description}</span>
        ) : null}
      </div>
    </label>
  );
}

export { CheckboxCard };
