import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import CreateLessonForm from './createform';

export default async function CreateLessonPage({ params }) {
  const supabase = createServerComponentClient({ cookies })
  const topic = params.slug;
  const moduleNumber = parseInt(params.module_number);

  const fetchNextLessonNumber = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("lesson_number")
      .eq("topic", topic)
      .eq("module_id", moduleNumber)
      .order("lesson_number", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching lessons:", error);
      return 1;
    }

    return data.length > 0 ? data[0].lesson_number + 1 : 1;
  }

  const nextLessonNumber = await fetchNextLessonNumber();

  return (
    <CreateLessonForm 
      topic={topic} 
      moduleNumber={moduleNumber} 
      initialLessonNumber={nextLessonNumber} 
    />
  );
}