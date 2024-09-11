import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { TopicCard, CreateTopicCard } from "@/components/dashboard/topicCard";
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: topics, error } = await supabase
    .from("topics")
    .select("name, description, slug");

  if (error) {
    console.error("Error fetching topics:", error);
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-neutral-800 mb-2">
              Welcome, {user.user_metadata.name || user.user_metadata.first_name}
            </h1>
            <p className="text-lg text-neutral-600">Manage your topics and lessons</p>
          </div>
          <Button variant="outline" asChild>
            <a href="/signout">Sign out</a>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CreateTopicCard />
          {topics && topics.map((topic) => (
            <TopicCard
              key={topic.name}
              name={topic.name}
              description={topic.description}
              slug={topic.slug}
            />
          ))}
        </div>
      </div>
    </main>
  );
}