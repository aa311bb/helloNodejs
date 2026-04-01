/**
 * ============================================
 * Inversify IoC 容器配置
 * ============================================
 *
 * 【什么是 IoC 容器？】
 *
 * IoC（Inversion of Control，控制反转）是一种设计思想：
 *
 *   传统方式（你控制一切）：
 *     const prisma = new PrismaClient()     ← 自己创建
 *     const service = new UserService(prisma) ← 自己传入
 *     const ctrl = new UserController(service) ← 自己传入
 *     问题：如果 PrismaClient 构造函数改了，所有地方都要改
 *
 *   IoC 方式（容器控制一切）：
 *     container.bind(TYPES.PrismaClient).toConstantValue(prisma)
 *     container.bind(TYPES.UserService).to(UserService)
 *     container.bind(TYPES.UserController).to(UserController)
 *     容器自动解析依赖链：Controller 需要 Service → 容器创建 Service
 *     Service 需要 Prisma → 容器传入 Prisma → 一切自动完成！
 *
 * 【Inversify 的三个核心概念】
 *
 *   1. Container（容器）    → 管理所有对象的"大工厂"
 *   2. bind（绑定）         → 告诉容器"这个标识对应哪个类"
 *   3. get（获取）          → 从容器中取出已创建的实例
 *
 * 【绑定方式】
 *
 *   .toConstantValue(实例)  → 绑定一个已创建好的单例（如 PrismaClient）
 *   .to(类)                 → 绑定一个类，容器会在需要时自动 new
 *
 * 【为什么是 async 函数？】
 *
 *   Prisma 7 使用 Driver Adapter，创建连接是异步操作
 *   所以 initContainer() 必须是 async，等待数据库连接成功后再绑定
 */

import { Container } from 'inversify'
import { PrismaClient } from '../generated/prisma/client.js'
import { TYPES } from './types.js'
import { UserService } from './services/UserService.js'
import { ArticleService } from './services/ArticleService.js'
import { TagService } from './services/TagService.js'
import { createPrismaClient } from './db/prisma.js'

/**
 * 初始化 IoC 容器
 *
 * 这个函数做了4件事：
 * 1. 创建空的 IoC 容器
 * 2. 异步创建 PrismaClient（连接数据库）
 * 3. 把 PrismaClient 绑定为单例（整个应用共享一个实例）
 * 4. 把所有 Service 类绑定到容器
 *
 * 绑定后，任何通过 @inject 装饰器声明依赖的类，
 * 容器都会自动注入对应的实例
 */
export async function initContainer() {
  // 创建空的 IoC 容器
  const container = new Container()

  // ============================================
  // 绑定数据库实例（单例模式）
  // ============================================
  // createPrismaClient() 返回一个已连接的 PrismaClient 实例
  // .toConstantValue() 表示绑定一个固定的值（不会重新创建）
  // 整个应用中，所有 Service 共享同一个 PrismaClient 实例
  // 这就是"单例模式"——节省资源，保证一致性
  const prisma = await createPrismaClient()
  container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma)

  // ============================================
  // 绑定 Service 层
  // ============================================
  // .to(UserService) 告诉容器：
  //   "当有人请求 TYPES.UserService 时，创建一个 UserService 实例"
  //
  // 容器会自动分析 UserService 的构造函数：
  //   constructor(@inject(TYPES.PrismaClient) prisma)
  // 发现有依赖 PrismaClient，就去容器里找，找到了就注入
  // 整个过程全自动，不需要手动传参
  container.bind<UserService>(TYPES.UserService).to(UserService)
  container.bind<ArticleService>(TYPES.ArticleService).to(ArticleService)
  container.bind<TagService>(TYPES.TagService).to(TagService)

  return container
}
