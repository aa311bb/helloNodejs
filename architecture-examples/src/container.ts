/**
 * ============================================
 * Inversify IoC 容器配置
 * ============================================
 *
 * 容器是"对象工厂"，负责创建和管理对象的生命周期
 *
 * bind().to() 和 bind().toConstantValue() 的区别：
 * - to()       → 每次请求都创建一个新实例
 * - toConstantValue() → 全局共享同一个单实例（单例，如数据库连接）
 *
 * inRequestScope(Http请求作用域) 也是可选
 */

import { Container } from 'inversify'
import { PrismaClient } from '@prisma/client'
import { TYPES } from './types.js'
import { UserService } from './services/UserService.js'
import { ArticleService } from './services/ArticleService.js'
import { TagService } from './services/TagService.js'
import { UserController } from './controllers/UserController.js'
import { ArticleController } from './controllers/ArticleController.js'
import prisma from '../db/prisma.js'

// ============================================
// 绑定 Prisma 数据库实例（全局单例）
// ============================================
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma)

// ============================================
// 绑定 Service 层
// ============================================
container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<ArticleService>(TYPES.ArticleService).to(ArticleService)
container.bind<tagService>(TYPES.TagService).to(TagService)

export { container }
