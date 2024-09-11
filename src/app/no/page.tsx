"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

function Video() {
  return (
    <video 
      className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
      autoPlay 
      loop 
      playsInline
    >
      <source src="/monkey.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      <Video />
      <Card className="w-full max-w-md z-10 bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-red-600">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-xl mb-6">You don't have admin access!</p>
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