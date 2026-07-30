import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CompleteProfileForm from './CompleteProfileForm'

export default async function CompleteProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  // Already has a username — nothing to do here, send them home
  if (profile?.username) {
    redirect('/')
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '400px' }}>
      <h1>Choose Your Username</h1>
      <p>Pick a unique username. You&apos;ll be able to change it later, but only once every 30 days.</p>
      <CompleteProfileForm userId={user.id} />
    </main>
  )
}