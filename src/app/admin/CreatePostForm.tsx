'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreatePostForm({ authorId }: { authorId: string }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const slug = generateSlug(title)

    const { error } = await supabase.from('posts').insert({
      title,
      slug,
      content,
      author_id: authorId,
      published,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Post created successfully!')
      setTitle('')
      setContent('')
      setPublished(false)
      router.refresh()
    }
  }

  return (
    <div style={{ marginTop: '2rem', maxWidth: '500px' }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your post content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          {' '}Publish immediately
        </label>
        <button type="submit">Create Post</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}