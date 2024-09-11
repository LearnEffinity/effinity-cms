import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function CreateTopic() {
  async function createTopic(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const slug = formData.get('slug') as string

    const supabase = createServerActionClient({ cookies })

    const { data, error } = await supabase
      .from('topics')
      .insert([{ name: title, description, slug }])

    if (error) {
      console.error('Error creating topic:', error)
      return
    }

    revalidatePath('/')
    redirect('/')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md bg-card border-none ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create New Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTopic} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (note you can&apos;t change this later)</Label>
              <Input id="slug" name="slug" required />
            </div>
            <Button type="submit" className="w-full">
              Create Topic
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}