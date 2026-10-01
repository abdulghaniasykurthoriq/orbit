"use client";

import { useEffect, useState } from "react";
import { CheckSquare } from "lucide-react";
import { Header } from "@/app/components/Header";
import { PageHeading } from "@/app/components/PageHeading";
import { Sidebar } from "@/app/components/Sidebar";
import { WorkspaceModal } from "@/app/components/WorkspaceModal";
import { AnalyticsView } from "@/app/components/views/AnalyticsView";
import { DashboardView } from "@/app/components/views/DashboardView";
import { MembersView } from "@/app/components/views/MembersView";
import { ProjectsView } from "@/app/components/views/ProjectsView";
import { SettingsView } from "@/app/components/views/SettingsView";
import { TasksView } from "@/app/components/views/TasksView";
import { useOrbitWorkspace } from "@/app/hooks/useOrbitWorkspace";
import { routeLabels } from "@/app/lib/routes";
import type { RouteKey } from "@/app/lib/types";

type OrbitAppProps = {
  activeRoute: RouteKey;
};

export function OrbitApp({ activeRoute }: OrbitAppProps) {
  const [mounted, setMounted] = useState(false);
  const workspace = useOrbitWorkspace();
  const title = routeLabels[activeRoute];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function createItem() {
    workspace.openModal(activeRoute === "projects" ? "project" : "task");
  }

  function renderView() {
    switch (activeRoute) {
      case "dashboard":
        return <DashboardView workspace={workspace} />;
      case "projects":
        return <ProjectsView workspace={workspace} />;
      case "tasks":
        return <TasksView mode="list" workspace={workspace} />;
      case "sprints":
        return <TasksView mode="board" workspace={workspace} />;
      case "analytics":
        return <AnalyticsView workspace={workspace} />;
      case "members":
        return <MembersView workspace={workspace} />;
      case "settings":
        return <SettingsView workspace={workspace} />;
    }
  }

  return (
    <div className={`app ${workspace.light ? "light" : ""}`}>
      <Sidebar
        activeRoute={activeRoute}
        mobileOpen={workspace.mobileOpen}
        projectCount={workspace.projects.length}
        openTaskCount={workspace.tasks.filter((task) => task.status !== "done").length}
        onNavigate={() => {
          workspace.setMobileOpen(false);
          workspace.setSearch("");
        }}
      />

      <main>
        <Header
          title={title}
          light={workspace.light}
          onToggleTheme={() => workspace.setLight(!workspace.light)}
          onToggleNavigation={() => workspace.setMobileOpen(!workspace.mobileOpen)}
        />

        <div className="content">
          <PageHeading
            route={activeRoute}
            title={title}
            search={workspace.search}
            onSearchChange={workspace.setSearch}
            onCreate={createItem}
          />
          {renderView()}
          <footer>
            <span>Orbit workspace</span>
            <span>Small steps. Meaningful progress. *</span>
          </footer>
        </div>
      </main>

      {workspace.notice && (
        <div role="status" className="toast">
          <CheckSquare size={18} />
          {workspace.notice}
        </div>
      )}

      <WorkspaceModal workspace={workspace} />
    </div>
  );
}
