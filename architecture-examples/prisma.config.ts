// Prisma 7 配置文件
// 数据库连接 URL 从这里读取，而不是 schema.prisma
import "dotenv/config"
import { defineConfig } from "prisma/config"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma/migrations"),
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
})
