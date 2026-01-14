import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Clip {
  id: string
  author: string
  content: string
  video_url?: string
  likes: number
  created_at: string
}

export async function fetchClips(): Promise<Clip[]> {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function addClip(author: string, content: string, videoUrl?: string): Promise<Clip> {
  const { data, error } = await supabase
    .from('clips')
    .insert({ author, content, video_url: videoUrl, likes: 0 })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function uploadVideo(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(fileName)
  
  return publicUrl
}

export async function likeClip(id: string, currentLikes: number): Promise<void> {
  const { error } = await supabase
    .from('clips')
    .update({ likes: currentLikes + 1 })
    .eq('id', id)
  
  if (error) throw error
}