"use client";

import { MoreHorizontal } from "lucide-react";
import { members } from "@/app/lib/data";
import { formatDate, taskDisplayId } from "@/app/lib/format";
import type { Project, Task } from "@/app/lib/types";

type TaskCardProps = {
  task: Task;
  project?: Project;
  onOpen: (task: Task) => void;
};

export function TaskCard({ task, project, onOpen }: TaskCardProps) {
  const member = members.find((item) => item.name === task.assignee);

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)}
      onClick={() => onOpen(task)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen(task);
      }}
    >
      <div className="card-top">
        <span style={{ color: project?.color }}>{project?.name || "Unassigned"}</span>
        <MoreHorizontal size={16} />
      </div>
      <h4>{task.title}</h4>
      <div className="task-meta">
        <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
        <span>{task.status === "done" ? <span className="green">Done</span> : formatDate(task.due)}</span>
      </div>
      <div className="task-bottom">
        <span className="task-id">{taskDisplayId(task.id)}</span>
        <span
          className="avatar small"
          style={{ background: `${member?.color || "#8b78ff"}25`, color: member?.color || "#8b78ff" }}
        >
          {member?.initial || "AG"}
        </span>
      </div>
    </div>
  );
}
