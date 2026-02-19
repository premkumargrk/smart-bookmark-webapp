'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState<any[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)

       if(data.session){
      console.log(data.session.user);
    }
    })

   
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)

        if (session){
          console.log(session.user);
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // useEffect(() => {
  //   if (session) {
  //     fetchBookmarks()
  //   }
  // }, [session])

  useEffect(() => {
  if (!session) return

  fetchBookmarks()

  const channel = supabase
    .channel('bookmarks-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
      },
      () => {
        fetchBookmarks()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [session])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setBookmarks(data)
  }

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: session.user.id,
      },
    ])

    setTitle('')
    setUrl('')
    fetchBookmarks()
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    fetchBookmarks()
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }
  if (!session) {
    return (
      // <div className="flex items-center justify-center min-h-screen">
      //   <button
      //     onClick={signInWithGoogle}
      //     className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      //   >
      //     Sign in with Google
      //   </button>
      // </div>

       <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center px-4">
      
      <h1 className="text-4xl font-bold mb-4">
        Smart Bookmark App
      </h1>

      <p className="text-gray-400 mb-8">
        Save and manage your bookmarks securely in real-time
      </p>

      <button
        onClick={signInWithGoogle}
        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-lg font-medium"
      >
        Sign in with Google
      </button>

    </div>
    )
  }
  return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={session.user.user_metadata.avatar_url}
            alt="avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold text-black">
              {session.user.user_metadata.full_name}
            </h2>
            <p className="text-sm text-black">
              {session.user.email}
            </p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-black">My Bookmarks</h1>

      {/* Form */}
      <div className="flex flex-col gap-3 mb-6 text-gray-700">
        <input
          type="text"
          placeholder="Bookmark Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="https://bookmark-url.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addBookmark}
          className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Add Bookmark
        </button>
      </div>

      {/* Bookmark List */}
      <div className="flex flex-col gap-4 text-black">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold text-lg">{bookmark.title}</p>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-blue-600 text-sm break-all"
              >
                {bookmark.url}
              </a>
            </div>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  </div>
)
 
}
