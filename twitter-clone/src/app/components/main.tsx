import React from 'react'
import ComposeTweet from "./server-comps/maketweet"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getTweets } from '@/lib/supabase/queries'
import { Tweet } from './client-comps/tweet'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase.types";
import { cookies, headers } from "next/headers";



dayjs.extend(relativeTime);



export const Main = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore }); 
  const {data: userData, error: userError} = await supabase.auth.getUser();

  const res = await getTweets();
  return (
    <main className="flex w-full h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] border-gray-600">
      <h1 className="text-xl font-bold p-6 sticky top-0 bg-black/10 backdrop-blur">Home</h1>
      <div className='border-t-[0.5px] px-4 border-b-[0.5px] border-gray-600 flex py-4 relative items-stretch space-x-2'>
        <div className='w-10 h-10 bg-slate-400 rounded-full flex-none'></div>
        <ComposeTweet />

        {/*  <div className='flex flex-col w-full'>
        <div className='flex flex-col'>
          <input className='w-full h-full bg-transparent outline-none border-none p-4 placeholder:text-2xl placeholder:text-gray-600'
            type='text'
            placeholder="What's happening?"></input>
        </div>
        <div className='w-full justify-between items-center flex'>
          <div></div>
          <div className='w-full max-w-[100px]'>
            <button className=" ml-[20px] rounded-full bg-tblue px-4 py-2 font-bold text-center hover:bg-opacity-70 transition duration-200">
              Tweet </button>
          </div>
        </div>
      </div> */}
      </div>
      <div className='flex flex-col'>
        {
          res?.data && res.data.map((tweet) => (
            <Tweet key ={tweet.id} tweet={tweet} uId ={userData.user.id}/>
          ))
        }
      </div>
    </main>
  )
}

export default Main