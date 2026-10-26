import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-page gap-6 px-4 py-8 sm:grid-cols-2">
        <div>
          <p className="font-serif text-2xl font-semibold">AccessSJ</p>
          <p className="mt-2 max-w-md text-base text-muted">
            A community guide for families of special-needs children, disabled people, and seniors in San Joaquin County.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 font-semibold">
          <Link href="/parks" className="underline underline-offset-2">
            Park directory
          </Link>
          <Link href="/events" className="underline underline-offset-2">
            Community playdates
          </Link>
          <Link href="/report" className="underline underline-offset-2">
            Add an accessibility report
          </Link>
        </div>
      </div>
      <p className="mx-auto max-w-page px-4 pb-8 text-sm text-muted">
        Park photographs courtesy of San Joaquin County Parks & Recreation, City of Lodi, City of Stockton, City of Manteca, City of Tracy, and City of Mountain House.
      </p>
    </footer>
  );
}
