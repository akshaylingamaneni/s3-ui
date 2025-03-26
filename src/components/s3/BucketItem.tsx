'use client'

import {
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import type { BucketConfig } from '@/types/storage'
import { Globe, Lock } from 'lucide-react'
import Link from 'next/link'

interface BucketItemProps {
  bucket: BucketConfig
}

export function BucketItem({ bucket }: BucketItemProps) {
  return (
    <SidebarMenuItem key={bucket.name} className="list-none">
      <SidebarMenuButton asChild>
        <Link 
          href={`/dashboard/buckets/${bucket.name}`} 
          className="flex items-center justify-between px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 rounded-lg transition-colors group w-full"
        >
          <div className="flex items-center gap-2 truncate">
            {bucket.visibility === 'private' ? (
              <Lock className="h-4 w-4 text-muted-foreground/70" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground/70" />
            )}
            <span className="truncate">{bucket.name}</span>
          </div>
          <span className="text-[11px] text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
            {bucket.region}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}