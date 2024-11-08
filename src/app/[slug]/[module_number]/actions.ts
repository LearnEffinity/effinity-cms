"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function deleteLesson(
  slug: string,
  moduleNumber: number,
  lessonNumber: number,
) {
  const supabase = createClient(cookies());

  try {
    const { data: deletedLesson, error: deleteError } = await supabase
      .from("lessons")
      .delete()
      .eq("topic", slug)
      .eq("module_number", moduleNumber)
      .eq("lesson_number", lessonNumber)
      .select();

    if (deleteError) throw deleteError;

    const { data: lessonsToUpdate, error: fetchError } = await supabase
      .from("lessons")
      .select("*")
      .eq("topic", slug)
      .eq("module_number", moduleNumber)
      .gt("lesson_number", lessonNumber)
      .order("lesson_number", { ascending: true });

    if (fetchError) throw fetchError;

    for (const lesson of lessonsToUpdate) {
      const { error: updateError } = await supabase
        .from("lessons")
        .update({ lesson_number: lesson.lesson_number - 1 })
        .eq("id", lesson.id);

      if (updateError) throw updateError;
    }

    revalidatePath(`/${slug}/${moduleNumber}`);
    return { success: true, data: deletedLesson };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return { success: false, error: error.message };
  }
}
