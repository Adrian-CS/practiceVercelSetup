import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function createDocument(formData: FormData) {
  'use server'
  const supabase = await createClient()
  await supabase.from('documents').insert({
    title: formData.get('title') as string,
    client: formData.get('client') as string,
    due_date: formData.get('due_date') as string,
    assignee_id: Number(formData.get('assignee_id')),
  })
  revalidatePath('/')
  redirect('/')
}

export default function Nuevo() {
  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">新規書類</h1>
      <form action={createDocument} className="space-y-3">
        <input name="title" placeholder="タイトル" required className="border p-2 w-full" />
        <input name="client" placeholder="顧客" className="border p-2 w-full" />
        <input name="due_date" type="date" required className="border p-2 w-full" />
        <input name="assignee_id" type="number" placeholder="担当者ID" className="border p-2 w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">保存</button>
      </form>
    </main>
  )
}