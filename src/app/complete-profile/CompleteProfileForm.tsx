'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CompleteProfileForm({ userId }: { userId: string }) {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        username: username.trim(),
        username_changed_at: new Date().toISOString(),
      })
      .eq('id', userId)

    setLoading(false)

    if (error) {
      if (error.code === '23505') {
        setMessage('That username is already taken. Try another.')
      } else {
        setMessage(`Error: ${error.message}`)
      }
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Choose a username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        minLength={3}
        maxLength={20}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Username'}
      </button>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </form>
  )
}