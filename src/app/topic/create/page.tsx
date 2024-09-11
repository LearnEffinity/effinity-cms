import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Button from "@/components/form/Button";
import { InputWithLabel } from "@/components/form/Input";

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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Create New Topic
        </h1>
        <form action={createTopic} className="space-y-4">
          <InputWithLabel
            name="title"
            label="Title"
            required
          />
          <InputWithLabel
            name="description"
            label="Description"
            required
          />
          <InputWithLabel
            name="slug"
            type="text"
            label="Slug (note you can't change this later)"
            required
          />
          <Button
            type="submit"
            size="md"
            variant="primary"
          >
            Create Topic
          </Button>
        </form>
      </div>
    </main>
  );
}