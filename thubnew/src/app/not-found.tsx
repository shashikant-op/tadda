import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The tutorial or page may have moved, been unpublished, or never existed.</p>
      <Link className="mt-8 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground" href="/">
        Return home
      </Link>
    </main>
  );
}
