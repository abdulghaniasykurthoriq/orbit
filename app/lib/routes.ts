import {
  BarChart3,
  CheckSquare,
  Folder,
  LayoutDashboard,
  Layers,
  Settings,
  Users,
} from "lucide-react";
import type { NavItem, RouteKey } from "./types";

export const routes: NavItem[] = [
  { key: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", href: "/projects", label: "Projects", icon: Folder },
  { key: "tasks", href: "/tasks", label: "My Tasks", icon: CheckSquare },
  { key: "sprints", href: "/sprints", label: "Sprints", icon: Layers },
  { key: "analytics", href: "/analytics", label: "Analytics", icon: BarChart3, group: "INSIGHTS" },
  { key: "members", href: "/members", label: "Members", icon: Users, group: "TEAM" },
  { key: "settings", href: "/settings", label: "Settings", icon: Settings },
];

export const routeLabels = routes.reduce(
  (labels, route) => ({ ...labels, [route.key]: route.label }),
  {} as Record<RouteKey, string>,
);
