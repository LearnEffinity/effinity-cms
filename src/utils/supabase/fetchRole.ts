"use client";
import { createClient } from "./client";

export const fetchRole = async () => {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("users")
    .select("role")
    //@ts-expect-error
    .eq("id", user.id)
    .single();

  if (error || userError) {
    throw error;
  }

  return data.role;
};
