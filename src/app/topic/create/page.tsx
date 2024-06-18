"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

export default function CreateTopic() {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("topics")
        .insert([{ name: title, description, slug }]);
      if (error) throw error;
      console.log("Topic created:", data);
      setIsLoading(false);

      router.push("/");
    } catch (error) {
      console.error("Error creating topic:", error);
    } finally {
    }
  };

  const isFormValid = title && description && slug;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Create New Topic
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithLabel
            label="Title"
            value={title}
            onChange={(v) => setTitle(v)}
          />
          <InputWithLabel
            label="Description"
            value={description}
            onChange={(v) => setDescription(v)}
          />
          <InputWithLabel
            type="text"
            label="Slug (note you can't change this later)"
            value={slug}
            onChange={(v) => setSlug(v)}
          />
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            size="md"
            variant="primary"
          >
            {isLoading ? "Creating..." : "Create Topic"}
          </Button>
        </form>
      </div>
    </main>
  );
}
