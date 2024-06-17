"use client";
import { createClient } from "./supabase/client";
import { createContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const supabaseClient = createClient();

export const AuthContext = createContext({
  user: null,
  session: null,
  client: supabaseClient,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        // console.log("session", session);
        // console.log("user", user);

        if (session?.user) {
          const {
            data: { role },
          } = await supabaseClient
            .from("users")
            .select("role")
            .eq("id", session.user.id)
            .single();
          console.log("role", role);
          setUserRole(role);
        } else {
          setUserRole(null);
        }
      },
    );

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        const {
          data: { role },
        } = await supabaseClient
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    };

    fetchSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user && !pathname.startsWith("/auth")) {
      router.push("/auth/login");
    } else if (userRole && userRole !== "admin" && pathname !== "/gtfo") {
      router.push("/gtfo");
    } else if (
      user &&
      pathname.startsWith("/auth") &&
      !pathname.startsWith("/auth/reset")
    ) {
      router.push("/");
    }
  }, [user, userRole, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, session, client: supabaseClient }}>
      {children}
    </AuthContext.Provider>
  );
};
