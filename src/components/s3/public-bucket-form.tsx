"use client"

import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { useRouter } from "next/navigation"

const publicBucketSchema = z.object({
  bucketName: z.string().min(1, "Bucket name is required"),
})

export function PublicBucketForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof publicBucketSchema>>({
    resolver: zodResolver(publicBucketSchema),
    defaultValues: {
      bucketName: "",
    },
  })

  // Mutation for adding a bucket
  const { mutate: addBucket, isPending: isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof publicBucketSchema>) => {
      // First check if bucket is accessible
      const checkResponse = await fetch(`/api/s3/check-public-bucket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucketName: data.bucketName }),
      })

      const checkResult = await checkResponse.json()
      if (!checkResult.isAccessible) {
        throw new Error("Bucket is not publicly accessible or does not exist")
      }

      // If accessible, add to Redis
      const addResponse = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bucket',
          data: {
            id: crypto.randomUUID(),
            name: data.bucketName,
            visibility: 'public',
            region: checkResult.region || 'us-east-1', // Get from check result if available
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
        })
      })

      if (!addResponse.ok) {
        throw new Error("Failed to add bucket")
      }

      return addResponse.json()
    },
    onSuccess: (_, variables) => {
      // Invalidate storage query to refresh bucket list
      queryClient.invalidateQueries({ queryKey: ['storage'] })
      // Navigate to the new bucket
      router.push(`/dashboard/buckets/${variables.bucketName}`)
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to add bucket")
    }
  })

  const onSubmit = (data: z.infer<typeof publicBucketSchema>) => {
    setError(null)
    addBucket(data)
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
              {isLoading ? "Adding Bucket..." : "Add Bucket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 