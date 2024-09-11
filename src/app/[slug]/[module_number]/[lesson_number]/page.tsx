"use client";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

export default function EditLesson({ params }) {
  const supabase = createClient();
  const router = useRouter();
  const topic = params.slug;
  const moduleId = parseInt(params.module_number);
  const lessonId = parseInt(params.lesson_number);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  async function saveToSupabase(jsonBlocks: Block[]) {
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ markdown: JSON.stringify(jsonBlocks) })
        .eq("topic", topic)
        .eq("module_number", moduleId)
        .eq("lesson_number", lessonId);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving to Supabase:", error);
    }
  }

  async function loadFromSupabase() {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("topic", topic)
        .eq("module_number", moduleId)
        .eq("lesson_number", lessonId)
        .single();
      console.log("data", data);
      if (error) throw error;

      setName(data.name);
      setDescription(data.description);
      if (data.image) {
        const { data: imageData } = supabase.storage
          .from("lesson_images")
          .getPublicUrl(data.image);
        setImageUrl(imageData.publicUrl);
      }

      return data.markdown
        ? JSON.parse(data.markdown) as PartialBlock[]
        : undefined;
    } catch (error) {
      console.error("Error loading from Supabase:", error);
      return undefined;
    }
  }

  useEffect(() => {
    loadFromSupabase().then((content) => {
      if (content) {
        const newEditor = BlockNoteEditor.create({ initialContent: content });
        setEditor(newEditor);
      } else {
        const newEditor = BlockNoteEditor.create();
        setEditor(newEditor);
      }
    });
  }, [topic, moduleId, lessonId]);

  const handleImageUpload = async (file) => {
    let name = `${Date.now()}-${file.name}`;
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
    setIsLoading(true);

    try {
      let imagePath = imageUrl;
      if (image) {
        imagePath = await handleImageUpload(image);
      }

      const { error } = await supabase
        .from("lessons")
        .update({
          name,
          description,
          image: imagePath,
          markdown: JSON.stringify(editor?.document),
        })
        .eq("topic", topic)
        .eq("module_number", moduleId)
        .eq("lesson_number", lessonId);

      if (error) throw error;

      router.push(`/${topic}/module/${moduleId}`);
    } catch (error) {
      console.error("Error updating lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name && description && editor?.document;

  if (!editor) {
    return "Loading content...";
  }

  return (
    <main className="flex min-h-screen bg-gray-100 p-8">
      <div className="w-1/2 pr-4">
        <div className="h-full rounded-lg  p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">Markdown Editor</h2>
          <BlockNoteView
            theme={"light"}
            editor={editor}
            onChange={() => {
              saveToSupabase(editor.document);
            }}
          />
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <div className="h-full rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Edit Lesson {lessonId} for {topic} Module {moduleId}
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
              value={lessonId}
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
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Lesson Image"
                  className="mt-4 h-48 w-full object-cover"
                />
              )}
            </div>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              size="md"
              variant="primary"
            >
              {isLoading ? "Updating..." : "Update Lesson"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
