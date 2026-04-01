/**
 * ============================================
 * 主入口文件 - 应用启动和配置
 * ============================================
 *
 * 【启动流程】
 *
 *   1. 加载 reflect-metadata（装饰器元数据支持，必须最先加载）
 *   2. 加载 .env 环境变量
 *   3. 导入所有控制器（触发 @controller 装饰器注册到框架）
 *   4. 配置日志系统（log4js）
 *   5. 初始化 IoC 容器（创建 PrismaClient、绑定 Service）
 *   6. 配置 Express 中间件（JSON解析、CORS、日志）
 *   7. 插入测试数据
 *   8. 启动 HTTP 服务器
 *
 * 【运行方式】
 *   npx tsx --tsconfig architecture-examples/tsconfig.json architecture-examples/src/main.ts
 *
 * 【为什么要用 tsx 而不是 ts-node？】
 *   tsx 是基于 esbuild 的 TypeScript 运行器，速度更快
 *   --tsconfig 参数告诉 tsx 使用项目自己的 tsconfig.json
 *   因为我们的 tsconfig 开启了 experimentalDecorators（装饰器实验特性）
 */

// ============================================
// 1. reflect-metadata 必须最先加载
// ============================================
// 装饰器（如 @inject、@controller）需要在类上存储元数据
// reflect-metadata 提供了 Reflect.metadata() API 来实现这一点
// 如果不加载这个包，所有依赖注入的装饰器都会报错
import 'reflect-metadata'

import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import log4js from 'log4js'
import { InversifyExpressServer } from 'inversify-express-utils'
import { initContainer } from './container.js'
import { TYPES } from './types.js'
import { PrismaClient } from './generated/prisma/client.js'

// ============================================
// 2. 加载 .env 环境变量
// ============================================
// ESM 模块中没有 __dirname，需要通过 fileURLToPath 手动获取
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

// ============================================
// 3. 导入控制器（触发装饰器注册）
// ============================================
// 【重要】这些 import 看起来没有使用，但它们有副作用！
//
// inversify-express-utils 使用 @controller('/path') 装饰器
// 装饰器在模块被加载时就会执行，把路由信息注册到框架中
// 如果不 import 这些文件，@controller 装饰器不会执行，路由就不会被注册
//
// 这就是 "副作用导入"（side-effect import）的概念
// 装饰器模式的核心思想：用声明式的方式定义行为，而不是命令式
import './controllers/UserController.js'
import './controllers/ArticleController.js'
import './controllers/TagController.js'

// ============================================
// 4. 配置日志系统（log4js）
// ============================================
// appenders: 定义日志输出目标（这里输出到控制台）
// categories: 定义日志级别和使用的 appender
// layout.pattern: 定义日志格式
//   %d{hh:mm:ss} → 时间
//   %p            → 日志级别（INFO、ERROR等）
//   %m            → 日志消息
//   %[  %]        → 颜色包裹
const logger = log4js.getLogger()
const PORT = 3003

// ============================================
// 5. 启动应用
// ============================================
async function start() {
  try {
    // ----------------------------------------
    // 5.1 初始化 IoC 容器
    // ----------------------------------------
    // initContainer() 做了这些事：
    //   1. 创建 Inversify 容器实例
    //   2. 异步创建 PrismaClient（连接数据库）
    //   3. 把 PrismaClient 绑定到容器中（单例）
    //   4. 把所有 Service 绑定到容器中
    // 返回的 container 就是 IoC 容器，管理着所有依赖关系
    const container = await initContainer()

    // ----------------------------------------
    // 5.2 创建 InversifyExpressServer
    // ----------------------------------------
    // InversifyExpressServer 是 inversify-express-utils 的核心
    // 它把 Inversify 容器和 Express 整合在一起
    // 这样控制器里就可以通过 @inject 获取 Service 实例
    const server = new InversifyExpressServer(container)

    // ----------------------------------------
    // 5.3 配置 Express 中间件
    // ----------------------------------------
    // setConfig 允许我们在 Express 应用创建时添加中间件
    // 类似于普通的 app.use()，但通过回调函数的方式
    server.setConfig((app) => {
      // JSON 请求体解析（POST/PUT 请求的 body）
      app.use(express.json())
      // URL-encoded 请求体解析（表单提交）
      app.use(express.urlencoded({ extended: true }))

      // CORS 跨域中间件
      // 浏览器有同源策略限制，前端(Vue, localhost:5173)和后端(localhost:3003)端口不同
      // 需要设置 CORS 头部才能让前端正常请求后端 API
      app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')           // 允许所有来源
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS') // 允许的HTTP方法
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')      // 允许的请求头
        // OPTIONS 是浏览器的"预检请求"，直接返回 204
        if (req.method === 'OPTIONS') return res.status(204).end()
        next()
      })

      // 请求日志中间件
      // 记录每个请求的方法、路径、状态码和耗时
      app.use((req, res, next) => {
        const start = Date.now()
        // res.on('finish') 在响应完成后触发
        res.on('finish', () => {
          logger.info(`${req.method} ${req.url} ${res.statusCode} (${Date.now() - start}ms)`)
        })
        next()
      })
    })

    // ----------------------------------------
    // 5.4 插入测试数据
    // ----------------------------------------
    // 从 IoC 容器中获取 PrismaClient 实例
    // TYPES.PrismaClient 是绑定时的标识符（Symbol）
    // container.get() 会返回容器中绑定的 PrismaClient 单例
    const prisma = container.get<PrismaClient>(TYPES.PrismaClient)
    await seedData(prisma)

    // ----------------------------------------
    // 5.5 启动 HTTP 服务器
    // ----------------------------------------
    // server.build() 根据 @controller 装饰器注册的路由，
    // 生成完整的 Express 应用
    const app = server.build()
    app.listen(PORT, () => {
      logger.info('========================================')
      logger.info('🏗️  MVC + IoC + 装饰器 架构服务器已启动')
      logger.info(`📍 http://localhost:${PORT}`)
      logger.info('========================================')
      logger.info('')
      logger.info('💡 测试:')
      logger.info(`   curl http://localhost:${PORT}/api/users`)
      logger.info(`   curl http://localhost:${PORT}/api/articles`)
      logger.info(`   curl http://localhost:${PORT}/api/tags`)
      logger.info('')
    })
  } catch (err) {
    logger.error('启动失败:', err.message)
    console.error(err)
    process.exit(1)
  }
}

// ============================================
// 测试数据初始化函数
// ============================================
/**
 * 向数据库插入测试数据（仅在数据库为空时执行）
 *
 * 数据关系：
 *   User（用户） 1──N Article（文章）     一个用户可以写多篇文章
 *   Article（文章）N──N Tag（标签）        一篇文章可以有多个标签，一个标签可以属于多篇文章
 *                       ↑ 通过 ArticleTag 中间表关联
 */
async function seedData(prisma) {
  // 先检查是否已有数据，避免重复插入
  const userCount = await prisma.user.count()
  if (userCount > 0) {
    logger.info('测试数据已存在，跳过初始化')
    return
  }

  logger.info('插入测试数据...')

  // 插入用户
  await prisma.user.createMany({
    data: [
      { name: '张三', email: 'zhangsan@arch.com', age: 25, gender: 'male' },
      { name: '李四', email: 'lisi@arch.com', age: 30, gender: 'female' },
      { name: '王五', email: 'wangwu@arch.com', age: 28, gender: 'male' },
    ],
  })

  // 插入标签
  await prisma.tag.createMany({
    data: [{ name: 'Prisma' }, { name: 'Inversify' }, { name: 'IoC' }, { name: 'MVC' }],
  })

  // 查出用户和标签，用于关联
  const allUsers = await prisma.user.findMany()
  const allTags = await prisma.tag.findMany()

  // 插入文章（关联作者）
  await prisma.article.createMany({
    data: [
      { title: 'Prisma ORM 入门', content: 'Prisma 是现代 Node.js ORM...', authorId: allUsers[0].id, views: 100, price: 0 },
      { title: 'IoC 依赖注入详解', content: 'IoC 是面向对象编程的核心...', authorId: allUsers[0].id, views: 200, price: 9.9 },
      { title: 'MVC 架构模式', content: 'MVC 将应用分为三层...', authorId: allUsers[1].id, views: 150, price: 19.9 },
    ],
  })

  const allArticles = await prisma.article.findMany()

  // 插入文章-标签关联（多对多中间表）
  await prisma.articleTag.createMany({
    data: [
      { articleId: allArticles[0].id, tagId: allTags[0].id },  // Prisma ORM 入门 → Prisma
      { articleId: allArticles[0].id, tagId: allTags[2].id },  // Prisma ORM 入门 → IoC
      { articleId: allArticles[1].id, tagId: allTags[1].id },  // IoC 依赖注入详解 → Inversify
      { articleId: allArticles[1].id, tagId: allTags[2].id },  // IoC 依赖注入详解 → IoC
      { articleId: allArticles[2].id, tagId: allTags[3].id },  // MVC 架构模式 → MVC
      { articleId: allArticles[2].id, tagId: allTags[1].id },  // MVC 架构模式 → Inversify
    ],
  })

  logger.info('✅ 测试数据插入完成')
}

// 启动！
start()
