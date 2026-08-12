import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
// Logout Server Action
async function logout() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
export default async function Home() {
  const supabase = await createClient()
  const { data: documents, error } = await supabase
    .from('documents')
    .select('id, title, client, due_date, status, assignees(name)')
    .order('due_date', { ascending: true })

  if (error) return <p className="p-8 text-red-500">Error: {error.message}</p>

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">書類管理 / Document management</h1>
        <form action={logout}>
          <button className="text-sm text-gray-600 underline">
            Cerrar sesión
          </button>
        </form>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">タイトル</th><th>顧客</th>
            <th>期限</th><th>担当者</th><th>状態</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}