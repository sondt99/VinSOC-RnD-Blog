import { format, parseISO } from "date-fns";

export function formatDate(dateStr: string, fmt = "MMMM d, yyyy"): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  return formatDate(dateStr, "MMM d, yyyy");
}

export function formatMonth(dateStr: string): string {
  return formatDate(dateStr, "MMM").toUpperCase();
}

export function formatYear(dateStr: string): number {
  try {
    return parseISO(dateStr).getFullYear();
  } catch {
    return 0;
  }
}
