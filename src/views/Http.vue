<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>HTTP 服务</span>
      </div>
      <h1>🌐 HTTP 模块</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>HTTP 模块用于创建 Web 服务器和客户端。本节涵盖 Web 服务器基础、反向代理（http-proxy-middleware）、动静分离与缓存策略。使用 <code>import http from 'http'</code> 引入。
    </div>

    <!-- 功能卡片 -->
    <div class="feature-grid">
      <div class="feature-card server">
        <div class="icon">🖥️</div>
        <h3>Web 服务器</h3>
        <p>创建 HTTP 服务</p>
      </div>
      <div class="feature-card proxy">
        <div class="icon">🔄</div>
        <h3>反向代理</h3>
        <p>http-proxy-middleware</p>
      </div>
      <div class="feature-card static">
        <div class="icon">📁</div>
        <h3>动静分离</h3>
        <p>缓存策略</p>
      </div>
      <div class="feature-card route">
        <div class="icon">🛤️</div>
        <h3>路由处理</h3>
        <p>请求分发</p>
      </div>
    </div>

    <!-- 基础服务器 -->
    <h2 class="section-title">🖥️ 基础 Web 服务器</h2>
    <div class="methods-grid">
      <MethodCard
        title="http.createServer([options][, requestListener])"
        desc="创建 HTTP 服务器"
        :examples="createServerExamples"
      />
      <MethodCard
        title="server.listen(port[, host][, callback])"
        desc="监听指定端口"
        :examples="listenExamples"
      />
    </div>

    <div class="code-block">
      <h4>📝 最简服务器</h4>
      <pre><code>import http from 'http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World')
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})</code></pre>
    </div>

    <!-- 请求对象 -->
    <h2 class="section-title">📥 请求对象 req</h2>
    <div class="req-table">
      <h4>📋 req 常用属性</h4>
      <table>
        <thead>
          <tr><th>属性</th><th>说明</th><th>示例</th></tr>
        </thead>
        <tbody>
          <tr><td><code>req.method</code></td><td>请求方法</td><td>GET, POST, PUT, DELETE</td></tr>
          <tr><td><code>req.url</code></td><td>请求路径</td><td>/api/users?id=1</td></tr>
          <tr><td><code>req.headers</code></td><td>请求头对象</td><td>{ 'content-type': '...' }</td></tr>
          <tr><td><code>req.httpVersion</code></td><td>HTTP 版本</td><td>1.1</td></tr>
          <tr><td><code>req.socket</code></td><td>底层 socket</td><td>获取 IP 等</td></tr>
        </tbody>
      </table>
    </div>

    <div class="code-block">
      <h4>📝 获取 POST 请求体</h4>
      <pre><code>function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        resolve(body)
      }
    })
  })
}

// 使用
if (req.method === 'POST') {
  const data = await parseBody(req)
  console.log(data)
}</code></pre>
    </div>

    <!-- 响应对象 -->
    <h2 class="section-title">📤 响应对象 res</h2>
    <div class="methods-grid">
      <MethodCard
        title="res.writeHead(statusCode[, headers])"
        desc="写入响应头和状态码"
        :examples="writeHeadExamples"
      />
      <MethodCard
        title="res.setHeader(name, value)"
        desc="设置单个响应头"
        :examples="setHeaderExamples"
      />
      <MethodCard
        title="res.write(chunk[, encoding])"
        desc="写入响应体数据"
        :examples="writeExamples"
      />
      <MethodCard
        title="res.end([data][, encoding])"
        desc="结束响应"
        :examples="endExamples"
      />
    </div>

    <div class="status-table">
      <h4>📋 常用状态码</h4>
      <table>
        <thead>
          <tr><th>状态码</th><th>说明</th><th>使用场景</th></tr>
        </thead>
        <tbody>
          <tr><td><code>200</code></td><td>OK</td><td>请求成功</td></tr>
          <tr><td><code>201</code></td><td>Created</td><td>资源创建成功</td></tr>
          <tr><td><code>304</code></td><td>Not Modified</td><td>缓存有效</td></tr>
          <tr><td><code>400</code></td><td>Bad Request</td><td>请求参数错误</td></tr>
          <tr><td><code>401</code></td><td>Unauthorized</td><td>未登录/未授权</td></tr>
          <tr><td><code>403</code></td><td>Forbidden</td><td>禁止访问</td></tr>
          <tr><td><code>404</code></td><td>Not Found</td><td>资源不存在</td></tr>
          <tr><td><code>500</code></td><td>Internal Server Error</td><td>服务器错误</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 路由处理 -->
    <h2 class="section-title">🛤️ 路由处理</h2>
    <div class="code-block">
      <h4>📝 基础路由示例</h4>
      <pre><code>const server = http.createServer((req, res) => {
  const { method, url } = req

  // GET / - 首页
  if (method === 'GET' && url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Home</h1>')
  }

  // GET /api/users - 获取用户列表
  else if (method === 'GET' && url === '/api/users') {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ users: [] }))
  }

  // POST /api/users - 创建用户
  else if (method === 'POST' && url === '/api/users') {
    const data = await parseBody(req)
    // ... 创建逻辑
    res.statusCode = 201
    res.end(JSON.stringify({ id: 1, ...data }))
  }

  // 404
  else {
    res.statusCode = 404
    res.end('Not Found')
  }
})</code></pre>
    </div>

    <!-- 动静分离与缓存 -->
    <h2 class="section-title">📁 动静分离与缓存策略</h2>

    <div class="cache-box">
      <h4>📋 缓存类型对比</h4>
      <div class="cache-types">
        <div class="cache-type strong">
          <h5>强缓存</h5>
          <p>不发请求，直接用缓存</p>
          <code>Cache-Control: max-age=31536000</code>
        </div>
        <div class="cache-type negotiate">
          <h5>协商缓存</h5>
          <p>发请求验证是否变化</p>
          <code>Last-Modified / ETag</code>
        </div>
      </div>
    </div>

    <div class="cache-table">
      <h4>📊 动静分离推荐配置</h4>
      <table>
        <thead>
          <tr><th>资源类型</th><th>缓存策略</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>HTML 页面</td>
            <td><code>no-cache</code> 或 <code>max-age=0</code></td>
            <td>每次验证，保证最新</td>
          </tr>
          <tr>
            <td>JS / CSS</td>
            <td><code>max-age=31536000</code></td>
            <td>永久缓存 + 文件名带 hash</td>
          </tr>
          <tr>
            <td>图片 / 字体</td>
            <td><code>max-age=31536000</code></td>
            <td>永久缓存</td>
          </tr>
          <tr>
            <td>API 接口</td>
            <td><code>no-cache</code> 或 <code>no-store</code></td>
            <td>实时数据，不缓存</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="code-block">
      <h4>📝 静态文件服务 + 缓存控制</h4>
      <pre><code>const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg'
}

// 静态资源路由
if (url.startsWith('/static/')) {
  const filePath = path.join(__dirname, url)
  const ext = path.extname(filePath)
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  // 强缓存 1 年
  res.setHeader('Cache-Control', 'public, max-age=31536000')
  res.setHeader('Content-Type', contentType)

  // 协商缓存支持
  const stats = fs.statSync(filePath)
  const mtime = stats.mtime.toISOString()
  res.setHeader('Last-Modified', mtime)

  // 304 响应
  if (req.headers['if-modified-since'] === mtime) {
    res.statusCode = 304
    return res.end()
  }

  fs.createReadStream(filePath).pipe(res)
}</code></pre>
    </div>

    <!-- 反向代理 -->
    <h2 class="section-title">🔄 反向代理</h2>

    <div class="proxy-intro">
      <h4>💡 什么是反向代理？</h4>
      <p>客户端请求代理服务器，代理服务器转发到后端服务器。用于负载均衡、隐藏后端、跨域处理。</p>
    </div>

    <div class="code-block">
      <h4>📝 使用 http-proxy-middleware</h4>
      <pre><code>// 安装: npm install http-proxy-middleware

import { createProxyMiddleware } from 'http-proxy-middleware'

// 代理配置
const apiProxy = createProxyMiddleware({
  target: 'http://localhost:3001',   // 目标服务器
  changeOrigin: true,                // 修改请求头 origin
  pathRewrite: {
    '^/api': ''                      // /api/users → /users
  },
  onProxyReq(proxyReq, req, res) {
    console.log('代理请求:', req.url)
  },
  onError(err, req, res) {
    res.statusCode = 500
    res.end('Proxy Error')
  }
})

// 在服务器中使用
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    return apiProxy(req, res)
  }
  // ... 其他路由
})</code></pre>
    </div>

    <div class="proxy-options">
      <h4>📋 常用代理配置</h4>
      <div class="options-list">
        <div class="option-item"><code>target</code> 目标服务器地址</div>
        <div class="option-item"><code>changeOrigin</code> 修改请求头中的 origin</div>
        <div class="option-item"><code>pathRewrite</code> 路径重写</div>
        <div class="option-item"><code>secure</code> 是否验证 SSL 证书</div>
        <div class="option-item"><code>headers</code> 添加自定义请求头</div>
        <div class="option-item"><code>onProxyReq</code> 代理请求前的钩子</div>
        <div class="option-item"><code>onProxyRes</code> 代理响应后的钩子</div>
        <div class="option-item"><code>onError</code> 错误处理</div>
      </div>
    </div>

    <!-- CORS -->
    <h2 class="section-title">🌐 CORS 跨域处理</h2>
    <div class="code-block">
      <h4>📝 设置 CORS 响应头</h4>
      <pre><code>// 设置 CORS 响应头
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
res.setHeader('Access-Control-Max-Age', '86400')

// 处理预检请求
if (req.method === 'OPTIONS') {
  res.statusCode = 204
  return res.end()
}</code></pre>
    </div>

    <!-- 完整示例 -->
    <h2 class="section-title">🏗️ 完整服务器架构</h2>
    <div class="code-block">
      <h4>📝 静态文件 + API代理 + 缓存策略</h4>
      <pre><code>const server = http.createServer(async (req, res) => {
  const { method, url } = req

  // 1. API 请求 - 代理到后端
  if (url.startsWith('/api/')) {
    return apiProxy(req, res)
  }

  // 2. 静态资源 - 强缓存 1 年
  if (url.startsWith('/static/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000')
    return serveStatic(req, res)
  }

  // 3. HTML 页面 - 不缓存
  if (url === '/' || url.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type', 'text/html')
    return res.end('<html>...</html>')
  }

  // 4. 404
  res.statusCode = 404
  res.end('Not Found')
})

server.listen(3000)</code></pre>
    </div>

    <!-- Vite 代理配置 -->
    <h2 class="section-title">⚡ Vite 开发环境代理</h2>
    <div class="code-block">
      <h4>📝 vite.config.js</h4>
      <pre><code>export default {
  server: {
    proxy: {
      // /api/* → http://localhost:3001/api/*
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      // /upload/* → http://cdn.example.com/*
      '/upload': {
        target: 'http://cdn.example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload/, '')
      }
    }
  }
}</code></pre>
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看输出：</p>
      <code>node network-examples/http-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>生产环境：</strong> 使用 Nginx 做反向代理和静态资源服务</li>
        <li><strong>开发环境：</strong> Vite/Webpack 的 proxy 配置即可</li>
        <li><strong>静态资源：</strong> 文件名加 hash（app.abc123.js）实现永久缓存</li>
        <li><strong>API 缓存：</strong> GET 请求可考虑短期缓存，POST/DELETE 不缓存</li>
        <li><strong>安全：</strong> 生产环境 CORS 不要用 *，指定具体域名</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import MethodCard from '@/components/MethodCard.vue'

const createServerExamples = [
  { code: "const server = http.createServer((req, res) => {", result: '' },
  { code: "  res.end('Hello')", result: '' },
  { code: '})', result: '' }
]

const listenExamples = [
  { code: "server.listen(3000)", result: '→ 监听 3000 端口' },
  { code: "server.listen(3000, 'localhost')", result: '→ 指定 host' },
  { code: "server.listen(3000, () => {", result: '' },
  { code: "  console.log('Server started')", result: '' },
  { code: '})', result: '' }
]

const writeHeadExamples = [
  { code: "res.writeHead(200, {", result: '' },
  { code: "  'Content-Type': 'application/json'", result: '' },
  { code: '})', result: '' }
]

const setHeaderExamples = [
  { code: "res.setHeader('Content-Type', 'text/html')", result: '' },
  { code: "res.setHeader('Cache-Control', 'no-cache')", result: '' }
]

const writeExamples = [
  { code: "res.write('Hello ')", result: '' },
  { code: "res.write('World')", result: '→ 分块写入' }
]

const endExamples = [
  { code: "res.end()", result: '→ 结束响应' },
  { code: "res.end('Hello World')", result: '→ 写入并结束' }
]
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

/* 功能卡片 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-3px);
}

.feature-card.server { border-color: #3498db; }
.feature-card.proxy { border-color: #9b59b6; }
.feature-card.static { border-color: #2ecc71; }
.feature-card.route { border-color: #f39c12; }

.feature-card .icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.feature-card h3 {
  color: var(--text);
  font-size: 1.1em;
}

.feature-card p {
  color: var(--text-dim);
  font-size: 0.85em;
  margin-top: 5px;
}

.section-title {
  font-size: 1.5em;
  color: var(--text);
  margin: 30px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

/* 表格样式 */
.req-table,
.status-table,
.cache-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.req-table h4,
.status-table h4,
.cache-table h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.req-table table,
.status-table table,
.cache-table table {
  width: 100%;
  border-collapse: collapse;
}

.req-table th,
.req-table td,
.status-table th,
.status-table td,
.cache-table th,
.cache-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.req-table th,
.status-table th,
.cache-table th {
  color: var(--primary);
}

.req-table td:first-child,
.status-table td:first-child {
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

/* 缓存类型 */
.cache-box {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.cache-box h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.cache-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.cache-type {
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.cache-type.strong {
  background: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.cache-type.negotiate {
  background: rgba(52, 152, 219, 0.1);
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.cache-type h5 {
  color: var(--text);
  margin-bottom: 8px;
}

.cache-type p {
  color: var(--text-dim);
  font-size: 0.85em;
  margin-bottom: 10px;
}

.cache-type code {
  font-size: 0.85em;
  color: var(--accent);
}

/* 代理介绍 */
.proxy-intro {
  background: rgba(155, 89, 182, 0.1);
  border: 1px solid rgba(155, 89, 182, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.proxy-intro h4 {
  color: #9b59b6;
  margin-bottom: 10px;
}

.proxy-intro p {
  color: var(--text-dim);
}

/* 代理选项 */
.proxy-options {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.proxy-options h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.options-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.option-item {
  font-size: 0.9em;
}

.option-item code {
  color: var(--accent);
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
</style>
