"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase.types";
import { Dialog, DialogContent } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Toaster, toast } from "sonner";


type SupabaseContext = {
    supabase: SupabaseClient<Database>;
};
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
                                                        
export const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [supabase] = useState(() => createPagesBrowserClient());
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [OpenTok, setTokOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [token, setToken] = useState("");

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            router.refresh();
        });

        supabase.auth.getSession().then((res) => {
            if (!res.data.session) {
                console.log(res);
                setIsOpen(true);
                return;
            }
            console.log(res);

        }
        );




        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabase]);

    return (
        <Context.Provider value={{ supabase }}>
            <>
                <Toaster />
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="p-6 text-black">
                        <h3 className="text-lg my-1">Please sign up to continue</h3>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                setIsLoading(true);

                                // first check if the username exists or not
                                const { data, error } = await supabase
                                    .from("profiles")
                                    .select()
                                    .eq("username", username.trim());

                                if (data && data?.length > 0) {
                                    return toast.error(
                                        "username already exists, please use another"
                                    );
                                }

                                const { data: signUpData, error: signUpError } =
                                    await supabase.auth.signInWithOtp({
                                        email: email.trim(),
                                        options: {
                                            data: {
                                                username,
                                                full_name: fullName,
                                            },
                                        },
                                    });

                                if (error) {
                                    return toast.error(signUpError.message);
                                }


                                //const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({ token_hash: token, type: 'email' });

                                toast.success("one time link sent successfully");
                                setIsLoading(false);
                            }}
                        >
                            <Input
                                type="email"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                type="text"
                                placeholder="username"
                                min={3}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="my-2"
                            />
                            <Input
                                type="text"
                                placeholder="your name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="my-2"
                            />
                            <p className="text-sm text-gray-900 my-2">
                                you will receive a login magic link!
                            </p>
                            <div className="flex w-full justify-end">
                                <Button disabled={isLoading}>Sign Up</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
                {children}
{/*                 <Toaster />
                <Dialog open={OpenTok} onOpenChange={setTokOpen}>
                    <DialogContent className="p-6 text-black">
                        <h3 className="text-lg my-1">Please input your Token for verification</h3>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();

                                setIsLoading(true);
                                console.log(email);

                                const { data, error: verifyError } = await supabase.auth.verifyOtp({
                                    email,
                                    token,
                                    type: 'signup'
                                })

                                const { error: signInError } = await supabase.auth.verifyOtp({
                                    email,
                                    token,
                                    type: 'magiclink'
                                })


                                if (verifyError) {
                                    return toast.error(verifyError.message);
                                }

                                // first check if the username exists or not

                                setTokOpen(false);
                            }}
                        >
                            <Input
                                type="text"
                                placeholder="your token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="my-2"
                            />
                            <div className="flex w-full justify-end">
                                <Button disabled={isLoading}>Submit</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
                {children} */}
            </>
        </Context.Provider>
    );

}

export const useSupabase = () => {
    const context = useContext(Context);


    if (context === undefined) {
        throw new Error("useSupabase must be used inside SupabaseProvider");
    }

    return context;
};