"use server"
import { Database } from '@/lib/supabase.types'
import { supabaseServer } from ".";

export type TweetType = Database['public']['Tables']['tweets']['Row'] & { profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'full_name' | 'username'>; };

export const getTweets = async () => {  
  return await supabaseServer.from("tweets").select('*, profiles(full_name, username)').returns<TweetType[]>();
};


export const getLikes = async(tweetId:string) => {
  const res = await supabaseServer.from('likes').select('id', {count: 'exact' }).eq('tweet_id', tweetId);
  console.log(res);
  return res;
};


export const userLiked = async({tweetId, userId}:{tweetId:string, userId?:string}) => {
  if(!userId) return false;
  const {data, error} = await supabaseServer.from('likes').select("id").eq("tweet_id", tweetId).eq("user_id", userId).single()
  return Boolean(data?.id);
};