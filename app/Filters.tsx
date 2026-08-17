'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { buttonSecondaryClass, inputClass, labelClass, STATUSES } from '@/lib/ui'

const DEBOUNCE_MS = 350

export function Filters({ defaultQ, defaultStatus }: { defaultQ: string; defaultStatus: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(defaultQ)
  const [status, setStatus] = useState(defaultStatus)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep local state in sync when the URL changes from elsewhere (browser
  // back/forward, a shared link with ?q=... already set). Adjusted directly
  // during render — rather than in an effect — per React's guidance for
  // deriving state from a changed prop: https://react.dev/learn/you-might-not-need-an-effect
  const [prevDefaultQ, setPrevDefaultQ] = useState(defaultQ)
  if (defaultQ !== prevDefaultQ) {
    setPrevDefaultQ(defaultQ)
    setQ(defaultQ)
  }
  const [prevDefaultStatus, setPrevDefaultStatus] = useState(defaultStatus)
  if (defaultStatus !== prevDefaultStatus) {
    setPrevDefaultStatus(defaultStatus)
    setStatus(defaultStatus)
  }

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  function navigate(nextQ: string, nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextQ) params.set('q', nextQ); else params.delete('q')
    if (nextStatus) params.set('status', nextStatus); else params.delete('status')
    params.delete('page') // any filter change goes back to page 1
    startTransition(() => {
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname)
    })
  }

  function handleQChange(value: string) {
    setQ(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate(value, status), DEBOUNCE_MS)
  }

  function handleStatusChange(value: string) {
    setStatus(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    navigate(q, value)
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setQ('')
    setStatus('')
    navigate('', '')
  }

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="q" className={labelClass}>Search</label>
        <div className="relative">
          <input
            id="q"
            value={q}
            onChange={(e) => handleQChange(e.target.value)}
            placeholder="Search title, client, status or assignee…"
            className={inputClass}
          />
          {isPending && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              Searching…
            </span>
          )}
        </div>
      </div>
      <div className="sm:w-48">
        <label htmlFor="status" className={labelClass}>Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={inputClass}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
      {(q || status) && (
        <button type="button" onClick={handleClear} className={buttonSecondaryClass}>
          Clear
        </button>
      )}
    </div>
  )
}
