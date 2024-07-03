"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { TopicCard, CreateTopicCard } from "@/components/dashboard/topicCard";
import { useRouter } from "next/navigation";
export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log(data);
        if (error) throw error;
        if (!data) {
          router.push("/auth/login");
        }
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    async function getTopics() {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("name, description, slug");
        if (error) throw error;
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    }

    getUser();
    getTopics();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 p-8">
      <div className="w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-[50px] font-bold">
            {user?.user_metadata ? (
              <>
                Welcome{" "}
                {user.user_metadata.name || user.user_metadata.first_name}
              </>
            ) : (
              "Loading..."
            )}
          </h1>
          <a
            className="rounded-lg bg-brand-primary px-8 py-4 text-center text-white"
            href="/signout"
          >
            Sign out
          </a>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
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
