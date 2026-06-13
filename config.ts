import { z } from "zod";

const configSchema = z.object({
  DB_USER: z.string(),
});

const configProject = configSchema.safeParse({
    DB_USER : process.env.DB_USER
});

if (!configProject.success){
    console.error("Lây biến môi trường không hợp lệ")
     throw new Error("Khoong  hợp lệ")
}

export const envConfig = configProject.data