"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const signOut = async () => {
      setIsSigningOut(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        router.push("/auth/login");
      } catch (e) {
        console.error("Error signing out:", e);
        setError("An error occurred while signing out. Please try again.");
      } finally {
        setIsSigningOut(false);
      }
    };

    signOut();
  }, [supabase.auth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign Out</CardTitle>
        </CardHeader>
        <CardContent>
          {isSigningOut ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-neutral-600">Signing you out...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => router.push("/")}>Return to Home</Button>
            </div>
          ) : (
            <p className="text-center text-sm text-neutral-600">You have been successfully signed out.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}