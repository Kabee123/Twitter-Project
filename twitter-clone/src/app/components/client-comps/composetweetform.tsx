"use client"

import { PostgrestError } from "@supabase/supabase-js";
import React, { useRef } from "react";
import { toast } from "sonner";

type ComposeTweetFormProps = {
  serverAction: any;
};

const MakeTweetForm = ({ serverAction }: ComposeTweetFormProps) => {

  const resetRef = useRef<HTMLButtonElement>(null);

  const handleSubmitTweet = async (data: any) => {

    try {
      const res = await serverAction(data);
      if (res?.error) {
        return toast.error(res.error.message);
      }
      toast.success("Tweet sent successfully");
      resetRef.current?.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form action={handleSubmitTweet} className="flex flex-col w-full h-full">
      <textarea
        name="tweet"
        className="w-full h-full text-xl text-balance placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-4 outline-none border-none flex-col"
        placeholder="What's happening?"
      />
      <div className="w-full justify-between items-center flex">
        <div></div>
        <div className="w-full max-w-[100px]">
          <button
            type="submit"
            className="rounded-full bg-twitterColor px-4 py-2 w-full text-lg text-center hover:bg-opacity-70 transition duration-200 font-bold"
          >
            Tweet
          </button>
          <button ref={resetRef} className="inivisible" type="reset"></button>
        </div>
      </div>
    </form>
  );
};

export default MakeTweetForm;