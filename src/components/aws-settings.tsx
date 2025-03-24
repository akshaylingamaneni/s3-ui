"use client"

import { useState } from "react"
import { UserResource } from "@clerk/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AWSCredentialsManager } from "@/lib/aws/credentials"

interface AwsSettingsProps {
  session: UserResource
}

export function AwsSettings({ session }: AwsSettingsProps) {
  const [credentials, setCredentials] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    region: "us-east-1"
  })
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (field: keyof typeof credentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
    setIsSuccess(false)
  }

  const validateAndSaveCredentials = async () => {
    setIsValidating(true)
    setError(null)
    setIsSuccess(false)

    try {
      const credentialsManager = AWSCredentialsManager.getInstance()
      const isValid = await credentialsManager.validateCredentials({
        type: 'iam_user',
        ...credentials
      })

      if (isValid) {
        // Save credentials associated with user
        await credentialsManager.saveCredentials(session.id, {
          type: 'iam_user',
          ...credentials
        })
        setIsSuccess(true)
      } else {
        setError("Invalid credentials. Please check your AWS access keys and try again.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to validate credentials")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Card className="bg-zinc-900">
      <CardHeader>
        <CardTitle>AWS Credentials</CardTitle>
        <CardDescription>
          Configure your AWS credentials to access and manage your S3 buckets.
          These credentials will be securely encrypted before storage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessKeyId">Access Key ID</Label>
          <Input
            id="accessKeyId"
            type="text"
            placeholder="Enter your AWS Access Key ID"
            value={credentials.accessKeyId}
            onChange={(e) => handleChange("accessKeyId", e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secretAccessKey">Secret Access Key</Label>
          <Input
            id="secretAccessKey"
            type="password"
            placeholder="Enter your AWS Secret Access Key"
            value={credentials.secretAccessKey}
            onChange={(e) => handleChange("secretAccessKey", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Default Region</Label>
          <Input
            id="region"
            type="text"
            placeholder="e.g., us-east-1"
            value={credentials.region}
            onChange={(e) => handleChange("region", e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {isSuccess && (
          <p className="text-sm text-green-500">
            AWS credentials have been validated and saved successfully.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={validateAndSaveCredentials}
          disabled={isValidating || !credentials.accessKeyId || !credentials.secretAccessKey}
        >
          {isValidating ? "Validating..." : "Save Credentials"}
        </Button>
      </CardFooter>
    </Card>
  )
} 