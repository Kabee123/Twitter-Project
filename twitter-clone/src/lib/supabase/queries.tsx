"use server"
import { Database } from '@/lib/supabase.types'
import { supabaseServer } from ".";
import { db } from "../db";
import {
  Like,
  Profile,
  Tweet,
  likes,
  profiles,
  tweets,
  tweetsReplies,
} from "../db/schema";
import { and, desc, eq, exists, OrderByOperators } from "drizzle-orm";

export type TweetType = Database['public']['Tables']['tweets']['Row'] & { profiles: Pick<Database['public']['Tables']['profiles']['Row'], 'full_name' | 'username'>; };

export const getTweets = async ({
  currentUserID,
  singleTweet,
  limit,
  orderBy,
  replyId,
  profileUsername,
}: {
  currentUserID?: string;
  singleTweet?: string;
  orderBy?: boolean;
  limit?: number;
  replyId?: string;
  profileUsername?: string;
}) => {


  /*     const res = await db.query.tweets.findMany({
        with: {
          profile: {
            columns: {
              username:true,
              fullName:true,
            }
          },
        }
      })
    } */


  let q = db.select({
    ...(currentUserID ? {
      hasLiked: exists(
        db
          .select()
          .from(likes)
          .where(
            and(
              eq(likes.tweetId, tweets.id),
              eq(likes.userId, currentUserID)
            )
          )
      ),
    }
      : {}), tweets, likes, profiles,
  }).from(tweets).
    leftJoin(likes, eq(tweets.id, likes.tweetId))
    .innerJoin(profiles, eq(tweets.profileId, profiles.id))
    .orderBy(desc(tweets.createdAt))
    .limit(10)

  if (singleTweet) {
    q = q.where(eq(tweets.id, singleTweet));
  }



  const rows = await q;

  if (rows) {
    const result = rows.reduce<
      Record<
        string,
        {
          tweet: Tweet;
          likes: Like[];
          profile: Profile;
          hasLiked: Boolean;
        }
      >
    >((acc, row) => {
      const tweet = row.tweets;
      const like = row.likes;
      const profile = row.profiles;
      const hasLiked = Boolean(row.hasLiked);
      //console.log(row.hasLiked);

      if (!acc[tweet.id]) {
        acc[tweet.id] = {
          tweet,
          likes: [],
          profile,
          hasLiked
        };
      }

      if (like) {
        acc[tweet.id].likes.push(like);
      }
      //console.log(acc);
      return acc;
    }, {});
    const data = Object.values(result);
/*    // console.log(data); */
    return data;
  }

};


export const getLikes = async (tweetId: string) => {
  const res = await supabaseServer.from('likes').select('id', { count: 'exact' }).eq('tweet_id', tweetId);
  // console.log(res);
  return res;
};


export const userLiked = async ({ tweetId, userId }: { tweetId: string, userId?: string }) => {
  if (!userId) return false;
  const { data, error } = await supabaseServer.from('likes').select("id").eq("tweet_id", tweetId).eq("user_id", userId).single()
  return Boolean(data?.id);
};