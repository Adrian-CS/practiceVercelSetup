import { createClient } from '@/lib/supabase/server'
import { deleteDocument, logout } from './actions'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: documents } = await supabase
    .from('documents')
    .select('id, title, client, due_date, status, assignees(name)')
    .order('due_date', { ascending: true })

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Document management</h1>
        <div className="flex gap-2">
          <Link href="/new" className="bg-blue-600 text-white px-3 py-1 rounded">New document</Link>
          <form action={logout}><button className="border px-3 py-1 rounded">Log out</button></form>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Title</th><th>Client</th><th>Due date</th>
            <th>Assignee</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {documents?.map((d) => (
            <tr key={d.id} className="border-b">
              <td className="py-2">{d.title}</td>
              <td>{d.client}</td>
              <td>{d.due_date}</td>
              <td>{d.assignees?.name}</td>
              <td>{d.status}</td>
              <td className="flex gap-3 py-2">
                <Link href={`/documents/${d.id}/edit`} className="text-blue-600">Edit</Link>
                <form action={deleteDocument}>
                  <input type="hidden" name="id" value={d.id} />
                  <button className="text-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}