import type { AmenityId } from "@/lib/types";
import { amenityById } from "@/lib/amenities";
import { cn } from "@/lib/utils";

export function AccessibilityBadge({
  id,
  compact = false,
  visitor = false,
}: {
  id: AmenityId;
  compact?: boolean;
  visitor?: boolean;
}) {
  const amenity = amenityById(id);
  const Icon = amenity.icon;
  const name = compact ? amenity.short : amenity.label;
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm font-semibold text-ink",
        visitor ? "border-dashed border-pine bg-paper" : "border-line bg-soft",
        compact && "py-0.5",
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>
        {name}
        {visitor ? <span className="sr-only">, reported by a visitor</span> : null}
      </span>
      {visitor ? <span aria-hidden="true">· visitor</span> : null}
    </span>
  );
}
