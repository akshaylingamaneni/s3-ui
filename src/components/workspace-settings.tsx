'use client'
import { AwsSettings } from "@/components/aws-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from 'react'

type WorkspaceSettingsProps = {
  defaultTab?: string
}

export function WorkspaceSettings({ defaultTab = "Aws Settings" }: WorkspaceSettingsProps) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth");
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return (
    <div className="w-full h-full">
      <Tabs defaultValue={defaultTab} className="h-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Workspace Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your workspace settings
            </p>
          </div>
          <TabsList className="self-start sm:self-auto w-full sm:w-auto flex gap-2 dark:bg-zinc-900">
            <TabsTrigger 
              value="Aws Settings" 
              className="flex-1 sm:flex-none text-xs sm:text-sm px-3 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              AWS Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="Aws Settings" className="border-none p-0 outline-none">
          <AwsSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
} 