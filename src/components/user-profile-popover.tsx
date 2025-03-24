'use client'

import React from 'react'
import { UserProfile } from '@clerk/nextjs'
import { dark, experimental__simple } from '@clerk/themes'
import { useTheme } from 'next-themes'
import { DotIcon, Fingerprint, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Settings2 } from 'lucide-react'
import { WorkspaceSettings } from '@/components/workspace-settings'

export function UserProfilePopover() {
    const { theme } = useTheme()
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center text-sm text-muted-foreground hover:text-primary hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 rounded-lg transition-colors group w-full justify-start font-normal"
                >
                    <Settings2 className="h-4 w-4 mr-2 -ml-2" />
                    Settings
                </Button>
            </DialogTrigger>

            <DialogContent
                className="p-2 min-w-[900px] border-border bg-background/80 backdrop-blur-sm flex flex-row items-center justify-center"
            >
                <DialogTitle className='hidden'>Workspace Settings</DialogTitle>

                <div className='flex flex-col gap-4'>
                    <UserProfile
                        appearance={{
                            baseTheme: theme === "dark" ? dark : experimental__simple,
                        }}
                        routing="hash"
                    >
                        <UserProfile.Page label="Workspace Settings" labelIcon={<Fingerprint className='h-4 w-4' />} url="workspace-settings">
                            <WorkspaceSettings defaultTab="Aws Settings" />
                        </UserProfile.Page>
                        <UserProfile.Page label="account" />
                        <UserProfile.Page label="security" />
                    </UserProfile>
                </div>
            </DialogContent>
        </Dialog>
    )
} 