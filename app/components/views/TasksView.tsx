"use client";

import { useRouter } from "next/navigation";
import { CheckSquare, Layers, Plus } from "lucide-react";
import { columns } from "@/app/lib/data";
import { formatDate } from "@/app/lib/format";
import type { OrbitWorkspace } from "@/app/hooks/useOrbitWorkspace";
import type { Status, Task } from "@/app/lib/types";
import { TaskCard } from "@/app/components/TaskCard";

type TasksViewProps = {
  mode: "board" | "list";
  workspace: OrbitWorkspace;
};

export function TasksView({ mode, workspace }: TasksViewProps) {
  const router = useRouter();
  const { filter, moveTask, openModal, projects, setFilter, visibleTasks } = workspace;

  return (
    <>
      <div className="toolbar">
        <div className="view-switch">
          <button className={mode === "board" ? "selected" : ""} onClick={() => router.push("/sprints")}>
            <Layers size={16} />
            Board
          </button>
          <button className={mode === "list" ? "selected" : ""} onClick={() => router.push("/tasks")}>
            <CheckSquare size={16} />
            List
          </button>
        </div>
        <select aria-label="Filter project" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {mode === "board" ? (
        <div className="kanban full">
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
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projects.find((project) => project.id === task.project)}
                    onOpen={(item) => openModal("task", item)}
                  />
                ))}
              <button className="add-task" onClick={() => openModal("task", { status: column.status } as Task)}>
                <Plus size={16} />
                Add task
              </button>
            </div>
          ))}
        </div>
      ) : (
        <section className="panel task-list">
          {visibleTasks.length === 0 ? (
            <div className="empty">No tasks found. Create a task or change your search.</div>
          ) : (
            visibleTasks.map((task) => (
              <div className="task-list-row" key={task.id}>
                <button
                  className={`check ${task.status === "done" ? "checked" : ""}`}
                  aria-label="Toggle task completion"
                  onClick={() => moveTask(task.id, task.status === "done" ? "todo" : "done")}
                />
                <button className="task-title" onClick={() => openModal("task", task)}>
                  {task.title}
                  <small>{projects.find((project) => project.id === task.project)?.name}</small>
                </button>
                <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                <select
                  aria-label={`Status of ${task.title}`}
                  value={task.status}
                  onChange={(event) => moveTask(task.id, event.target.value as Status)}
                >
                  {columns.map((column) => (
                    <option key={column.status} value={column.status}>
                      {column.label}
                    </option>
                  ))}
                </select>
                <span className="muted">{formatDate(task.due)}</span>
              </div>
            ))
          )}
        </section>
      )}
    </>
  );
}
