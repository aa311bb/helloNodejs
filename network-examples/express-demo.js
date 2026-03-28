/**
 * Express 框架学习示例
 *
 * 功能演示：
 * 1. GET/POST 请求处理
 * 2. 动态路由参数
 * 3. 模块化路由 (express.Router)
 * 4. 中间件 (日志、防盗链)
 * 5. log4js 日志系统
 *
 * 运行: node network-examples/express-demo.js
 * 访问: http://localhost:3001
 */

// ============================================
// 1. 引入依赖
// ============================================
import express from 'express' // Express 框架
import log4js from 'log4js' // 日志库

// ============================================
// 2. 配置 log4js 日志系统
// ============================================
// log4js 配置说明：
// - appenders: 定义日志输出的位置（控制台、文件等）
// - categories: 定义日志类别，可以有不同的输出配置
log4js.configure({
  appenders: {
    // 控制台输出 - 彩色日志，方便开发调试
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        // 日志格式: [时间] [级别] [分类] - 消息内容
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss}] [%p] [%c] -%] %m',
      },
    },
    // 文件输出 - 普通日志文件
    file: {
      type: 'file',
      filename: 'logs/app.log', // 日志文件路径
      maxLogSize: 10 * 1024 * 1024, // 单个文件最大 10MB
      backups: 3, // 保留 3 个备份文件
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss}] [%p] [%c] - %m',
      },
    },
    // 错误日志 - 单独存放错误级别日志
    errorFile: {
      type: 'file',
      filename: 'logs/error.log',
      maxLogSize: 10 * 1024 * 1024,
      backups: 3,
    },
  },
  categories: {
    // 默认日志配置：输出到控制台和文件
    default: {
      appenders: ['console', 'file'],
      level: 'debug', // 日志级别：trace < debug < info < warn < error < fatal
    },
    // 错误日志配置：只记录 error 及以上级别
    error: {
      appenders: ['console', 'errorFile'],
      level: 'error',
    },
    // HTTP 请求日志
    http: {
      appenders: ['console', 'file'],
      level: 'info',
    },
  },
})

// 创建不同用途的 logger 实例
const logger = log4js.getLogger('default') // 通用日志
const errorLogger = log4js.getLogger('error') // 错误日志
const httpLogger = log4js.getLogger('http') // HTTP 请求日志

// ============================================
// 3. 创建 Express 应用实例
// ============================================
const app = express()
const PORT = 3001

// ============================================
// 4. 内置中间件
// ============================================
// 解析 JSON 格式的请求体 (Content-Type: application/json)
app.use(express.json())

// 解析 URL 编码的请求体 (Content-Type: application/x-www-form-urlencoded)
// extended: true 使用 qs 库解析，支持嵌套对象
app.use(express.urlencoded({ extended: true }))

// 静态文件服务 - 将 public 目录作为静态资源目录
// 访问方式: http://localhost:3001/static/xxx.jpg
app.use('/static', express.static('public'))

// ============================================
// 5. CORS 跨域中间件
// ============================================
// 允许前端（Vue 开发服务器）跨域访问后端 API
app.use((req, res, next) => {
  // 允许的来源域名
  res.setHeader('Access-Control-Allow-Origin', '*')
  // 允许的 HTTP 方法
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  // 允许的请求头
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // 预检请求缓存时间（秒）
  res.setHeader('Access-Control-Max-Age', '86400')

  // OPTIONS 预检请求直接返回 204
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  next()
})

// ============================================
// 6. 自定义中间件
// ============================================

/**
 * 日志中间件 - 记录每个请求的基本信息
 * 中间件执行顺序：按照 app.use() 的定义顺序执行
 */
app.use((req, res, next) => {
  const startTime = Date.now()

  // 记录请求信息
  httpLogger.info(`--> ${req.method} ${req.url}`)
  httpLogger.debug(`    IP: ${req.ip}`)
  httpLogger.debug(`    User-Agent: ${req.get('User-Agent')}`)

  // 监听响应完成事件，记录响应时间
  res.on('finish', () => {
    const duration = Date.now() - startTime
    httpLogger.info(`<-- ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`)
  })

  // 调用 next() 将控制权传递给下一个中间件
  // 如果不调用 next()，请求会被挂起
  next()
})

/**
 * 防盗链中间件 - 检查 Referer 请求头
 * Referer: 表示请求来源页面的 URL
 * 用途：防止其他网站盗用你的图片、视频等资源
 */
const refererCheck = (req, res, next) => {
  // 获取 Referer 请求头
  const referer = req.get('Referer')

  // 允许的来源域名白名单
  const allowedOrigins = [
    'localhost:3001', // 本地开发
    'localhost:5173', // Vite 开发服务器
    '127.0.0.1:3001',
    '127.0.0.1:5173',
  ]

  // 如果没有 Referer（直接访问）或者来源在白名单中，允许访问
  if (!referer) {
    // 直接访问（如浏览器地址栏输入）通常没有 Referer
    logger.debug('无 Referer，允许访问')
    return next()
  }

  try {
    // 解析 Referer URL，提取主机名
    const url = new URL(referer)
    const origin = url.host // 包含端口号，如 localhost:3001

    if (allowedOrigins.includes(origin)) {
      logger.debug(`Referer 检查通过: ${origin}`)
      next()
    } else {
      // 来源不在白名单，拒绝访问
      logger.warn(`防盗链拦截: ${referer}`)
      res.status(403).json({
        error: '禁止访问',
        message: '该资源不允许从外部网站访问',
        referer: referer,
      })
    }
  } catch (e) {
    // URL 解析失败，允许通过
    logger.warn(`Referer 解析失败: ${referer}`)
    next()
  }
}

// 对 /static/protected/* 路径启用防盗链
app.use('/static/protected', refererCheck, express.static('public/protected'))

// ============================================
// 6. 模拟数据库
// ============================================
let articles = [
  { id: 1, title: 'Express 入门教程', content: 'Express 是一个简洁灵活的 Node.js Web 应用框架', author: '张三', views: 100 },
  { id: 2, title: '中间件详解', content: '中间件是 Express 的核心概念，用于处理请求和响应', author: '李四', views: 200 },
  { id: 3, title: 'RESTful API 设计', content: 'RESTful 是一种 API 设计风格，使用 HTTP 方法表示操作', author: '王五', views: 150 },
]

let nextArticleId = 4

// ============================================
// 7. 基础路由 - GET 请求
// ============================================

/**
 * 首页路由
 * GET /
 * 返回欢迎信息和 API 列表
 */
app.get('/', (req, res) => {
  logger.info('访问首页')

  res.json({
    message: '🚀 Express 服务器运行中',
    version: '1.0.0',
    endpoints: {
      'GET /': '首页 - API 列表',
      'GET /api/articles': '获取文章列表',
      'GET /api/articles/:id': '获取单篇文章（动态参数）',
      'POST /api/articles': '创建文章',
      'PUT /api/articles/:id': '更新文章',
      'DELETE /api/articles/:id': '删除文章',
      'GET /api/info': '服务器信息',
      'GET /test/referer': '防盗链测试页面',
    },
  })
})

/**
 * 获取文章列表
 * GET /api/articles
 * 支持分页参数：page, limit
 */
app.get('/api/articles', (req, res) => {
  // 从查询字符串获取分页参数
  const page = parseInt(req.query.page) || 1 // 默认第 1 页
  const limit = parseInt(req.query.limit) || 10 // 默认每页 10 条

  logger.debug(`获取文章列表: page=${page}, limit=${limit}`)

  // 计算分页
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedArticles = articles.slice(startIndex, endIndex)

  res.json({
    data: paginatedArticles,
    pagination: {
      page,
      limit,
      total: articles.length,
      totalPages: Math.ceil(articles.length / limit),
    },
  })
})

/**
 * 获取单篇文章 - 动态路由参数
 * GET /api/articles/:id
 * :id 是动态参数，通过 req.params.id 获取
 */
app.get('/api/articles/:id', (req, res) => {
  // req.params 包含所有动态路由参数
  const id = parseInt(req.params.id)
  logger.debug(`获取文章详情: id=${id}`)

  const article = articles.find((a) => a.id === id)

  if (article) {
    // 增加浏览次数
    article.views++
    res.json(article)
  } else {
    // 文章不存在，返回 404
    errorLogger.error(`文章不存在: id=${id}`)
    res.status(404).json({ error: '文章不存在', id })
  }
})

// ============================================
// 8. POST 请求
// ============================================

/**
 * 创建文章
 * POST /api/articles
 * 请求体需要包含 title 和 content
 */
app.post('/api/articles', (req, res) => {
  // req.body 包含解析后的请求体（需要 express.json() 中间件）
  const { title, content, author } = req.body

  logger.info(`创建文章: ${title}`)

  // 参数验证
  if (!title || !content) {
    return res.status(400).json({
      error: '参数错误',
      message: 'title 和 content 是必填字段',
    })
  }

  // 创建新文章
  const newArticle = {
    id: nextArticleId++,
    title,
    content,
    author: author || '匿名',
    views: 0,
    createdAt: new Date().toISOString(),
  }

  articles.push(newArticle)

  // 返回 201 Created 状态码
  res.status(201).json(newArticle)
})

// ============================================
// 9. PUT 请求 - 更新资源
// ============================================

/**
 * 更新文章
 * PUT /api/articles/:id
 * PUT 是完整更新，PATCH 是部分更新
 */
app.put('/api/articles/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { title, content, author } = req.body

  logger.info(`更新文章: id=${id}`)

  const index = articles.findIndex((a) => a.id === id)

  if (index === -1) {
    return res.status(404).json({ error: '文章不存在', id })
  }

  // 更新文章（保留原有字段，更新传入的字段）
  articles[index] = {
    ...articles[index],
    title: title || articles[index].title,
    content: content || articles[index].content,
    author: author || articles[index].author,
    updatedAt: new Date().toISOString(),
  }

  res.json(articles[index])
})

// ============================================
// 10. DELETE 请求
// ============================================

/**
 * 删除文章
 * DELETE /api/articles/:id
 */
app.delete('/api/articles/:id', (req, res) => {
  const id = parseInt(req.params.id)
  logger.info(`删除文章: id=${id}`)

  const index = articles.findIndex((a) => a.id === id)

  if (index === -1) {
    return res.status(404).json({ error: '文章不存在', id })
  }

  // 从数组中删除
  const deleted = articles.splice(index, 1)[0]

  res.json({
    message: '删除成功',
    article: deleted,
  })
})

// ============================================
// 11. 服务器信息接口
// ============================================
app.get('/api/info', (req, res) => {
  logger.debug('获取服务器信息')

  res.json({
    node: process.version,
    platform: process.platform,
    uptime: Math.floor(process.uptime()) + 's',
    memory: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
    },
    express: '4.x',
    timestamp: new Date().toISOString(),
  })
})

// ============================================
// 12. 防盗链测试页面
// ============================================
app.get('/test/referer', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>防盗链测试</title>
      <style>
        body { font-family: sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #1a1a2e; color: #eee; }
        h1 { color: #00d9ff; }
        .card { background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin: 15px 0; }
        code { background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px; color: #ff6b6b; }
        img { max-width: 100%; border: 2px solid #333; border-radius: 8px; }
        .warning { color: #f39c12; }
        .success { color: #2ecc71; }
      </style>
    </head>
    <body>
      <h1>🔒 防盗链测试</h1>
      <div class="card">
        <h3>测试说明</h3>
        <p>/static/* 路径 - 无防盗链保护</p>
        <p>/static/protected/* 路径 - 有防盗链保护（仅允许白名单域名）</p>
      </div>
      <div class="card">
        <h3>Referer 信息</h3>
        <p>当前页面 Referer: <code>${req.get('Referer') || '无'}</code></p>
        <p>当前 URL: <code>${req.protocol}://${req.get('host')}${req.originalUrl}</code></p>
      </div>
      <div class="card">
        <h3>测试步骤</h3>
        <ol>
          <li>从本页面访问受保护资源 → <span class="success">应该成功</span></li>
          <li>直接在浏览器打开受保护资源 URL → <span class="success">应该成功（无 Referer）</span></li>
          <li>从其他网站链接访问 → <span class="warning">应该被拦截</span></li>
        </ol>
      </div>
    </body>
    </html>
  `)
})

// ============================================
// 13. 404 处理中间件
// ============================================
// 当没有匹配到任何路由时，会执行这个中间件
app.use((req, res) => {
  logger.warn(`404 - 路由不存在: ${req.method} ${req.url}`)
  res.status(404).json({
    error: 'Not Found',
    message: `路由 ${req.method} ${req.url} 不存在`,
  })
})

// ============================================
// 14. 全局错误处理中间件
// ============================================
// 四个参数的中间件是错误处理中间件
// err - 错误对象
// req - 请求对象
// res - 响应对象
// next - 下一个中间件函数
app.use((err, req, res, next) => {
  errorLogger.error('服务器错误:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    // 开发环境显示完整错误堆栈
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
})

// ============================================
// 15. 启动服务器
// ============================================
app.listen(PORT, () => {
  logger.info('========================================')
  logger.info('🚀 Express 服务器已启动')
  logger.info(`📍 地址: http://localhost:${PORT}`)
  logger.info(`📅 时间: ${new Date().toISOString()}`)
  logger.info('========================================')
  logger.info('')
  logger.info('📋 可用接口:')
  logger.info(`   GET  /                  首页`)
  logger.info(`   GET  /api/articles      文章列表`)
  logger.info(`   GET  /api/articles/:id  文章详情`)
  logger.info(`   POST /api/articles      创建文章`)
  logger.info(`   PUT  /api/articles/:id  更新文章`)
  logger.info(`   DELETE /api/articles/:id 删除文章`)
  logger.info('')
  logger.info('💡 测试命令:')
  logger.info(`   curl http://localhost:${PORT}/api/articles`)
  logger.info(`   curl -X POST -H "Content-Type: application/json" \\`)
  logger.info(`     -d '{"title":"测试文章","content":"内容"}' \\`)
  logger.info(`     http://localhost:${PORT}/api/articles`)
  logger.info('')
})

// 优雅退出
process.on('SIGINT', () => {
  logger.info('正在关闭服务器...')
  log4js.shutdown(() => {
    logger.info('日志系统已关闭')
    process.exit(0)
  })
})
