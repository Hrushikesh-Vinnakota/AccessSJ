import type { Park } from "@/lib/types";

const photo = (file: string, alt: string) =>
  ({
    src: `/parks/${file}`,
    alt,
  }) as const;

export const parks: Park[] = [
  {
    id: "micke-grove",
    slug: "micke-grove",
    name: "Micke Grove Regional Park",
    town: "Lodi",
    address: "11793 N. Micke Grove Rd, Lodi, CA 95240",
    lat: 38.0819,
    lng: -121.2724,
    summary:
      "County park with a zoo, a Japanese garden, a lake, and playgrounds. A public listing names a wheelchair-accessible entrance and parking lot, plus slides, swings, picnic tables, grills, a public restroom, a baseball field, and hiking.",
    description:
      "San Joaquin County Parks lists this 132-acre park at 11793 N. Micke Grove Road. The page names Micke Grove Zoo, Wortley Lake, the Japanese Garden, the San Joaquin County Historical Museum, picnic shelters, a water play feature, softball fields, horseshoe pits, playgrounds, and a disc golf course. The Stanislaus Picnic Shelter is temporarily closed for repairs. A Wheree listing for this address adds a wheelchair-accessible entrance, a wheelchair-accessible parking lot, barbecue grills, picnic tables, slides, swings, a public restroom, a baseball field, and hiking, including kid-friendly hikes. That listing does not describe a wheelchair path or ramp, an accessible restroom stall, a high-back or harness swing, a changing station, a low-noise zone, or loaner equipment, so those badges are not shown. The listing is not marked as owner-verified.",
    hours: "8:00 a.m. to sunset.",
    website: "https://sjparks.com/parks/micke-grove-regional-park",
    websiteLabel: "San Joaquin County Parks",
    amenities: ["wheelchair-paths"],
    amenityNotes: {
      "wheelchair-paths":
        "The Wheree listing for this address names a wheelchair-accessible entrance and a wheelchair-accessible parking lot. It does not describe a path, ramp, or hiking trail as wheelchair accessible.",
    },
    photos: [
      photo("micke-grove.png", "Photo of a red wooden bridge over a stream at Micke Grove Regional Park."),
    ],
    communityNotes: [],
  },
  {
    id: "oak-grove",
    slug: "oak-grove",
    name: "Shumway Oak Grove Regional Park",
    town: "Stockton",
    address: "4520 W Eight Mile Road, Stockton, CA 95209",
    lat: 38.0541,
    lng: -121.366,
    summary:
      "County oak-forest park with a nature center, a lake, and one trail the county describes as handicapped-accessible.",
    description:
      "San Joaquin County Parks lists Shumway Oak Grove Regional Park at 4520 W. Eight Mile Road, Stockton, CA 95209. The page names Oak Grove Lake, the Oak Grove Nature Center, rental picnic shelters, disc golf, playgrounds, and two trails: the Mi-Wuk, a 1.5 mile walk, and the Yokuts, a quarter-mile handicapped-accessible trail. The Oaks Pavilion playground is closed for repairs, with no reopen date on the page. The page does not describe accessible restrooms, changing tables, or loaner equipment.",
    hours: "8:00 a.m. to sunset.",
    website: "https://sjparks.com/parks/shumway-oak-grove-regional-park",
    websiteLabel: "San Joaquin County Parks",
    amenities: ["wheelchair-paths"],
    amenityNotes: {
      "wheelchair-paths":
        "San Joaquin County Parks describes the Yokuts Trail as a quarter-mile handicapped-accessible trail. The Mi-Wuk Trail is listed as a 1.5 mile walk and is not described as accessible.",
    },
    photos: [
      photo("oak-grove.png", "Photo of a wooden picnic shelter at Shumway Oak Grove Regional Park."),
    ],
    communityNotes: [],
  },
  {
    id: "victory-park",
    slug: "victory-park",
    name: "Victory Park",
    town: "Stockton",
    address: "1001 N. Pershing Ave, Stockton, CA 95203",
    lat: 37.9606,
    lng: -121.3146,
    summary:
      "Central Stockton park with a flat paved perimeter loop, woodchip play pits, bucket swings, and new contactless ADA restrooms.",
    description:
      "The City of Stockton facilities list gives Victory Park as 22.45 acres at 1001 N. Pershing Avenue. Listed amenities are picnic tables, group picnics, play equipment, tennis, softball, basketball courts, barbecue, restrooms, and a parking lot. The October 22, 2026 assessment, checked against the Stockton parks directory and facility logs, describes a flat paved asphalt perimeter loop, woodchip play pits, inclusive bucket and tot swings, and new contactless self-cleaning ADA restrooms. That assessment also names the Haggin Museum and duck ponds. OpenStreetMap maps a rose garden inside the park. That map label is not an access audit. No adult changing station, low-noise zone, or loaner equipment is listed.",
    hours: "City parks open one hour before sunrise and close one hour after sunset.",
    website: "https://stocktonca.gov/community/recreation/parks/park_locations___facilities.php",
    websiteLabel: "City of Stockton",
    amenities: ["wheelchair-paths", "adaptive-swings", "paved-surface", "woodchip-surface", "accessible-restrooms"],
    amenityNotes: {
      "wheelchair-paths":
        "The October 22, 2026 assessment describes a completely flat paved asphalt perimeter loop. The named source is the City of Stockton parks directory and facility logs.",
      "adaptive-swings":
        "The same assessment names inclusive bucket and tot swings for toddlers and younger children.",
      "paved-surface":
        "The main walking route in the assessment is that paved asphalt perimeter loop.",
      "woodchip-surface":
        "Play pits are woodchip. Loose chips are harder for wheels than the paved loop.",
      "accessible-restrooms":
        "The assessment describes new contactless, self-cleaning ADA restrooms. It does not name an adult changing station.",
    },
    photos: [
      photo("victory-park.png", "Photo of the Victory Park pool and splash pad."),
    ],
    communityNotes: [],
  },
  {
    id: "lodi-lake",
    slug: "lodi-lake",
    name: "Lodi Lake Park",
    town: "Lodi",
    address: "Lodi Lake Park, Lodi, CA",
    lat: 38.1501,
    lng: -121.2888,
    summary:
      "River park with paved nature trails, accessible parking, and ADA restrooms. Wilderness loops turn to dirt, and the play lots are standard.",
    description:
      "OpenStreetMap places Lodi Lake Park on the north side of Lodi, beside Lodi Lake, and does not give a street address. The October 22, 2026 assessment, using the San Joaquin County Wheelchair Travel Guide, describes a water recreation hub on the Mokelumne River with paved nature trails, launch ramps, accessible parking, and ADA restroom cubicles. Wilderness loops change to dirt and mulch. Play lots are standard, so the inclusive-swing badge is not shown. No adult changing station, low-noise zone, or loaner equipment is listed. Confirm the entrance with the City of Lodi before a visit.",
    hours: "Not listed on the sources used here.",
    website: "https://www.lodi.gov/",
    websiteLabel: "City of Lodi",
    amenities: ["wheelchair-paths", "paved-surface", "accessible-restrooms"],
    amenityNotes: {
      "wheelchair-paths":
        "The Wheelchair Travel Guide assessment lists paved nature trails and accessible parking. Wilderness loops are dirt and are not part of this badge.",
      "paved-surface":
        "Paved trails are listed. The same assessment names natural dirt and mulch where the wilderness loops leave the pavement.",
      "accessible-restrooms":
        "Restroom cubicles are described as ADA compliant, with accessible parking. An adult changing station is not named.",
    },
    photos: [
      photo("lodi-lake.png", "Photo of Lodi Lake from above, with the water winding through trees."),
    ],
    communityNotes: [],
  },
  {
    id: "woodward",
    slug: "woodward",
    name: "Woodward Community Park",
    town: "Manteca",
    address: "710 E Woodward Ave, Manteca, CA 95337",
    lat: 37.7739,
    lng: -121.2061,
    summary:
      "Manteca park at 710 E Woodward Avenue with new ADA playground ramps, a paved loop, woodchip pits, an enlarged ADA restroom, and a splash pad.",
    description:
      "The City of Manteca park list gives Woodward Community Park at 710 E Woodward Avenue. The October 22, 2026 assessment, checked with the Recreation and Community Services office, says crews added permanent ADA entry ramps at three playground junctions, a paved loop, woodchip play pits, and an enlarged ADA restroom, plus a summer splash pad. Swings on site are standard, so the inclusive-swing badge is not shown. The earlier splash-pad project also described an ADA-compliant splash pad, replacement restrooms, improved walkways, and a sidewalk from Woodward Avenue. No adult changing station, low-noise zone, or loaner equipment is listed.",
    hours: "Splash pad hours were announced as 11:00 a.m. to 7:00 p.m. in season. Full park hours are on the city page.",
    website: "https://www.manteca.gov/departments/recreation-community-services/parks-and-facilities/parks-listing",
    websiteLabel: "City of Manteca",
    amenities: ["wheelchair-paths", "paved-surface", "woodchip-surface", "accessible-restrooms"],
    amenityNotes: {
      "wheelchair-paths":
        "The October 22, 2026 assessment says permanent ADA entry ramps were added at three playground junctions.",
      "paved-surface":
        "The assessment names a paved loop. The earlier splash-pad project also describes improved walkways and a sidewalk from Woodward Avenue. This is not a claim about every path in the park.",
      "woodchip-surface":
        "Play pits are woodchip. Loose chips are harder for wheels than the paved loop.",
      "accessible-restrooms":
        "The assessment describes an enlarged ADA restroom complex. It does not name an adult changing station.",
    },
    photos: [
      photo("woodward.png", "Photo of a picnic shelter at Woodward Community Park."),
    ],
    communityNotes: [],
  },
  {
    id: "lincoln-park",
    slug: "lincoln-park",
    name: "Lincoln Park",
    town: "Tracy",
    address: "200 Eaton Ave, Tracy, CA 95376",
    lat: 37.7428,
    lng: -121.4235,
    summary:
      "Tracy park with a flat concrete loop about five feet wide, woodchip play bases, inclusive rope play, a rose garden, and a splash pad.",
    description:
      "The City of Tracy lists Lincoln Park at 200 Eaton Avenue. The page names picnic tables, a playground, walking paths, restrooms, parking, and a water feature. The October 22, 2026 assessment, mapped from the Tracy parks directory, describes a continuous concrete loop about five feet wide with a flat grade near 1 percent, woodchip bases under play equipment, nature-themed playgrounds with ramps, inclusive rope climbing assemblies and swings, a rose garden, a gazebo, a splash pad, and permanent ADA restrooms. The city photo gallery also includes a decomposed-granite trail, so not every walk is the concrete loop. The assessment does not name a high-back or harness swing, so the inclusive-swing badge is not shown. No adult changing station, low-noise zone, or loaner equipment is listed.",
    hours: "See the City of Tracy park page.",
    website: "https://www.cityoftracy.org/Departments/Parks-Recreation-Community-Services/Park-Listing/Lincoln-Park",
    websiteLabel: "City of Tracy",
    amenities: ["wheelchair-paths", "paved-surface", "woodchip-surface", "accessible-restrooms"],
    amenityNotes: {
      "wheelchair-paths":
        "The Tracy parks directory assessment describes a continuous concrete loop about five feet wide, nearly flat, with ramps into the playgrounds.",
      "paved-surface":
        "That loop is paved concrete. The city gallery also shows a decomposed-granite trail, so not every walk is paved.",
      "woodchip-surface":
        "Play equipment sits on woodchip bases. Loose chips are harder for wheels than the concrete loop.",
      "accessible-restrooms":
        "The assessment names permanent ADA restrooms. It does not name an adult changing station.",
    },
    photos: [
      photo("lincoln-park.png", "Photo of the City of Tracy Lincoln Park entrance sign."),
    ],
    communityNotes: [],
  },
  {
    id: "central-community",
    slug: "central-community",
    name: "Central Community Park",
    town: "Mountain House",
    address: "25 E Main St, Mountain House, CA 95391",
    lat: 37.7789,
    lng: -121.541,
    summary:
      "Mountain House sports park at 25 E Main Street with wide concrete trails, a woodchip play area, inclusive play structures, and permanent restroom blocks.",
    description:
      "The City of Mountain House facilities directory lists Central Community Park at 25 Main Street. The October 22, 2026 assessment, using the facilities portal, describes wide concrete paths between multi-sport fields, a woodchip play area, inclusive playground structures, picnic plazas, a splash fountain, and permanent restroom blocks from a Phase 2 update. The restroom line does not describe grab bars or a turning space, and the play equipment is not named as a high-back or harness swing, so those two badges are not shown. No adult changing station, low-noise zone, or loaner equipment is listed. The map pin is a geocode of Main Street in Mountain House.",
    hours: "See the City of Mountain House facilities page.",
    website: "https://www.mountainhouseca.gov/Facilities",
    websiteLabel: "City of Mountain House",
    amenities: ["wheelchair-paths", "paved-surface", "woodchip-surface"],
    amenityNotes: {
      "wheelchair-paths":
        "The Mountain House facilities portal assessment describes wide concrete trails connecting the sports fields and play area.",
      "paved-surface":
        "Those walking paths are paved concrete.",
      "woodchip-surface":
        "The play area is woodchip. Loose chips are harder for wheels than the concrete paths.",
    },
    photos: [
      photo("central-community.jpg", "Photo of ornamental grass and a lawn at Central Community Park in late-day light."),
    ],
    communityNotes: [],
  },
  {
    id: "buckley-cove",
    slug: "buckley-cove",
    name: "Buckley Cove Park",
    town: "Stockton",
    address: "4311 Buckley Cove Way, Stockton, CA 95219",
    lat: 37.9746,
    lng: -121.3759,
    summary:
      "Stockton marina and fishing park with accessible parking, paved paths, flat boat ramps, and standard ADA restrooms. No inclusive playground or low-noise zone is listed.",
    description:
      "The City of Stockton lists Buckley Cove Park at 4311 Buckley Cove Way. Listed amenities are picnic tables, play equipment, boat launches, barbecue, restrooms, and a parking lot. The October 22, 2026 assessment, checked against Stockton parks facility logs, describes a gated marina and fishing site with accessible parking, paved paths, flat boat ramps, and standard ADA restroom cubicles. Coverage is partial: parking and the launch area, not a playground loop. The assessment says there is no inclusive playground and no low-noise zone. The boat launch office at 4911 Buckley Cove Way is a separate address. The city said that launch is closed from October through December 2026 for dredging, and that the park area stays open. No loaner beach wheelchair is listed.",
    hours: "City parks open one hour before sunrise and close one hour after sunset.",
    website: "https://stocktonca.gov/community/recreation/parks/park_locations___facilities.php",
    websiteLabel: "City of Stockton",
    amenities: ["wheelchair-paths", "paved-surface", "accessible-restrooms"],
    amenityNotes: {
      "wheelchair-paths":
        "The Stockton facility-log assessment lists accessible parking, paved paths, and flat boat ramps. This is partial coverage at the marina, not a playground loop.",
      "paved-surface":
        "Paved areas are the parking lot, boat-ramp approaches, and paths. The assessment does not describe a paved play loop.",
      "accessible-restrooms":
        "Restrooms are described as standard ADA cubicles. An adult changing station is not named.",
    },
    photos: [
      photo("buckley-cove.png", "Photo of the boat docks at Buckley Cove."),
    ],
    communityNotes: [],
  },
];

export function getPark(slug: string): Park | undefined {
  return parks.find((park) => park.slug === slug);
}
