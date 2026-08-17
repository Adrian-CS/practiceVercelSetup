'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

// Wraps a <tr> so double-clicking it opens the edit page — the one bit of
// this row that genuinely needs a browser event (dblclick isn't expressible
// as a plain <Link>/<form>). Single clicks on the row itself do nothing;
// clicks on the Edit link or Delete button inside it behave normally and
// don't trigger this (guarded via closest('a, button')).
export function DocumentRow({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  const router = useRouter()

  return (
    <tr
      className={className}
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).closest('a, button')) return
        router.push(href)
      }}
    >
      {children}
    </tr>
  )
}
