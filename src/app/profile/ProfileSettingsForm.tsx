'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const COOLDOWN_DAYS = 30

export default function ProfileSettingsForm({
  userId,
  currentUsername,
  currentAvatarUrl,
  usernameChangedAt,
}: {
  userId: string
  currentUsername: string
  currentAvatarUrl?: string | null
  usernameChangedAt?: string | null
}) {
  const [username, setUsername] = useState(currentUsername)
  const [message, setMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Calculate whether the user is still in the cooldown period
  const daysSinceChange = usernameChangedAt
    ? Math.floor((Date.now() - new Date(usernameChangedAt).getTime()) / (1000 * 60 * 60 * 24))
    : COOLDOWN_DAYS
  const canChangeUsername = daysSinceChange >= COOLDOWN_DAYS
  const daysRemaining = COOLDOWN_DAYS - daysSinceChange

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!canChangeUsername) {
      setMessage(`You can change your username again in ${daysRemaining} day(s).`)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username: username.trim(),
        username_changed_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) {
      setMessage(error.code === '23505' ? 'That username is taken.' : `Error: ${error.message}`)
    } else {
      setMessage('Username updated!')
      router.refresh()
    }
  }

 const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setUploading(true)
  setMessage('')

  // Delete the old avatar file first, if one exists
  if (avatarUrl) {
    const oldPath = avatarUrl.split('/avatars/')[1]
    if (oldPath) {
      await supabase.storage.from('avatars').remove([oldPath])
    }
  }

  // Use a unique filename every time (timestamp) so the URL always changes
  const filePath = `${userId}/avatar-${Date.now()}.${file.name.split('.').pop()}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) {
    setMessage(`Upload error: ${uploadError.message}`)
    setUploading(false)
    return
  }

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', userId)

  setUploading(false)

  if (updateError) {
    setMessage(`Error: ${updateError.message}`)
  } else {
    setAvatarUrl(urlData.publicUrl)
    setMessage('Avatar updated!')
    router.refresh()
  }
}

  const handleAvatarDelete = async () => {
    if (!avatarUrl) return
    setMessage('')

    const filePath = avatarUrl.split('/avatars/')[1]

    await supabase.storage.from('avatars').remove([filePath])

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', userId)

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setAvatarUrl(null)
      setMessage('Avatar removed.')
      router.refresh()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
      {/* Avatar section */}
      <div>
        <h2>Avatar</h2>
        {avatarUrl ? (
          <div>
            <img src={avatarUrl} alt="Your avatar" width={100} height={100} style={{ borderRadius: '50%' }} />
            <div>
              <button onClick={handleAvatarDelete}>Remove Avatar</button>
            </div>
          </div>
        ) : (
          <p>No avatar set.</p>
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} disabled={uploading} />
        {uploading && <p>Uploading...</p>}
      </div>

      {/* Username section */}
      <div>
        <h2>Username</h2>
        <form onSubmit={handleUsernameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={20}
            disabled={!canChangeUsername}
          />
          <button type="submit" disabled={!canChangeUsername}>
            Save Username
          </button>
          {!canChangeUsername && (
            <p style={{ color: 'orange' }}>You can change your username again in {daysRemaining} day(s).</p>
          )}
        </form>
      </div>

      {message && <p>{message}</p>}
    </div>
  )
}