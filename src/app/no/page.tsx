"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Video from "@/components/Video";

export default function Home() {
  const supabase = createClient();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <Video />
      <Card className="z-10 w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-red-600">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-xl">You don&apos;t have admin access!</p>
          <Button
            className="w-full"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
