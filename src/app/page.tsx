import { createClient } from '@/lib/supabase/client'

export default async function Home() {
  const supabase = createClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Supabase Connection Test</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      ) : (
        <div>
          <p>✅ Connected successfully!</p>
          <p>Posts found: {posts?.length ?? 0}</p>
          <pre>{JSON.stringify(posts, null, 2)}</pre>
        </div>
      )}
    </main>
  )
}