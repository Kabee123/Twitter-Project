"use server"
import { randomUUID } from "crypto";
import { supabaseServer } from ".";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import {
    Like,
    Profile,
    Tweet,
    likes,
    profiles,
    replies,
    tweets,
    tweetsReplies,
  } from "../db/schema";
  import { eq, ne, gt, gte, and } from "drizzle-orm";

export const likeTweet = async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
/*     await supabaseServer.from('likes').insert({
        id: randomUUID(),
        tweet_id: tweetId,
        user_id: userId,
    }) */

    await db.insert(likes).values ({
        tweetId,
        userId,
    }).catch(()=> {
        console.log ("something went wrong liking a tweet");
    })
    revalidatePath('');
};


export const unlikeTweet = async ({ tweetId, userId }: { tweetId: string, userId: string }) => {
    await db.delete(likes).where(
        and(eq(likes.tweetId, tweetId), eq(likes.userId, userId)))

    revalidatePath('');
};

export const reply = async ({
    tweetId,
    userId,
    replyText,
  }: {
    tweetId: string;
    userId: string;
    replyText: string;
  }) => {
  
    if (replyText === "") return;
  
    await db.insert(replies).values({
        text: replyText,
        userId,
        tweetId,
    });
  
    revalidatePath(`/tweet/[id]`);
  };