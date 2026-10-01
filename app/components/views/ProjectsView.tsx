"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Calendar, Folder, MoreHorizontal, Plus } from "lucide-react";
import { formatDate, statusClass } from "@/app/lib/format";
import type { OrbitWorkspace } from "@/app/hooks/useOrbitWorkspace";

type ProjectsViewProps = {
  workspace: OrbitWorkspace;
};

export function ProjectsView({ workspace }: ProjectsViewProps) {
  const router = useRouter();
  const { openModal, projectProgress, projects, search, setFilter, tasks } = workspace;
  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()));

  function openBoard(projectId: string) {
    setFilter(projectId);
    router.push("/sprints");
  }

  return (
    <div className="projects-grid">
      {filteredProjects.map((project) => (
        <section className="panel project-card" key={project.id}>
          <div className="project-card-top">
            <span className="project-symbol" style={{ color: project.color, background: `${project.color}20` }}>
              <Folder size={22} />
            </span>
            <button aria-label={`Edit ${project.name}`} className="icon-button" onClick={() => openModal("project", project)}>
              <MoreHorizontal size={20} />
            </button>
          </div>
          <span className={`badge ${statusClass(project.status)}`}>{project.status}</span>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <div className="progress-label">
            <span>Progress</span>
            <span>{projectProgress(project.id)}%</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${projectProgress(project.id)}%`, background: project.color }} />
          </div>
          <div className="project-card-bottom">
            <span>
              <Calendar size={14} />
              {formatDate(project.due)}
            </span>
            <button className="text-button" onClick={() => openBoard(project.id)}>
              {tasks.filter((task) => task.project === project.id).length} tasks <ArrowUpRight size={14} />
            </button>
          </div>
        </section>
      ))}
      <button className="new-project-card" onClick={() => openModal("project")}>
        <Plus size={25} />
        Create a project
      </button>
    </div>
  );
}
