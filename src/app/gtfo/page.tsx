"use client";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex">
        <h1 className="text-[50px]">You don't have admin! GTFO!</h1>
        <a
          className="rounded-lg bg-brand-primary px-8 py-4 text-center text-white"
          href="/signout"
        >
          Sign out
        </a>
        <video src="/monkey.mp4" autoPlay loop />
      </div>
    </main>
  );
}
