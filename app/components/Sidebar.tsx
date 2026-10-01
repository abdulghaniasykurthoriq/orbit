"use client";

import Link from "next/link";
import { ChevronDown, MoreHorizontal, Star } from "lucide-react";
import { routes } from "@/app/lib/routes";
import type { RouteKey } from "@/app/lib/types";

type SidebarProps = {
  activeRoute: RouteKey;
  mobileOpen: boolean;
  projectCount: number;
  openTaskCount: number;
  onNavigate: () => void;
};

export function Sidebar({ activeRoute, mobileOpen, projectCount, openTaskCount, onNavigate }: SidebarProps) {
  return (
    <aside className={mobileOpen ? "sidebar mobile-open" : "sidebar"}>
      <Link className="brand" href="/dashboard" onClick={onNavigate}>
        <span className="brand-mark">
          <Star size={23} fill="white" />
        </span>
        Orbit
        <span className="brand-dot">R</span>
      </Link>

      <button className="workspace">
        <span className="workspace-icon">A</span>
        <span>
          Agat Workspace
          <small>Pro workspace</small>
        </span>
        <ChevronDown size={15} />
      </button>

      <div className="nav-label">WORKSPACE</div>
      <nav>
        {routes.map((route, index) => {
          const Icon = route.icon;
          return (
            <div key={route.key}>
              {route.group && routes[index - 1]?.group !== route.group && (
                <div className="nav-label section-label">{route.group}</div>
              )}
              <Link
                className={activeRoute === route.key ? "nav-item active" : "nav-item"}
                href={route.href}
                onClick={onNavigate}
              >
                <Icon size={19} />
                {route.label}
                {route.key === "projects" && <span className="nav-count">{projectCount}</span>}
                {route.key === "tasks" && <span className="nav-count">{openTaskCount}</span>}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="storage-note">
          <span>Make room for great work.</span>
          <small>Your next idea starts here.</small>
          <div className="tiny-orbit">*</div>
        </div>
        <Link className="user" href="/settings" onClick={onNavigate}>
          <span className="avatar">AG</span>
          <span>
            Abdul Ghani
            <small>Fullstack Developer</small>
          </span>
          <MoreHorizontal size={17} />
        </Link>
      </div>
    </aside>
  );
}
