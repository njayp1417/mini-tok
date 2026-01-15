import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
  }
})

export interface Clip {
  id: string
  author: string
  content: string
  video_url?: string
  likes: number
  created_at: string
  user_id?: string
}

export interface Profile {
  id: string
  username: string
  avatar_url?: string
  bio?: string
  created_at: string
}

export interface UserStats {
  id: string
  following_count: number
  followers_count: number
  likes_count: number
}

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) return null
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  
  if (error) throw error
}

// User stats (optimized with view)
export async function getUserStats(userId: string): Promise<UserStats> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    return { id: userId, following_count: 0, followers_count: 0, likes_count: 0 }
  }
  return data
}

export async function fetchClips(): Promise<Clip[]> {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function addClip(author: string, content: string, videoUrl?: string, userId?: string): Promise<Clip> {
  const { data, error } = await supabase
    .from('clips')
    .insert({ author, content, video_url: videoUrl, likes: 0, user_id: userId })
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

// Like functions with user tracking
export async function likeClip(clipId: string, userId: string): Promise<void> {
  // Add to user_likes table
  const { error: likeError } = await supabase
    .from('user_likes')
    .insert({ user_id: userId, clip_id: clipId })
  
  if (likeError) throw likeError
  
  // Increment clip likes count
  const { data: clip } = await supabase
    .from('clips')
    .select('likes')
    .eq('id', clipId)
    .single()
  
  if (clip) {
    await supabase
      .from('clips')
      .update({ likes: clip.likes + 1 })
      .eq('id', clipId)
  }
}

export async function unlikeClip(clipId: string, userId: string): Promise<void> {
  // Remove from user_likes table
  const { error: unlikeError } = await supabase
    .from('user_likes')
    .delete()
    .eq('user_id', userId)
    .eq('clip_id', clipId)
  
  if (unlikeError) throw unlikeError
  
  // Decrement clip likes count
  const { data: clip } = await supabase
    .from('clips')
    .select('likes')
    .eq('id', clipId)
    .single()
  
  if (clip && clip.likes > 0) {
    await supabase
      .from('clips')
      .update({ likes: clip.likes - 1 })
      .eq('id', clipId)
  }
}

export async function hasUserLiked(clipId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_likes')
    .select('*')
    .eq('user_id', userId)
    .eq('clip_id', clipId)
    .single()
  
  return !!data
}

// Follow/Unfollow functions (optimistic UI ready)
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
  const { data } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()
  
  return !!data
}

export async function getFollowersCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)
  
  return count || 0
}

export async function getFollowingCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)
  
  return count || 0
}