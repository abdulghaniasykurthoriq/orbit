"use client";

import { Plus, Search } from "lucide-react";
import type { RouteKey } from "@/app/lib/types";

const descriptions: Record<RouteKey, string> = {
  dashboard: "Good morning, Abdul. Let's make today count.",
  projects: "Big ideas. Clear plans. One shared workspace.",
  tasks: "Focus on what moves your work forward.",
  sprints: "A little momentum, every single day.",
  analytics: "A closer look at your team's momentum.",
  members: "Good work starts with great people.",
  settings: "Make this workspace your own.",
};

type PageHeadingProps = {
  route: RouteKey;
  title: string;
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
};

export function PageHeading({ route, title, search, onSearchChange, onCreate }: PageHeadingProps) {
  const itemType = route === "projects" ? "project" : "task";
  const canCreate = route !== "analytics" && route !== "members" && route !== "settings";

  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">YOUR WORK, IN ORBIT</div>
        <h1>{title}</h1>
        <p>{descriptions[route]}</p>
      </div>
      {canCreate && (
        <div className="page-actions">
          <div className="search">
            <Search size={17} />
            <input
              id="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={route === "projects" ? "Search projects..." : "Search tasks..."}
              aria-label="Search"
            />
            <kbd>Ctrl K</kbd>
          </div>
          <button className="primary" onClick={onCreate}>
            <Plus size={17} />
            New {itemType}
          </button>
        </div>
      )}
    </div>
  );
}
