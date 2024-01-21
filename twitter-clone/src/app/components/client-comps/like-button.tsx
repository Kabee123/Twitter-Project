"use client"
import React, { startTransition, useTransition, useState } from 'react'
import { createPagesBrowserClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { likeTweet, unlikeTweet } from '@/lib/supabase/mutations'
import { toast } from "sonner";
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from 'react-icons/ai'


type LikeButtonProps = {
    tweetId: string;
    likesCount: number | null;
    isUserHasLiked: boolean;
};

export const LikeButton = ({
    tweetId,
    likesCount,
    isUserHasLiked,
}: LikeButtonProps) => {

    const [supabaseClient] = useState(() => createPagesBrowserClient());
    let [isLikePending, startTransition] = useTransition();

    return (
        <button onClick={() => {
            console.log("click");
            supabaseClient.auth.getUser().then((res) => {
                if (res.data && res.data.user) {
                    console.log("found user");

                    const u = res.data.user;
                    console.log(u.id);
                    startTransition(() =>
                        isUserHasLiked ? unlikeTweet({ tweetId: tweetId, userId: u.id })
                            : likeTweet({
                                tweetId,
                                userId: u.id,
                            })
                    );
                } else {
                    toast("pelase login to like a tweet")
                }
            })
                .catch(() => {
                    toast.error("authentication f")
                })
        }}
            className='rounded-full hover:bg-white/10 flex items-center space-x-5 transition duration-200 cursor-pointer p-3'>
            {isUserHasLiked ? (
                <AiFillHeart className="w-5 h-5 text-red-600" />
            ) : (
                <AiOutlineHeart className="w-5 h-5" />
            )}
            <span>{likesCount}</span></button>
    )
}
