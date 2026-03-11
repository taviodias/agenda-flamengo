import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  const day = (() => {
    const now = new Date();
    now.setHours(now.getHours() - 3); // GMT -3
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth()
    ) {
      return "Hoje";
    }
    if (
      date.getDate() === now.getDate() + 1 &&
      date.getMonth() === now.getMonth()
    ) {
      return "Amanhã";
    }
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })
      .format(date)
      .replace(/^\w/, (c) => c.toUpperCase());
  })();
  return {
    day,
    time,
  };
}
