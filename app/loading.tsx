// Shown instantly by Next.js while `Home` (a Server Component) awaits
// Supabase — no client JS or state needed, just this file's naming
// convention. Shaped like the real page so there's no layout shift once
// the data arrives.
export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl animate-pulse p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-56 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="flex gap-2">
          <div className="h-9 w-32 rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="h-9 w-24 rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="h-10 flex-1 rounded-md bg-gray-200 dark:bg-gray-800" />
        <div className="h-10 sm:w-48 rounded-md bg-gray-200 dark:bg-gray-800" />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="h-10 bg-gray-100 dark:bg-gray-900" />
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="hidden h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 sm:block" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="hidden h-4 w-24 rounded bg-gray-200 dark:bg-gray-800 md:block" />
              <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
