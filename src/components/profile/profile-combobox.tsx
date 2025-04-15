"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Settings } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAWSProfileStore } from "@/store/aws-store"
import { AWSProfile } from "@/lib/aws/s3-client"
import { useBucketStore } from "@/store/bucketStore"

const FormSchema = z.object({
  profile: z.string({
    required_error: "Please select a profile.",
  }),
})

export function ProfileCombobox() {
  const { activeProfile, setActiveProfile } = useAWSProfileStore()
  const { setCurrentBucket, setCurrentPath } = useBucketStore()
  const [profiles, setProfiles] = useState<AWSProfile[]>([])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profile: activeProfile?.profileName || "",
    },
  })
  const profileChange = (profile: AWSProfile) => {
    setCurrentBucket(null)
    setCurrentPath(null)
    setActiveProfile(profile)
  }

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await fetch('/api/aws/get-profiles')
        const data = await response.json()
        if (data.success && data.profiles) {
          setProfiles(data.profiles)
        }
      } catch (error) {
        console.error('Failed to load profiles:', error)
      }
    }

    loadProfiles()
  }, [])

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="profile"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                          <Settings className="size-4 shrink-0" />
                        </div>
                        {field.value
                          ? profiles.find(
                              (profile) => profile.profileName === field.value
                            )?.profileName
                          : "Select AWS Profile"}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search profiles..." />
                    <CommandList>
                      <CommandEmpty>No profile found.</CommandEmpty>
                      <CommandGroup>
                        {profiles.map((profile) => (
                          <CommandItem
                            value={profile.profileName}
                            key={profile.profileName}
                            onSelect={() => {
                              form.setValue("profile", profile.profileName)
                              profileChange(profile)
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex size-6 items-center justify-center rounded-sm border">
                                <Settings className="size-4 shrink-0" />
                              </div>
                              {profile.profileName}
                            </div>
                            <Check
                              className={cn(
                                "ml-auto",
                                profile.profileName === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
} 