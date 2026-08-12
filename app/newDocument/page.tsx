import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function crearDocumento(formData: FormData) {
  'use server'
  const supabase = await createClient()
  await supabase.from('documentos').insert({
    titulo: formData.get('titulo') as string,
    cliente: formData.get('cliente') as string,
    fecha_limite: formData.get('fecha_limite') as string,
    responsable_id: Number(formData.get('responsable_id')),
  })
  revalidatePath('/')
  redirect('/')
}

export default function Nuevo() {
  return (
    <main className="max-w-md mx-auto p-8">
      <h1 className="text-xl font-bold mb-4">新規書類</h1>
      <form action={crearDocumento} className="space-y-3">
        <input name="titulo" placeholder="タイトル" required className="border p-2 w-full" />
        <input name="cliente" placeholder="顧客" className="border p-2 w-full" />
        <input name="fecha_limite" type="date" required className="border p-2 w-full" />
        <input name="responsable_id" type="number" placeholder="担当者ID" className="border p-2 w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">保存</button>
      </form>
    </main>
  )
}