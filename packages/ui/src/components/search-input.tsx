"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { InputProps } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/input-group";
import { cn } from "@workspace/ui/lib/utils";

type SearchInputProps = Omit<InputProps, "onChange" | "value" | "type"> & {
  value: string;
  onValueChange: (value: string) => void;
  /** className for the outer InputGroup wrapper (widths, etc.) */
  className?: string;
};

export function SearchInput({
  value,
  onValueChange,
  placeholder = "Search…",
  className,
  "aria-label": ariaLabel = "Search",
  ...props
}: SearchInputProps) {
  return (
    <InputGroup className={cn("w-full sm:max-w-sm", className)}>
      <InputGroupAddon align="inline-start">
        <InputGroupText>
          <SearchIcon aria-hidden />
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        aria-label={ariaLabel}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
        {...props}
      />
      {value.length > 0 && (
        <InputGroupAddon align="inline-end">
          <Button
            aria-label="Clear search"
            onClick={() => onValueChange("")}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <XIcon aria-hidden />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
