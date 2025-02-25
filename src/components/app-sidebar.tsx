import { LayoutDashboard, FolderKanban, Users, DollarSign, Settings, LogOut, Building2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ModeToggle"
import { getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server"
import { Button } from "./ui/button"
import Link from "next/link"
import { useTheme } from 'next-themes'
// Menu items.
const items = [
  {
    title: "דף הבית",
    url: "/home",
    icon: LayoutDashboard ,
  },
  {
    title: "פרויקטים",
    url: "/projects",
    icon: FolderKanban ,
  },
  {
    title: "משתמשים",
    url: "/users",
    icon: Users  ,
  },
  {
    title: "מקורות מימון",
    url: "/fundingsources",
    icon: DollarSign  ,
  },
  {
    title: "ישובים",
    url: "/cities",
    icon: Building2   ,
  },
]

export async function  AppSidebar() {
  const {getUser} = getKindeServerSession();
  const user = await getUser();
  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
        <SidebarHeader className="flex flex-row items-center justify-between gap-4 w-full px-4 rtl:flex-row">
          <h2 className="text-2xl font-bold text-blue-900 order-2 rtl:order-1">מערכת פתרו"ן</h2>
          <div className="order-1 rtl:order-2">
            <ModeToggle />
          </div>
        </SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu className="mt-10">
            {items.map((item) => {
                const isActive = false; // Check if the item is active
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "bg-blue-100 rounded-md" : ""} // Apply a different background for the active item
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span className="text-lg">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
              <SidebarMenuItem>
                {user && 
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.picture ?? ""} />
                    <AvatarFallback>{user.given_name}</AvatarFallback>
                  </Avatar>
                  <p>{user.given_name + " " + user.family_name}</p>
                  
                  <Button variant={'ghost'} size={'icon'} aria-label="Logout" title="Logout" className="rounded-full mr-auto" asChild>
                        <LogoutLink>
                            <LogOut/>
                        </LogoutLink>
                  </Button>
                </div>
                }
              </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  )
}
