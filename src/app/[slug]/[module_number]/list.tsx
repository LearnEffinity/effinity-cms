"use client";

import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LessonsList({ lessons, slug, moduleNumber }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] pr-4">
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="flex items-center py-2 hover:bg-accent rounded-md">
              <Link href={`/${slug}/${moduleNumber}/${lesson.lesson_number}`} className="flex items-center w-full px-4">
                <span className="mr-4 text-muted-foreground">{lesson.lesson_number}.</span>
                <span className="text-foreground">{lesson.name}</span>
              </Link>
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