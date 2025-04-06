"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle, Trash2, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

export const awsCredentialsSchema = z.object({
    profileName: z.string().min(1, "Profile name is required"),
    accessKeyId: z.string().min(16, "Access Key ID must be at least 16 characters"),
    secretAccessKey: z.string().min(32, "Secret Access Key must be at least 32 characters"),
    endpoint: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    region: z.string().min(1, "Region is required"),
    forcePathStyle: z.boolean().optional()
})

export type AWSCredentials = z.infer<typeof awsCredentialsSchema>

export function AwsSettings() {
    const [profiles, setProfiles] = useState<AWSCredentials[]>([])
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
    const [isValidating, setIsValidating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    const form = useForm<AWSCredentials>({
        resolver: zodResolver(awsCredentialsSchema),
        defaultValues: {
            profileName: "",
            accessKeyId: "",
            secretAccessKey: "",
            endpoint: "",
            region: "us-east-1",
            forcePathStyle: false
        }
    })

    // Load existing profiles
    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const response = await fetch('/api/aws/get-profiles')
                const data = await response.json()
                if (data.success) {
                    setProfiles(data.profiles)
                }
            } catch (error) {
                console.error('Failed to load profiles:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadProfiles()
    }, [])

    // Handle profile selection
    const handleProfileSelect = async (profileName: string) => {
        const profile = profiles.find(p => p.profileName === profileName)
        if (profile) {
            setSelectedProfile(profileName)
            
            // Decrypt key before showing in form
            const response = await fetch('/api/aws/decrypt-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ encryptedKey: profile.secretAccessKey }),
            })
            const data = await response.json()
            
            form.reset({
                ...profile,
                secretAccessKey: data.success ? data.decryptedKey : ''
            })
        }
    }

    const onSubmit = async (data: AWSCredentials) => {
        setIsValidating(true)
        setError(null)
        setIsSuccess(false)

        try {
            // Validate credentials
            const validateResponse = await fetch('/api/aws/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const validationData = await validateResponse.json()

            if (validationData.valid) {
                // Save credentials
                const saveResponse = await fetch('/api/aws/save-credentials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        credentials: {
                            type: 'iam_user',
                            ...data
                        }
                    }),
                })

                const saveData = await saveResponse.json()

                if (saveData.success) {
                    setIsSuccess(true)
                    // Refresh profiles list
                    const updatedProfiles = selectedProfile
                        ? profiles.map(p => p.profileName === selectedProfile ? data : p)
                        : [...profiles, data]
                    setProfiles(updatedProfiles)
                    setSelectedProfile(data.profileName)
                } else {
                    setError("Failed to save credentials: " + saveData.error)
                }
            } else {
                setError(validationData.error || "Invalid credentials")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to validate credentials")
        } finally {
            setIsValidating(false)
        }
    }

    const handleDeleteProfile = async (profileName: string) => {
        try {
            const response = await fetch('/api/aws/delete-profile', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileName }),
            })

            const data = await response.json()
            if (data.success) {
                setProfiles(profiles.filter(p => p.profileName !== profileName))
                if (selectedProfile === profileName) {
                    setSelectedProfile(null)
                    form.reset({
                        profileName: "",
                        accessKeyId: "",
                        secretAccessKey: "",
                        endpoint: "",
                        region: "us-east-1",
                        forcePathStyle: false
                    })
                }
            }
        } catch (error) {
            console.error('Failed to delete profile:', error)
        }
    }

    const handleImportBuckets = async (profileName: string) => {
        try {
            const response = await fetch('/api/aws/import-buckets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profileName }),
            })

            const data = await response.json()
            if (data.success) {
                // Show success toast or message
                setIsSuccess(true)
            }
        } catch (error) {
            console.error('Failed to import buckets:', error)
            setError('Failed to import buckets')
        }
    }

    if (isLoading) {
        return (
            <Card className="dark:bg-zinc-800/50">
                <CardHeader>
                    <CardTitle>AWS Credentials</CardTitle>
                    <CardDescription className="dark:text-zinc-300">
                        Configure your AWS credentials to access and manage your S3 buckets.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-[100px] dark:bg-zinc-800" />
                            <Skeleton className="h-9 w-[120px] dark:bg-zinc-800" />
                        </div>
                        <Skeleton className="h-10 w-full dark:bg-zinc-800" />
                        <Skeleton className="h-[200px] w-full dark:bg-zinc-800" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="dark:bg-zinc-800/50">
            <CardHeader>
                <CardTitle>AWS Credentials</CardTitle>
                <CardDescription className="dark:text-zinc-300">
                    Configure your AWS credentials to access and manage your S3 buckets.
                    You can save multiple profiles for different AWS accounts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <Label className="dark:text-zinc-200">AWS Profiles</Label>
                        <Button
                            variant="outline"
                            size="sm"
                            className="dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:text-zinc-200"
                            onClick={() => {
                                setSelectedProfile(null)
                                form.reset({
                                    profileName: "",
                                    accessKeyId: "",
                                    secretAccessKey: "",
                                    endpoint: "",
                                    region: "us-east-1",
                                    forcePathStyle: false
                                })
                            }}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            New Profile
                        </Button>
                    </div>

                    {profiles.length > 0 && (
                        <div className="flex gap-2">
                            <Select value={selectedProfile || ''} onValueChange={handleProfileSelect}>
                                <SelectTrigger className="flex-1 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600">
                                    <SelectValue placeholder="Select an existing profile" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-600">
                                    {profiles.map((profile) => (
                                        <SelectItem
                                            key={profile.profileName}
                                            value={profile.profileName}
                                            className="dark:text-zinc-200 dark:focus:bg-zinc-700/50 dark:hover:bg-zinc-700/50"
                                        >
                                            {profile.profileName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedProfile && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="dark:hover:bg-red-600"
                                    onClick={() => handleDeleteProfile(selectedProfile)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {(selectedProfile || profiles.length === 0) && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="profileName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-zinc-200">Profile Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter a profile name"
                                                className="dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600 dark:placeholder:text-zinc-400"
                                            />
                                        </FormControl>
                                        <FormMessage className="dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="accessKeyId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-zinc-200">Access Key ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter your AWS Access Key ID"
                                                className="dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600 dark:placeholder:text-zinc-400"
                                            />
                                        </FormControl>
                                        <FormMessage className="dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="secretAccessKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-zinc-200">Secret Access Key</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Enter your AWS Secret Access Key"
                                                className="dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600 dark:placeholder:text-zinc-400"
                                            />
                                        </FormControl>
                                        <FormMessage className="dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endpoint"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-zinc-200">
                                            Custom Endpoint (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="https://your-s3-endpoint.com"
                                                className="dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600 dark:placeholder:text-zinc-400"
                                            />
                                        </FormControl>
                                        <FormMessage className="dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="dark:text-zinc-200">Region</FormLabel>
                                        <Select 
                                            onValueChange={field.onChange} 
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-600">
                                                <SelectValue placeholder="Select a region" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-zinc-800 dark:border-zinc-600">
                                                <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                                                <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                                                {/* Add more regions as needed */}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="forcePathStyle"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="dark:text-zinc-200">
                                            Force Path Style
                                        </FormLabel>
                                        <FormMessage className="dark:text-red-400" />
                                    </FormItem>
                                )}
                            />

                            {error && (
                                <p className="text-sm text-destructive dark:text-red-400">
                                    {error}
                                </p>
                            )}

                            {isSuccess && (
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm text-green-500 dark:text-green-400">
                                        AWS credentials have been validated and saved successfully.
                                    </p>
                                    <Button
                                        onClick={() => handleImportBuckets(form.getValues("profileName"))}
                                        className="w-full flex items-center gap-2 dark:bg-zinc-200 dark:text-zinc-800 cursor-pointer"
                                    >
                                        <Download className="h-4 w-4" />
                                        Sync Buckets
                                    </Button>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isValidating}
                                className="w-full dark:bg-zinc-200 dark:text-zinc-800 cursor-pointer"
                            >
                                {isValidating ? "Validating..." : selectedProfile ? "Update Profile" : "Create Profile"}
                            </Button>
                        </form>
                    </Form>
                )}

                {!selectedProfile && profiles.length > 0 && (
                    <div className="text-center text-muted-foreground dark:text-zinc-400">
                        <p>Select an existing profile to edit or create a new one.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 