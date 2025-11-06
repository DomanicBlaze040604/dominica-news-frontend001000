import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  FileEdit,
  AlertCircle,
  Share2,
  Settings,
  BarChart3,
  Image,
  Tag,
  Calendar,
} from "lucide-react";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Articles", url: "/admin/articles", icon: FileText },
  { title: "Categories", url: "/admin/categories", icon: Layers },
  { title: "Authors", url: "/admin/authors", icon: Users },
];

const contentItems = [
  { title: "Pages", url: "/admin/pages", icon: FileEdit },
  { title: "Breaking News", url: "/admin/breaking-news", icon: AlertCircle },
  { title: "Media Library", url: "/admin/media", icon: Image },
  { title: "Tags", url: "/admin/tags", icon: Tag },
];

const settingsItems = [
  { title: "Social Media", url: "/admin/social-media", icon: Share2 },
  { title: "Site Settings", url: "/admin/settings", icon: Settings },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Schedule", url: "/admin/schedule", icon: Calendar },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (url: string, exact?: boolean) => {
    if (exact) return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  const MenuSection = ({ 
    items, 
    label 
  }: { 
    items: typeof mainItems; 
    label: string;
  }) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url, item.exact);
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active}>
                  <NavLink
                    to={item.url}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          {!collapsed ? (
            <div>
              <h2 className="font-display text-xl font-bold text-primary">Admin</h2>
              <p className="text-xs text-muted-foreground">Dominica News</p>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DN</span>
            </div>
          )}
        </div>

        <MenuSection items={mainItems} label="Main" />
        <MenuSection items={contentItems} label="Content" />
        <MenuSection items={settingsItems} label="Settings" />
      </SidebarContent>
    </Sidebar>
  );
}
