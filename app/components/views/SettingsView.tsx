"use client";

import type { OrbitWorkspace } from "@/app/hooks/useOrbitWorkspace";

type SettingsViewProps = {
  workspace: OrbitWorkspace;
};

export function SettingsView({ workspace }: SettingsViewProps) {
  const { exportWorkspace, light, resetWorkspace, setLight } = workspace;

  return (
    <section className="panel settings">
      <h2>Workspace preferences</h2>
      <div className="setting-row">
        <div>
          <strong>Appearance</strong>
          <p className="muted">Choose the theme that helps you focus.</p>
        </div>
        <button onClick={() => setLight(!light)}>{light ? "Light mode" : "Dark mode"}</button>
      </div>
      <div className="setting-row">
        <div>
          <strong>Demo data</strong>
          <p className="muted">Restore the original projects and tasks.</p>
        </div>
        <button
          className="danger"
          onClick={() => {
            if (confirm("Reset all projects and tasks to demo data?")) resetWorkspace();
          }}
        >
          Reset workspace
        </button>
      </div>
      <div className="setting-row">
        <div>
          <strong>Export workspace</strong>
          <p className="muted">Download a backup of your projects and tasks.</p>
        </div>
        <button onClick={exportWorkspace}>Export JSON</button>
      </div>
    </section>
  );
}
