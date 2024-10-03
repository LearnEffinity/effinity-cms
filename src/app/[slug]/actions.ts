'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
export async function updateTopic(slug: string, name: string, description: string) {
  const supabase = createClient( cookies() )

 const { data, error } = await supabase
    .from("topics")
    .update({ name, description })
    .eq("slug", slug)
    .select()
  if (error) {
    console.error("Error updating topic:", error)
    return { success: false, error: error.message }
  }
  console.log("Updated topic:", data)

  revalidatePath(`/${slug}`)
  return { success: true, data }
}