"use client"

import { 
  FolderIcon, 
  CloudIcon, 
  UploadCloudIcon, 
  DatabaseIcon, 
  FileIcon, 
  PackageIcon,
  ServerIcon,
  ShieldIcon,
  GlobeIcon,
  LayersIcon,
  BoxIcon,
  FolderOpenIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Gravity, { MatterBody } from "@/components/ui/gravity"
import { useState, useEffect } from "react"

interface EmptyStateProps {
  title?: string
  description?: string
  onAction?: () => void
  actionLabel?: string
  variant?: "bucket" | "files"
}

export function EmptyState({
  title = "No bucket selected",
  description = "Select a bucket to view its contents",
  onAction,
  actionLabel,
  variant = "bucket"
}: EmptyStateProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Shorter delay to start animation
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[500px] bg-zinc-50/50 dark:bg-neutral-800/40 rounded-lg overflow-hidden relative border border-zinc-200 dark:border-neutral-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid grid-cols-6 gap-4 p-8 opacity-[0.02]">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="aspect-square rounded-full bg-current" />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-4 z-10">
        <div className="rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-neutral-900/50 dark:to-neutral-800/50 p-4 shadow-xl">
          {variant === "bucket" ? (
            <CloudIcon className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
          ) : (
            <FolderIcon className="h-8 w-8 text-zinc-600 dark:text-zinc-400" />
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center max-w-sm">
            {description}
          </p>
        </div>
        {onAction && actionLabel && (
          <Button
            variant="outline"
            onClick={onAction}
            className="mt-2 relative z-20 shadow-lg hover:shadow-xl transition-shadow"
          >
            {actionLabel}
          </Button>
        )}
      </div>

      {/* Small Floating Icons */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.07]">
        {[
          { icon: CloudIcon, x: 10, y: 20, rotate: 15 },
          { icon: FileIcon, x: 25, y: 35, rotate: -10 },
          { icon: FolderIcon, x: 40, y: 15, rotate: 25 },
          { icon: DatabaseIcon, x: 55, y: 40, rotate: -15 },
          { icon: CloudIcon, x: 70, y: 25, rotate: 20 },
          { icon: FileIcon, x: 85, y: 45, rotate: -25 },
          { icon: FolderIcon, x: 15, y: 60, rotate: 30 },
          { icon: DatabaseIcon, x: 30, y: 75, rotate: -20 },
          { icon: CloudIcon, x: 45, y: 55, rotate: 15 },
          { icon: FileIcon, x: 60, y: 70, rotate: -30 },
          { icon: FolderIcon, x: 75, y: 85, rotate: 25 },
          { icon: DatabaseIcon, x: 90, y: 65, rotate: -15 },
          { icon: CloudIcon, x: 20, y: 90, rotate: 20 },
          { icon: FileIcon, x: 35, y: 80, rotate: -25 },
          { icon: FolderIcon, x: 50, y: 95, rotate: 30 },
          { icon: DatabaseIcon, x: 65, y: 85, rotate: -20 },
          { icon: CloudIcon, x: 80, y: 75, rotate: 15 },
          { icon: FileIcon, x: 95, y: 90, rotate: -30 },
          { icon: FolderIcon, x: 5, y: 45, rotate: 25 },
          { icon: DatabaseIcon, x: 82, y: 15, rotate: -15 },
        ].map(({ icon: Icon, x, y, rotate }, i) => (
          <div
            key={`icon-${i}`}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <Icon size={16} className="text-current" />
          </div>
        ))}
      </div>

      {/* Physics animation background */}
      <Gravity 
        gravity={{ x: 0, y: 0.3 }} 
        className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        debug={false}
      >
        {variant === "bucket" ? (
          // Bucket selection empty state
          <>
            <MatterBody x="20%" y="30%" angle={15}>
              <div className="text-2xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg px-6 py-3 flex items-center gap-2 shadow-lg">
                <CloudIcon className="h-5 w-5" />
                S3
              </div>
            </MatterBody>
            <MatterBody x="40%" y="20%" angle={-10}>
              <div className="text-xl bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-zinc-600 dark:to-zinc-700 text-white rounded-lg px-5 py-2 flex items-center gap-2 shadow-lg">
                <DatabaseIcon className="h-4 w-4" />
                Bucket
              </div>
            </MatterBody>
            <MatterBody x="60%" y="40%" angle={5}>
              <div className="text-lg bg-gradient-to-r from-violet-500 to-violet-600 dark:from-zinc-500 dark:to-zinc-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <PackageIcon className="h-4 w-4" />
                Storage
              </div>
            </MatterBody>
            <MatterBody x="25%" y="60%" angle={-8}>
              <div className="text-base bg-gradient-to-r from-purple-500 to-purple-600 dark:from-zinc-600 dark:to-zinc-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <GlobeIcon className="h-4 w-4" />
                Cloud
              </div>
            </MatterBody>
            <MatterBody x="75%" y="25%" angle={12}>
              <div className="text-base bg-gradient-to-r from-sky-500 to-sky-600 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <ServerIcon className="h-4 w-4" />
                AWS
              </div>
            </MatterBody>
            <MatterBody x="45%" y="70%" angle={-5}>
              <div className="text-base bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-zinc-500 dark:to-zinc-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <BoxIcon className="h-4 w-4" />
                Object
              </div>
            </MatterBody>
            <MatterBody x="85%" y="45%" angle={15}>
              <div className="text-base bg-gradient-to-r from-teal-500 to-teal-600 dark:from-zinc-600 dark:to-zinc-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <ShieldIcon className="h-4 w-4" />
                Secure
              </div>
            </MatterBody>
            <MatterBody x="15%" y="45%" angle={-12}>
              <div className="text-base bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <LayersIcon className="h-4 w-4" />
                Region
              </div>
            </MatterBody>
          </>
        ) : (
          // Empty bucket state
          <>
            <MatterBody x="30%" y="20%" angle={-5}>
              <div className="text-2xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg px-6 py-3 flex items-center gap-2 shadow-lg">
                <FileIcon className="h-5 w-5" />
                Files
              </div>
            </MatterBody>
            <MatterBody x="50%" y="30%" angle={10}>
              <div className="text-xl bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-zinc-600 dark:to-zinc-700 text-white rounded-lg px-5 py-2 flex items-center gap-2 shadow-lg">
                <UploadCloudIcon className="h-4 w-4" />
                Upload
              </div>
            </MatterBody>
            <MatterBody x="70%" y="25%" angle={-8}>
              <div className="text-lg bg-gradient-to-r from-violet-500 to-violet-600 dark:from-zinc-500 dark:to-zinc-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <CloudIcon className="h-4 w-4" />
                Cloud
              </div>
            </MatterBody>
            <MatterBody x="25%" y="50%" angle={15}>
              <div className="text-base bg-gradient-to-r from-purple-500 to-purple-600 dark:from-zinc-600 dark:to-zinc-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <LayersIcon className="h-4 w-4" />
                Share
              </div>
            </MatterBody>
            <MatterBody x="65%" y="55%" angle={-12}>
              <div className="text-base bg-gradient-to-r from-sky-500 to-sky-600 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <ServerIcon className="h-4 w-4" />
                Sync
              </div>
            </MatterBody>
            <MatterBody x="40%" y="65%" angle={8}>
              <div className="text-base bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-zinc-500 dark:to-zinc-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <ShieldIcon className="h-4 w-4" />
                Secure
              </div>
            </MatterBody>
            <MatterBody x="85%" y="40%" angle={-15}>
              <div className="text-base bg-gradient-to-r from-teal-500 to-teal-600 dark:from-zinc-600 dark:to-zinc-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <FolderOpenIcon className="h-4 w-4" />
                Browse
              </div>
            </MatterBody>
            <MatterBody x="15%" y="35%" angle={20}>
              <div className="text-base bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-zinc-700 dark:to-zinc-800 text-white rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                <PackageIcon className="h-4 w-4" />
                Store
              </div>
            </MatterBody>
          </>
        )}
      </Gravity>
    </div>
  )
} 