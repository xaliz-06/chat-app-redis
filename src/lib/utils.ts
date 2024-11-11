import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type User = {
  fullName: string;
  id: string;
  image: string;
  userTag: string;
  username: string;
  email: string;
};

export type UserId = string;

export function chatHrefConstructor(id_1: string, id_2: string) {
  const sortedIds = [id_1, id_2].sort();

  return `${sortedIds[0]}--${sortedIds[1]}`;
}
