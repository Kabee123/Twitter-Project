"use server"

import React, { startTransition, useTransition, useState } from 'react'
import { BsDot, BsChat, BsThreeDots } from 'react-icons/bs'
import { AiOutlineRetweet, AiOutlineHeart } from 'react-icons/ai'
import { IoStatsChart, IoShareOutline } from 'react-icons/io5'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);
import { LikeButton } from './like-button'
import { TweetType, getLikes, userLiked } from '@/lib/supabase/queries'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase.types";
import { cookies, headers } from "next/headers";


type TweetProps = {
    tweet: TweetType;
    uId?: string;
};



export const Tweet = async ({ tweet, uId }: TweetProps) => {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore }); 
    const {data: userData, error: userError} = await supabase.auth.getUser();


    const getTweetLikes = await getLikes(tweet.id);
    const userHasLiked = await userLiked({tweetId:tweet.id, userId:uId});



    return (
         <div
            className='border-b-[0.5px] px-4 py-4 flex space-x-4 border-gray-600'>
            <div>
                <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
            </div>
            <div className='flex flex-col'>
                <div className='flex items-center w-full justify-between'>
                    <div className='flex items-center space-x-1'>
                        <div className='font-bold'>{tweet.profiles.full_name ?? ""}</div>
                        <div className='text-gray-500'>@{tweet.profiles.username}</div>
                        <div className='text-gray-500'><BsDot /></div>
                        <div className='text-gray-500'>{dayjs(tweet.created_at).fromNow()}</div>
                    </div>
                    <div> <BsThreeDots /> </div>
                </div>
                <div className='text-white text-base'>
                    {tweet.text}
                </div>
                <div
                    className='bg-slate-400 aspect-square w-full h-80 rounded-xl mt-2'>
                </div>
                <div className='flex items-center justify-start space-x-20 mt-2 w-full'>
                    <div className='rounded-full hover:bg-white/10 transition duration-200 cursor-pointer p-3'><BsChat /></div>
                    <div className='rounded-full hover:bg-white/10 transition duration-200 cursor-pointer p-3'><AiOutlineRetweet /></div>
                    <LikeButton tweetId={tweet.id} likesCount={getTweetLikes.count} isUserHasLiked={userHasLiked}/>
                    <div className='rounded-full hover:bg-white/10 transition duration-200 cursor-pointer p-3'><IoStatsChart /></div>
                    <div className='rounded-full hover:bg-white/10 transition duration-200 cursor-pointer p-3'><IoShareOutline /></div>
                </div>
            </div>
        </div> 
    );
}
