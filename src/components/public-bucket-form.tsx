"use client"

import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const publicBucketSchema = z.object({
  bucketName: z.string().min(1, "Bucket name is required"),
})

export function PublicBucketForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof publicBucketSchema>>({
    resolver: zodResolver(publicBucketSchema),
    defaultValues: {
      bucketName: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof publicBucketSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/s3/check-public-bucket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucketName: data.bucketName }),
      })

      const result = await response.json()

      if (result.isAccessible) {
        // Add to list of accessible public buckets
        // Navigate to bucket contents
      } else {
        setError("Bucket is not publicly accessible or does not exist")
      }
    } catch (err) {
      setError("Failed to check bucket accessibility")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="dark:bg-zinc-800">
      <CardHeader>
        <CardTitle>Add Public Bucket</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bucketName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-zinc-200">Bucket Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="my-public-bucket"
                      className="dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm text-destructive dark:text-red-400">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Checking..." : "Add Bucket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 