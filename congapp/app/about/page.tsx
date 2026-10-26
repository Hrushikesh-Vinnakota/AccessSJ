export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-5xl font-semibold">About AccessSJ</h1>
      <div className="mt-4 space-y-4 text-lg">
        <p>
          AccessSJ helps families of children with disabilities, disabled adults, and seniors in San Joaquin County find a public park they can actually use, and meet other people there.
        </p>
        <p>
          The directory covers parks in Stockton, Tracy, Lodi, Manteca, and Mountain House. Each listing names the access features a family needs before the trip: paths and ramps, inclusive swings, paved or woodchip surfaces, accessible restrooms, changing stations, low-noise areas, and loaner equipment.
        </p>
        <p>
          A solid badge means a public source names that feature. A dashed visitor badge means an admin approved a report that a known feature works. A problem report, once approved, stays on the report list with a link to the park and does not add a badge.
        </p>
        <p>
          Text can be made larger, and a high-contrast theme is available. This is a community guide, not a certified accessibility audit. Look at the park before you rely on a badge.
        </p>
      </div>
    </div>
  );
}
