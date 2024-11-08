"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Maximize2, X } from "lucide-react";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/core/style.css";

export default function CreateLessonForm({ topic, moduleNumber, initialLessonNumber }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markdownJson, setMarkdownJson] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const editor = useCreateBlockNote();

  const onChange = useCallback(() => {
    const json = editor.document;
    setMarkdownJson(json);
  }, [editor]);

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
      const imagePath = image ? await handleImageUpload(image) : null;

      console.log({
        name,
        description,
        moduleNumber,
        initialLessonNumber,
        imagePath,
        markdownJson,
        topic
      });

      const { data, error } = await supabase.from("lessons").insert([
        {
          name,
          description,
          module_number: moduleNumber,
          lesson_number: initialLessonNumber,
          image: imagePath,
          markdown: markdownJson,
          topic,
        },
      ]);

      if (error) throw error;

      router.push(`/${topic}/${moduleNumber}`);
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name && description && initialLessonNumber && markdownJson;

  const EditorComponent = useCallback(() => (
    <BlockNoteView
      editor={editor}
      theme="light"
      onChange={onChange}
    />
  ), [editor, onChange]);

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
          <CardTitle>Create New Lesson for {topic} Module {moduleNumber}</CardTitle>
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
                value={initialLessonNumber}
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
            </div>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full"
            >
              {isLoading ? "Creating..." : "Create Lesson"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}