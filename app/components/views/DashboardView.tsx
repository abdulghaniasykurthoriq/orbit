"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Calendar, CheckSquare, Clock, Folder, Pause, Play, Square, Users } from "lucide-react";
import { columns, members } from "@/app/lib/data";
import { formatDate, statusClass } from "@/app/lib/format";
import type { OrbitWorkspace } from "@/app/hooks/useOrbitWorkspace";
import { TaskCard } from "@/app/components/TaskCard";

type DashboardViewProps = {
  workspace: OrbitWorkspace;
};

export function DashboardView({ workspace }: DashboardViewProps) {
  const router = useRouter();
  const {
    activity,
    completedCount,
    moveTask,
    openModal,
    overdueCount,
    projectProgress,
    projects,
    running,
    seconds,
    setFilter,
    setRunning,
    setSeconds,
    tasks,
    visibleTasks,
  } = workspace;

  const stats = [
    { icon: Folder, value: projects.filter((project) => project.status !== "Completed").length, label: "Active projects", color: "#8b78ff" },
    { icon: CheckSquare, value: completedCount, label: "Tasks completed", color: "#2bcfa8" },
    { icon: Clock, value: overdueCount, label: "Overdue tasks", color: "#efb346" },
    { icon: Users, value: members.length, label: "Team members", color: "#e56bc1" },
  ];

  const elapsed = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  function goToProject(projectId: string) {
    setFilter(projectId);
    router.push("/sprints");
  }

  return (
    <>
      <div className="stats">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div className="stat" key={stat.label}>
              <div className="stat-top">
                <span className="stat-icon" style={{ color: stat.color, background: `${stat.color}18` }}>
                  <Icon size={19} />
                </span>
                <span className="stat-caption">
                  {index === 1 ? "Great progress" : index === 2 ? "Needs attention" : "This workspace"}
                  <ArrowUpRight size={13} />
                </span>
              </div>
              <div className="stat-number">{String(stat.value).padStart(2, "0")}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="spark">
                {[30, 45, 38, 55, 47, 65, 60, 85, 78, 100].map((height, sparkIndex) => (
                  <span
                    key={sparkIndex}
                    style={{ height: `${height}%`, background: stat.color, opacity: sparkIndex === 9 ? 1 : 0.22 + sparkIndex * 0.035 }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="panel">
            <div className="panel-heading">
              <h2>
                Sprint board <span className="muted">/ Sprint 01</span>
                <span className="badge inprogress">IN PROGRESS</span>
              </h2>
              <button className="text-button" onClick={() => router.push("/sprints")}>
                Full board <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="kanban compact">
              {columns.map((column) => (
                <div
                  className="column"
                  key={column.status}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => moveTask(event.dataTransfer.getData("text/plain"), column.status)}
                >
                  <div className="column-head">
                    <span>
                      <i style={{ background: column.color }} />
                      {column.label}
                    </span>
                    <span className="count">{visibleTasks.filter((task) => task.status === column.status).length}</span>
                  </div>
                  {visibleTasks
                    .filter((task) => task.status === column.status)
                    .slice(0, 2)
                    .map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        project={projects.find((project) => project.id === task.project)}
                        onOpen={(item) => openModal("task", item)}
                      />
                    ))}
                </div>
              ))}
            </div>
          </section>

          <div className="lower-grid">
            <section className="panel">
              <div className="panel-heading">
                <h2>Active projects</h2>
                <button className="text-button" onClick={() => router.push("/projects")}>
                  View all <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="project-rows">
                {projects.slice(0, 4).map((project) => (
                  <button key={project.id} className="project-row" onClick={() => goToProject(project.id)}>
                    <span className="project-dot" style={{ background: project.color }} />
                    <div>
                      <h4>{project.name}</h4>
                      <small>
                        <CheckSquare size={12} />
                        {tasks.filter((task) => task.project === project.id).length} tasks
                        <Calendar size={12} />
                        {formatDate(project.due)}
                      </small>
                    </div>
                    <span className={`badge ${statusClass(project.status)}`}>{project.status}</span>
                    <div className="progress-track">
                      <span style={{ width: `${projectProgress(project.id)}%`, background: project.color }} />
                    </div>
                    <span className="progress-value">{projectProgress(project.id)}%</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <h2>Team workload</h2>
                <Users size={16} className="muted" />
              </div>
              {members.map((member) => (
                <div className="member-row" key={member.name}>
                  <span className="avatar" style={{ color: member.color, background: `${member.color}20` }}>
                    {member.initial}
                  </span>
                  <div>
                    <strong>{member.name}</strong>
                    <small>{member.role}</small>
                  </div>
                  <div className="workload-number">
                    {tasks.filter((task) => task.assignee === member.name && task.status !== "done").length}
                    <small>tasks</small>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>

        <div className="dashboard-side">
          <section className="panel activity">
            <div className="panel-heading">
              <h2>Recent activity</h2>
              <Clock size={16} className="muted" />
            </div>
            <div className="activity-list">
              {activity.slice(0, 5).map((item, index) => (
                <div className="activity-row" key={`${item}-${index}`}>
                  <span
                    className="avatar small"
                    style={{ background: `${members[index % members.length].color}20`, color: members[index % members.length].color }}
                  >
                    {members[index % members.length].initial}
                  </span>
                  <div>
                    <p>{item}</p>
                    <small>{index === 0 ? "Just now" : "Earlier in this workspace"}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="activity-footer">All caught up. Keep the momentum.</div>
          </section>

          <section className="timer">
            <div>
              <Clock size={16} />
              Time tracker
              <span className="badge">FOCUS</span>
            </div>
            <p>{elapsed}</p>
            <span>Time for your next great idea.</span>
            <div className="timer-controls">
              <button aria-label={running ? "Pause timer" : "Start timer"} onClick={() => setRunning(!running)}>
                {running ? <Pause size={21} fill="white" /> : <Play size={21} fill="white" />}
              </button>
              <button
                aria-label="Reset timer"
                onClick={() => {
                  setRunning(false);
                  setSeconds(0);
                }}
              >
                <Square size={18} fill="white" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
