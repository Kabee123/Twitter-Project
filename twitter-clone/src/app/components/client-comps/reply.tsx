"use client";
import { BsDot, BsChat, BsThreeDots } from 'react-icons/bs'
import React, { useState, useTransition, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "../ui/dialog"
import { reply } from '@/lib/supabase/mutations';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);
import { Tweet, Profile, replies } from '@/lib/db/schema'
import { useSupabase } from "../../api/supabase-provider"
import { toast } from "sonner";

type ReplyProps = {
    tweet: {
        userProfile: Profile,
        tweetInfo: Tweet,
    }
};


export const Reply = ({ tweet }: ReplyProps) => {
    const [rep, setrep] = useState<string>("");
    const { supabase } = useSupabase();
    let [isReplyPending, startTransition] = useTransition();
    const [DialogOpen, setDialogOpen] = useState(false);

    return (
        <Dialog onOpenChange={setDialogOpen} open={DialogOpen}>
            <DialogTrigger asChild>
                <button className="rounded-full flex items-center space-x-2 hover:bg-white/10 transition duration-200 p-3 cursor-pointer">
                    <BsChat />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-black sm:max-w-2xl border-none text-white">
                <div className="border-b-[0.5px] border-gray-600 p-2 flex space-x-4 w-full">
                    <div>
                        <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex items-center w-full justify-between">
                            <div className="flex items-center space-x-1 w-full">
                                <div className="font-bold">
                                    {tweet.userProfile.fullName ?? ""}
                                </div>
                                <div className="text-gray-500">
                                    @{tweet.userProfile.username}
                                </div>
                                <div className="text-gray-500">
                                    <BsDot />
                                </div>
                                <div className="text-gray-500">
                                    {dayjs(tweet.tweetInfo.createdAt).fromNow()}
                                </div>
                            </div>
                            <div>
                                <BsThreeDots />
                            </div>
                        </div>
                        <div className="text-white text-base w-full my-4 break-all">
                            {tweet.tweetInfo.text}
                        </div>
                    </div>
                </div>
                <div>Replying to @{tweet.userProfile.username}</div>
                <div className="flex w-full items-center space-x-2">
                    <div>
                        <div className="w-10 h-10 bg-slate-200 rounded-full" />
                    </div>
                    <textarea
                        value={rep}
                        onChange={(e) => setrep(e.target.value)}
                        className="w-full h-full text-xl placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-4 outline-none"
                    />
                </div>
                <div className="w-full justify-between items-center flex">
                    <div></div>
                    <div className="w-full max-w-[100px]">
                        <button
                            disabled={isReplyPending}
                            onClick={() => {
                                supabase.auth
                                    .getUser()
                                    .then((res) => {
                                        if (res.data && res.data.user) {
                                            const user = res.data.user;
                                            startTransition(() => {
                                                reply({
                                                    replyText: rep,
                                                    tweetId: tweet.tweetInfo.id,
                                                    userId: user.id,
                                                }).then(() =>
                                                    setDialogOpen(false));
                                            });
                                        } else {
                                            toast("please login to reply to a tweet");
                                        }
                                    })
                                    .catch(() => {
                                        toast.error("authentication failed");
                                    });
                            }}
                            className="rounded-full bg-twitterColor px-4 py-2 w-full text-lg text-center hover:bg-opacity-70 transition duration-200 font-bold"
                        >
                            Reply
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
