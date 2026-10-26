# AccessSJ

AccessSJ helps families of children with disabilities, disabled adults, and seniors in San Joaquin County find public parks they can actually use, and meet other people there.

The interface targets WCAG 2.1 AA: scalable text, a high-contrast theme, labeled controls, visible focus, and a written park list that matches the map.

## What you can do

- Search eight parks in Stockton, Tracy, Lodi, Manteca, and Mountain House.
- Filter by wheelchair paths, inclusive swings, paved or woodchip surfaces, accessible restrooms, changing stations, low-noise zones, and loaner equipment.
- Open a park for photos, amenity notes, community notes, and Google Maps directions.
- Browse playdates, RSVP with a name, or post a meetup. Playdates and reports are stored in `data/community-store.json`. RSVPs are stored in `data/rsvps.json`.
- File an accessibility report, with an optional photo of a ramp or gate.

A solid badge is shown when a public source names that feature. A visitor badge is added when the newest report says the feature works. The notes are not a certified audit. Access notes for six city parks follow an October 22, 2026 assessment of those public sources.

## Requirements

- Node.js 20 or newer
- npm

No API key is required. Map tiles load from OpenStreetMap when the map is open.

## Run

From `congapp/`, after `npm install`:

```bash
npm run dev
```

Open http://127.0.0.1:8515. Stop the server with Ctrl+C.

```bash
npm test
npm run typecheck
```
