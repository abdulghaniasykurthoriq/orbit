import type { Column, Member, Project, Task } from "./types";

export const members: Member[] = [
  { name: "Abdul Ghani", initial: "AG", role: "Fullstack Developer", color: "#8b78ff" },
  { name: "Sarah Chen", initial: "SC", role: "Product Designer", color: "#26c6a3" },
  { name: "James Park", initial: "JP", role: "Backend Developer", color: "#5989ef" },
  { name: "Mia Wilson", initial: "MW", role: "Frontend Developer", color: "#df62b7" },
];

export const initialProjects: Project[] = [
  {
    id: "p1",
    name: "Design System v2",
    description: "A unified foundation for our next chapter.",
    color: "#8b78ff",
    status: "Active",
    due: "2026-10-20",
  },
  {
    id: "p2",
    name: "Backend API Migration",
    description: "Faster, cleaner and built to scale.",
    color: "#2bcfa8",
    status: "Review",
    due: "2026-10-15",
  },
  {
    id: "p3",
    name: "Mobile App Launch",
    description: "Bring the workspace wherever you go.",
    color: "#efb346",
    status: "Active",
    due: "2026-11-01",
  },
  {
    id: "p4",
    name: "Marketing Website",
    description: "Tell a better story about what we do.",
    color: "#e56bc1",
    status: "Planning",
    due: "2026-10-25",
  },
];

const taskRows = [
  ["Update onboarding illustrations", "p1", "todo", "Medium", "2026-10-08", "Sarah Chen"],
  ["Set up CI/CD pipeline", "p2", "todo", "High", "2026-10-05", "Abdul Ghani"],
  ["Design mobile navigation", "p3", "todo", "Low", "2026-10-12", "Mia Wilson"],
  ["Refactor token refresh logic", "p2", "progress", "High", "2026-10-09", "James Park"],
  ["Build reusable form components", "p1", "progress", "Medium", "2026-10-10", "Abdul Ghani"],
  ["Write launch announcement", "p4", "progress", "Medium", "2026-10-14", "Mia Wilson"],
  ["Finalize color token library", "p1", "done", "Low", "2026-09-29", "Sarah Chen"],
  ["API rate limiting middleware", "p2", "done", "High", "2026-09-30", "James Park"],
] as const;

export const initialTasks: Task[] = taskRows.map(
  ([title, project, status, priority, due, assignee], index) => ({
    id: `t${index}`,
    title,
    description: "",
    project,
    status,
    priority,
    due,
    assignee,
  }),
);

export const columns: Column[] = [
  { status: "todo", label: "To do", color: "#8e92a7" },
  { status: "progress", label: "In progress", color: "#efb346" },
  { status: "done", label: "Done", color: "#2bcfa8" },
];

export const defaultActivity = [
  "James completed API rate limiting middleware",
  "Sarah finalized the color token library",
  "Abdul started reusable form components",
];
