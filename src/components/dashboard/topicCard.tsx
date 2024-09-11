import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, Edit } from 'lucide-react'

function TopicCard({ name, description, slug }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-neutral-800">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-neutral-600">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${slug}`} className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Modules
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${slug}/edit`} className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CreateTopicCard() {
  return (
    <Card className="flex flex-col items-center justify-center h-full bg-card bg-opacity-10 border-2 border-dashed border-brand-primary">
      <CardContent className="text-center">
        <PlusCircle className="h-12 w-12 text-primary my-4 justify-center mx-auto" />
        <CardTitle className="text-xl font-bold text-brand-primary mb-2 mx-auto">Create New Topic</CardTitle>
        <CardDescription className="text-sm text-neutral-600 mb-4">Add a new topic to your curriculum</CardDescription>
        <Button asChild>
          <Link href="/create">Create Topic</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export { TopicCard, CreateTopicCard };