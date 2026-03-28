<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>Express 框架</span>
      </div>
      <h1>🚂 Express 框架</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>Express 是 Node.js 最流行的 Web 框架，提供路由、中间件等强大功能。使用 <code>npm install express</code> 安装。
    </div>

    <!-- 服务器状态检测 -->
    <div class="server-status" :class="{ online: serverOnline, offline: !serverOnline }">
      <div class="status-icon">
        <span v-if="serverOnline">✅</span>
        <span v-else>❌</span>
      </div>
      <div class="status-info">
        <h3>{{ serverOnline ? '服务器运行中' : '服务器未启动' }}</h3>
        <p v-if="serverOnline">地址: {{ serverUrl }}</p>
        <p v-else>
          请先启动服务器:
          <code>node network-examples/express-demo.js</code>
        </p>
      </div>
      <button @click="checkServerStatus" class="refresh-btn">刷新状态</button>
    </div>

    <!-- 功能卡片 -->
    <div class="feature-grid">
      <div class="feature-card">
        <div class="icon">🛤️</div>
        <h3>路由</h3>
        <p>GET/POST/PUT/DELETE</p>
      </div>
      <div class="feature-card">
        <div class="icon">🔗</div>
        <h3>动态参数</h3>
        <p>/api/:id</p>
      </div>
      <div class="feature-card">
        <div class="icon">📦</div>
        <h3>模块化</h3>
        <p>express.Router()</p>
      </div>
      <div class="feature-card">
        <div class="icon">🔧</div>
        <h3>中间件</h3>
        <p>请求处理链</p>
      </div>
      <div class="feature-card">
        <div class="icon">📝</div>
        <h3>log4js</h3>
        <p>日志系统</p>
      </div>
      <div class="feature-card">
        <div class="icon">🔒</div>
        <h3>防盗链</h3>
        <p>Referer 检查</p>
      </div>
    </div>

    <!-- API 测试面板 -->
    <h2 class="section-title">🧪 API 测试面板</h2>
    <div class="api-tester">
      <div class="api-list">
        <div
          v-for="api in apis"
          :key="api.path"
          class="api-item"
          :class="{ active: selectedApi === api }"
          @click="selectApi(api)"
        >
          <span class="method" :class="api.method.toLowerCase()">{{ api.method }}</span>
          <span class="path">{{ api.path }}</span>
          <span class="desc">{{ api.desc }}</span>
        </div>
      </div>

      <div class="api-detail" v-if="selectedApi">
        <div class="api-header">
          <span class="method" :class="selectedApi.method.toLowerCase()">{{ selectedApi.method }}</span>
          <input v-model="requestPath" class="path-input" :placeholder="selectedApi.path" />
          <button @click="sendRequest" :disabled="loading || !serverOnline" class="send-btn">
            {{ loading ? '请求中...' : '发送请求' }}
          </button>
        </div>

        <div class="api-body" v-if="selectedApi.body">
          <h4>请求体 (JSON)</h4>
          <textarea v-model="requestBody" class="body-input"></textarea>
        </div>

        <div class="api-response">
          <h4>响应结果</h4>
          <div v-if="error" class="error-box">{{ error }}</div>
          <pre v-else-if="response" class="response-box">{{ formattedResponse }}</pre>
          <div v-else class="empty-hint">点击"发送请求"查看结果</div>
        </div>
      </div>
    </div>

    <!-- 路由详解 -->
    <h2 class="section-title">🛤️ 路由详解</h2>
    <div class="code-block">
      <h4>📝 基础路由</h4>
      <pre><code>// GET 请求
app.get('/', (req, res) => {
  res.json({ message: 'Hello Express' })
})

// POST 请求
app.post('/api/users', (req, res) => {
  const { name } = req.body  // 获取请求体
  res.status(201).json({ id: 1, name })
})

// 动态路由参数 :id
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id  // 获取动态参数
  res.json({ id })
})

// 查询参数 ?page=1&limit=10
app.get('/api/articles', (req, res) => {
  const page = req.query.page    // 获取查询参数
  const limit = req.query.limit
  res.json({ page, limit })
})</code></pre>
    </div>

    <!-- 模块化路由 -->
    <h2 class="section-title">📦 模块化路由 express.Router()</h2>
    <div class="code-block">
      <h4>📝 路由模块化</h4>
      <pre><code>// routes/articles.js - 文章路由模块
import express from 'express'
const router = express.Router()

// 定义子路由
router.get('/', (req, res) => {
  res.json({ articles: [] })
})

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id })
})

router.post('/', (req, res) => {
  res.status(201).json(req.body)
})

export default router

// app.js - 主文件
import articlesRouter from './routes/articles.js'

// 挂载路由模块
app.use('/api/articles', articlesRouter)
// 现在 /api/articles → router.get('/')
// /api/articles/:id → router.get('/:id')</code></pre>
    </div>

    <!-- 中间件 -->
    <h2 class="section-title">🔧 中间件</h2>
    <div class="middleware-flow">
      <div class="flow-item">请求</div>
      <div class="flow-arrow">→</div>
      <div class="flow-item mw">日志中间件</div>
      <div class="flow-arrow">→</div>
      <div class="flow-item mw">认证中间件</div>
      <div class="flow-arrow">→</div>
      <div class="flow-item mw">路由处理</div>
      <div class="flow-arrow">→</div>
      <div class="flow-item">响应</div>
    </div>

    <div class="code-block">
      <h4>📝 中间件示例</h4>
      <pre><code>// 日志中间件 - 记录每个请求
app.use((req, res, next) => {
  const start = Date.now()

  // 监听响应完成
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.url} ${res.statusCode} (${duration}ms)`)
  })

  next() // 必须调用 next() 传递给下一个中间件
})

// 认证中间件 - 检查 token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ error: '未授权' })
  }

  // 验证 token...
  req.user = { id: 1, name: 'test' } // 将用户信息挂载到 req
  next()
}

// 在特定路由使用中间件
app.get('/api/profile', authMiddleware, (req, res) => {
  res.json(req.user)
})</code></pre>
    </div>

    <!-- log4js -->
    <h2 class="section-title">📝 log4js 日志系统</h2>
    <div class="code-block">
      <h4>📝 log4js 配置</h4>
      <pre><code>import log4js from 'log4js'

// 配置日志输出
log4js.configure({
  appenders: {
    // 控制台输出
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d] [%p] [%c] -%] %m'
      }
    },
    // 文件输出
    file: {
      type: 'file',
      filename: 'logs/app.log',
      maxLogSize: 10 * 1024 * 1024,  // 10MB
      backups: 3  // 保留 3 个备份
    }
  },
  categories: {
    default: {
      appenders: ['console', 'file'],
      level: 'debug'  // trace < debug < info < warn < error < fatal
    }
  }
})

// 使用日志
const logger = log4js.getLogger('default')
logger.debug('调试信息')
logger.info('普通信息')
logger.warn('警告信息')
logger.error('错误信息')</code></pre>
    </div>

    <!-- 防盗链 -->
    <h2 class="section-title">🔒 防盗链 (Referer)</h2>
    <div class="code-block">
      <h4>📝 Referer 检查中间件</h4>
      <pre><code>/**
 * 防盗链中间件 - 检查请求来源
 * Referer 请求头包含来源页面的 URL
 */
const refererCheck = (req, res, next) => {
  const referer = req.get('Referer')

  // 允许的来源白名单
  const allowedOrigins = [
    'localhost:3001',
    'localhost:5173',
    'example.com'
  ]

  // 无 Referer（直接访问）通常允许
  if (!referer) {
    return next()
  }

  // 解析 Referer URL
  const url = new URL(referer)
  const origin = url.host  // localhost:3001

  if (allowedOrigins.includes(origin)) {
    next()  // 白名单，允许访问
  } else {
    res.status(403).json({
      error: '禁止访问',
      message: '该资源不允许从外部网站访问'
    })
  }
}

// 对特定路径启用防盗链
app.use('/static/protected', refererCheck, express.static('protected'))</code></pre>
    </div>

    <!-- 常用中间件 -->
    <h2 class="section-title">⚡ 常用内置中间件</h2>
    <div class="middleware-table">
      <table>
        <thead>
          <tr><th>中间件</th><th>说明</th><th>用途</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>express.json()</code></td>
            <td>解析 JSON 请求体</td>
            <td>POST/PUT JSON 数据</td>
          </tr>
          <tr>
            <td><code>express.urlencoded()</code></td>
            <td>解析 URL 编码请求体</td>
            <td>表单提交</td>
          </tr>
          <tr>
            <td><code>express.static()</code></td>
            <td>静态文件服务</td>
            <td>CSS/JS/图片等</td>
          </tr>
          <tr>
            <td><code>express.Router()</code></td>
            <td>创建模块化路由</td>
            <td>路由分组</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Express 服务器</h3>
      <p>在终端运行以下命令启动服务器：</p>
      <code>node network-examples/express-demo.js</code>
      <p class="hint">启动后可使用上方的 API 测试面板进行测试</p>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>req.params</strong> - 获取动态路由参数 (:id)</li>
        <li><strong>req.query</strong> - 获取查询字符串 (?page=1)</li>
        <li><strong>req.body</strong> - 获取请求体（需要 express.json()）</li>
        <li><strong>req.headers / req.get()</strong> - 获取请求头</li>
        <li><strong>res.json()</strong> - 返回 JSON 响应</li>
        <li><strong>res.status()</strong> - 设置状态码</li>
        <li><strong>next()</strong> - 中间件必须调用才能继续</li>
        <li><strong>错误处理</strong> - 四参数中间件 (err, req, res, next)</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const serverUrl = 'http://localhost:3001'
const serverOnline = ref(false)
const loading = ref(false)
const response = ref(null)
const error = ref(null)
const selectedApi = ref(null)
const requestPath = ref('')
const requestBody = ref('')

// API 列表
const apis = [
  { method: 'GET', path: '/', desc: '首页 - API 列表', body: false },
  { method: 'GET', path: '/api/articles', desc: '文章列表', body: false },
  { method: 'GET', path: '/api/articles/1', desc: '文章详情 (动态参数)', body: false },
  { method: 'POST', path: '/api/articles', desc: '创建文章', body: true },
  { method: 'PUT', path: '/api/articles/1', desc: '更新文章', body: true },
  { method: 'DELETE', path: '/api/articles/1', desc: '删除文章', body: false },
  { method: 'GET', path: '/api/info', desc: '服务器信息', body: false },
]

// 格式化响应
const formattedResponse = computed(() => {
  if (!response.value) return ''
  return JSON.stringify(response.value, null, 2)
})

// 检查服务器状态
async function checkServerStatus() {
  try {
    const res = await fetch(`${serverUrl}/api/info`, { method: 'GET' })
    if (res.ok) {
      serverOnline.value = true
    } else {
      serverOnline.value = false
    }
  } catch {
    serverOnline.value = false
  }
}

// 选择 API
function selectApi(api) {
  selectedApi.value = api
  requestPath.value = api.path
  error.value = null
  response.value = null

  // 设置默认请求体
  if (api.body) {
    requestBody.value = JSON.stringify({
      title: '测试文章标题',
      content: '这是测试内容',
      author: '测试作者'
    }, null, 2)
  } else {
    requestBody.value = ''
  }
}

// 发送请求
async function sendRequest() {
  if (!serverOnline.value) {
    error.value = '服务器未启动，请先运行: node network-examples/express-demo.js'
    return
  }

  loading.value = true
  error.value = null
  response.value = null

  try {
    const options = {
      method: selectedApi.value.method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (selectedApi.value.body && requestBody.value) {
      options.body = requestBody.value
    }

    const res = await fetch(`${serverUrl}${requestPath.value}`, options)
    const data = await res.json()

    if (!res.ok) {
      error.value = `HTTP ${res.status}: ${data.error || data.message || '请求失败'}`
    } else {
      response.value = data
    }
  } catch (e) {
    error.value = `请求失败: ${e.message}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkServerStatus()
  selectApi(apis[0])
})
</script>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 40px;
}

.module-header {
  margin-bottom: 30px;
}

.module-header .breadcrumb {
  font-size: 0.9em;
  color: var(--text-dim);
  margin-bottom: 10px;
}

.module-header .breadcrumb a {
  color: var(--primary);
  text-decoration: none;
}

.module-header h1 {
  font-size: 2.5em;
  color: var(--primary);
}

.intro-box {
  background: rgba(0, 217, 255, 0.1);
  border-left: 4px solid var(--primary);
  padding: 15px 20px;
  margin-bottom: 30px;
  border-radius: 0 8px 8px 0;
}

.intro-box code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--primary);
}

/* 服务器状态 */
.server-status {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.server-status.online {
  background: rgba(46, 204, 113, 0.1);
  border: 2px solid #2ecc71;
}

.server-status.offline {
  background: rgba(231, 76, 60, 0.1);
  border: 2px solid #e74c3c;
}

.status-icon {
  font-size: 2em;
}

.status-info {
  flex: 1;
}

.status-info h3 {
  margin: 0 0 5px;
  color: var(--text);
}

.status-info p {
  margin: 0;
  color: var(--text-dim);
  font-size: 0.9em;
}

.status-info code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--accent);
}

.refresh-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 功能卡片 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.1);
}

.feature-card .icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.feature-card h3 {
  color: var(--text);
  font-size: 0.95em;
}

.feature-card p {
  color: var(--text-dim);
  font-size: 0.8em;
  margin-top: 5px;
}

.section-title {
  font-size: 1.5em;
  color: var(--text);
  margin: 30px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

/* API 测试面板 */
.api-tester {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.api-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.api-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.api-item.active {
  background: rgba(0, 217, 255, 0.15);
}

.api-item .method {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75em;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
}

.api-item .method.get { background: #2ecc71; color: white; }
.api-item .method.post { background: #3498db; color: white; }
.api-item .method.put { background: #f39c12; color: white; }
.api-item .method.delete { background: #e74c3c; color: white; }

.api-item .path {
  color: var(--text);
  font-family: monospace;
  font-size: 0.85em;
}

.api-item .desc {
  color: var(--text-dim);
  font-size: 0.75em;
  margin-left: auto;
}

.api-detail {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.api-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.api-header .method {
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
}

.path-input {
  flex: 1;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: var(--text);
  font-family: monospace;
}

.send-btn {
  padding: 10px 20px;
  background: var(--primary);
  border: none;
  border-radius: 6px;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.send-btn:hover:not(:disabled) {
  background: #00b8d9;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.api-body h4 {
  color: var(--text-dim);
  margin-bottom: 8px;
  font-size: 0.9em;
}

.body-input {
  width: 100%;
  height: 120px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: var(--text);
  font-family: monospace;
  font-size: 0.9em;
  resize: vertical;
}

.api-response h4 {
  color: var(--text-dim);
  margin-bottom: 8px;
  font-size: 0.9em;
}

.response-box {
  background: rgba(0, 0, 0, 0.4);
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.85em;
  color: #2ecc71;
  max-height: 300px;
  overflow-y: auto;
}

.error-box {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  padding: 15px;
  border-radius: 6px;
  color: #e74c3c;
}

.empty-hint {
  color: var(--text-dim);
  text-align: center;
  padding: 20px;
}

/* 中间件流程图 */
.middleware-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.flow-item {
  padding: 10px 15px;
  background: rgba(52, 152, 219, 0.2);
  border-radius: 8px;
  color: var(--primary);
  font-weight: bold;
}

.flow-item.mw {
  background: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
}

.flow-arrow {
  color: var(--text-dim);
  font-size: 1.2em;
}

/* 表格 */
.middleware-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.middleware-table h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.middleware-table table {
  width: 100%;
  border-collapse: collapse;
}

.middleware-table th,
.middleware-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.middleware-table th {
  color: var(--primary);
}

.middleware-table td:first-child {
  color: var(--accent);
  font-family: monospace;
}

.code-block {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.code-block h4 {
  color: var(--accent);
  margin-bottom: 15px;
}

.code-block pre {
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: var(--text);
  line-height: 1.6;
}

.run-box {
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid var(--secondary);
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  text-align: center;
}

.run-box h3 {
  color: var(--secondary);
  margin-bottom: 15px;
}

.run-box code {
  background: rgba(0, 0, 0, 0.4);
  padding: 10px 20px;
  border-radius: 6px;
  display: inline-block;
  font-size: 1.1em;
}

.run-box .hint {
  color: var(--text-dim);
  font-size: 0.9em;
  margin-top: 10px;
}

.tips-box {
  background: rgba(0, 217, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
}

.tips-box h3 {
  color: var(--primary);
  margin-bottom: 15px;
}

.tips-box ul {
  list-style: none;
}

.tips-box li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.tips-box li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary);
}

@media (max-width: 768px) {
  .api-tester {
    grid-template-columns: 1fr;
  }
}
</style>
