import React from 'react'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { getTweets } from '@/lib/supabase/queries'
import { db } from "@/lib/db"
import { tweets, likes, profiles, replies } from "@/lib/db/schema"
import { and, desc, eq, exists } from "drizzle-orm";
import { TweetOutput } from '@/app/components/client-comps/tweet';
import { BsDot, BsChat, BsThreeDots } from 'react-icons/bs'

export const TweetPage = async ({ params }: { params: { id: string } }) => {

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const tweet = await getTweets({ currentUserID: userData.user?.id, singleTweet: params.id });

    const reply = await db.query.replies.findMany({
        with: {
            profile: true
        },
        where: eq(replies.tweetId, params.id)
    });

   console.log(tweet);


    /*     const tweet = await db.select().from(tweets); */
    /*    const tweet = await db.select({
            tweets,
            profiles,
            ...(userData.user?.id ? {
                hasLiked: exists(
                    db
                        .select()
                        .from(likes)
                        .where(
                            and(
                                eq(likes.tweetId, tweets.id),
                                eq(likes.userId, userData.user.id)
                            )
                        )
                ),
            }
                : {}), likes,
        }).from(tweets)
            .where(eq(tweets.id, params.id))
            .leftJoin(likes, eq(tweets.id, likes.tweetId))
            .innerJoin(profiles, eq(tweets.profileId, profiles.id));
            console.log(tweet); 
     */


    /*     const tweet = await getTweets({
            currentUserID: userData.user?.id,
            getSingleTweetId: params.id,
        });
     */


    return (
        <main className="flex w-full h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
            {tweet ? <TweetOutput hasLiked={tweet[0].hasLiked} tweet={{ tweetInfo: tweet[0].tweet, userProfile: tweet[0]?.profile }} likes={tweet[0].likes.length ?? 0} currentUserId={userData.user?.id} /> : <div> No Tweet Found </div>}
            {reply.map((reply) => (
                <div key={reply.id}
                    className='border-b-[0.5px] px-4 py-4 flex space-x-4 border-gray-600 w-full '>
                    <div>
                        <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
                    </div>
                    <div className='flex flex-col w-full'>
                        <div className='flex items-center w-full justify-between'>
                            <div className='flex items-center space-x-1 w-full'>
                                <div className='font-bold'>{reply.profile.fullName ?? ""}</div>
                                <div className='text-gray-500'>@{reply.profile.username}</div>
                                <div className='text-gray-500'><BsDot /></div>
                            </div>
                            <div> <BsThreeDots /> </div>
                        </div>
                        <div className='text-white text-base break-all transition-all'>
                            {reply.text}
                        </div>
                    </div>
                </div>
            ))}
        </main >
    )
}

export default TweetPage