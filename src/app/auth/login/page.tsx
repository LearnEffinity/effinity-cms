"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/lucide";

import type { SupabaseClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Failed to sign in with Google:", error.message);
    }
  }
  return (
    <div className=" relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

      <div className="relative hidden h-full flex-col bg-background p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-foreground" />
        <div className="relative z-20 flex items-center text-lg font-medium">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M41.7553 18.5601L35.7394 25.9551L32.6619 22.1722C31.2234 20.407 29.0669 19.3799 26.7874 19.3799H15.9637C12.1203 19.3799 8.94251 22.2472 8.45919 25.9551C8.41823 25.6316 8.39551 25.3036 8.39551 24.9689V13.791C8.39551 9.6142 11.7851 6.22985 15.9637 6.22985H35.8807C42.2546 6.22985 45.7742 13.6179 41.7553 18.5601Z" fill="#4D37C9"/>
<path d="M35.7392 25.9541L32.6617 29.7371C31.2232 31.5044 29.0667 32.5293 26.7872 32.5293H15.9635C12.1201 32.5293 8.94231 29.6642 8.45898 25.9541C8.94231 22.2463 12.1201 19.379 15.9635 19.379H26.7872C29.0667 19.379 31.2232 20.4061 32.6617 22.1712L35.7392 25.9541Z" fill="#7C71F4"/>
<path d="M35.8807 45.6826H15.9637C11.7853 45.6826 8.39551 42.296 8.39551 38.119V26.9413C8.39551 26.6064 8.41823 26.2784 8.45919 25.9551C8.94251 29.665 12.1203 32.5301 15.9637 32.5301H26.7874C29.0669 32.5301 31.2234 31.5052 32.6619 29.7381L35.7394 25.9551L41.7553 33.3501C45.7742 38.2921 42.2546 45.6826 35.8807 45.6826Z" fill="#583AFE"/>
</svg>
          Effinity CMS
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Take control of your financial journey.&rdquo;
            </p>
            <footer className="text-sm">- Effinity</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 bg-background">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Log In to Your Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to log in to your account
            </p>
          </div>
          <LoginForm signInWithGoogle={signInWithGoogle} supabase={supabase} router={router} />
          
        </div>
      </div>
    </div>
  );
}

function LoginForm({
  supabase,
  signInWithGoogle,
  router,
}: {
  supabase: SupabaseClient<any, "public", any>;
  signInWithGoogle: () => void;
  router: any;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginButton = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log("Failed to login:", error.message);
      setError("Failed to login: " + error.message);
    } else {
      console.log("Logged in:", data);
      router.push("/");
    }

    setIsLoading(false);
  };

  return (
    <div className="grid gap-6 ">
      <form onSubmit={handleLoginButton}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Log In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={signInWithGoogle}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
      <div className="flex items-center space-x-2">
        <Checkbox id="remember" />
        <label
          htmlFor="remember"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Remember me
        </label>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full bg-destructive text-destructive-foreground text-center py-2 rounded-lg"
        >
          {error}
        </motion.div>
      )}
      <div className="text-sm text-right">
        <Link
          href="/auth/forgot-password"
          className="text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}