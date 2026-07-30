import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreatePostForm from './CreatePostForm'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}. You have admin access.</p>
      <CreatePostForm authorId={user.id} />
    </main>
  )
}