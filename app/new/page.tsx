import { createDocument } from '../actions'
import Link from 'next/link'

export default function NewDocument() {
  return (
    <main className="max-w-md mx-auto p-8">
      <Link href="/" className="text-blue-600">← Back</Link>
      <h1 className="text-xl font-bold my-4">New document</h1>
      <form action={createDocument} className="space-y-3">
        <input name="title" placeholder="Title" required className="border p-2 w-full" />
        <input name="client" placeholder="Client" className="border p-2 w-full" />
        <input name="due_date" type="date" required className="border p-2 w-full" />
        <input name="assignee_id" type="number" placeholder="Assignee ID" className="border p-2 w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </main>
  )
}