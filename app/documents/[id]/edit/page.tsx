import { createClient } from '@/lib/supabase/server'
import { updateDocument } from '@/app/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buttonPrimaryClass, inputClass, labelClass, linkClass, STATUSES } from '@/lib/ui'

export default async function EditDocument({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: doc } = await supabase
    .from('documents')
    .select('id, title, client, due_date, status, assignee_id')
    .eq('id', Number(id))
    .single()

  if (!doc) notFound()

  return (
    <main className="mx-auto max-w-md p-4 sm:p-8">
      <Link href="/" className={`text-sm ${linkClass}`}>← Back</Link>
      <h1 className="my-4 text-xl font-bold">Edit document</h1>
      <form action={updateDocument} className="space-y-4">
        <input type="hidden" name="id" value={doc.id} />
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" name="title" defaultValue={doc.title} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="client" className={labelClass}>Client</label>
          <input id="client" name="client" defaultValue={doc.client ?? ''} className={inputClass} />
        </div>
        <div>
          <label htmlFor="due_date" className={labelClass}>Due date</label>
          <input
            id="due_date"
            name="due_date"
            type="date"
            defaultValue={doc.due_date}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="status" className={labelClass}>Status</label>
          <select id="status" name="status" defaultValue={doc.status} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="assignee_id" className={labelClass}>Assignee ID</label>
          <input
            id="assignee_id"
            name="assignee_id"
            type="number"
            defaultValue={doc.assignee_id ?? ''}
            className={inputClass}
          />
        </div>
        <button className={`${buttonPrimaryClass} w-full`}>Update</button>
      </form>
    </main>
  )
}
