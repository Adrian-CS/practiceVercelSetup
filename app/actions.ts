'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDocument(formData: FormData) {
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

export async function updateDocument(formData: FormData) {
  const supabase = await createClient()
  const id = Number(formData.get('id'))
  await supabase.from('documents').update({
    title: formData.get('title') as string,
    client: formData.get('client') as string,
    due_date: formData.get('due_date') as string,
    status: formData.get('status') as string,
    assignee_id: Number(formData.get('assignee_id')),
  }).eq('id', id)
  revalidatePath('/')
  redirect('/')
}

export async function deleteDocument(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('documents').delete().eq('id', Number(formData.get('id')))
  revalidatePath('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}