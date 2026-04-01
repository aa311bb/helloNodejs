<template>
  <div class="content-wrapper">
    <h1>🏗️ MVC + IoC + 装饰器</h1>
    <p class="desc">项目架构设计：MVC分层、依赖注入、装饰器路由、Prisma ORM</p>

    <!-- 服务器状态 -->
    <div :class="['server-status', serverOnline ? 'online' : 'offline']">
      <span class="dot"></span>
      <span v-if="serverOnline">架构服务器已连接 (localhost:3003)</span>
      <span v-else>
        架构服务器未启动 — 请先运行:
        <code>npx tsx --tsconfig architecture-examples/tsconfig.json architecture-examples/src/main.ts</code>
      </span>
    </div>

    <!-- ============================================ -->
    <!-- 第1部分：用生活例子理解 MVC -->
    <!-- ============================================ -->
    <div class="section">
      <h2>🍽️ 用"餐厅"理解 MVC</h2>
      <p class="explain-text">
        你去餐厅吃饭，整个流程其实就是 MVC：
      </p>

      <!-- 餐厅比喻图 -->
      <div class="diagram restaurant-diagram">
        <div class="flow-row">
          <div class="flow-node customer">
            <div class="node-icon">🧑</div>
            <div class="node-title">顾客</div>
            <div class="node-sub">（浏览器/Vue）</div>
            <div class="node-desc">发起请求：我要一份鱼香肉丝</div>
          </div>
          <div class="flow-arrow">
            <span class="arrow-text">点单</span>
            <span class="arrow-symbol">→</span>
          </div>
          <div class="flow-node waiter">
            <div class="node-icon">🧑‍🍳</div>
            <div class="node-title">服务员</div>
            <div class="node-sub">（Controller 控制器）</div>
            <div class="node-desc">记录订单，转告厨师<br/>不自己做饭！</div>
          </div>
          <div class="flow-arrow">
            <span class="arrow-text">通知</span>
            <span class="arrow-symbol">→</span>
          </div>
          <div class="flow-node chef">
            <div class="node-icon">👨‍🍳</div>
            <div class="node-title">厨师</div>
            <div class="node-sub">（Service 业务逻辑）</div>
            <div class="node-desc">决定怎么做菜<br/>放多少盐、炒多久</div>
          </div>
          <div class="flow-arrow">
            <span class="arrow-text">取材</span>
            <span class="arrow-symbol">→</span>
          </div>
          <div class="flow-node fridge">
            <div class="node-icon">🧊</div>
            <div class="node-title">冰箱</div>
            <div class="node-sub">（Prisma/数据库）</div>
            <div class="node-desc">存放食材（数据）<br/>只管存取，不管做法</div>
          </div>
        </div>
      </div>

      <div class="explain-box">
        <p><strong>顾客（浏览器）</strong>说："我要看用户列表"</p>
        <p><strong>服务员（Controller）</strong>记录下来："好的，用户列表，我去让厨师准备"</p>
        <p><strong>厨师（Service）</strong>决定业务规则："用户列表要分页，每页10条，按ID倒序"</p>
        <p><strong>冰箱（数据库）</strong>只是存储数据的，厨师来拿就走</p>
        <p class="explain-highlight">核心思想：<strong>每个人只做自己的事</strong>，不越界</p>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第2部分：请求流转图 -->
    <!-- ============================================ -->
    <div class="section">
      <h2>📦 一个请求的完整旅程</h2>
      <p class="explain-text">
        当你在浏览器输入 <code>GET /api/users</code> 时，发生了什么？
      </p>

      <div class="journey-flow">
        <div class="journey-step" v-for="(step, i) in requestFlow" :key="i">
          <div :class="['step-badge', step.color]">{{ i + 1 }}</div>
          <div class="step-content">
            <div class="step-file">{{ step.file }}</div>
            <div class="step-role">{{ step.role }}</div>
            <div class="step-code" v-if="step.code"><pre>{{ step.code }}</pre></div>
            <div class="step-desc">{{ step.desc }}</div>
          </div>
          <div v-if="i < requestFlow.length - 1" class="step-connector">↓</div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第3部分：对比传统写法 vs MVC -->
    <!-- ============================================ -->
    <div class="section">
      <h2>⚖️ 传统写法 vs MVC 写法</h2>
      <p class="explain-text">
        看看同样的功能，两种写法有什么区别
      </p>
      <div class="compare-box">
        <div class="compare-side bad">
          <div class="compare-title">❌ 传统：全部塞一起（你之前学的 Express）</div>
          <pre>// 一个文件搞定所有事情
app.get('/api/users', async (req, res) => {
  // 1. 解析参数（Controller 的事）
  const page = parseInt(req.query.page) || 1

  // 2. 查数据库（Prisma 的事）
  const users = await prisma.user.findMany({
    skip: (page - 1) * 10,
    take: 10
  })

  // 3. 返回结果（Controller 的事）
  res.json(users)
})

// 问题：
// - 路由、参数解析、数据库查询、业务逻辑全混在一起
// - 如果 10 个接口都要分页，就要写 10 遍分页逻辑
// - 改数据库就要改这个文件，改业务逻辑也要改这个文件
// - 代码超过 200 行就开始混乱</pre>
        </div>
        <div class="compare-side good">
          <div class="compare-title">✅ MVC：各司其职</div>
          <pre>// ─── UserController.ts ───
// 只负责：接收请求 + 返回响应
@httpGet('/')
async findAll(@queryParam('page') page) {
  const result = await this.userService.findAll(page)
  return this.json(result)  // 交给 Service 处理
}

// ─── UserService.ts ───
// 只负责：业务逻辑（分页规则等）
async findAll(page = 1, limit = 10) {
  return await this.prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit
  })
}

// ─── prisma.ts ───
// 只负责：连接数据库
export async function createPrismaClient() {
  return new PrismaClient({ adapter })
}

// 好处：
// - 每个文件职责单一，清晰明了
// - 分页逻辑写在 Service，所有 Controller 共享
// - 改数据库不影响 Controller 和 Service
// - 每个文件不超过 100 行</pre>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第4部分：IoC 依赖注入图解 -->
    <!-- ============================================ -->
    <div class="section">
      <h2>💉 IoC 依赖注入：到底"注入"了什么？</h2>
      <p class="explain-text">
        IoC = Inversion of Control（控制反转）。<strong>反转了什么？</strong>反转了"谁来创建对象"的控制权。
      </p>

      <div class="compare-box">
        <div class="compare-side bad">
          <div class="compare-title">❌ 传统：每个类自己 new 依赖</div>
          <pre>// Controller 自己创建 Service
class UserController {
  constructor() {
    // 自己 new → 自己控制 → "正"控
    this.service = new UserService()
  }
}

// Service 自己创建 PrismaClient
class UserService {
  constructor() {
    this.prisma = new PrismaClient({
      host: 'localhost',
      password: '441426'  // 密码写死在这里
    })
  }
}

// 问题链：
// 改密码 → 要改 UserService
// 改数据库 → 要改 UserService
// 想测试 → 没法用假的数据库（Mock）</pre>
        </div>
        <div class="compare-side good">
          <div class="compare-title">✅ IoC：容器统一管理，自动注入</div>
          <pre>// container.ts — 注册中心
container.bind(TYPES.PrismaClient)
  .toConstantValue(prisma)     // 只在一个地方配置
container.bind(TYPES.UserService)
  .to(UserService)

// UserService — 只声明"我需要什么"
@injectable()
class UserService {
  constructor(
    @inject(TYPES.PrismaClient) prisma  // ← 容器自动注入！
  ) {}
}

// UserController — 也只声明"我需要什么"
@controller('/api/users')
class UserController {
  constructor(
    @inject(TYPES.UserService) service  // ← 容器自动注入！
  ) {}
}

// 依赖链自动创建：
// Controller ← Service ← PrismaClient
// 不需要手动 new 任何东西！</pre>
        </div>
      </div>

      <!-- IoC 容器图 -->
      <div class="diagram ioc-diagram">
        <div class="ioc-container-box">
          <div class="ioc-title">🧊 IoC 容器（container.ts）</div>
          <div class="ioc-bindings">
            <div class="ioc-binding">
              <span class="ioc-key">TYPES.PrismaClient</span>
              <span class="ioc-arrow">→</span>
              <span class="ioc-value">PrismaClient 实例（单例）</span>
            </div>
            <div class="ioc-binding">
              <span class="ioc-key">TYPES.UserService</span>
              <span class="ioc-arrow">→</span>
              <span class="ioc-value">UserService 类</span>
            </div>
            <div class="ioc-binding">
              <span class="ioc-key">TYPES.ArticleService</span>
              <span class="ioc-arrow">→</span>
              <span class="ioc-value">ArticleService 类</span>
            </div>
          </div>
        </div>
        <div class="ioc-inject-flow">
          <div class="inject-row">
            <div class="inject-node ctrl">UserController</div>
            <div class="inject-label">@inject(TYPES.UserService)</div>
            <div class="inject-arrow">→</div>
            <div class="inject-node svc">UserService</div>
            <div class="inject-label">@inject(TYPES.PrismaClient)</div>
            <div class="inject-arrow">→</div>
            <div class="inject-node db">PrismaClient</div>
          </div>
          <div class="inject-note">
            Controller 不关心 Service 怎么创建的<br/>
            Service 不关心 PrismaClient 怎么创建的<br/>
            <strong>全部由容器自动处理！</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第5部分：装饰器是什么 -->
    <!-- ============================================ -->
    <div class="section">
      <h2>🏷️ 装饰器：给代码贴标签</h2>
      <p class="explain-text">
        装饰器就是一个"标签"，贴在类或方法上，自动赋予它某种能力。<br/>
        就像给文件贴"重要"标签，别人一看就知道这个文件要优先处理。
      </p>

      <div class="decorator-demo">
        <div class="decorator-item">
          <div class="decorator-tag">@controller('/api/users')</div>
          <div class="decorator-mean">贴在类上 → 这个类是控制器，处理 /api/users 路径的请求</div>
        </div>
        <div class="decorator-item">
          <div class="decorator-tag">@httpGet('/')</div>
          <div class="decorator-mean">贴在方法上 → 这个方法处理 GET /api/users/ 请求</div>
        </div>
        <div class="decorator-item">
          <div class="decorator-tag">@httpPost('/')</div>
          <div class="decorator-mean">贴在方法上 → 这个方法处理 POST /api/users/ 请求</div>
        </div>
        <div class="decorator-item">
          <div class="decorator-tag">@injectable()</div>
          <div class="decorator-mean">贴在类上 → 这个类可以被 IoC 容器管理</div>
        </div>
        <div class="decorator-item">
          <div class="decorator-tag">@inject(TYPES.UserService)</div>
          <div class="decorator-mean">贴在构造函数参数上 → 请容器自动注入 UserService 实例</div>
        </div>
        <div class="decorator-item">
          <div class="decorator-tag">@queryParam('page')</div>
          <div class="decorator-mean">贴在方法参数上 → 自动从 URL 的 ?page=xxx 取值</div>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第6部分：项目结构 -->
    <!-- ============================================ -->
    <div class="section">
      <h2>📂 项目结构</h2>
      <div class="structure-box">
        <pre>architecture-examples/
├── prisma/
│   └── schema.prisma      ← 数据模型定义（替代建表SQL）
├── src/
│   ├── main.ts             ← 入口：启动服务器（餐厅开门）
│   ├── container.ts        ← IoC容器：绑定依赖关系（人事部安排岗位）
│   ├── types.ts            ← 类型标识：Symbol常量（员工工牌号）
│   ├── db/
│   │   └── prisma.ts       ← 数据库客户端（冰箱的钥匙）
│   ├── controllers/        ← 控制器层（服务员）
│   │   ├── UserController.ts
│   │   ├── ArticleController.ts
│   │   └── TagController.ts
│   └── services/           ← 服务层（厨师）
│       ├── UserService.ts
│       ├── ArticleService.ts
│       └── TagService.ts</pre>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- 第7部分：API 测试面板 -->
    <!-- ============================================ -->
    <template v-if="serverOnline">
      <div class="section">
        <h2>🧪 API 测试面板</h2>
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab-btn', { active: activeTab === tab.key }]"
            @click="switchTab(tab.key)"
          >{{ tab.label }}</button>
        </div>

        <!-- 用户管理 -->
        <div v-if="activeTab === 'users'" class="tab-content">
          <div class="action-bar">
            <h3>用户列表</h3>
            <button class="btn btn-primary" @click="showCreateUser = !showCreateUser">+ 新增用户</button>
          </div>
          <div v-if="showCreateUser" class="form-card">
            <input v-model="newUser.name" placeholder="姓名 *" />
            <input v-model="newUser.email" placeholder="邮箱 *" />
            <input v-model.number="newUser.age" placeholder="年龄" type="number" />
            <select v-model="newUser.gender">
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
            <div class="form-actions">
              <button class="btn btn-primary" @click="createUser">确认创建</button>
              <button class="btn" @click="showCreateUser = false">取消</button>
            </div>
          </div>
          <div v-if="users.length" class="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>姓名</th><th>邮箱</th><th>年龄</th><th>性别</th><th>创建时间</th><th>操作</th></tr></thead>
              <tbody>
                <tr v-for="u in users" :key="u.id">
                  <td>{{ u.id }}</td>
                  <td>{{ u.name }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.age || '-' }}</td>
                  <td>{{ genderMap[u.gender] || u.gender }}</td>
                  <td>{{ formatTime(u.createdAt) }}</td>
                  <td><button class="btn-sm btn-del" @click="deleteUser(u.id)">删除</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty">暂无用户数据</div>
        </div>

        <!-- 文章管理 -->
        <div v-if="activeTab === 'articles'" class="tab-content">
          <div class="action-bar">
            <h3>文章列表</h3>
            <button class="btn btn-primary" @click="showCreateArticle = !showCreateArticle">+ 新增文章</button>
          </div>
          <div v-if="showCreateArticle" class="form-card">
            <input v-model="newArticle.title" placeholder="标题 *" />
            <textarea v-model="newArticle.content" placeholder="内容" rows="2"></textarea>
            <select v-model.number="newArticle.author_id">
              <option value="" disabled>选择作者 *</option>
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
            <input v-model.number="newArticle.price" placeholder="价格" type="number" step="0.01" />
            <div class="form-actions">
              <button class="btn btn-primary" @click="createArticle">确认创建</button>
              <button class="btn" @click="showCreateArticle = false">取消</button>
            </div>
          </div>
          <div v-if="articles.length" class="card-list">
            <div v-for="a in articles" :key="a.id" class="article-card" @click="fetchArticleDetail(a.id)">
              <div class="article-title">{{ a.title }}</div>
              <div class="article-meta">
                <span>作者: {{ a.author?.name || '-' }}</span>
                <span>浏览: {{ a.views }}</span>
                <span>价格: ¥{{ a.price }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty">暂无文章数据</div>
        </div>

        <!-- 文章详情 -->
        <div v-if="activeTab === 'detail'" class="tab-content">
          <button class="btn" @click="activeTab = 'articles'" style="margin-bottom: 15px">&larr; 返回列表</button>
          <div v-if="articleDetail" class="detail-card">
            <h3>{{ articleDetail.title }}</h3>
            <div class="detail-meta">
              <span>作者: {{ articleDetail.author?.name }}</span>
              <span>邮箱: {{ articleDetail.author?.email }}</span>
              <span>浏览: {{ articleDetail.views }}</span>
              <span>价格: ¥{{ articleDetail.price }}</span>
            </div>
            <p class="detail-content">{{ articleDetail.content }}</p>
            <div v-if="articleDetail.tags && articleDetail.tags.length" class="tag-list">
              <span v-for="t in articleDetail.tags" :key="t.tagId" class="tag">{{ t.tag?.name }}</span>
            </div>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="activeTab === 'tags'" class="tab-content">
          <h3>标签列表（Prisma _count 关联计数）</h3>
          <div class="tag-grid">
            <div v-for="t in tags" :key="t.id" class="tag-item">
              <span class="tag-name">{{ t.name }}</span>
              <span class="tag-count">{{ t._count?.articles || 0 }} 篇文章</span>
            </div>
          </div>
          <div v-if="!tags.length" class="empty">暂无标签</div>
        </div>

        <!-- 日志 -->
        <div v-if="activeTab === 'logs'" class="tab-content">
          <h3>请求日志</h3>
          <div class="log-box">
            <div v-for="(log, i) in logs" :key="i" :class="['log-item', log.type]">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-method">{{ log.method }}</span>
              <span class="log-url">{{ log.url }}</span>
              <span :class="['log-status', log.status >= 400 ? 'err' : 'ok']">{{ log.status }}</span>
              <span class="log-duration">{{ log.duration }}ms</span>
            </div>
            <div v-if="!logs.length" class="empty">暂无请求日志</div>
          </div>
        </div>
      </div>
    </template>

    <!-- 离线提示 -->
    <template v-else>
      <div class="offline-tips">
        <h3>📦 启动步骤</h3>
        <ol>
          <li>确保本地 MySQL 已启动</li>
          <li>创建数据库: <code>CREATE DATABASE `architecture-test` CHARACTER SET utf8mb4;</code></li>
          <li>安装依赖: <code>npm install inversify inversify-express-utils reflect-metadata @prisma/client prisma typescript tsx</code></li>
          <li>初始化数据库: <code>cd architecture-examples && npx prisma migrate dev --name init</code></li>
          <li>启动服务: <code>npx tsx --tsconfig architecture-examples/tsconfig.json architecture-examples/src/main.ts</code></li>
        </ol>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const BASE = 'http://localhost:3003'

const serverOnline = ref(false)
let checkTimer = null

const tabs = [
  { key: 'users', label: '👤 用户' },
  { key: 'articles', label: '📝 文章' },
  { key: 'tags', label: '🏷️ 标签' },
  { key: 'logs', label: '📋 日志' },
]
const activeTab = ref('users')

const users = ref([])
const articles = ref([])
const tags = ref([])
const articleDetail = ref(null)

const showCreateUser = ref(false)
const showCreateArticle = ref(false)
const newUser = ref({ name: '', email: '', age: '', gender: 'male' })
const newArticle = ref({ title: '', content: '', author_id: '', price: 0 })

const logs = ref([])
const genderMap = { male: '男', female: '女', other: '其他' }

// ============================================
// 请求流转步骤（用于图解）
// ============================================
const requestFlow = computed(() => [
  {
    file: '浏览器 / Vue 页面',
    role: '🧑 顾客',
    code: 'fetch("http://localhost:3003/api/users")',
    desc: '顾客点单："我要看用户列表"',
    color: 'blue',
  },
  {
    file: 'Express 路由',
    role: '🏪 前台',
    code: '@controller("/api/users") + @httpGet("/")',
    desc: '前台收到请求，根据菜单（路由表）找到对应的服务员',
    color: 'purple',
  },
  {
    file: 'UserController.ts',
    role: '🧑‍🍳 服务员',
    code: '@inject(TYPES.UserService) userService\n\nconst result = await this.userService.findAll(page)',
    desc: '服务员记录订单，把请求转交给厨师。自己不做饭！',
    color: 'green',
  },
  {
    file: 'UserService.ts',
    role: '👨‍🍳 厨师',
    code: 'this.prisma.user.findMany({\n  orderBy: { id: "desc" },\n  take: 10, skip: 0\n})',
    desc: '厨师决定做法：按ID倒序、每页10条。然后去冰箱（数据库）取食材',
    color: 'orange',
  },
  {
    file: 'Prisma → MySQL',
    role: '🧊 冰箱',
    code: 'SELECT * FROM users ORDER BY id DESC LIMIT 10',
    desc: 'Prisma 把厨师的指令翻译成 SQL，去数据库取出数据',
    color: 'red',
  },
  {
    file: 'UserController.ts → 浏览器',
    role: '🧑‍🍳 服务员 → 🧑 顾客',
    code: 'return this.json({ data: [...], pagination: {...} })',
    desc: '数据原路返回：冰箱→厨师→服务员→顾客。顾客拿到菜单！',
    color: 'blue',
  },
])

function switchTab(key) {
  if (key === 'tags') fetchTags()
  activeTab.value = key
}

async function checkServer() {
  try {
    const res = await fetch(BASE + '/api/users?limit=1', { signal: AbortSignal.timeout(2000) })
    serverOnline.value = res.ok
    if (res.ok && !users.value.length) {
      await fetchUsers()
      await fetchArticles()
    }
  } catch {
    serverOnline.value = false
  }
}

function addLog(method, url, status, duration) {
  logs.value.unshift({ time: new Date().toLocaleTimeString(), method, url, status, duration, type: status >= 400 ? 'error' : 'info' })
  if (logs.value.length > 50) logs.value.pop()
}

async function api(method, path, body = null) {
  const start = Date.now()
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + path, opts)
  const data = await res.json()
  addLog(method, path, res.status, Date.now() - start)
  return { status: res.status, data }
}

async function fetchUsers() {
  const { data } = await api('GET', '/api/users')
  if (data.data) users.value = data.data
}

async function createUser() {
  if (!newUser.value.name || !newUser.value.email) return alert('请填写必填字段')
  const { status, data } = await api('POST', '/api/users', newUser.value)
  if (status === 201) {
    showCreateUser.value = false
    newUser.value = { name: '', email: '', age: '', gender: 'male' }
    await fetchUsers()
  } else {
    alert(data.error || '创建失败')
  }
}

async function deleteUser(id) {
  if (!confirm('确认删除？')) return
  await api('DELETE', `/api/users/${id}`)
  await fetchUsers()
}

async function fetchArticles() {
  const { data } = await api('GET', '/api/articles')
  if (data.data) articles.value = data.data
}

async function createArticle() {
  if (!newArticle.value.title || !newArticle.value.author_id) return alert('请填写必填字段')
  const { status } = await api('POST', '/api/articles', newArticle.value)
  if (status === 201) {
    showCreateArticle.value = false
    newArticle.value = { title: '', content: '', author_id: '', price: 0 }
    await fetchArticles()
  }
}

async function fetchArticleDetail(id) {
  const { data } = await api('GET', `/api/articles/${id}`)
  if (data.id) {
    articleDetail.value = data
    activeTab.value = 'detail'
    await fetchArticles()
  }
}

async function fetchTags() {
  const { data } = await api('GET', '/api/tags')
  if (Array.isArray(data)) tags.value = data
}

function formatTime(t) {
  if (!t) return '-'
  return new Date(t).toLocaleString('zh-CN')
}

onMounted(() => {
  checkServer()
  checkTimer = setInterval(checkServer, 5000)
})

onUnmounted(() => {
  clearInterval(checkTimer)
})
</script>

<style scoped>
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 30px 40px; }
h1 { font-size: 2em; color: var(--primary); margin-bottom: 8px; }
.desc { color: var(--text-dim); margin-bottom: 20px; }
h2 { color: var(--text); margin-bottom: 15px; }

.server-status { display: flex; align-items: center; gap: 10px; padding: 12px 20px; border-radius: 8px; margin-bottom: 25px; font-size: .95em; }
.server-status.online { background: rgba(46,204,113,.15); color: #2ecc71; border: 1px solid rgba(46,204,113,.3); }
.server-status.offline { background: rgba(231,76,60,.15); color: #e74c3c; border: 1px solid rgba(231,76,60,.3); }
.dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.online .dot { background: #2ecc71; box-shadow: 0 0 8px #2ecc71; }
.offline .dot { background: #e74c3c; box-shadow: 0 0 8px #e74c3c; }
.server-status code { background: rgba(0,0,0,.3); padding: 2px 8px; border-radius: 4px; font-size: .85em; }

.offline-tips { background: rgba(255,255,255,.05); border-radius: 12px; padding: 25px; }
.offline-tips h3 { color: var(--primary); margin-bottom: 15px; }
.offline-tips ol { padding-left: 20px; line-height: 2; }
.offline-tips code { background: rgba(0,0,0,.3); padding: 2px 8px; border-radius: 4px; color: #ff6b6b; }

.section { margin-top: 30px; }

/* ========== 说明文字 ========== */
.explain-text { color: var(--text-dim); line-height: 1.8; margin-bottom: 15px; font-size: .95em; }
.explain-text code { background: rgba(0,0,0,.3); padding: 2px 6px; border-radius: 4px; color: #f39c12; }

/* ========== 餐厅比喻图 ========== */
.restaurant-diagram {
  background: rgba(0,0,0,.2);
  border-radius: 12px;
  padding: 25px 15px;
  overflow-x: auto;
}
.flow-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 700px;
}
.flow-node {
  flex: 1;
  background: rgba(255,255,255,.06);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  border: 2px solid transparent;
  min-width: 140px;
}
.flow-node .node-icon { font-size: 2em; margin-bottom: 5px; }
.flow-node .node-title { font-weight: 700; font-size: 1.05em; margin-bottom: 2px; }
.flow-node .node-sub { font-size: .75em; color: var(--text-dim); margin-bottom: 8px; }
.flow-node .node-desc { font-size: .8em; color: var(--text-dim); line-height: 1.5; }
.flow-node.customer { border-color: #3498db; }
.flow-node.waiter { border-color: #2ecc71; }
.flow-node.chef { border-color: #f39c12; }
.flow-node.fridge { border-color: #9b59b6; }
.flow-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 50px;
}
.arrow-text { font-size: .7em; color: var(--text-dim); }
.arrow-symbol { font-size: 1.5em; color: var(--primary); }

.explain-box {
  background: rgba(0,0,0,.15);
  border-radius: 8px;
  padding: 15px 20px;
  margin-top: 15px;
  line-height: 1.9;
  font-size: .9em;
}
.explain-box p { margin: 3px 0; }
.explain-box strong { color: var(--primary); }
.explain-highlight {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(255,255,255,.1);
  font-size: 1em;
  color: #f39c12;
}

/* ========== 请求流转图 ========== */
.journey-flow {
  background: rgba(0,0,0,.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.journey-step {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}
.step-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: .85em;
  flex-shrink: 0;
  color: #fff;
}
.step-badge.blue { background: #3498db; }
.step-badge.purple { background: #9b59b6; }
.step-badge.green { background: #2ecc71; }
.step-badge.orange { background: #f39c12; }
.step-badge.red { background: #e74c3c; }
.step-content { flex: 1; }
.step-file { font-weight: 700; color: var(--primary); font-size: .95em; }
.step-role { font-size: .85em; color: var(--text-dim); margin-bottom: 5px; }
.step-code pre {
  background: rgba(0,0,0,.3);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: .8em;
  line-height: 1.5;
  margin: 0 0 5px;
  white-space: pre-wrap;
  color: #2ecc71;
}
.step-desc { font-size: .85em; color: var(--text-dim); margin-bottom: 8px; line-height: 1.5; }
.step-connector {
  text-align: center;
  color: var(--primary);
  font-size: 1.2em;
  padding: 2px 0 2px 12px;
  opacity: .5;
}

/* ========== 对比框 ========== */
.compare-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.compare-side {
  background: rgba(0,0,0,.15);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid transparent;
}
.compare-side.bad { border-color: rgba(231,76,60,.2); }
.compare-side.good { border-color: rgba(46,204,113,.2); }
.compare-title { font-weight: 700; margin-bottom: 10px; font-size: .9em; }
.compare-side.bad .compare-title { color: #e74c3c; }
.compare-side.good .compare-title { color: #2ecc71; }
.compare-side pre {
  background: rgba(0,0,0,.3);
  padding: 10px;
  border-radius: 6px;
  font-size: .78em;
  line-height: 1.55;
  margin: 0;
  white-space: pre-wrap;
  color: var(--text-dim);
}

/* ========== IoC 容器图 ========== */
.ioc-diagram {
  background: rgba(0,0,0,.2);
  border-radius: 12px;
  padding: 20px;
  margin-top: 15px;
}
.ioc-container-box {
  background: rgba(155,89,182,.1);
  border: 1px dashed rgba(155,89,182,.4);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}
.ioc-title { font-weight: 700; color: #9b59b6; margin-bottom: 10px; font-size: .95em; }
.ioc-binding {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  font-size: .88em;
}
.ioc-key {
  background: rgba(0,0,0,.3);
  padding: 3px 10px;
  border-radius: 4px;
  color: #3498db;
  font-family: monospace;
  min-width: 180px;
}
.ioc-arrow { color: var(--text-dim); }
.ioc-value { color: var(--text-dim); }
.ioc-inject-flow { text-align: center; }
.inject-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}
.inject-node {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: .88em;
}
.inject-node.ctrl { background: rgba(46,204,113,.15); color: #2ecc71; border: 1px solid rgba(46,204,113,.3); }
.inject-node.svc { background: rgba(243,156,18,.15); color: #f39c12; border: 1px solid rgba(243,156,18,.3); }
.inject-node.db { background: rgba(155,89,182,.15); color: #9b59b6; border: 1px solid rgba(155,89,182,.3); }
.inject-label { font-size: .75em; color: var(--text-dim); }
.inject-arrow { font-size: 1.3em; color: var(--primary); }
.inject-note { font-size: .85em; color: var(--text-dim); line-height: 1.7; }
.inject-note strong { color: #2ecc71; }

/* ========== 装饰器说明 ========== */
.decorator-demo { display: grid; gap: 10px; }
.decorator-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(0,0,0,.15);
  border-radius: 8px;
  padding: 12px 15px;
}
.decorator-tag {
  background: rgba(243,156,18,.15);
  color: #f39c12;
  padding: 4px 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: .88em;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid rgba(243,156,18,.2);
}
.decorator-mean { font-size: .88em; color: var(--text-dim); }

/* ========== 项目结构 ========== */
.structure-box { background: rgba(0,0,0,.3); border-radius: 8px; padding: 15px 20px; overflow-x: auto; }
.structure-box pre { margin: 0; font-size: .85em; line-height: 1.6; color: var(--text-dim); }

/* ========== Tabs ========== */
.tabs { display: flex; gap: 5px; margin-bottom: 20px; flex-wrap: wrap; }
.tab-btn { padding: 8px 18px; border: 1px solid rgba(255,255,255,.15); border-radius: 6px; background: transparent; color: var(--text-dim); cursor: pointer; font-size: .9em; transition: all .2s; }
.tab-btn:hover { border-color: var(--primary); color: var(--primary); }
.tab-btn.active { background: var(--primary); color: #000; border-color: var(--primary); font-weight: 600; }

.action-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.action-bar h3 { color: var(--text); margin: 0; }

.btn { padding: 6px 16px; border-radius: 6px; border: 1px solid rgba(255,255,255,.15); background: transparent; color: var(--text-dim); cursor: pointer; font-size: .85em; transition: all .2s; }
.btn:hover { border-color: var(--primary); color: var(--primary); }
.btn-primary { background: var(--primary); color: #000; border-color: var(--primary); font-weight: 600; }
.btn-primary:hover { opacity: .85; color: #000; }

.form-card { background: rgba(0,217,255,.05); border: 1px solid rgba(0,217,255,.15); border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; flex-wrap: wrap; gap: 10px; }
.form-card input, .form-card select, .form-card textarea { flex: 1; min-width: 150px; padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,.15); background: rgba(0,0,0,.3); color: var(--text); font-size: .9em; }
.form-card textarea { flex-basis: 100%; }
.form-actions { display: flex; gap: 10px; align-items: center; }

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: .9em; }
th { background: rgba(0,217,255,.1); padding: 10px 12px; text-align: left; color: var(--primary); white-space: nowrap; }
td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,.05); white-space: nowrap; }
.btn-sm { padding: 3px 10px; border-radius: 4px; border: none; cursor: pointer; font-size: .8em; }
.btn-del { background: rgba(231,76,60,.2); color: #e74c3c; }
.btn-del:hover { background: rgba(231,76,60,.4); }

.card-list { display: grid; gap: 10px; }
.article-card { background: rgba(255,255,255,.05); border-radius: 8px; padding: 15px; cursor: pointer; transition: all .2s; }
.article-card:hover { background: rgba(0,217,255,.1); border-left: 3px solid var(--primary); }
.article-title { font-weight: 600; margin-bottom: 8px; }
.article-meta { display: flex; gap: 20px; font-size: .85em; color: var(--text-dim); }

.detail-card { background: rgba(255,255,255,.05); border-radius: 8px; padding: 20px; }
.detail-card h3 { color: var(--primary); margin: 0 0 15px; }
.detail-meta { display: flex; gap: 20px; font-size: .9em; color: var(--text-dim); margin-bottom: 15px; }
.detail-content { line-height: 1.8; margin: 15px 0; }

.tag-list { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { padding: 3px 12px; border-radius: 20px; background: rgba(0,217,255,.15); color: var(--primary); font-size: .85em; }

.tag-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-top: 15px; }
.tag-item { background: rgba(255,255,255,.05); border-radius: 8px; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; }
.tag-name { font-weight: 600; }
.tag-count { font-size: .85em; color: var(--text-dim); }

.log-box { background: rgba(0,0,0,.3); border-radius: 8px; padding: 10px; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: .85em; }
.log-item { display: flex; gap: 12px; padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,.03); }
.log-item.error { background: rgba(231,76,60,.08); }
.log-time { color: var(--text-dim); min-width: 80px; }
.log-method { color: #f39c12; min-width: 40px; font-weight: 600; }
.log-url { flex: 1; word-break: break-all; }
.log-status { min-width: 30px; text-align: center; }
.log-status.ok { color: #2ecc71; }
.log-status.err { color: #e74c3c; }
.log-duration { color: var(--text-dim); min-width: 60px; text-align: right; }

.empty { text-align: center; padding: 30px; color: var(--text-dim); }

@media (max-width: 900px) {
  .compare-box { grid-template-columns: 1fr; }
  .flow-row { flex-direction: column; }
  .flow-arrow .arrow-symbol { transform: rotate(90deg); }
}
</style>
