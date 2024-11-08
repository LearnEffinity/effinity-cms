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
export async function deleteModule(slug: string, moduleNumber: number) {
  const supabase = createClient(cookies());


  try {
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("*")
      .eq("topic", slug)
      .eq("module_number", moduleNumber);


    const { data: deletedLessons, error: lessonsError } = await supabase
      .from("lessons")
      .delete()
      .eq("topic", slug)
      .eq("module_number", moduleNumber)
      .select();


    if (lessonsError) {
      console.error("Error deleting lessons:", lessonsError);
      throw lessonsError;
    }

    const { data: moduleData } = await supabase
      .from("modules")
      .select("*")
      .eq("topic", slug)
      .eq("module_number", moduleNumber);


    const { data: deletedModule, error: moduleError } = await supabase
      .from("modules")
      .delete()
      .eq("topic", slug)
      .eq("module_number", moduleNumber)
      .select();


    if (moduleError) {
      console.error("Error deleting module:", moduleError);
      throw moduleError;
    }

    revalidatePath(`/${slug}`);
    return { success: true, deletedLessons, deletedModule };
  } catch (error) {
    console.error("Error deleting module:", error);
    return { success: false, error: error.message };
  }
}