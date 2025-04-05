"use client"

import {
  ChevronDown,
  Database,
  FolderOpen,
  LifeBuoy,
  Send,
  Settings2,
  Settings
} from "lucide-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UserProfilePopover } from "@/components/user-profile-popover"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import { ThemeToggle } from "./ui/theme-toggle"
import { UserProfile } from "@clerk/nextjs"
import { ProfileSwitcher } from "@/components/profile-switcher"
import { BucketsList } from "./s3/BucketsList"
import { AWSCredentials, AwsSettings } from "@/components/aws-settings"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { useAWSStore } from "@/store/aws-store"
import { ProfileCombobox } from "./profile-combobox"

// Temporary mock data - this will come from your bucket list later
const mockBuckets = [
  { name: "my-bucket-1", region: "us-east-1" },
  { name: "my-bucket-2", region: "eu-west-1" },
  { name: "my-bucket-3", region: "ap-south-1" },
  { name: "my-bucket-4", region: "ap-south-1" },
  { name: "my-bucket-5", region: "ap-south-1" },
  { name: "my-bucket-6", region: "ap-south-1" },
  { name: "my-bucket-7", region: "ap-south-1" },
  { name: "my-bucket-8", region: "ap-south-1" },  
  
  // ... more buckets
]

const navSecondary = [
  {
    title: "Support",
    url: "#",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
]

function BucketList() {
  const [isOpen, setIsOpen] = React.useState(true)
  const { activeProfile } = useAWSStore()

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="list-none">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <div className="flex items-center">
          <Database className="mr-2 h-4 w-4" />
          <span>Buckets</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="list-none">
        <nav className="space-y-0.5 list-none py-1">
          <BucketsList selectedProfile={activeProfile?.profileName || ""} />
        </nav>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="-ml-2" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#f1f1f1,#f1f1f1),linear-gradient(#f1f1f1_50%,rgba(241,241,241,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%,0.7),hsl(90,100%,63%,0.7),hsl(210,100%,63%,0.7),hsl(195,100%,63%,0.7),hsl(270,100%,63%,0.7))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 relative flex aspect-square size-8 items-center justify-center rounded-md shadow-sm">
                  <FolderOpen className="size-4 text-zinc-800 dark:text-white relative z-10" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">S3 UI</span>
                  <span className="truncate text-xs text-muted-foreground">Bucket Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <div className="py-2">
        <ProfileCombobox />
      </div>

      <SidebarContent>
        <BucketList />
      </SidebarContent>
      
      <SidebarFooter className="pb-5">
        <SidebarMenu >
        {navSecondary.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link 
                  href={item.url} 
                  className="flex items-center px-2 -ml-1 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 rounded-lg transition-colors group w-full"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-1 py-1.5 text-sm font-normal text-muted-foreground hover:text-primary hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 rounded-lg -ml-2"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="text-sm">AWS Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[400px] sm:w-[540px] dark:bg-zinc-900">
                <SheetHeader>
                  <SheetTitle>AWS Settings</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <AwsSettings />
                </div>
              </SheetContent>
            </Sheet>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <UserProfilePopover />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
