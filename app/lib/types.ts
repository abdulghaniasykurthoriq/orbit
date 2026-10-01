import type { LucideIcon } from "lucide-react";

export type Status = "todo" | "progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  project: string;
  status: Status;
  priority: "Low" | "Medium" | "High";
  due: string;
  assignee: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  color: string;
  status: string;
  due: string;
};

export type Member = {
  name: string;
  initial: string;
  role: string;
  color: string;
};

export type RouteKey =
  | "dashboard"
  | "projects"
  | "tasks"
  | "sprints"
  | "analytics"
  | "members"
  | "settings";

export type NavItem = {
  href: `/${RouteKey}`;
  key: RouteKey;
  label: string;
  icon: LucideIcon;
  group?: "INSIGHTS" | "TEAM";
};

export type Column = {
  status: Status;
  label: string;
  color: string;
};
