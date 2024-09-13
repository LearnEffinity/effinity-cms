import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import EditModuleForm from '@/components/form/editmodule'
import LessonsList from './list'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  const modulee = await fetchModule();
  const lessons = await fetchLessons();
  const imageUrl = modulee?.image ? await fetchImageUrl(modulee.image) : '';

  if (!modulee) {
    redirect(`/${slug}`);
  }
  const serializedModule = modulee ? JSON.parse(JSON.stringify(modulee)) : null;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <LessonsList lessons={lessons} slug={slug} moduleNumber={moduleNumber} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Edit Module for {slug} as Module {moduleNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditModuleForm 
              initialModule={serializedModule}
              initialImageUrl={imageUrl}
              slug={slug}
              moduleNumber={moduleNumber}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}