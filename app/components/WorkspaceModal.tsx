"use client";

import { Trash2, X } from "lucide-react";
import { columns, members } from "@/app/lib/data";
import type { OrbitWorkspace } from "@/app/hooks/useOrbitWorkspace";
import type { Project, Task } from "@/app/lib/types";

type WorkspaceModalProps = {
  workspace: OrbitWorkspace;
};

export function WorkspaceModal({ workspace }: WorkspaceModalProps) {
  const { closeModal, deleteItem, modal, projects, saveItem } = workspace;

  if (!modal) return null;

  const isTask = modal.kind === "task";
  const item = modal.item;
  const title = isTask ? (item as Task | null)?.title : (item as Project | null)?.name;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <h2 id="modal-title">
            {item?.id ? "Edit" : "Create"} {modal.kind}
          </h2>
          <button aria-label="Close dialog" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={saveItem}>
          <label>
            {isTask ? "Task title" : "Project name"}
            <input
              name="title"
              required
              autoFocus
              maxLength={150}
              defaultValue={title || ""}
              placeholder={isTask ? "What needs to be done?" : "Give your project a name"}
            />
          </label>

          <label>
            Description
            <textarea name="description" rows={3} defaultValue={item?.description || ""} placeholder="Add a little context..." />
          </label>

          <div className="form-grid">
            {isTask ? (
              <>
                <label>
                  Project
                  <select name="project" defaultValue={(item as Task | null)?.project || projects[0]?.id}>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                    <option value="">Unassigned</option>
                  </select>
                </label>
                <label>
                  Priority
                  <select name="priority" defaultValue={(item as Task | null)?.priority || "Medium"}>
                    {["Low", "Medium", "High"].map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Status
                  <select name="status" defaultValue={(item as Task | null)?.status || "todo"}>
                    {columns.map((column) => (
                      <option key={column.status} value={column.status}>
                        {column.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Assignee
                  <select name="assignee" defaultValue={(item as Task | null)?.assignee || members[0].name}>
                    {members.map((member) => (
                      <option key={member.name}>{member.name}</option>
                    ))}
                  </select>
                </label>
              </>
            ) : (
              <>
                <label>
                  Status
                  <select name="status" defaultValue={(item as Project | null)?.status || "Planning"}>
                    {["Planning", "Active", "Review", "On Hold", "Completed"].map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Color
                  <input type="color" name="color" defaultValue={(item as Project | null)?.color || "#8b78ff"} />
                </label>
              </>
            )}
            <label>
              Due date
              <input type="date" name="due" defaultValue={item?.due || ""} />
            </label>
          </div>

          <div className="modal-actions">
            {item?.id && (
              <button
                type="button"
                className="danger delete"
                onClick={() => {
                  if (confirm(`Delete this ${modal.kind}?`)) deleteItem();
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button className="primary" type="submit">
              {item?.id ? "Save changes" : `Create ${modal.kind}`}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
