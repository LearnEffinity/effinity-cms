"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function CreateLesson({ params }) {
  const supabase = createClient();
  const router = useRouter();
  const topic = params.slug;
  const moduleNumber = parseInt(params.module_number);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lessonNumber, setLessonNumber] = useState(1);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markdownJson, setMarkdownJson] = useState(null);

  const editor = useCreateBlockNote({});

  useEffect(() => {
    async function fetchLessons() {
      try {
        const { data, error } = await supabase
          .from("lessons")
          .select("lesson_id")
          .eq("topic", topic)
          .eq("module_id", moduleNumber)
          .order("lesson_id", { ascending: false })
          .limit(1);
        if (error) throw error;
        const nextLessonNumber = data.length > 0 ? data[0].lesson_id + 1 : 1;
        setLessonNumber(nextLessonNumber);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    }
    fetchLessons();
  }, [topic, moduleNumber]);

  const onChange = () => {
    console.log("editor.document", editor.document);
    const json = editor.document;
    setMarkdownJson(json);
  };

  const handleImageUpload = async (file) => {
    let name = file.name;

    name = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("lesson_images")
      .upload(`public/${name}`, file);

    if (error) {
      throw error;
    }
    console.log("image data", data);

    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", {
      name,
      description,
      lessonNumber,
      markdownJson,
    });
    setIsLoading(true);

    try {
      const imagePath = image ? await handleImageUpload(image) : null;

      const { data, error } = await supabase.from("lessons").insert([
        {
          name,
          description,
          module_id: moduleNumber,
          lesson_id: lessonNumber,
          image: imagePath,
          markdown: markdownJson,
          topic,
        },
      ]);

      if (error) throw error;

      router.push(`/topic/${topic}/${moduleNumber}/${lessonNumber}`);
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name && description && lessonNumber && markdownJson;

  return (
    <main className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-1/2 pr-4">
        <div className="h-full rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Markdown Editor</h2>
          <BlockNoteView theme={"light"} editor={editor} onChange={onChange} />
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <div className="h-full rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Create New Lesson for {topic} Module {moduleNumber}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputWithLabel
              label="Lesson Name"
              value={name}
              onChange={(v) => setName(v)}
              required
            />
            <InputWithLabel
              label="Description"
              value={description}
              onChange={(v) => setDescription(v)}
              required
            />
            <InputWithLabel
              label="Lesson Number"
              value={lessonNumber}
              readOnly
              required
            />

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              size="md"
              variant="primary"
            >
              {isLoading ? "Creating..." : "Create Lesson"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
