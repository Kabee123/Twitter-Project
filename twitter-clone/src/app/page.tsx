import LeftSide from './components/left';
import Main from './components/main'
import Right from './components/right'
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState } from "react";

export const revalidate = 0;

export const Home = async () => {

  return (
    <div className="w-full h-full flex justify-center items-center relative bg-black">
      <div className="xl:max-w-[70vw] w-full h-full flex relative">
        <LeftSide />
        <Main />
        <Right />
      </div >
    </div >
  )
}

export default Home