import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import TopicPageClient from './client'

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const slug = params.slug

  async function fetchTopic() {
    const { data, error } = await supabase
      .from("topics")
      .select("name, description, slug")
      .eq("slug", slug)
      .single()
    if (error) throw error
    return data
  }

  async function fetchModules() {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("topic", slug)
      .order("module_number", { ascending: true })
    if (error) throw error
    return data
  }

  async function fetchImageUrl(imagePath: string) {
    const { data } = supabase.storage
      .from("module_images")
      .getPublicUrl(imagePath)
    return data.publicUrl
  }

  const topic = await fetchTopic()
  const modulesData = await fetchModules()

  const modules = await Promise.all(
    modulesData.map(async (module) => {
      if (module.image) {
        module.imageUrl = await fetchImageUrl(module.image)
      }
      return module
    })
  )

  return <TopicPageClient initialTopic={topic} initialModules={modules} slug={slug} />
}