// Shown instantly while `EditDocument` awaits the document row from
// Supabase. Matches the real form's field count so nothing jumps around
// once the actual data replaces it.
export default function Loading() {
  return (
    <main className="mx-auto max-w-md animate-pulse p-4 sm:p-8">
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="my-4 h-7 w-40 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="mb-1 h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
        <div className="h-10 rounded-md bg-gray-300 dark:bg-gray-700" />
      </div>
    </main>
  )
}
