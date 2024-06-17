"use client";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log("Data:", data);
        if (error) throw error;
        setUser(data.user);
        // console.log("User:", data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    getUser();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex">
        <h1 className="text-[50px]">
          {user?.user_metadata ? (
            <>
              Welcome {user.user_metadata.name || user.user_metadata.first_name}
            </>
          ) : (
            "Loading..."
          )}
        </h1>
        <a
          className="rounded-lg bg-brand-primary px-8 py-4 text-center text-white"
          href="/signout"
        >
          Sign out
        </a>
      </div>
    </main>
  );
}
