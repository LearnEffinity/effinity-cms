"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function EditModuleForm({ initialModule, initialImageUrl, slug, moduleNumber }) {
  const supabase = createClientComponentClient()
  const router = useRouter();

  const [name, setName] = useState(initialModule.name);
  const [description, setDescription] = useState(initialModule.description);
  const [difficulty, setDifficulty] = useState(initialModule.difficulty.toString());
  const [length, setLength] = useState(initialModule.length);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (file) => {
    const { data, error } = await supabase.storage
      .from("module_images")
      .upload(`public/${file.name}`, file);

    if (error) {
      throw error;
    }

    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imagePath = initialModule.image;
      if (image) {
        imagePath = await handleImageUpload(image);
      }

      const { data, error } = await supabase
        .from("modules")
        .update({
          name,
          description,
          difficulty,
          length,
          image: imagePath,
        })
        .eq("topic", slug)
        .eq("module_number", moduleNumber);

      if (error) {
        throw error;
      }

      router.push(`/${slug}`);
    } catch (error) {
      console.error("Error saving module:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = name && description && difficulty && length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Module Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="moduleNumber">Module Number</Label>
        <Input
          id="moduleNumber"
          value={moduleNumber}
          readOnly
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="length">Length (in minutes)</Label>
        <Input
          id="length"
          type="number"
          value={length}
          onChange={(e) => setLength(e.target.value)}
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
            alt="Module Image"
            className="mt-4 h-48 w-full object-cover rounded-md"
          />
        )}
      </div>
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}