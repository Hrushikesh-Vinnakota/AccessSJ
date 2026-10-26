"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ParkPhoto } from "@/lib/types";

export function Photo({
  photo,
  className,
  fallback,
}: {
  photo: ParkPhoto;
  className?: string;
  fallback: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className={cn("flex items-end bg-pine p-4 text-on-pine", className)}
        role="img"
        aria-label={`${photo.alt} Image could not be loaded.`}
      >
        <span className="font-serif text-2xl font-semibold">{fallback}</span>
      </div>
    );
  }
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      className={cn("h-full w-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
