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

// Follow/Unfollow functions
export async function followUser(followerId: string, followingId: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId })
  
  if (error) throw error
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
  
  if (error) throw error
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()
  
  return !!data
}

export async function getFollowersCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)
  
  return count || 0
}

export async function getFollowingCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)
  
  return count || 0
}