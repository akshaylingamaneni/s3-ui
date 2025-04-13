"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Settings, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserProfilePopover } from "@/components/profile/user-profile-popover"
import { PublicBucketForm } from "@/components/s3/public-bucket-form"
import { useAWSProfileStore } from '@/store/aws-store'

export interface AWSProfile {
  profileName: string
  region: string
}

export function ProfileSwitcher() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [profiles, setProfiles] = React.useState<AWSProfile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [showProfileDialog, setShowProfileDialog] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [showPublicBucketDialog, setShowPublicBucketDialog] = React.useState(false)
  
  const { activeProfile, setActiveProfile } = useAWSProfileStore()

  React.useEffect(() => {
    const loadProfiles = async () => {
      try {
        const response = await fetch('/api/aws/get-profiles')
        console.log("response", response)
        const data = await response.json()
        if (data.success && data.profiles) {
          setProfiles(data.profiles)
          if (data.profiles.length > 0 && !activeProfile) {
            setActiveProfile(data.profiles[0])
          }
        }
      } catch (error) {
        console.error('Failed to load profiles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfiles()
  }, [activeProfile, setActiveProfile])


  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-800">
            </div>
            <div className="grid flex-1 gap-1">
              <div className="h-4 w-24 rounded bg-zinc-800" />
              <div className="h-3 w-16 rounded bg-zinc-800" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-100"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-200">
                  <Settings className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {profiles.length === 0 ? (
                    <>
                      <span className="truncate font-semibold">Add AWS Profile</span>
                      <span className="truncate text-xs text-muted-foreground">Configure AWS credentials</span>
                    </>
                  ) : (
                    <>
                      <span className="truncate font-semibold">
                        {activeProfile?.profileName}
                      </span>
                    </>
                  )}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Connection Type
              </DropdownMenuLabel>
              
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => {
                  setIsDropdownOpen(false)
                  setShowPublicBucketDialog(true)
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Globe className="size-4 shrink-0" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">Public Buckets</p>
                  <p className="text-xs text-muted-foreground">Browse public S3 buckets</p>
                </div>
              </DropdownMenuItem>

              {profiles.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    AWS Profiles
                  </DropdownMenuLabel>
                  {profiles.map((profile) => (
                    <DropdownMenuItem
                      key={profile.profileName}
                      onClick={() => setActiveProfile(profile)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <Settings className="size-4 shrink-0" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{profile.profileName}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              <DropdownMenuItem 
                className="gap-2 p-2"
                onClick={() => {
                  setIsDropdownOpen(false)
                  setShowProfileDialog(true)
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  {profiles.length === 0 ? "Add AWS Profile" : "Add new profile"}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={showPublicBucketDialog} onOpenChange={setShowPublicBucketDialog}>
        <DialogContent className="dark:bg-zinc-800">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <PublicBucketForm />
        </DialogContent>
      </Dialog>

      <UserProfilePopover 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
        defaultTab="workspace-settings"
        hideSettings={true}
      />
    </>
  )
} 