import { z } from "zod";

export const addFriendEmailValidation = z.object({
  email: z.string().email(),
});

export const addFriendTagValidation = z.object({
  tag: z
    .string()
    .length(6)
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Tag must contain only alphanumeric characters (0-9, a-z, A-Z)."
    ),
});
