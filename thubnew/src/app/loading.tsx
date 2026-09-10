export default function Loading() {
  return <main className="site-container w-full flex-1 px-5 py-12" role="status" aria-label="Loading page">
    <div className="skeleton-line h-4 w-32 rounded" />
    <div className="skeleton-line mt-8 h-12 max-w-xl rounded" />
    <div className="mt-10 space-y-4">
      <div className="skeleton-line h-4 w-full rounded" />
      <div className="skeleton-line h-4 w-5/6 rounded" />
      <div className="skeleton-line h-4 w-4/6 rounded" />
    </div>
    <span className="sr-only">Loading page…</span>
  </main>;
}
