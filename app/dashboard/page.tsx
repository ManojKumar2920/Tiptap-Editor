
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import TextEditor from "@/components/Dashboard/TextEditor"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />


          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
         <TextEditor />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
