import { createDocument } from '../actions'
import Link from 'next/link'
import { buttonPrimaryClass, inputClass, labelClass, linkClass } from '@/lib/ui'

export default function NewDocument() {
  return (
    <main className="mx-auto max-w-md p-4 sm:p-8">
      <Link href="/" className={`text-sm ${linkClass}`}>← Back</Link>
      <h1 className="my-4 text-xl font-bold">New document</h1>
      <form action={createDocument} className="space-y-4">
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="client" className={labelClass}>Client</label>
          <input id="client" name="client" className={inputClass} />
        </div>
        <div>
          <label htmlFor="due_date" className={labelClass}>Due date</label>
          <input id="due_date" name="due_date" type="date" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="assignee_id" className={labelClass}>Assignee ID</label>
          <input id="assignee_id" name="assignee_id" type="number" className={inputClass} />
        </div>
        <button className={`${buttonPrimaryClass} w-full`}>Save</button>
      </form>
    </main>
  )
}
