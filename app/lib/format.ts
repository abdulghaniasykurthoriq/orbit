export function formatDate(value: string) {
  if (!value) return "No due date";

  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function taskDisplayId(id: string) {
  if (id.startsWith("t")) {
    return `ORB-${100 + Number(id.slice(1))}`;
  }

  return `ORB-${id.slice(0, 3).toUpperCase()}`;
}

export function statusClass(value: string) {
  return value.toLowerCase().replace(/\s+/g, "");
}
