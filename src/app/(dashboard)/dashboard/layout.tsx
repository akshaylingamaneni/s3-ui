import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { BucketBreadcrumb } from "@/components/layout/BucketBreadcrumb"
import { SignOutButton } from "@clerk/nextjs"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <BucketBreadcrumb />
          </div>
        </header>
        {/* <SignOutButton /> */}
        <div className="">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  )
} 