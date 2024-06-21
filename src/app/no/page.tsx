"use client";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/form/Button";

export default function Home() {
  const supabase = createClient();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex">
        <h1 className="text-[50px]">You don't have admin! GTFO!</h1>
        <Button
          className="rounded-lg bg-brand-primary px-8 py-4 text-center text-white"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </Button>
        <video src="/monkey.mp4" autoPlay loop />
      </div>
    </main>
  );
}
