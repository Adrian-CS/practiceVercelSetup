import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: documentos, error } = await supabase
    .from('documentos')
    .select('id, titulo, cliente, fecha_limite, estado, responsables(nombre)')
    .order('fecha_limite', { ascending: true })

  if (error) return <p className="p-8 text-red-500">Error: {error.message}</p>

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">書類管理 / Document management</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">タイトル</th><th>顧客</th>
            <th>期限</th><th>担当者</th><th>状態</th>
          </tr>
        </thead>
        <tbody>
          {documentos?.map((d) => (
            <tr key={d.id} className="border-b">
              <td className="py-2">{d.titulo}</td>
              <td>{d.cliente}</td>
              <td>{d.fecha_limite}</td>
              <td>{d.responsables?.nombre}</td>
              <td>{d.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}