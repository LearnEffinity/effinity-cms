import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import EditModuleForm from '@/components/form/editmodule'
import LessonsList from './list'

export default async function EditModule({ params }) {
  const supabase = createServerComponentClient({ cookies })
  const slug = params.slug;
  const moduleNumber = parseInt(params.module_number);

  const fetchModule = async () => {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("topic", slug)
      .eq("module_number", moduleNumber)
      .single();

    if (error) {
      console.error("Error fetching module:", error);
      return null;
    }

    return data;
  }

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("topic", slug)
      .eq("module_number", moduleNumber)
      .order("lesson_number", { ascending: true });

    if (error) {
      console.error("Error fetching lessons:", error);
      return [];
    }

    return data;
  }

  const fetchImageUrl = async (imagePath) => {
    const { data } = supabase.storage
      .from("module_images")
      .getPublicUrl(imagePath);

    return data.publicUrl;
  }

  const module = await fetchModule();
  const lessons = await fetchLessons();
  const imageUrl = module?.image ? await fetchImageUrl(module.image) : '';

  if (!module) {
    redirect(`/topic/${slug}`);
  }

  return (
    <main className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-1/2 pr-4">
        <LessonsList lessons={lessons} slug={slug} moduleNumber={moduleNumber} />
      </div>
      <div className="w-1/2 pl-4">
        <div className="h-full rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Edit Module for {slug} as Module {moduleNumber}
          </h1>
          <EditModuleForm 
            initialModule={module}
            initialImageUrl={imageUrl}
            slug={slug}
            moduleNumber={moduleNumber}
          />
        </div>
      </div>
    </main>
  );
}