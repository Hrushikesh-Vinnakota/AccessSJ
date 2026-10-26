import type { AmenityId } from "@/lib/types";
import {
  Accessibility,
  Baby,
  Bath,
  Footprints,
  LifeBuoy,
  PersonStanding,
  Trees,
  VolumeX,
  type LucideIcon,
} from "lucide-react";

export interface AmenityMeta {
  id: AmenityId;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
}

export const AMENITIES: AmenityMeta[] = [
  {
    id: "wheelchair-paths",
    label: "Wheelchair accessible paths and ramps",
    short: "Paths & ramps",
    description: "A connected route a wheelchair or walker can use, including ramps where the path changes level.",
    icon: Accessibility,
  },
  {
    id: "adaptive-swings",
    label: "Adaptive and inclusive swings",
    short: "Inclusive swings",
    description: "A swing with a back, harness, or high back that more children can use with a caregiver.",
    icon: PersonStanding,
  },
  {
    id: "paved-surface",
    label: "Paved ground surface",
    short: "Paved surface",
    description: "Concrete or asphalt on the main walking loop or playground approach.",
    icon: Footprints,
  },
  {
    id: "woodchip-surface",
    label: "Woodchip play surface",
    short: "Woodchip surface",
    description: "Engineered wood fiber or loose chips under play equipment. Often harder for wheels than a paved path.",
    icon: Trees,
  },
  {
    id: "accessible-restrooms",
    label: "Accessible restrooms",
    short: "Accessible restrooms",
    description: "A restroom with a turning space, grab bars, and a door a wheelchair can use.",
    icon: Bath,
  },
  {
    id: "changing-station",
    label: "Changing station",
    short: "Changing station",
    description: "An adult or family changing station, not only a baby changing table.",
    icon: Baby,
  },
  {
    id: "sensory-friendly",
    label: "Sensory-friendly or low-noise zone",
    short: "Low-noise zone",
    description: "A quieter corner, garden, or time of day that families use when a busy playground is too much.",
    icon: VolumeX,
  },
  {
    id: "loaner-equipment",
    label: "Loaner equipment on site",
    short: "Loaner equipment",
    description: "Something you can borrow at the park, such as a beach wheelchair. Always call ahead.",
    icon: LifeBuoy,
  },
];

export function amenityById(id: AmenityId): AmenityMeta {
  const found = AMENITIES.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Unknown amenity: ${id}`);
  }
  return found;
}

export const CONDITION_LABELS = {
  good: "Works well right now",
  "needs-attention": "Needs attention",
  blocked: "Blocked or unusable",
} as const;
