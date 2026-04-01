/**
 * ============================================
 * Prisma 数据库客户端
 * ============================================
 *
 * 【Prisma 7 的 Driver Adapter 机制】
 *
 * Prisma 7 做了重大改版，不再像旧版那样直接连接数据库
 * 而是通过 "驱动适配器"（Driver Adapter）来连接：
 *
 *   旧版 Prisma 6:  PrismaClient → 内置引擎 → 数据库
 *   新版 Prisma 7:  PrismaClient → Driver Adapter → 数据库驱动 → 数据库
 *
 * 好处：
 * - 可以用任何数据库驱动（mariadb、mysql2 等）
 * - 连接池由驱动管理，更灵活
 * - 支持边缘环境（Edge Runtime）
 *
 * ============================================
 * 连接步骤（3步）
 * ============================================
 *
 * 第1步：创建 Driver Adapter
 *   PrismaMariaDb 是 Prisma 提供的 MariaDB/MySQL 适配器
 *   它的构造函数可以直接接收 PoolConfig 配置对象（不需要手动创建连接池）
 *   它内部会自动创建和管理连接池
 *
 *   PoolConfig 常用字段：
 *   - host:     数据库主机地址
 *   - port:     数据库端口（MySQL 默认 3306）
 *   - user:     数据库用户名
 *   - password: 数据库密码
 *   - database: 数据库名称
 *   - connectionLimit: 最大连接数
 *
 * 第2步：创建 PrismaClient，传入 adapter
 *   PrismaClient({ adapter }) 告诉 Prisma 使用我们提供的适配器
 *   而不是用内置的连接方式
 *
 * 第3步：返回 prisma 实例，供其他模块使用
 *
 * ============================================
 * 注意事项
 * ============================================
 *
 * 1. PrismaMariaDb 的 'b' 是小写，不是 PrismaMariaDB（大写 B 会报错）
 * 2. 适配器构造函数接受的是 PoolConfig 对象或连接字符串，不是已创建的 Pool
 * 3. 由于创建连接是异步操作，整个函数是 async 的
 * 4. MariaDB 驱动同时兼容 MySQL 和 MariaDB 数据库
 */

import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

export async function createPrismaClient() {
  // 第1步：创建 MariaDB/MySQL 驱动适配器
  // PrismaMariaDb 会自动管理连接池，我们只需传入配置
  const adapter = new PrismaMariaDb({
    host: 'localhost',       // 数据库地址
    port: 3306,              // MySQL 默认端口
    user: 'root',            // 数据库用户名
    password: '441426',      // 数据库密码
    database: 'architecture-test',  // 数据库名称
    connectionLimit: 5,      // 连接池最大连接数
  })

  // 第2步：创建 PrismaClient，传入 adapter
  // PrismaClient 会通过 adapter 来执行所有的数据库操作
  const prisma = new PrismaClient({ adapter })

  // 第3步：返回 prisma 实例
  // 这个实例会被绑定到 IoC 容器中，供 Service 层注入使用
  return prisma
}
