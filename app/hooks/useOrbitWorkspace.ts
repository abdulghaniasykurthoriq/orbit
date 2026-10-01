"use client";

import { useEffect, useMemo, useState } from "react";
import { columns, defaultActivity, initialProjects, initialTasks } from "@/app/lib/data";
import type { Project, Status, Task } from "@/app/lib/types";

const STORAGE_KEY = "orbit-v2";

type ModalState = {
  kind: "task" | "project";
  item: Task | Project | null;
} | null;

export function useOrbitWorkspace() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [light, setLight] = useState(false);
  const [notice, setNotice] = useState("");
  const [activity, setActivity] = useState<string[]>(defaultActivity);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("orbit-v1");
      if (saved) {
        const data = JSON.parse(saved) as Partial<{
          tasks: Task[];
          projects: Project[];
          activity: string[];
          light: boolean;
        }>;

        if (Array.isArray(data.tasks) && Array.isArray(data.projects)) {
          setTasks(data.tasks);
          setProjects(data.projects);
          setActivity(data.activity || defaultActivity);
          setLight(Boolean(data.light));
        }
      }
    } catch {
      setNotice("Saved workspace could not be loaded.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, projects, activity, light }));
    } catch {
      setNotice("Storage is full. Changes could not be saved.");
    }
  }, [activity, light, projects, ready, tasks]);

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!notice) return;

    const id = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("search")?.focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const visibleTasks = useMemo(() => {
    const query = search.toLowerCase();

    return tasks.filter((task) => {
      const matchesProject = filter === "all" || task.project === filter;
      const matchesSearch = `${task.title} ${task.assignee}`.toLowerCase().includes(query);
      return matchesProject && matchesSearch;
    });
  }, [filter, search, tasks]);

  const completedCount = tasks.filter((task) => task.status === "done").length;
  const overdueCount = tasks.filter(
    (task) => task.status !== "done" && task.due && task.due < new Date().toISOString().slice(0, 10),
  ).length;

  function log(message: string) {
    setActivity((items) => [message, ...items].slice(0, 12));
    setNotice(message);
  }

  function openModal(kind: "task" | "project", item: Task | Project | null = null) {
    setModal({ kind, item });
  }

  function closeModal() {
    setModal(null);
  }

  function moveTask(id: string, status: Status) {
    setTasks((items) => items.map((task) => (task.id === id ? { ...task, status } : task)));
    log(`Task moved to ${columns.find((column) => column.status === status)?.label}`);
  }

  function projectProgress(projectId: string) {
    const projectTasks = tasks.filter((task) => task.project === projectId);
    if (!projectTasks.length) return 0;

    return Math.round((projectTasks.filter((task) => task.status === "done").length / projectTasks.length) * 100);
  }

  function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!modal) return;

    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return;

    if (modal.kind === "task") {
      const current = modal.item as Task | null;
      const task: Task = {
        id: current?.id || crypto.randomUUID(),
        title,
        description: String(form.get("description") || ""),
        project: String(form.get("project") || ""),
        status: String(form.get("status") || "todo") as Status,
        priority: String(form.get("priority") || "Medium") as Task["priority"],
        due: String(form.get("due") || ""),
        assignee: String(form.get("assignee") || ""),
      };

      setTasks((items) =>
        current?.id ? items.map((item) => (item.id === task.id ? task : item)) : [...items, task],
      );
      log(current?.id ? "Task updated" : "New task created");
    } else {
      const current = modal.item as Project | null;
      const project: Project = {
        id: current?.id || crypto.randomUUID(),
        name: title,
        description: String(form.get("description") || ""),
        color: String(form.get("color") || "#8b78ff"),
        status: String(form.get("status") || "Planning"),
        due: String(form.get("due") || ""),
      };

      setProjects((items) =>
        current?.id ? items.map((item) => (item.id === project.id ? project : item)) : [...items, project],
      );
      log(current?.id ? "Project updated" : "New project created");
    }

    closeModal();
  }

  function deleteItem() {
    if (!modal?.item?.id) return;

    if (modal.kind === "task") {
      setTasks((items) => items.filter((task) => task.id !== modal.item?.id));
      log("Task deleted");
    } else {
      setProjects((items) => items.filter((project) => project.id !== modal.item?.id));
      setTasks((items) => items.map((task) => (task.project === modal.item?.id ? { ...task, project: "" } : task)));
      log("Project deleted");
    }

    closeModal();
  }

  function resetWorkspace() {
    setTasks(initialTasks);
    setProjects(initialProjects);
    setActivity(["Workspace reset to demo data"]);
    setNotice("Demo data restored");
  }

  function exportWorkspace() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ tasks, projects }, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "orbit-workspace.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return {
    activity,
    closeModal,
    completedCount,
    deleteItem,
    exportWorkspace,
    filter,
    light,
    mobileOpen,
    modal,
    moveTask,
    notice,
    openModal,
    overdueCount,
    projectProgress,
    projects,
    resetWorkspace,
    running,
    saveItem,
    search,
    seconds,
    setFilter,
    setLight,
    setMobileOpen,
    setRunning,
    setSearch,
    setSeconds,
    tasks,
    visibleTasks,
  };
}

export type OrbitWorkspace = ReturnType<typeof useOrbitWorkspace>;
