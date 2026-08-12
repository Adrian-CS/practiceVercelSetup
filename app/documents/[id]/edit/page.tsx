import { createClient } from '@/lib/supabase/server'
import { updateDocument } from '@/app/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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
    <main className="max-w-md mx-auto p-8">
      <Link href="/" className="text-blue-600">← Back</Link>
      <h1 className="text-xl font-bold my-4">Edit document</h1>
      <form action={updateDocument} className="space-y-3">
        <input type="hidden" name="id" value={doc.id} />
        <input name="title" defaultValue={doc.title} required className="border p-2 w-full" />
        <input name="client" defaultValue={doc.client ?? ''} className="border p-2 w-full" />
        <input name="due_date" type="date" defaultValue={doc.due_date} required className="border p-2 w-full" />
        <select name="status" defaultValue={doc.status} className="border p-2 w-full">
          <option value="pending">pending</option>
          <option value="in_progress">in_progress</option>
          <option value="completed">completed</option>
        </select>
        <input name="assignee_id" type="number" defaultValue={doc.assignee_id ?? ''} className="border p-2 w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
      </form>
    </main>
  )
}