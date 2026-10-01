"use client";

import { columns } from "@/app/lib/data";
import type { OrbitWorkspace } from "@/app/hooks/useOrbitWorkspace";

type AnalyticsViewProps = {
  workspace: OrbitWorkspace;
};

export function AnalyticsView({ workspace }: AnalyticsViewProps) {
  const { completedCount, projectProgress, projects, tasks } = workspace;
  const progressCount = tasks.filter((task) => task.status === "progress").length;
  const completedPercent = tasks.length ? (completedCount / tasks.length) * 100 : 0;
  const progressPercent = tasks.length ? ((completedCount + progressCount) / tasks.length) * 100 : 0;

  return (
    <div className="analytics-grid">
      <section className="panel analytics-card">
        <h2>Task distribution</h2>
        <div
          className="donut"
          style={{
            background: `conic-gradient(#2bcfa8 0 ${completedPercent}%, #8b78ff 0 ${progressPercent}%, #353648 0)`,
          }}
        >
          <div>
            <strong>{tasks.length}</strong>
            <span>Total tasks</span>
          </div>
        </div>
        <div className="legend">
          {columns.map((column) => (
            <span key={column.status}>
              <i style={{ background: column.color }} />
              {column.label} - {tasks.filter((task) => task.status === column.status).length}
            </span>
          ))}
        </div>
      </section>

      <section className="panel analytics-card">
        <h2>Project completion</h2>
        <p className="muted">Completed tasks as a share of each project.</p>
        {projects.map((project) => (
          <div className="analytics-bar" key={project.id}>
            <div>
              <span>{project.name}</span>
              <strong>{projectProgress(project.id)}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${projectProgress(project.id)}%`, background: project.color }} />
            </div>
          </div>
        ))}
      </section>

      <section className="panel analytics-card">
        <h2>Priority breakdown</h2>
        {(["High", "Medium", "Low"] as const).map((priority) => (
          <div className="priority-row" key={priority}>
            <span className={`badge ${priority.toLowerCase()}`}>{priority}</span>
            <strong>{tasks.filter((task) => task.priority === priority).length} tasks</strong>
          </div>
        ))}
      </section>

      <section className="panel analytics-card">
        <h2>Completion rate</h2>
        <div className="big-metric">
          {tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}
          <span>%</span>
        </div>
        <p className="muted">
          {completedCount} of {tasks.length} tasks completed. Keep going!
        </p>
      </section>
    </div>
  );
}
