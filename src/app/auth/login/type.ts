import { z } from "zod";
import { loginSchema } from "./schema";

export type LoginFormValues = z.infer<typeof loginSchema>;
