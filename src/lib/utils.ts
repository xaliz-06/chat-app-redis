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
