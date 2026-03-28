/**
 * Node.js HTTP 模块 - 真正可运行的服务器示例
 * 运行: node network-examples/http-demo.js
 * 访问: http://localhost:3000
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { log } from 'console'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================
// 配置
// ============================================
const PORT = 3000
const STATIC_DIR = path.join(__dirname, 'public')

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

// 模拟数据库
const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' },
]

// ============================================
// 工具函数
// ============================================

// 解析 POST 请求体
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        resolve(body)
      }
    })
    req.on('error', reject)
  })
}

// 解析 URL 查询参数
function parseQuery(url) {
  const query = {}
  const searchParams = url.split('?')[1]
  if (searchParams) {
    for (const pair of searchParams.split('&')) {
      const [key, value] = pair.split('=')
      query[decodeURIComponent(key)] = decodeURIComponent(value || '')
    }
  }
  return query
}

// 发送 JSON 响应
function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  })
  res.end(JSON.stringify(data, null, 2))
}

// 发送 HTML 响应
function sendHTML(res, html, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache',
  })
  res.end(html)
}

// 发送错误响应
function sendError(res, message, statusCode = 400) {
  sendJSON(res, { error: message }, statusCode)
}

// 生成简单 ETag
function generateETag(content) {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return `"${hash.toString(16)}"`
}

// ============================================
// 路由处理器
// ============================================

// 首页
function handleHome(req, res) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Node.js HTTP 服务器示例</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #1a1a2e; color: #eee; }
    h1 { color: #00d9ff; }
    .card { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin: 15px 0; }
    h3 { color: #00d9ff; margin-top: 0; }
    code { background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px; color: #ff6b6b; }
    a { color: #00d9ff; }
    .method { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
    .get { background: #2ecc71; color: white; }
    .post { background: #3498db; color: white; }
    .put { background: #f39c12; color: white; }
    .delete { background: #e74c3c; color: white; }
  </style>
</head>
<body>
  <h1>🚀 Node.js HTTP 服务器示例</h1>
  <p>这是一个功能完整的 HTTP 服务器示例，演示了路由、缓存、API 等功能。</p>

  <div class="card">
    <h3>📡 API 接口</h3>
    <p><span class="method get">GET</span> <a href="/api/users"><code>/api/users</code></a> 获取用户列表</p>
    <p><span class="method get">GET</span> <code>/api/users/:id</code> 获取单个用户</p>
    <p><span class="method post">POST</span> <code>/api/users</code> 创建用户 (JSON)</p>
    <p><span class="method put">PUT</span> <code>/api/users/:id</code> 更新用户</p>
    <p><span class="method delete">DELETE</span> <code>/api/users/:id</code> 删除用户</p>
  </div>

  <div class="card">
    <h3>📁 静态文件 & 缓存</h3>
    <p><span class="method get">GET</span> <code>/static/*</code> 静态资源（强缓存 1 年）</p>
    <p><span class="method get">GET</span> <a href="/cache-test"><code>/cache-test</code></a> 协商缓存测试 (ETag)</p>
  </div>

  <div class="card">
    <h3>ℹ️ 服务器信息</h3>
    <p><span class="method get">GET</span> <a href="/api/info"><code>/api/info</code></a> 获取服务器信息</p>
  </div>
</body>
</html>`
  sendHTML(res, html)
}

// 获取用户列表
function handleGetUsers(req, res) {
  const query = parseQuery(req.url)

  // 支持分页
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedUsers = users.slice(start, end)

  sendJSON(res, {
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: users.length,
      totalPages: Math.ceil(users.length / limit),
    },
  })
}

// 获取单个用户
function handleGetUser(req, res, id) {
  const user = users.find((u) => u.id === parseInt(id))
  if (user) {
    sendJSON(res, user)
  } else {
    sendError(res, '用户不存在', 404)
  }
}

// 创建用户
async function handleCreateUser(req, res) {
  const body = await parseBody(req)

  if (!body.name || !body.email) {
    return sendError(res, 'name 和 email 是必填字段')
  }

  const newUser = {
    id: users.length + 1,
    name: body.name,
    email: body.email,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  sendJSON(res, newUser, 201)
}

// 更新用户
async function handleUpdateUser(req, res, id) {
  const userId = parseInt(id)
  const index = users.findIndex((u) => u.id === userId)

  if (index === -1) {
    return sendError(res, '用户不存在', 404)
  }

  const body = await parseBody(req)
  users[index] = {
    ...users[index],
    ...body,
    updatedAt: new Date().toISOString(),
  }
  sendJSON(res, users[index])
}

// 删除用户
function handleDeleteUser(req, res, id) {
  const userId = parseInt(id)
  const index = users.findIndex((u) => u.id === userId)

  if (index === -1) {
    return sendError(res, '用户不存在', 404)
  }

  users.splice(index, 1)
  sendJSON(res, { message: '删除成功', id: userId })
}

// 服务器信息
function handleServerInfo(req, res) {
  sendJSON(res, {
    node: process.version,
    platform: process.platform,
    uptime: Math.floor(process.uptime()) + 's',
    memory: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
    },
    timestamp: new Date().toISOString(),
  })
}

// 协商缓存测试
function handleCacheTest(req, res) {
  const content = JSON.stringify({
    message: '这是一个协商缓存测试',
    timestamp: new Date().toISOString(),
    tip: '第二次请求会返回 304',
  })

  const etag = generateETag(content)

  // 检查客户端缓存是否有效
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304)
    return res.end()
  }

  res.writeHead(200, {
    'Content-Type': 'application/json',
    ETag: etag,
    'Cache-Control': 'no-cache',
  })
  res.end(content)
}

// 静态文件服务
function handleStatic(req, res, filePath) {
  const fullPath = path.join(STATIC_DIR, filePath)

  // 安全检查：防止路径遍历攻击
  if (!fullPath.startsWith(STATIC_DIR)) {
    return sendError(res, '禁止访问', 403)
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      return sendError(res, '文件不存在', 404)
    }

    const ext = path.extname(fullPath)
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    // 协商缓存：检查 If-Modified-Since
    const mtime = stats.mtime.toUTCString()
    if (req.headers['if-modified-since'] === mtime) {
      res.writeHead(304)
      return res.end()
    }

    // 强缓存：静态资源缓存 1 年
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
      'Last-Modified': mtime,
    })

    fs.createReadStream(fullPath).pipe(res)
  })
}

// CORS 预检请求
function handleOptions(req, res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })
  res.end()
}

// ============================================
// 创建服务器
// ============================================
const server = http.createServer(async (req, res) => {
  const { method } = req
  const urlPath = req.url.split('?')[0]
  console.log(`[${new Date().toISOString()}] ${method} ${req.url}`)

  // CORS 预检请求
  if (method === 'OPTIONS') {
    return handleOptions(req, res)
  }

  // 路由分发
  try {
    // 首页
    if (method === 'GET' && urlPath === '/') {
      return handleHome(req, res)
    }

    // API: 用户列表
    if (method === 'GET' && urlPath === '/api/users') {
      return handleGetUsers(req, res)
    }

    // API: 单个用户
    const userMatch = urlPath.match(/^\/api\/users\/(\d+)$/)
    if (userMatch) {
      if (method === 'GET') return handleGetUser(req, res, userMatch[1])
      if (method === 'PUT') return handleUpdateUser(req, res, userMatch[1])
      if (method === 'DELETE') return handleDeleteUser(req, res, userMatch[1])
    }

    // API: 创建用户
    if (method === 'POST' && urlPath === '/api/users') {
      return handleCreateUser(req, res)
    }

    // API: 服务器信息
    if (method === 'GET' && urlPath === '/api/info') {
      return handleServerInfo(req, res)
    }

    // 协商缓存测试
    if (method === 'GET' && urlPath === '/cache-test') {
      return handleCacheTest(req, res)
    }

    // 静态文件
    if (urlPath.startsWith('/static/')) {
      return handleStatic(req, res, urlPath.replace('/static/', ''))
    }

    // 404
    sendError(res, 'Not Found', 404)
  } catch (error) {
    console.error('服务器错误:', error)
    sendError(res, 'Internal Server Error', 500)
  }
})

// ============================================
// 启动服务器
// ============================================
server.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════╗')
  console.log('║      🚀 Node.js HTTP 服务器已启动         ║')
  console.log('╠══════════════════════════════════════════╣')
  console.log(`║  访问地址: http://localhost:${PORT}          ║`)
  console.log('║  按 Ctrl+C 停止服务器                    ║')
  console.log('╚══════════════════════════════════════════╝')
  console.log()
  console.log('📋 可用接口:')
  console.log(`   GET  /                  首页`)
  console.log(`   GET  /api/users         用户列表`)
  console.log(`   GET  /api/users/:id     用户详情`)
  console.log(`   POST /api/users         创建用户`)
  console.log(`   GET  /api/info          服务器信息`)
  console.log(`   GET  /cache-test        缓存测试`)
  console.log()
  console.log('💡 测试命令:')
  console.log(`   curl http://localhost:${PORT}/api/users`)
  console.log(`   curl http://localhost:${PORT}/api/info`)
  console.log(
    `   curl -X POST -H "Content-Type: application/json" -d '{"name":"测试","email":"test@test.com"}' http://localhost:${PORT}/api/users`,
  )
  console.log()
})

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...')
  server.close(() => {
    console.log('服务器已关闭')
    process.exit(0)
  })
})
