import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-serif text-5xl font-semibold">That page is not here</h1>
      <p className="mt-3 text-lg text-muted">The park or page may have moved. The directory is the surest way back.</p>
      <Link href="/parks" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-pine px-5 font-semibold text-on-pine">
        Browse parks
      </Link>
    </div>
  );
}
