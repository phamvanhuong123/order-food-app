import { z } from "zod";

const configSchema = z.object({
  DB_USER: z.string(),
  NEXT_PUBLIC_API_ENDPOINT : z.string()
});

const configProject = configSchema.safeParse({
    DB_USER : process.env.DB_USER,
    NEXT_PUBLIC_API_ENDPOINT : process.env.NEXT_PUBLIC_API_ENDPOINT
});

if (!configProject.success){
    console.error("Lây biến môi trường không hợp lệ")
     throw new Error("Khoong  hợp lệ")
}

export const envConfig = configProject.data