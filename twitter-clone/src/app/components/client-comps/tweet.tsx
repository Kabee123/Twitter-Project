"use client"

import React from 'react'
import { BsDot, BsThreeDots } from 'react-icons/bs'
import { AiOutlineRetweet, AiOutlineHeart } from 'react-icons/ai'
import { IoStatsChart, IoShareOutline } from 'react-icons/io5'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);
import { LikeButton } from './like-button'
import { Tweet, Profile } from '@/lib/db/schema'
import { Reply } from "./reply"
import { useRouter } from 'next/navigation'

type TweetProps = {
    tweet: {
        userProfile: Profile,
        tweetInfo: Tweet,
    }
    uId?: string;
    hasLiked: Boolean;
    likes: number;
    currentUserId?: string;
};



export const TweetOutput = ({ tweet, uId, hasLiked, likes }: TweetProps) => {

    const router = useRouter();

    return (
        <>
            <div
                className='border-b-[0.5px] px-4 py-4 flex space-x-4 border-gray-600 w-full '>
                <div>
                    <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex items-center w-full justify-between'>
                        <div className='flex items-center space-x-1 w-full'>
                            <div className='font-bold'>{tweet.userProfile.fullName ?? ""}</div>
                            <div className='text-gray-500'>@{tweet.userProfile.username}</div>
                            <div className='text-gray-500'><BsDot /></div>
                            <div className='text-gray-500'>{dayjs(tweet.tweetInfo.createdAt).fromNow()}</div>
                        </div>
                        <div> <BsThreeDots /> </div>
                    </div>
                    <div onClick={() => {
                        router.push(`/tweet/${tweet.tweetInfo.id}`);
                    }} className='text-white text-base break-all hover:bg-white/10 transition-all cursor-pointer '>
                        {tweet.tweetInfo.text}
                    </div>
                    <div
                        className='bg-slate-400 aspect-square w-full h-80 rounded-xl mt-2'>
                    </div>
                    <div className='flex items-center justify-start space-x-20 mt-2 w-full'>
                        <Reply tweet={tweet} />
                        <div className='rounded-full hover:bg-white/10 transition duration-200 cursor-pointer p-3'><AiOutlineRetweet /></div>
                        <LikeButton tweetId={tweet.tweetInfo.id} likesCount={likes} isUserHasLiked={hasLiked} />
                        <div className='rounded-full hover:bg-white/10 transition duration-200 cursor-pointer p-3'><IoStatsChart /></div>
                        <div className='rounded-full hover:bg-white/10 transition duration-200 cursor-pointer p-3'><IoShareOutline /></div>
                    </div>
                </div>
            </div>
        </>
    );
}
