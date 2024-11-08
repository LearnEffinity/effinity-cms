"use client";

import { useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";
import { deleteLesson } from "./actions";

export default function LessonsList({ lessons, slug, moduleNumber }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  const handleDelete = async (lesson) => {
    setIsDeleting(true);
    try {
      const result = await deleteLesson(slug, moduleNumber, lesson.lesson_number);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Error deleting lesson:", result.error);
      }
    } catch (error) {
      console.error("Error in delete handler:", error);
    } finally {
      setIsDeleting(false);
      setLessonToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {lessonToDelete && (
        <Alert variant="destructive">
          <AlertTitle>Confirm Deletion</AlertTitle>
          <AlertDescription>
            <p className="mb-4">
              Are you sure you want to delete lesson "{lessonToDelete.name}"?
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setLessonToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(lessonToDelete)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="h-[400px] pr-4">
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="flex items-center py-2 hover:bg-accent rounded-md group">
              <Link
                href={`/${slug}/${moduleNumber}/${lesson.lesson_number}`}
                className="flex items-center flex-1 px-4"
              >
                <span className="mr-4 text-muted-foreground">{lesson.lesson_number}.</span>
                <span className="text-foreground">{lesson.name}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 mr-2"
                onClick={(e) => {
                  e.preventDefault();
                  setLessonToDelete(lesson);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <Button
        onClick={() => router.push(`/${slug}/${moduleNumber}/create-lesson`)}
        className="w-full"
      >
        Add Lesson
      </Button>
    </div>
  );
}