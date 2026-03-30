/**
 * ============================================
 * Prisma 数据库客户端
 * ============================================
 *
 * 只创建一个 PrismaClient 实例（单例模式）
 * 整个应用共享这一个数据库连接
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

export default prisma
