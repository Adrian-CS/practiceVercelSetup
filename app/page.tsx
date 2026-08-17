import { createClient } from '@/lib/supabase/server'
import { deleteDocument } from './actions'
import { DeleteButton } from './DeleteButton'
import { DocumentRow } from './DocumentRow'
import { Filters } from './Filters'
import Link from 'next/link'
import { buttonSecondaryClass, linkClass, StatusBadge } from '@/lib/ui'

const PAGE_SIZE = 10

// Maps the public `sort` URL param to the actual column (and, for
// `assignee`, the joined table) supabase-js needs to order by.
const SORT_COLUMNS = {
  title: { column: 'title' },
  client: { column: 'client' },
  due_date: { column: 'due_date' },
  status: { column: 'status' },
  assignee: { column: 'name', referencedTable: 'assignees' },
} as const

type SortKey = keyof typeof SORT_COLUMNS
const DEFAULT_SORT: SortKey = 'due_date'

function isSortKey(value: string): value is SortKey {
  return value in SORT_COLUMNS
}

// Builds a `/?q=...&status=...&sort=...&dir=...&page=N` href, dropping
// params that are already the default so URLs stay clean and bookmarkable.
function buildHref(params: { q: string; status: string; sort: SortKey; dir: 'asc' | 'desc'; page: number }) {
  const sp = new URLSearchParams()
  if (params.q) sp.set('q', params.q)
  if (params.status) sp.set('status', params.status)
  if (params.sort !== DEFAULT_SORT) sp.set('sort', params.sort)
  if (params.dir !== 'asc') sp.set('dir', params.dir)
  if (params.page > 1) sp.set('page', String(params.page))
  const qs = sp.toString()
  return qs ? `/?${qs}` : '/'
}

// A sortable header: a link that sorts ascending by `sortKey`, or flips
// direction if `sortKey` is already the active sort column. Defined at
// module scope (not inside Home) — components created during render lose
// their identity every re-render.
function SortHeader({
  sortKey,
  label,
  sort,
  dir,
  q,
  status,
}: {
  sortKey: SortKey
  label: string
  sort: SortKey
  dir: 'asc' | 'desc'
  q: string
  status: string
}) {
  const nextDir: 'asc' | 'desc' = sort === sortKey && dir === 'asc' ? 'desc' : 'asc'
  const isActive = sort === sortKey
  return (
    <Link
      href={buildHref({ q, status, sort: sortKey, dir: nextDir, page: 1 })}
      className={`inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100 ${isActive ? 'text-gray-900 dark:text-gray-100' : ''}`}
    >
      {label}
      {isActive && <span aria-hidden>{dir === 'asc' ? '▲' : '▼'}</span>}
    </Link>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string; dir?: string; page?: string }>
}) {
  const { q = '', status = '', sort: sortParam, dir: dirParam, page: pageParam } = await searchParams
  const sort: SortKey = sortParam && isSortKey(sortParam) ? sortParam : DEFAULT_SORT
  const dir: 'asc' | 'desc' = dirParam === 'desc' ? 'desc' : 'asc'
  const page = Math.max(1, Number(pageParam) || 1)

  const supabase = await createClient()
  const sortConfig = SORT_COLUMNS[sort]
  let query = supabase
    .from('documents')
    .select('id, title, client, due_date, status, assignees(name)', { count: 'exact' })
    .order(sortConfig.column, {
      ascending: dir === 'asc',
      referencedTable: 'referencedTable' in sortConfig ? sortConfig.referencedTable : undefined,
    })

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
      <h1 className="mb-6 text-2xl font-bold">Documents</h1>

      <Filters defaultQ={q} defaultStatus={status} />

      {error && <p className="mb-4 text-red-500">Error: {error.message}</p>}

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">
                <SortHeader sortKey="title" label="Title" sort={sort} dir={dir} q={q} status={status} />
              </th>
              <th className="hidden px-4 py-3 sm:table-cell">
                <SortHeader sortKey="client" label="Client" sort={sort} dir={dir} q={q} status={status} />
              </th>
              <th className="px-4 py-3">
                <SortHeader sortKey="due_date" label="Due date" sort={sort} dir={dir} q={q} status={status} />
              </th>
              <th className="hidden px-4 py-3 md:table-cell">
                <SortHeader sortKey="assignee" label="Assignee" sort={sort} dir={dir} q={q} status={status} />
              </th>
              <th className="px-4 py-3">
                <SortHeader sortKey="status" label="Status" sort={sort} dir={dir} q={q} status={status} />
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {documents?.map((d) => (
              <DocumentRow
                key={d.id}
                href={`/documents/${d.id}/edit`}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
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
              </DocumentRow>
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
            <Link href={buildHref({ q, status, sort, dir, page: page - 1 })} className={buttonSecondaryClass}>
              Previous
            </Link>
          ) : (
            <span className={`${buttonSecondaryClass} pointer-events-none opacity-40`}>Previous</span>
          )}
          <span className="px-2">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={buildHref({ q, status, sort, dir, page: page + 1 })} className={buttonSecondaryClass}>
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
