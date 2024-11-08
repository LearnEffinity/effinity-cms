"use client";

import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/style.css";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Maximize2, X } from "lucide-react";

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
  const [isFullScreen, setIsFullScreen] = useState(false);

  const editor = useCreateBlockNote();

  const saveToSupabase = useCallback(async (jsonBlocks: Block[]) => {
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
  }, [supabase, topic, moduleId, lessonId]);

  const loadFromSupabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("topic", topic)
        .eq("module_number", moduleId)
        .eq("lesson_number", lessonId)
        .single();

      console.log("Loaded data:", data);

      if (error) throw error;

      setName(data.name);
      setDescription(data.description);
      if (data.image) {
        const { data: imageData } = supabase.storage
          .from("lesson_images")
          .getPublicUrl(data.image);
        setImageUrl(imageData.publicUrl);
      }

      if (data.markdown) {
        const parsedMarkdown = JSON.parse(data.markdown);
        console.log("Parsed markdown:", parsedMarkdown);
        return parsedMarkdown;
      }

      return undefined;
    } catch (error) {
      console.error("Error loading from Supabase:", error);
      return undefined;
    }
  }, [supabase, topic, moduleId, lessonId]);

  useEffect(() => {
    loadFromSupabase().then((content) => {
      if (content && editor) {
        console.log("Updating editor content with:", content);
        editor.replaceBlocks(
          editor.document,
          content      
        );
      }
    });
  }, [loadFromSupabase, editor]);

  const handleImageUpload = async (file) => {
    let name = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("lesson_images")
      .upload(`public/${name}`, file);

    if (error) {
      throw error;
    }

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
          markdown: JSON.stringify(editor.document),
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

  const EditorComponent = useCallback(() => (
    <BlockNoteView
      editor={editor}
      theme="light"
      onChange={() => saveToSupabase(editor.document)}
    />
  ), [editor, saveToSupabase]);

  if (!editor) {
    return "Loading content...";
  }

  return (
    <main className="flex min-h-screen bg-neutral-50 p-8">
      <Card className="w-1/2 mr-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Markdown Editor</CardTitle>
          <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
            <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(true)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <DialogContent className="max-w-full w-full h-full">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>Full Screen Editor</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogHeader>
              <div className="h-[calc(100vh-100px)]">
                <EditorComponent />
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <EditorComponent />
        </CardContent>
      </Card>
      <Card className="w-1/2 ml-4">
        <CardHeader>
          <CardTitle>Edit Lesson {lessonId} for {topic} Module {moduleId}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Lesson Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessonNumber">Lesson Number</Label>
              <Input
                id="lessonNumber"
                value={lessonId}
                readOnly
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
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
              className="w-full"
            >
              {isLoading ? "Updating..." : "Update Lesson"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}