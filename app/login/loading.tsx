export default function Loading() {
  return (
    <main className="mx-auto flex min-h-full max-w-sm animate-pulse items-center p-4 sm:p-8">
      <div className="w-full rounded-lg border border-gray-200 p-6 dark:border-gray-800">
        <div className="mb-4 h-6 w-24 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-4">
          <div>
            <div className="mb-1 h-4 w-12 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
          <div>
            <div className="mb-1 h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 rounded-md bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="h-10 rounded-md bg-gray-300 dark:bg-gray-700" />
        </div>
      </div>
    </main>
  )
}
