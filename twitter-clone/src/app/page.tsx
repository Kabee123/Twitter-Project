import LeftSide from './components/left';
import Main from './components/main'
import Right from './components/right'
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { createContext, useContext, useEffect, useState } from "react";

export const revalidate = 0;

export const Home = async () => {

  return (
    <Main />
  )
}

export default Home