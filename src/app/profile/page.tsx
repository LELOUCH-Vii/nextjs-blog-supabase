import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileSettingsForm from './ProfileSettingsForm'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url, username_changed_at, xp, role, email')
    .eq('id', user.id)
    .single()

  return (
    <main style={{ padding: '2rem', maxWidth: '500px' }}>
      <h1>Profile Settings</h1>
      <p><strong>User ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {profile?.email}</p>
      <p><strong>Rank:</strong> {profile?.xp ?? 0} XP</p>
      <ProfileSettingsForm
        userId={user.id}
        currentUsername={profile?.username ?? ''}
        currentAvatarUrl={profile?.avatar_url}
        usernameChangedAt={profile?.username_changed_at}
      />
    </main>
  )
}