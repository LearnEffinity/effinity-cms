"use client";
import { createClient } from "./supabase/client";
import { createContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const supabaseClient = createClient();

export const AuthContext = createContext({
  user: null,
  session: null,
  client: supabaseClient,
  userRole: null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleAuthChange = async (event, session) => {
      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        const { data: userRoleData, error } = await supabaseClient
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        } else {
          setUserRole(userRoleData?.role || null);
        }
      } else {
        setUserRole(null);
      }
      setIsAuthLoaded(true);
    };

    const { data: authListener } =
      supabaseClient.auth.onAuthStateChange(handleAuthChange);

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      await handleAuthChange(null, session);
    };

    fetchSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!user) {
      if (!pathname.startsWith("/auth")) {
        router.push("/auth/login");
      }
    } else {
      if (userRole !== "admin" && pathname !== "/gtfo") {
        router.push("/gtfo");
      } else if (
        user &&
        pathname.startsWith("/auth") &&
        !pathname.startsWith("/auth/reset")
      ) {
        router.push("/");
      }
    }
  }, [user, userRole, isAuthLoaded, router, pathname]);

  return (
    <AuthContext.Provider
      value={{ user, session, client: supabaseClient, userRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
