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
    <main className="flex min-h-screen flex-col items-center bg-neutral-50 p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-[50px] font-bold text-neutral-700">
            Welcome {user.user_metadata.name || user.user_metadata.first_name}
          </h1>
          <Button variant="default" asChild>
            <a href="/signout">Sign out</a>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topics && topics.map((topic) => (
            <TopicCard
              key={topic.name}
              name={topic.name}
              description={topic.description}
              slug={topic.slug}
            />
          ))}
          <CreateTopicCard />
        </div>
      </div>
    </main>
  );
}