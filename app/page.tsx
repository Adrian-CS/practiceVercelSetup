import { createClient } from '@/lib/supabase/server'
import { deleteDocument, logout } from './actions'
import { DeleteButton } from './DeleteButton'
import { Filters } from './Filters'
import Link from 'next/link'
import { buttonPrimaryClass, buttonSecondaryClass, linkClass, StatusBadge } from '@/lib/ui'

const PAGE_SIZE = 10

// Builds a `/?q=...&status=...&page=N` href, dropping empty params and the
// page number when it's 1, so links stay clean and bookmarkable.
function pageHref(params: { q: string; status: string; page: number }) {
  const sp = new URLSearchParams()
  if (params.q) sp.set('q', params.q)
  if (params.status) sp.set('status', params.status)
  if (params.page > 1) sp.set('page', String(params.page))
  const qs = sp.toString()
  return qs ? `/?${qs}` : '/'
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q = '', status = '', page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const supabase = await createClient()
  let query = supabase
    .from('documents')
    .select('id, title, client, due_date, status, assignees(name)', { count: 'exact' })
    .order('due_date', { ascending: true })

  // Strip characters that have special meaning in PostgREST's `or()` filter
  // syntax (commas separate conditions, parens group them) so a search term
  // like "Acme, Inc." can't break the query.
  const safeQ = q.replace(/[,()]/g, '').trim()
  if (safeQ) {
    const orParts = [
      `title.ilike.%${safeQ}%`,
      `client.ilike.%${safeQ}%`,
      `status.ilike.%${safeQ}%`,
    ]
    // `assignees.name` lives on a joined table — PostgREST's `or()` can't
    // filter an embedded resource's column directly, so look up matching
    // assignees first and match documents by their id instead. (A cast like
    // `due_date::text.ilike...` would cover the due date too, but PostgREST
    // rejects `::` casts inside `or()`, so dates are left out of search.)
    const { data: matchingAssignees } = await supabase
      .from('assignees')
      .select('id')
      .ilike('name', `%${safeQ}%`)
    if (matchingAssignees?.length) {
      orParts.push(`assignee_id.in.(${matchingAssignees.map((a) => a.id).join(',')})`)
    }
    query = query.or(orParts.join(','))
  }
  if (status) query = query.eq('status', status)

  const from = (page - 1) * PAGE_SIZE
  const { data: documents, count, error } = await query.range(from, from + PAGE_SIZE - 1)

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Document management</h1>
        <div className="flex gap-2">
          <Link href="/new" className={buttonPrimaryClass}>New document</Link>
          <form action={logout}>
            <button className={buttonSecondaryClass}>Log out</button>
          </form>
        </div>
      </div>

      <Filters defaultQ={q} defaultStatus={status} />

      {error && <p className="mb-4 text-red-500">Error: {error.message}</p>}

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="hidden px-4 py-3 sm:table-cell">Client</th>
              <th className="px-4 py-3">Due date</th>
              <th className="hidden px-4 py-3 md:table-cell">Assignee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {documents?.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                <td className="px-4 py-3 font-medium">{d.title}</td>
                <td className="hidden px-4 py-3 text-gray-600 sm:table-cell dark:text-gray-400">
                  {d.client}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{d.due_date}</td>
                <td className="hidden px-4 py-3 text-gray-600 md:table-cell dark:text-gray-400">
                  {d.assignees?.name}
                </td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/documents/${d.id}/edit`} className={linkClass}>Edit</Link>
                    <form action={deleteDocument}>
                      <input type="hidden" name="id" value={d.id} />
                      <DeleteButton className="text-red-600 hover:underline dark:text-red-400" />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {documents?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between dark:text-gray-400">
        <p>
          {total === 0
            ? 'No results'
            : `Showing ${from + 1}–${Math.min(from + PAGE_SIZE, total)} of ${total}`}
        </p>
        <div className="flex items-center gap-2">
          {page > 1 ? (
            <Link href={pageHref({ q, status, page: page - 1 })} className={buttonSecondaryClass}>
              Previous
            </Link>
          ) : (
            <span className={`${buttonSecondaryClass} pointer-events-none opacity-40`}>Previous</span>
          )}
          <span className="px-2">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={pageHref({ q, status, page: page + 1 })} className={buttonSecondaryClass}>
              Next
            </Link>
          ) : (
            <span className={`${buttonSecondaryClass} pointer-events-none opacity-40`}>Next</span>
          )}
        </div>
      </div>
    </main>
  )
}
