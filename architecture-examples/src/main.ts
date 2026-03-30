/**
 * ============================================
 * 主入口文件 - 应用启动和配置
 * ============================================
 *
 * 运行方式： npx tsx architecture-examples/src/main.ts
 *
 * MVC + IoC 架构流程:
 *
 *   请求 → Express Router → Controller → Service → Prisma → MySQL
 *                      ↑                    ↑          ↑
 *                      └─ IoC 容器自动注入依赖 ──┘
 */

// reflect-metadata 必须最先加载
import 'reflect-metadata'

import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import log4js from 'log4js'
import { InversifyExpressServer } from 'inversify-express-utils'

// 加载环境变量
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

// 导入 IoC 容器
import { container } from './container.js'

// 导入控制器（触发装饰器注册）
import './controllers/UserController.js'
import './controllers/ArticleController.js'

// ============================================
// 配置日志
// ============================================
log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: { type: 'pattern', pattern: '%[[%d{hh:mm:ss}] [%p] -%] %m' },
    },
  },
  categories: {
    default: { appenders: ['console'], level: 'debug' },
  },
})

const logger = log4js.getLogger()

// ============================================
// 创建 InversifyExpressServer
// ============================================
// InversifyExpressServer 把 Express 和 Inversify 审合在一起
// 它传入 IoC 容器和 Express app 配置
// 它会自动扫描所有 @controller 装饰器， 类，注册路由
const server = new InversifyExpressServer(container)

// 配置 Express 中间件
server.setConfig((app) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // CORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') return res.status(204).end()
    next()
  })

  // 日志
  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      logger.info(`${req.method} ${req.url} ${res.statusCode} (${Date.now() - start}ms)`)
    })
    next()
  })
})

// ============================================
// 初始化测试数据
// ============================================
async function seedData() {
  const prisma = container.get<PrismaClient>(TYPES.PrismaClient) as unknown as Prisma.Client

  const userCount = await prisma.user.count()
  if (userCount > 0) {
    logger.info('测试数据已存在，跳过初始化')
    return
  }

  logger.info('插入测试数据...')

  const users = await prisma.user.createMany({
    data: [
      { name: '张三', email: 'zhangsan@arch.com', age: 25, gender: 'male' },
      { name: '李四', email: 'lisi@arch.com', age: 30, gender: 'female' },
      { name: '王五', email: 'wangwu@arch.com', age: 28, gender: 'male' },
    ],
  })
  logger.info(`   插入 ${users.count} 个用户`)

  const tags = await prisma.tag.createMany({
    data: [
      { name: 'Prisma' },
      { name: 'Inversify' },
      { name: 'IoC' },
      { name: 'MVC' },
    ],
  })

  const allUsers = await prisma.user.findMany()
  const allTags = await prisma.tag.findMany()

  const articles = await prisma.article.createMany({
    data: [
      { title: 'Prisma ORM 入门', content: 'Prisma 是现代 Node.js ORM，替代 Knex...', authorId: allUsers[0].id, views: 100, price: 0 },
      { title: 'IoC 依赖注入详解', content: 'IoC 是面向对象编程的核心思想...', authorId: allUsers[0].id, views: 200, price: 9.9 },
      { title: 'MVC 架构模式', content: 'MVC 将应用分为三层...', authorId: allUsers[1].id, views: 150, price: 19.9 },
    ],
  })
  logger.info(`   插入 ${articles.count} 篇文章`)

  const allArticles = await prisma.article.findMany()

  // 文章-标签关联
  await prisma.articleTag.createMany({
    data: [
      { articleId: allArticles[0].id, tagId: allTags[0].id },
      { articleId: allArticles[0].id, tagId: allTags[2].id },
      { articleId: allArticles[1].id, tagId: allTags[1].id },
      { articleId: allArticles[1].id, tagId: allTags[2].id },
      { articleId: allArticles[2].id, tagId: allTags[3].id },
      { articleId: allArticles[2].id, tagId: allTags[1].id },
    ],
  })

  logger.info('✅ 测试数据插入完成')
}

// ============================================
// 启动
// ============================================
const PORT = 3003

async function start() {
  try {
    await seedData()

    const app = server.build()

    app.listen(PORT, () => {
      logger.info('========================================')
      logger.info('🏗️  MVC + IoC + 装饰器 架构服务器已启动')
      logger.info(`📍 http://localhost:${PORT}`)
      logger.info('========================================')
      logger.info('')
      logger.info('📁 项目结构:')
      logger.info('   main.ts         → 入口（启动服务器）')
      logger.info('   container.ts   → IoC 容器（管理依赖）')
      logger.info('   types.ts       → 类型标识（绑定的 key）')
      logger.info('   controllers/   → 控制器（接收请求）')
      logger.info('   services/     → 服务层（业务逻辑）')
      logger.info('   db/           → 数据库（Prisma）')
      logger.info('')
      logger.info('💡 测试:')
      logger.info(`   curl http://localhost:${PORT}/api/users`)
      logger.info(`   curl http://localhost:${PORT}/api/articles`)
      logger.info('')
    })
  } catch (err) {
    logger.error('启动失败:', err.message)
    process.exit(1)
  }
}

start()
