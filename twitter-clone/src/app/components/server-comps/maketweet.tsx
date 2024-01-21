import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import { randomUUID } from "crypto";
import { SupabaseClient } from "@supabase/supabase-js";

import { revalidatePath } from "next/cache";
import MakeTweetForm from "../client-comps/composetweetform";
import type { Database } from "@/lib/supabase.types";
import { useRouter } from "next/router";

const ComposeTweet = () => {
  async function submitTweet(formData: FormData) {
    "use server";

    const tweet = formData.get("tweet");
    console.log("yes");

    if (!tweet) return;

    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore }); 

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey)
      return { error: { message: "supabase credentials are not provided!" } };

    const supabaseServer = new SupabaseClient(supabaseUrl, supabaseSecretKey);

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    console.log(userData);

    if (userError) return;

    const { data, error } = await supabaseServer.from("tweets").insert({
      profile_id: userData.user.id,
      text: tweet.toString(),
      id: randomUUID(),
    });

    revalidatePath('')
  }

  /*     return (
          <form  action={submitTweet} className="flex flex-col w-full h-full">
          <input
            type="text"
            name="tweet"
            className="w-full h-full text-2xl placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-4 outline-none border-none"
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
              <button className="invisible" type="reset"></button>
            </div>
          </div>
        </form>
      ) */
  return <MakeTweetForm serverAction={submitTweet} />;
};

export default ComposeTweet;