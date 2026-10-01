"use client";

import { members } from "@/app/lib/data";
import type { OrbitWorkspace } from "@/app/hooks/useOrbitWorkspace";

type MembersViewProps = {
  workspace: OrbitWorkspace;
};

export function MembersView({ workspace }: MembersViewProps) {
  const { tasks } = workspace;

  return (
    <div className="projects-grid">
      {members.map((member) => (
        <section className="panel profile-card" key={member.name}>
          <span className="avatar large" style={{ color: member.color, background: `${member.color}20` }}>
            {member.initial}
          </span>
          <h2>{member.name}</h2>
          <p className="muted">{member.role}</p>
          <div className="profile-metrics">
            <div>
              <strong>{tasks.filter((task) => task.assignee === member.name).length}</strong>
              <span>Assigned</span>
            </div>
            <div>
              <strong>{tasks.filter((task) => task.assignee === member.name && task.status === "done").length}</strong>
              <span>Completed</span>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
