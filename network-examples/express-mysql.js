/**
 * Express + MySQL 学习示例
 *
 * 技术栈：
 * - express：Web 框架
 * - mysql2：MySQL 数据库驱动（支持 Promise）
 * - knex：SQL 查询构建器（不依赖具体数据库，方便切换）
 * - js-yaml：解析 YAML 配置文件
 *
 * 运行前准备：
 * 1. 确保本地 MySQL 已启动
 * 2. 创建数据库：CREATE DATABASE `node-test` CHARACTER SET utf8mb4;
 * 3. 安装依赖：npm install express mysql2 knex js-yaml log4js
 * 4. 运行：node network-examples/express-mysql.js
 *
 * 访问：http://localhost:3002
 */

// ============================================
// 1. 引入依赖
// ============================================
import express from 'express'       // Web 框架
import mysql from 'mysql2/promise'  // MySQL 驱动（Promise 版本，支持 async/await）
import knex from 'knex'             // SQL 查询构建器
import yaml from 'js-yaml'          // YAML 解析器
import fs from 'fs'                 // 文件系统
import path from 'path'             // 路径处理
import { fileURLToPath } from 'url' // ES Module 路径
import log4js from 'log4js'         // 日志

// ES Module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================
// 2. 读取 YAML 配置文件
// ============================================
// js-yaml.load() 将 YAML 文本解析为 JavaScript 对象
const configText = fs.readFileSync(path.join(__dirname, 'db-config.yaml'), 'utf8')
const config = yaml.load(configText)

console.log('📋 配置加载完成:')
console.log(`   数据库: ${config.database.host}:${config.database.port}/${config.database.database}`)
console.log(`   服务端口: ${config.server.port}`)

// ============================================
// 3. 配置 log4js
// ============================================
log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: { type: 'pattern', pattern: '%[[%d{hh:mm:ss}] [%p] [%c] -%] %m' },
    },
    file: {
      type: 'file',
      filename: 'logs/mysql-app.log',
      maxLogSize: 10 * 1024 * 1024,
      backups: 3,
    },
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'debug' },
    http: { appenders: ['console', 'file'], level: 'info' },
  },
})

const logger = log4js.getLogger('default')
const httpLogger = log4js.getLogger('http')

// ============================================
// 4. 创建 MySQL 连接池（mysql2 方式）
// ============================================
// mysql2/promise 提供的原生连接池
// 连接池的好处：复用连接，避免每次请求都创建新连接
const pool = mysql.createPool({
  host: config.database.host,         // 主机地址
  port: config.database.port,         // 端口
  user: config.database.user,         // 用户名
  password: config.database.password, // 密码
  database: config.database.database, // 数据库名
  waitForConnections: true,           // 连接池满时是否等待
  connectionLimit: 10,                // 最大连接数
  queueLimit: 0,                      // 排队等待的请求数（0 = 不限）
  charset: 'utf8mb4',                 // 字符集（支持 emoji）
})

// ============================================
// 5. 创建 Knex 实例（查询构建器方式）
// ============================================
// Knex 是一个 SQL 查询构建器，可以让我们用 JavaScript 方法链来写 SQL
// 好处：不依赖具体数据库语法，切换数据库只需改配置
const db = knex({
  client: 'mysql2',
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
  },
  // 连接池配置
  pool: { min: 2, max: 10 },
})

// ============================================
// 6. 初始化数据库表
// ============================================
async function initDatabase() {
  logger.info('开始初始化数据库表...')

  try {
    // ------------------------------------------
    // 创建 users 用户表
    // ------------------------------------------
    // db.schema.hasTable() 检查表是否存在
    // db.schema.createTable() 创建表
    const usersExists = await db.schema.hasTable('users')
    if (!usersExists) {
      await db.schema.createTable('users', (table) => {
        // table.increments('id') - 自增主键，相当于 INT AUTO_INCREMENT PRIMARY KEY
        table.increments('id').primary().comment('用户ID，自增主键')

        // table.string('name', length) - 相当于 VARCHAR(length)
        table.string('name', 50).notNullable().comment('用户名，不能为空')

        // table.string() - VARCHAR(255)
        table.string('email', 100).notNullable().unique().comment('邮箱，唯一')

        // table.integer() - INT 类型
        table.integer('age').unsigned().comment('年龄，无符号整数')

        // table.enum() - 枚举类型，限制只能取指定值
        table.enum('gender', ['male', 'female', 'other']).defaultTo('other').comment('性别')

        // table.tinyint() - TINYINT 类型，常用于布尔值
        table.tinyint('status').defaultTo(1).unsigned().comment('状态：1启用 0禁用')

        // table.timestamps() - 自动创建 created_at 和 updated_at 字段
        // created_at: 记录创建时间，插入数据时自动填充
        // updated_at: 记录更新时间，修改数据时自动更新
        // 注意：MySQL 中 timestamps 默认精度为秒，useTimestamps 会自动管理
        table.timestamps(true, true)
        // 参数1：是否添加 created_at 和 updated_at（默认 true）
        // 参数2：是否使用数据库默认值（CURRENT_TIMESTAMP）

        // table.comment() - 给表添加注释
      })
      logger.info('✅ users 表创建成功')
    }

    // ------------------------------------------
    // 创建 articles 文章表
    // ------------------------------------------
    const articlesExists = await db.schema.hasTable('articles')
    if (!articlesExists) {
      await db.schema.createTable('articles', (table) => {
        table.increments('id').primary().comment('文章ID')
        table.string('title', 200).notNullable().comment('文章标题')
        table.text('content').comment('文章内容（text类型，不限长度）')

        // table.integer('author_id').unsigned() - 无符号整数，用于关联用户表
        // .references('id').inTable('users') - 外键约束，引用 users 表的 id 字段
        // .onDelete('CASCADE') - 当用户被删除时，该用户的文章也会被级联删除
        // .onUpdate('CASCADE') - 当用户 id 更新时，文章的 author_id 也跟着更新
        table
          .integer('author_id')
          .unsigned()
          .references('id')
          .inTable('users')
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
          .comment('作者ID，外键关联 users 表')

        table.integer('views').defaultTo(0).unsigned().comment('浏览次数')

        // table.decimal('price', 10, 2) - 十进制数，总共10位，小数点后2位
        table.decimal('price', 10, 2).defaultTo(0).comment('文章价格')

        table.tinyint('status').defaultTo(1).unsigned().comment('状态：1发布 0草稿')
        table.timestamps(true, true)
      })
      logger.info('✅ articles 表创建成功')
    }

    // ------------------------------------------
    // 创建 tags 标签表
    // ------------------------------------------
    const tagsExists = await db.schema.hasTable('tags')
    if (!tagsExists) {
      await db.schema.createTable('tags', (table) => {
        table.increments('id').primary().comment('标签ID')
        table.string('name', 50).notNullable().unique().comment('标签名称，唯一')
        table.timestamps(true, true)
      })
      logger.info('✅ tags 表创建成功')
    }

    // ------------------------------------------
    // 创建 article_tags 文章标签关联表（多对多）
    // ------------------------------------------
    // 一篇文章可以有多个标签，一个标签可以属于多篇文章
    // 所以需要一个中间表来管理这种多对多关系
    const articleTagsExists = await db.schema.hasTable('article_tags')
    if (!articleTagsExists) {
      await db.schema.createTable('article_tags', (table) => {
        // 复合主键：一个文章不能重复打同一个标签
        table.integer('article_id').unsigned().references('id').inTable('articles').onDelete('CASCADE').comment('文章ID')
        table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE').comment('标签ID')

        // table.primary([]) - 设置复合主键（联合唯一）
        table.primary(['article_id', 'tag_id'])
        table.timestamps(true, true)
      })
      logger.info('✅ article_tags 关联表创建成功')
    }

    // ------------------------------------------
    // 插入初始测试数据
    // ------------------------------------------
    // 检查 users 表是否为空
    const userCount = await db('users').count('* as count').first()
    if (userCount.count === 0) {
      logger.info('插入测试数据...')

      // 插入用户数据
      // db('users').insert() - 向 users 表插入数据
      // 注意：MySQL 批量 insert 只返回第一个自增 ID（如 [1]）
      // 后续 ID 需要根据第一条推算：id, id+1, id+2 ...
      const [firstUserId] = await db('users').insert([
        { name: '张三', email: 'zhangsan@test.com', age: 25, gender: 'male' },
        { name: '李四', email: 'lisi@test.com', age: 30, gender: 'female' },
        { name: '王五', email: 'wangwu@test.com', age: 28, gender: 'male' },
      ])
      // 推算所有用户 ID
      const u1 = firstUserId
      const u2 = firstUserId + 1
      const u3 = firstUserId + 2
      logger.info(`   插入 3 个用户 (id: ${u1}, ${u2}, ${u3})`)

      // 插入文章数据
      const [firstArticleId] = await db('articles').insert([
        { title: 'MySQL 入门教程', content: 'MySQL 是最流行的关系型数据库...', author_id: u1, views: 100, price: 0 },
        { title: 'Express 中间件详解', content: '中间件是 Express 的核心概念...', author_id: u1, views: 200, price: 9.9 },
        { title: 'Knex 查询构建器', content: 'Knex.js 是一个灵活的 SQL 查询构建器...', author_id: u2, views: 150, price: 19.9 },
      ])
      const a1 = firstArticleId
      const a2 = firstArticleId + 1
      const a3 = firstArticleId + 2
      logger.info(`   插入 3 篇文章 (id: ${a1}, ${a2}, ${a3})`)

      // 插入标签
      const [firstTagId] = await db('tags').insert([
        { name: 'MySQL' },
        { name: 'Express' },
        { name: 'Node.js' },
        { name: '前端' },
      ])
      const t1 = firstTagId
      const t2 = firstTagId + 1
      const t3 = firstTagId + 2
      const t4 = firstTagId + 3
      logger.info(`   插入 4 个标签 (id: ${t1}, ${t2}, ${t3}, ${t4})`)

      // 插入文章-标签关联（多对多）
      await db('article_tags').insert([
        { article_id: a1, tag_id: t1 },  // MySQL教程 → MySQL
        { article_id: a1, tag_id: t3 },  // MySQL教程 → Node.js
        { article_id: a2, tag_id: t2 },  // Express中间件 → Express
        { article_id: a2, tag_id: t3 },  // Express中间件 → Node.js
        { article_id: a3, tag_id: t1 },  // Knex查询 → MySQL
        { article_id: a3, tag_id: t2 },  // Knex查询 → Express
      ])
      logger.info('✅ 测试数据插入完成')
    }

    logger.info('✅ 数据库初始化完成')
  } catch (error) {
    logger.error('数据库初始化失败:', error.message)
    throw error
  }
}

// ============================================
// 7. 创建 Express 应用
// ============================================
const app = express()
const PORT = config.server.port

// 解析请求体
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS 跨域（允许 Vue 前端访问）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()
  next()
})

// 日志中间件
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    httpLogger.info(`${req.method} ${req.url} ${res.statusCode} (${Date.now() - start}ms)`)
  })
  next()
})

// ============================================
// 工具函数
// ============================================
function sendJSON(res, data, status = 200) {
  res.status(status).json(data)
}

function sendError(res, message, status = 400) {
  res.status(status).json({ error: message })
}

// ============================================
// 8. 路由 - 首页
// ============================================
app.get('/', (req, res) => {
  sendJSON(res, {
    message: '🚀 Express + MySQL 服务器运行中',
    tables: ['users', 'articles', 'tags', 'article_tags'],
    endpoints: {
      // ---- 用户 CRUD ----
      'GET    /api/users':              '获取用户列表',
      'GET    /api/users/:id':          '获取用户详情',
      'POST   /api/users':              '创建用户',
      'PUT    /api/users/:id':          '更新用户',
      'DELETE /api/users/:id':          '删除用户',

      // ---- 文章 CRUD ----
      'GET    /api/articles':           '获取文章列表',
      'GET    /api/articles/:id':       '获取文章详情（含作者和标签）',
      'POST   /api/articles':           '创建文章',
      'PUT    /api/articles/:id':       '更新文章',
      'DELETE /api/articles/:id':       '删除文章',

      // ---- 标签 CRUD ----
      'GET    /api/tags':               '获取标签列表',
      'POST   /api/tags':               '创建标签',

      // ---- 连表查询 ----
      'GET    /api/join/user-articles':  '连表查询：用户及其文章',
      'GET    /api/join/article-tags':   '连表查询：文章及其标签',

      // ---- 事务示例 ----
      'POST   /api/transaction/transfer':'事务示例：模拟转账',
      'POST   /api/transaction/create-article':'事务示例：创建文章并打标签',
    },
  })
})

// ============================================
// 9. 用户 CRUD（增删改查）
// ============================================

// ---------- 查询（Read） ----------

/**
 * 获取用户列表
 * GET /api/users
 *
 * Knex 查询方法：
 * - db('users')           选择 users 表
 * - .select('id','name')  选择字段（不写则 SELECT *）
 * - .where({ status: 1 })  WHERE 条件
 * - .orderBy('id', 'desc') 排序
 * - .limit(10)             限制条数
 * - .offset(0)             偏移量（分页用）
 */
app.get('/api/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, gender, status } = req.query

    // 构建查询
    let query = db('users').select('id', 'name', 'email', 'age', 'gender', 'status', 'created_at', 'updated_at')

    // .where() 条件查询（动态拼接条件）
    if (gender) query = query.where({ gender })
    if (status !== undefined) query = query.where({ status: parseInt(status) })

    // 获取总数（用于分页）
    // .clone() 复制当前查询条件，避免影响原查询
    const totalQuery = query.clone()
    // .count('* as count') 相当于 SELECT COUNT(*) AS count
    const [{ count }] = await totalQuery.count('* as count')

    // 分页
    // .orderBy() 排序，desc = 降序，asc = 升序
    const users = await query
      .orderBy('id', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))

    sendJSON(res, {
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (err) {
    logger.error('获取用户列表失败:', err.message)
    sendError(res, err.message, 500)
  }
})

/**
 * 获取单个用户
 * GET /api/users/:id
 *
 * .where({ id })  查询条件
 * .first()        只返回第一条记录（而不是数组）
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    // db('users').where({ id: req.params.id }).first()
    // 相当于 SQL: SELECT * FROM users WHERE id = ? LIMIT 1
    const user = await db('users')
      .select('id', 'name', 'email', 'age', 'gender', 'status', 'created_at', 'updated_at')
      .where({ id: req.params.id })
      .first()

    if (!user) {
      return sendError(res, '用户不存在', 404)
    }

    // 同时查询该用户的文章数量
    // .count('* as count') 统计数量
    const [{ count }] = await db('articles')
      .where({ author_id: user.id })
      .count('* as count')

    sendJSON(res, { ...user, article_count: parseInt(count) })
  } catch (err) {
    logger.error('获取用户详情失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ---------- 创建（Create） ----------

/**
 * 创建用户
 * POST /api/users
 *
 * db('users').insert(data) 相当于 SQL: INSERT INTO users (name, email, ...) VALUES (?, ?, ...)
 * 返回插入行的自增 ID
 *
 * created_at 和 updated_at 字段：
 * Knex 的 timestamps(true, true) 会自动管理
 * 但在 insert 时需要手动传入，或者用 .defaultTo(knex.fn.now())
 */
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age, gender } = req.body

    // 参数校验
    if (!name || !email) {
      return sendError(res, 'name 和 email 是必填字段')
    }

    // 检查邮箱是否已存在
    // .where({ email }).first() 查询是否存在相同邮箱
    const existing = await db('users').where({ email }).first()
    if (existing) {
      return sendError(res, '该邮箱已被注册')
    }

    // 插入数据
    // knex.fn.now() 返回当前时间，相当于 MySQL 的 NOW()
    const [id] = await db('users').insert({
      name,
      email,
      age: age || null,
      gender: gender || 'other',
      created_at: db.fn.now(),   // 创建时间 = 当前时间
      updated_at: db.fn.now(),   // 更新时间 = 当前时间
    })

    logger.info(`创建用户: id=${id}, name=${name}`)

    // 返回创建的用户（查一次数据库拿到完整数据）
    const user = await db('users').where({ id }).first()
    sendJSON(res, user, 201)
  } catch (err) {
    logger.error('创建用户失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ---------- 更新（Update） ----------

/**
 * 更新用户
 * PUT /api/users/:id
 *
 * db('users').where({ id }).update(data)
 * 相当于 SQL: UPDATE users SET name=?, email=? WHERE id=?
 * 返回受影响的行数
 */
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, age, gender, status } = req.body
    const id = req.params.id

    // 检查用户是否存在
    const user = await db('users').where({ id }).first()
    if (!user) {
      return sendError(res, '用户不存在', 404)
    }

    // 构建更新数据（只更新传入的字段）
    const updateData = { updated_at: db.fn.now() } // 更新时间自动更新
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (age !== undefined) updateData.age = age
    if (gender !== undefined) updateData.gender = gender
    if (status !== undefined) updateData.status = status

    // 执行更新
    await db('users').where({ id }).update(updateData)

    logger.info(`更新用户: id=${id}`)

    // 返回更新后的数据
    const updated = await db('users').where({ id }).first()
    sendJSON(res, updated)
  } catch (err) {
    logger.error('更新用户失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ---------- 删除（Delete） ----------

/**
 * 删除用户
 * DELETE /api/users/:id
 *
 * db('users').where({ id }).del()
 * 相当于 SQL: DELETE FROM users WHERE id=?
 *
 * 注意：因为 articles 表设置了 onDelete('CASCADE')
 * 所以删除用户时，该用户的文章也会被自动删除（级联删除）
 */
app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id

    // 检查是否存在
    const user = await db('users').where({ id }).first()
    if (!user) {
      return sendError(res, '用户不存在', 404)
    }

    // 执行删除
    // .del() 或 .delete() 都可以
    await db('users').where({ id }).del()

    logger.info(`删除用户: id=${id}, name=${user.name}`)
    sendJSON(res, { message: '删除成功', id: parseInt(id), name: user.name })
  } catch (err) {
    logger.error('删除用户失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ============================================
// 10. 文章 CRUD
// ============================================

/**
 * 获取文章列表
 * GET /api/articles
 */
app.get('/api/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, author_id, status } = req.query

    let query = db('articles')
      .select(
        'articles.id',
        'articles.title',
        'articles.views',
        'articles.price',
        'articles.status',
        'articles.created_at',
        // 连表获取作者名称
        // .select('users.name as author_name')
        // 相当于 SQL: SELECT users.name AS author_name
        'users.name as author_name',
      )
      // .join() 内连接：只返回两个表中都匹配的记录
      // 相当于 SQL: FROM articles INNER JOIN users ON articles.author_id = users.id
      .join('users', 'articles.author_id', 'users.id')

    // 动态条件
    if (author_id) query = query.where('articles.author_id', author_id)
    if (status !== undefined) query = query.where('articles.status', parseInt(status))

    // 总数
    const [{ count }] = await query.clone().count('* as count')

    // 分页 + 排序
    const articles = await query
      .orderBy('articles.id', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))

    sendJSON(res, {
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(count),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (err) {
    logger.error('获取文章列表失败:', err.message)
    sendError(res, err.message, 500)
  }
})

/**
 * 获取文章详情（含标签）
 * GET /api/articles/:id
 *
 * 演示多表连查
 */
app.get('/api/articles/:id', async (req, res) => {
  try {
    const id = req.params.id

    // 查询文章 + 作者信息
    const article = await db('articles')
      .select(
        'articles.*',
        'users.name as author_name',
        'users.email as author_email',
      )
      .join('users', 'articles.author_id', 'users.id')
      .where('articles.id', id)
      .first()

    if (!article) {
      return sendError(res, '文章不存在', 404)
    }

    // 查询文章的标签（多对多关联查询）
    // article_tags 是中间表，连接 articles 和 tags
    const tags = await db('tags')
      .select('tags.id', 'tags.name')
      // .join('article_tags', 'tags.id', 'article_tags.tag_id')
      // 相当于 SQL: FROM tags INNER JOIN article_tags ON tags.id = article_tags.tag_id
      .join('article_tags', 'tags.id', 'article_tags.tag_id')
      .where('article_tags.article_id', id)

    // 增加浏览次数
    // .increment('views', 1) 相当于 SQL: UPDATE articles SET views = views + 1
    await db('articles').where({ id }).increment('views', 1)

    sendJSON(res, { ...article, tags })
  } catch (err) {
    logger.error('获取文章详情失败:', err.message)
    sendError(res, err.message, 500)
  }
})

/**
 * 创建文章
 * POST /api/articles
 */
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content, author_id, price, tag_ids } = req.body

    if (!title || !author_id) {
      return sendError(res, 'title 和 author_id 是必填字段')
    }

    // 验证作者是否存在
    const author = await db('users').where({ id: author_id }).first()
    if (!author) {
      return sendError(res, '作者不存在')
    }

    // 插入文章
    const [id] = await db('articles').insert({
      title,
      content: content || '',
      author_id,
      price: price || 0,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })

    // 如果传了 tag_ids，插入文章-标签关联
    if (tag_ids && tag_ids.length > 0) {
      // .map() 将标签 ID 数组转为插入格式的数组
      const tagData = tag_ids.map(tag_id => ({
        article_id: id,
        tag_id,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      }))
      await db('article_tags').insert(tagData)
    }

    logger.info(`创建文章: id=${id}, title=${title}`)
    const article = await db('articles').where({ id }).first()
    sendJSON(res, article, 201)
  } catch (err) {
    logger.error('创建文章失败:', err.message)
    sendError(res, err.message, 500)
  }
})

/**
 * 更新文章
 * PUT /api/articles/:id
 */
app.put('/api/articles/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { title, content, price, status } = req.body

    const article = await db('articles').where({ id }).first()
    if (!article) {
      return sendError(res, '文章不存在', 404)
    }

    const updateData = { updated_at: db.fn.now() }
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (price !== undefined) updateData.price = price
    if (status !== undefined) updateData.status = status

    await db('articles').where({ id }).update(updateData)

    logger.info(`更新文章: id=${id}`)
    const updated = await db('articles').where({ id }).first()
    sendJSON(res, updated)
  } catch (err) {
    logger.error('更新文章失败:', err.message)
    sendError(res, err.message, 500)
  }
})

/**
 * 删除文章
 * DELETE /api/articles/:id
 */
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const id = req.params.id
    const article = await db('articles').where({ id }).first()
    if (!article) {
      return sendError(res, '文章不存在', 404)
    }

    // 因为 article_tags 设置了 onDelete('CASCADE')
    // 删除文章时会自动删除关联的标签记录
    await db('articles').where({ id }).del()

    logger.info(`删除文章: id=${id}, title=${article.title}`)
    sendJSON(res, { message: '删除成功', id: parseInt(id) })
  } catch (err) {
    logger.error('删除文章失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ============================================
// 11. 标签接口
// ============================================

app.get('/api/tags', async (req, res) => {
  try {
    // 查询所有标签，并统计每个标签有多少篇文章
    // .groupBy('tags.id') 按标签分组
    const tags = await db('tags')
      .select('tags.id', 'tags.name')
      // 统计关联文章数
      .count('article_tags.article_id as article_count')
      // .leftJoin() 左连接：即使标签没有关联文章也会返回（count 为 0）
      .leftJoin('article_tags', 'tags.id', 'article_tags.tag_id')
      .groupBy('tags.id')
      .orderBy('tags.id', 'asc')

    sendJSON(res, tags)
  } catch (err) {
    logger.error('获取标签列表失败:', err.message)
    sendError(res, err.message, 500)
  }
})

app.post('/api/tags', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return sendError(res, '标签名不能为空')

    const existing = await db('tags').where({ name }).first()
    if (existing) return sendError(res, '标签已存在')

    const [id] = await db('tags').insert({
      name,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })

    logger.info(`创建标签: id=${id}, name=${name}`)
    const tag = await db('tags').where({ id }).first()
    sendJSON(res, tag, 201)
  } catch (err) {
    logger.error('创建标签失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ============================================
// 12. 连表查询示例
// ============================================

/**
 * 连表查询：用户及其文章
 * GET /api/join/user-articles
 *
 * 演示 .leftJoin() 左连接
 * 左连接：左表(users)所有记录都会返回，右表(articles)没有匹配则为 NULL
 */
app.get('/api/join/user-articles', async (req, res) => {
  try {
    // .leftJoin() 左连接：即使某个用户没有文章，也会返回该用户（文章字段为 null）
    const result = await db('users')
      .select(
        'users.id as user_id',
        'users.name as user_name',
        'users.email',
        'articles.id as article_id',
        'articles.title',
        'articles.views',
      )
      // .leftJoin(表名, 左表字段, 右表字段)
      .leftJoin('articles', 'users.id', 'articles.author_id')
      .orderBy('users.id', 'asc')

    // 按用户分组（一个用户可能有多篇文章）
    const grouped = {}
    for (const row of result) {
      if (!grouped[row.user_id]) {
        grouped[row.user_id] = {
          user_id: row.user_id,
          user_name: row.user_name,
          email: row.email,
          articles: [],
        }
      }
      if (row.article_id) {
        grouped[row.user_id].articles.push({
          article_id: row.article_id,
          title: row.title,
          views: row.views,
        })
      }
    }

    sendJSON(res, Object.values(grouped))
  } catch (err) {
    logger.error('连表查询失败:', err.message)
    sendError(res, err.message, 500)
  }
})

/**
 * 连表查询：文章及其标签
 * GET /api/join/article-tags
 *
 * 演示多表关联（articles → article_tags → tags）
 */
app.get('/api/join/article-tags', async (req, res) => {
  try {
    const articles = await db('articles')
      .select(
        'articles.id as article_id',
        'articles.title',
        'articles.views',
        'articles.price',
        'users.name as author_name',
      )
      .join('users', 'articles.author_id', 'users.id')
      .orderBy('articles.id', 'asc')

    // 为每篇文章查询标签
    for (const article of articles) {
      const tags = await db('tags')
        .select('tags.id', 'tags.name')
        .join('article_tags', 'tags.id', 'article_tags.tag_id')
        .where('article_tags.article_id', article.article_id)

      article.tags = tags
    }

    sendJSON(res, articles)
  } catch (err) {
    logger.error('连表查询失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ============================================
// 13. 事务（Transaction）示例
// ============================================

/**
 * 事务示例 1：模拟转账
 * POST /api/transaction/transfer
 *
 * 事务的概念：
 * - 事务是一组操作，要么全部成功，要么全部失败
 * - 比如转账：A 扣钱 + B 加钱，必须同时成功或同时失败
 *
 * Knex 事务写法：
 * - db.transaction(callback) - 开启事务
 * - callback 中使用 trx 参数代替 db 来操作数据库
 * - callback 正常返回 → 自动 commit（提交）
 * - callback 抛出异常 → 自动 rollback（回滚）
 */
app.post('/api/transaction/transfer', async (req, res) => {
  // 使用 db.transaction() 开启事务
  // trx 是事务对象，后续所有数据库操作都用 trx 代替 db
  const trx = await db.transaction()

  try {
    const { from_user_id, to_user_id, amount } = req.body

    if (!from_user_id || !to_user_id || !amount) {
      // 在事务中抛出错误会自动回滚
      throw new Error('from_user_id, to_user_id, amount 都是必填')
    }

    if (amount <= 0) {
      throw new Error('转账金额必须大于 0')
    }

    // 查询转出用户（使用 trx 代替 db）
    const fromUser = await trx('users').where({ id: from_user_id }).first()
    if (!fromUser) throw new Error('转出用户不存在')

    // 查询接收用户
    const toUser = await trx('users').where({ id: to_user_id }).first()
    if (!toUser) throw new Error('接收用户不存在')

    // 模拟扣款（用 age 字段模拟余额，仅作演示）
    // trx('users').where({ id }).update() - 在事务中更新
    await trx('users').where({ id: from_user_id }).update({
      age: fromUser.age - amount, // 模拟扣款
      updated_at: db.fn.now(),
    })

    // 模拟加款
    await trx('users').where({ id: to_user_id }).update({
      age: toUser.age + amount, // 模拟加款
      updated_at: db.fn.now(),
    })

    // 如果以上代码都正常执行，提交事务
    // trx.commit() - 提交事务，所有操作永久生效
    await trx.commit()

    logger.info(`转账成功: ${fromUser.name} → ${toUser.name}, 金额: ${amount}`)
    sendJSON(res, {
      message: '转账成功',
      from: fromUser.name,
      to: toUser.name,
      amount,
    })
  } catch (err) {
    // 出错了，回滚事务
    // trx.rollback() - 回滚事务，所有操作撤销
    await trx.rollback()

    logger.error('转账失败:', err.message)
    sendError(res, err.message, 500)
  }
})

/**
 * 事务示例 2：创建文章并打标签（原子操作）
 * POST /api/transaction/create-article
 *
 * 场景：创建文章和添加标签必须在同一个事务中
 * 如果添加标签失败，文章也不应该被创建
 */
app.post('/api/transaction/create-article', async (req, res) => {
  const trx = await db.transaction()

  try {
    const { title, content, author_id, price, tag_ids } = req.body

    if (!title || !author_id) {
      throw new Error('title 和 author_id 是必填字段')
    }

    // 步骤1：在事务中创建文章
    const [articleId] = await trx('articles').insert({
      title,
      content: content || '',
      author_id,
      price: price || 0,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })

    // 步骤2：在事务中添加标签关联
    if (tag_ids && tag_ids.length > 0) {
      // 验证所有标签是否存在
      for (const tag_id of tag_ids) {
        const tag = await trx('tags').where({ id: tag_id }).first()
        if (!tag) throw new Error(`标签 id=${tag_id} 不存在`)
      }

      const tagData = tag_ids.map(tag_id => ({
        article_id: articleId,
        tag_id,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      }))
      await trx('article_tags').insert(tagData)
    }

    // 全部成功，提交事务
    await trx.commit()

    logger.info(`事务创建文章成功: id=${articleId}, title=${title}`)
    const article = await db('articles').where({ id: articleId }).first()
    sendJSON(res, article, 201)
  } catch (err) {
    // 任一步骤失败，全部回滚
    await trx.rollback()
    logger.error('事务创建文章失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ============================================
// 14. mysql2 原生查询示例（不通过 Knex）
// ============================================

/**
 * mysql2 原生查询接口
 * GET /api/raw-example
 *
 * 演示直接使用 mysql2/promise 执行原生 SQL
 * 有时复杂查询用原生 SQL 更方便
 */
app.get('/api/raw-example', async (req, res) => {
  try {
    // pool.execute() 执行原生 SQL
    // 使用 ? 占位符防止 SQL 注入
    const [rows] = await pool.execute('SELECT COUNT(*) as total FROM users')

    // 也可以用 pool.query()
    // execute 和 query 的区别：
    // - execute 使用预处理语句（Prepared Statement），更安全
    // - query 直接拼接 SQL，适合一次性查询
    const [articles] = await pool.query(
      'SELECT id, title, views FROM articles ORDER BY views DESC LIMIT ?',
      [5]
    )

    sendJSON(res, {
      total_users: rows[0].total,
      top_articles: articles,
      tip: '这是 mysql2 原生 SQL 查询的结果',
    })
  } catch (err) {
    logger.error('原生查询失败:', err.message)
    sendError(res, err.message, 500)
  }
})

// ============================================
// 15. 404 + 错误处理
// ============================================
app.use((req, res) => {
  sendError(res, `路由不存在: ${req.method} ${req.url}`, 404)
})

app.use((err, req, res, next) => {
  logger.error('服务器错误:', err)
  sendError(res, 'Internal Server Error', 500)
})

// ============================================
// 16. 启动服务器
// ============================================
async function start() {
  try {
    // 先初始化数据库
    await initDatabase()

    // 再启动 Express
    app.listen(PORT, () => {
      logger.info('========================================')
      logger.info('🚀 Express + MySQL 服务器已启动')
      logger.info(`📍 http://localhost:${PORT}`)
      logger.info('========================================')
      logger.info('')
      logger.info('💡 测试命令:')
      logger.info(`   curl http://localhost:${PORT}/api/users`)
      logger.info(`   curl http://localhost:${PORT}/api/articles`)
      logger.info(`   curl http://localhost:${PORT}/api/join/user-articles`)
      logger.info(`   curl http://localhost:${PORT}/api/raw-example`)
      logger.info('')
    })
  } catch (err) {
    logger.error('启动失败:', err.message)
    logger.error('请检查:')
    logger.error('  1. MySQL 是否已启动')
    logger.error('  2. 数据库 node-test 是否已创建')
    logger.error('  3. 账号密码是否正确')
    process.exit(1)
  }
}

start()

// 优雅退出
process.on('SIGINT', async () => {
  logger.info('正在关闭...')
  await db.destroy()   // 关闭 Knex 连接池
  await pool.end()     // 关闭 mysql2 连接池
  logger.info('数据库连接已关闭')
  process.exit(0)
})
