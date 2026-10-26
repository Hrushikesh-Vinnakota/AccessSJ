import Link from "next/link";

export function Hero() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-line bg-paper shadow-card">
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-pine">San Joaquin County</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] sm:text-6xl">
            Parks and playdates that leave nobody at the curb.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            AccessSJ helps families of children with disabilities, disabled adults, and seniors find a public park that works — a paved loop, an inclusive swing, a quiet garden — and then meet other people there.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#parks" className="inline-flex min-h-11 items-center rounded-full bg-pine px-5 font-semibold text-on-pine">
              Search parks
            </Link>
            <Link href="/events" className="inline-flex min-h-11 items-center rounded-full border border-line bg-cream px-5 font-semibold">
              See playdates
            </Link>
          </div>
        </div>
        <ul className="grid gap-3 rounded-3xl bg-soft p-4 text-base" aria-label="What you can do here">
          <li>
            <strong className="block font-serif text-xl">8 county parks</strong>
            Stockton, Tracy, Lodi, Manteca, and Mountain House.
          </li>
          <li>
            <strong className="block font-serif text-xl">Features, not vibes</strong>
            Paths, swings, surfaces, restrooms, quiet zones, loaner gear.
          </li>
          <li>
            <strong className="block font-serif text-xl">Reports from families</strong>
            A stuck gate matters more than a brochure.
          </li>
        </ul>
      </div>
    </section>
  );
}
