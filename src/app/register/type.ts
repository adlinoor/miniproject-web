import { z } from "zod";
import { registerSchema } from "./schema";

export type RegisterFormValues = z.infer<typeof registerSchema>;
