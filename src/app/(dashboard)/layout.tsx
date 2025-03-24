import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-black">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              {/* Your breadcrumb or other header content */}
            </div>
            <UserButton 
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  userButtonBox: "hover:bg-zinc-800",
                  userButtonOuterIdentifier: "text-white",
                  userButtonPopoverCard: "bg-black border border-zinc-800",
                  userButtonPopoverText: "text-white",
                }
              }}
            />
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
} 