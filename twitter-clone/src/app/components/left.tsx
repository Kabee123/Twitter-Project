import { BiHomeCircle, BiUser } from 'react-icons/bi'
import { HiOutlineHashtag } from 'react-icons/hi'
import { BsBell, BsBookmark, BsTable, BsThreeDots, BsTwitter } from 'react-icons/bs'
import { HiEnvelope } from 'react-icons/hi2'
import Link from 'next/link';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase.types";
import { cookies, headers } from "next/headers";
import { db } from '@/lib/db';
import {
  profiles,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const NAV_ITEMS = [
  {
    title: "Twitter",
    icon: BsTwitter
  },
  {
    title: 'Home',
    icon: BiHomeCircle
  },
  {
    title: 'Explore',
    icon: HiOutlineHashtag
  },
  {
    title: 'Notifications',
    icon: BsBell
  },
  {
    title: 'Messages',
    icon: HiEnvelope
  },
  {
    title: 'Bookmarks',
    icon: BsBookmark
  },
  {
    title: 'Profile',
    icon: BiUser
  }
]


export const LeftSide = async () => {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const res = await db.select().from(profiles).where(eq(profiles.id, userData.user?.id as string));

  console.log(res);

  return (
    <section className="w-[23%] sticky top-0 xl:flex flex-col items-stretch h-screen hidden">
          <div className='flex flex-col items-stretch h-[89%] space-y-4 mt-4'>
            {NAV_ITEMS.map((item) => (
              <Link className="hover:bg-white/10 text-2xl transition duration-200 flex items-center justify-start w-fit space-x-4 rounded-3xl py-2 px-6"
                href={item.title === "Home" ? '/' : `/${item.title.toLowerCase()}`}
                key={item.title}>
                <div> <item.icon />
                </div>
                {item.title !== "Twitter" && <div>{item.title}</div>}
              </Link>
            ))}
            <button className="rounded-full m-4 bg-twitterColor p-4 text-2xl text-center hover:bg-opacity-70 transition duration-200">
              Tweet
            </button>
          </div>
          <button className="rounded-full flex items-center space-x-2 bg-transparent p-4 text-center w-full hover:bg-white/10 transition duration-200 justify-between">
            <div className='flex items-centre space-x-2'>
              <div className="rounded-full bg-slate-400 w-10 h-10"></div>
              <div className='text-sm text-left'>
                <div className='font-semibold'>{res[0].fullName}</div>
                <div className='text-xs'>@{res[0].username}</div>
              </div>
            </div>
            <div>
              <BsThreeDots />
            </div>
          </button>
        </section>
  )
}

export default LeftSide