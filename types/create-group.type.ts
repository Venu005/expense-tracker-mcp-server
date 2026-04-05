import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(1),
  memberEmails: z.array(z.string().email()).min(1),
});

export const addGroupMemberSchema = z.object({
  groupId: z.string(),
  email: z.string().email(),
});
