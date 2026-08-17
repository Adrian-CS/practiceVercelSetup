import Link from 'next/link'
import { logout } from './actions'
import { buttonSecondaryClass, linkClass } from '@/lib/ui'

// Server Component — no client JS needed, Log out is a plain <form> Server
// Action like everywhere else in the app.
export function Navbar({ userEmail }: { userEmail?: string }) {
  return (
    <header className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/" className="text-lg font-bold">
          📄 Document management
        </Link>
        {userEmail && (
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link href="/" className={linkClass}>Home</Link>
            <Link href="/new" className={linkClass}>New document</Link>
            <span className="text-gray-500 dark:text-gray-400">{userEmail}</span>
            <form action={logout}>
              <button className={buttonSecondaryClass}>Log out</button>
            </form>
          </nav>
        )}
      </div>
    </header>
  )
}
