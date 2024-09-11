"use client";

import Link from 'next/link';
import { useRouter } from "next/navigation";
import Button from "@/components/form/Button";

export default function LessonsList({ lessons, slug, moduleNumber }) {
  const router = useRouter();

  return (
    <div className="h-full rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Lessons</h2>
      <ul className="space-y-4">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="flex items-center">
            <Link href={`/${slug}/${moduleNumber}/${lesson.lesson_number}`}>
              <span className="mr-4">{lesson.lesson_number}</span>
              <span>{lesson.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => router.push(`/${slug}/${moduleNumber}/create-lesson`)}
        className="mt-4"
      >
        Add Lesson
      </Button>
    </div>
  );
}