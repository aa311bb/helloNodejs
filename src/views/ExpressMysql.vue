<template>
  <div class="content-wrapper">
    <h1>🗄️ Express + MySQL</h1>
    <p class="desc">MySQL 数据库操作，Knex 查询构建器，CRUD，连表查询，事务处理</p>

    <!-- 服务器状态 -->
    <div :class="['server-status', serverOnline ? 'online' : 'offline']">
      <span class="dot"></span>
      <span v-if="serverOnline">MySQL 服务已连接 (localhost:3002)</span>
      <span v-else>
        MySQL 服务未启动 — 请先运行:
        <code>node network-examples/express-mysql.js</code>
      </span>
    </div>

    <template v-if="serverOnline">
      <!-- API 测试面板 -->
      <div class="section">
        <h2>🧪 API 测试面板</h2>

        <!-- Tab 切换 -->
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab-btn', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >{{ tab.label }}</button>
        </div>

        <!-- 用户管理 -->
        <div v-if="activeTab === 'users'" class="tab-content">
          <div class="action-bar">
            <h3>用户列表</h3>
            <button class="btn btn-primary" @click="showCreateUser = true">+ 新增用户</button>
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
              <thead>
                <tr>
                  <th>ID</th><th>姓名</th><th>邮箱</th><th>年龄</th><th>性别</th><th>状态</th><th>创建时间</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u.id">
                  <td>{{ u.id }}</td>
                  <td>{{ u.name }}</td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.age || '-' }}</td>
                  <td>{{ genderMap[u.gender] }}</td>
                  <td>{{ u.status ? '启用' : '禁用' }}</td>
                  <td>{{ formatTime(u.created_at) }}</td>
                  <td class="actions">
                    <button class="btn-sm btn-del" @click="deleteUser(u.id)">删除</button>
                  </td>
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
            <button class="btn btn-primary" @click="showCreateArticle = true">+ 新增文章</button>
          </div>
          <div v-if="showCreateArticle" class="form-card">
            <input v-model="newArticle.title" placeholder="标题 *" />
            <textarea v-model="newArticle.content" placeholder="内容" rows="3"></textarea>
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
                <span>作者: {{ a.author_name }}</span>
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
              <span>作者: {{ articleDetail.author_name }}</span>
              <span>邮箱: {{ articleDetail.author_email }}</span>
              <span>浏览: {{ articleDetail.views }}</span>
              <span>价格: ¥{{ articleDetail.price }}</span>
            </div>
            <p class="detail-content">{{ articleDetail.content }}</p>
            <div v-if="articleDetail.tags && articleDetail.tags.length" class="tag-list">
              <span v-for="t in articleDetail.tags" :key="t.id" class="tag">{{ t.name }}</span>
            </div>
          </div>
        </div>

        <!-- 连表查询 -->
        <div v-if="activeTab === 'join'" class="tab-content">
          <h3>连表查询结果</h3>
          <div class="sub-tabs">
            <button :class="['btn', { active: joinType === 'user' }]" @click="joinType = 'user'; fetchJoinData()">用户 + 文章</button>
            <button :class="['btn', { active: joinType === 'article' }]" @click="joinType = 'article'; fetchJoinData()">文章 + 标签</button>
          </div>
          <div v-if="joinType === 'user'" class="join-result">
            <div v-for="item in joinUserArticles" :key="item.user_id" class="join-card">
              <h4>{{ item.user_name }} <span class="email">{{ item.email }}</span></h4>
              <ul v-if="item.articles.length">
                <li v-for="a in item.articles" :key="a.article_id">{{ a.title }} ({{ a.views }}次浏览)</li>
              </ul>
              <p v-else class="empty">暂无文章</p>
            </div>
          </div>
          <div v-if="joinType === 'article'" class="join-result">
            <div v-for="a in joinArticleTags" :key="a.article_id" class="join-card">
              <h4>{{ a.title }}</h4>
              <span class="author">作者: {{ a.author_name }}</span>
              <div class="tag-list" style="margin-top: 8px">
                <span v-for="t in a.tags" :key="t.id" class="tag">{{ t.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 事务 -->
        <div v-if="activeTab === 'transaction'" class="tab-content">
          <h3>事务示例</h3>
          <div class="txn-grid">
            <div class="txn-card">
              <h4>模拟转账</h4>
              <p class="txn-desc">事务保证 A 扣款和 B 加款同时成功或同时失败</p>
              <select v-model.number="txn.from">
                <option value="" disabled>转出用户</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} (余额:{{ u.age || 0 }})</option>
              </select>
              <select v-model.number="txn.to">
                <option value="" disabled>接收用户</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} (余额:{{ u.age || 0 }})</option>
              </select>
              <input v-model.number="txn.amount" placeholder="转账金额" type="number" />
              <button class="btn btn-primary" @click="transfer">执行转账</button>
            </div>
            <div class="txn-card">
              <h4>创建文章并打标签</h4>
              <p class="txn-desc">事务保证创建文章和关联标签同时成功或同时失败</p>
              <input v-model="txnArticle.title" placeholder="文章标题 *" />
              <textarea v-model="txnArticle.content" placeholder="文章内容" rows="2"></textarea>
              <select v-model.number="txnArticle.author_id">
                <option value="" disabled>选择作者 *</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
              <div v-if="tags.length" class="tag-check">
                <label v-for="t in tags" :key="t.id">
                  <input type="checkbox" :value="t.id" v-model="txnArticle.tag_ids" />
                  {{ t.name }}
                </label>
              </div>
              <button class="btn btn-primary" @click="createArticleWithTags">事务创建</button>
            </div>
          </div>
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
            <div v-if="!logs.length" class="empty">暂无请求日志，试试其他操作吧</div>
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
          <li>创建数据库: <code>CREATE DATABASE \`node-test\` CHARACTER SET utf8mb4;</code></li>
          <li>启动服务: <code>node network-examples/express-mysql.js</code></li>
          <li>服务启动后会自动创建表和测试数据</li>
        </ol>
        <div class="deps">
          <h4>所需依赖:</h4>
          <code>npm install express mysql2 knex js-yaml log4js</code>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const BASE = 'http://localhost:3002'

// 服务器状态
const serverOnline = ref(false)
let checkTimer = null

// Tab 相关
const tabs = [
  { key: 'users', label: '👤 用户管理' },
  { key: 'articles', label: '📝 文章管理' },
  { key: 'join', label: '🔗 连表查询' },
  { key: 'transaction', label: '🔒 事务' },
  { key: 'logs', label: '📋 日志' },
]
const activeTab = ref('users')

// 数据
const users = ref([])
const articles = ref([])
const tags = ref([])
const articleDetail = ref(null)

// 表单
const showCreateUser = ref(false)
const showCreateArticle = ref(false)
const newUser = ref({ name: '', email: '', age: '', gender: 'male' })
const newArticle = ref({ title: '', content: '', author_id: '', price: 0 })

// 连表
const joinType = ref('user')
const joinUserArticles = ref([])
const joinArticleTags = ref([])

// 事务
const txn = ref({ from: '', to: '', amount: 0 })
const txnArticle = ref({ title: '', content: '', author_id: '', tag_ids: [] })

// 日志
const logs = ref([])

const genderMap = { male: '男', female: '女', other: '其他' }

// 检测服务器状态
async function checkServer() {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(2000) })
    serverOnline.value = res.ok
    if (res.ok && !users.value.length) {
      await fetchUsers()
      await fetchArticles()
      await fetchTags()
    }
  } catch {
    serverOnline.value = false
  }
}

// 添加日志
function addLog(method, url, status, duration) {
  const now = new Date()
  const time = now.toLocaleTimeString()
  logs.value.unshift({ time, method, url, status, duration, type: status >= 400 ? 'error' : 'info' })
  if (logs.value.length > 50) logs.value.pop()
}

// 封装请求
async function api(method, path, body = null) {
  const start = Date.now()
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + path, opts)
  const data = await res.json()
  const duration = Date.now() - start
  addLog(method, path, res.status, duration)
  return { status: res.status, data }
}

// 用户
async function fetchUsers() {
  const { data } = await api('GET', '/api/users?limit=20')
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
  if (!confirm('确认删除该用户？')) return
  const { status } = await api('DELETE', `/api/users/${id}`)
  if (status === 200) await fetchUsers()
}

// 文章
async function fetchArticles() {
  const { data } = await api('GET', '/api/articles?limit=20')
  if (data.data) articles.value = data.data
}

async function createArticle() {
  if (!newArticle.value.title || !newArticle.value.author_id) return alert('请填写必填字段')
  const { status, data } = await api('POST', '/api/articles', newArticle.value)
  if (status === 201) {
    showCreateArticle.value = false
    newArticle.value = { title: '', content: '', author_id: '', price: 0 }
    await fetchArticles()
  } else {
    alert(data.error || '创建失败')
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

// 标签
async function fetchTags() {
  const { data } = await api('GET', '/api/tags')
  if (Array.isArray(data)) tags.value = data
}

// 连表
async function fetchJoinData() {
  if (joinType.value === 'user') {
    const { data } = await api('GET', '/api/join/user-articles')
    if (Array.isArray(data)) joinUserArticles.value = data
  } else {
    const { data } = await api('GET', '/api/join/article-tags')
    if (Array.isArray(data)) joinArticleTags.value = data
  }
}

// 事务
async function transfer() {
  if (!txn.value.from || !txn.value.to || !txn.value.amount) return alert('请填写完整')
  const { status, data } = await api('POST', '/api/transaction/transfer', txn.value)
  if (status === 200) {
    alert(`转账成功: ${data.from} → ${data.to}, 金额: ${data.amount}`)
    await fetchUsers()
  } else {
    alert(data.error || '转账失败')
  }
}

async function createArticleWithTags() {
  if (!txnArticle.value.title || !txnArticle.value.author_id) return alert('请填写必填字段')
  const { status, data } = await api('POST', '/api/transaction/create-article', txnArticle.value)
  if (status === 201) {
    alert(`事务创建成功: 文章ID=${data.id}`)
    txnArticle.value = { title: '', content: '', author_id: '', tag_ids: [] }
    await fetchArticles()
  } else {
    alert(data.error || '创建失败')
  }
}

// 格式化时间
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
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 40px;
}

h1 {
  font-size: 2em;
  color: var(--primary);
  margin-bottom: 8px;
}

.desc {
  color: var(--text-dim);
  margin-bottom: 20px;
}

/* 服务器状态 */
.server-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  font-size: 0.95em;
}

.server-status.online {
  background: rgba(46, 204, 113, 0.15);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.server-status.offline {
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.online .dot {
  background: #2ecc71;
  box-shadow: 0 0 8px #2ecc71;
}

.offline .dot {
  background: #e74c3c;
  box-shadow: 0 0 8px #e74c3c;
}

.server-status code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
}

/* 离线提示 */
.offline-tips {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 25px;
}

.offline-tips h3 {
  color: var(--primary);
  margin-bottom: 15px;
}

.offline-tips ol {
  padding-left: 20px;
  line-height: 2;
}

.offline-tips code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  color: #ff6b6b;
}

.deps {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Tab */
.tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.tab-btn.active {
  background: var(--primary);
  color: #000;
  border-color: var(--primary);
  font-weight: 600;
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.action-bar h3 {
  color: var(--text);
  margin: 0;
}

/* 按钮 */
.btn {
  padding: 6px 16px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.2s;
}

.btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn.active {
  background: rgba(0, 217, 255, 0.15);
  border-color: var(--primary);
  color: var(--primary);
}

.btn-primary {
  background: var(--primary);
  color: #000;
  border-color: var(--primary);
  font-weight: 600;
}

.btn-primary:hover {
  opacity: 0.85;
  color: #000;
}

/* 表单 */
.form-card {
  background: rgba(0, 217, 255, 0.05);
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.form-card input,
.form-card select,
.form-card textarea {
  flex: 1;
  min-width: 150px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.3);
  color: var(--text);
  font-size: 0.9em;
}

.form-card textarea {
  flex-basis: 100%;
}

.form-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 表格 */
.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

th {
  background: rgba(0, 217, 255, 0.1);
  padding: 10px 12px;
  text-align: left;
  color: var(--primary);
  white-space: nowrap;
}

td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
}

.btn-sm {
  padding: 3px 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
}

.btn-del {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.btn-del:hover {
  background: rgba(231, 76, 60, 0.4);
}

/* 文章卡片 */
.card-list {
  display: grid;
  gap: 10px;
}

.article-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.article-card:hover {
  background: rgba(0, 217, 255, 0.1);
  border-left: 3px solid var(--primary);
}

.article-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.article-meta {
  display: flex;
  gap: 20px;
  font-size: 0.85em;
  color: var(--text-dim);
}

/* 详情 */
.detail-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
}

.detail-card h3 {
  color: var(--primary);
  margin: 0 0 15px;
}

.detail-meta {
  display: flex;
  gap: 20px;
  font-size: 0.9em;
  color: var(--text-dim);
  margin-bottom: 15px;
}

.detail-content {
  line-height: 1.8;
  margin: 15px 0;
}

/* 标签 */
.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 3px 12px;
  border-radius: 20px;
  background: rgba(0, 217, 255, 0.15);
  color: var(--primary);
  font-size: 0.85em;
}

.tag-check {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.tag-check label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 0.9em;
}

/* 连表 */
.sub-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.join-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.join-card h4 {
  margin: 0 0 8px;
  color: var(--text);
}

.join-card .email {
  font-weight: normal;
  font-size: 0.85em;
  color: var(--text-dim);
}

.join-card .author {
  font-size: 0.85em;
  color: var(--text-dim);
}

.join-card ul {
  padding-left: 20px;
  margin: 5px 0;
}

.join-card li {
  padding: 3px 0;
  font-size: 0.9em;
}

/* 事务 */
.txn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.txn-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
}

.txn-card h4 {
  color: var(--primary);
  margin: 0 0 8px;
}

.txn-desc {
  font-size: 0.85em;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.txn-card select,
.txn-card input,
.txn-card textarea {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.3);
  color: var(--text);
  font-size: 0.9em;
  box-sizing: border-box;
}

.txn-card textarea {
  resize: vertical;
}

.txn-card .btn-primary {
  width: 100%;
  margin-top: 5px;
}

/* 日志 */
.log-box {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.85em;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.log-item.error {
  background: rgba(231, 76, 60, 0.08);
}

.log-time {
  color: var(--text-dim);
  min-width: 80px;
}

.log-method {
  color: #f39c12;
  min-width: 40px;
  font-weight: 600;
}

.log-url {
  flex: 1;
  word-break: break-all;
}

.log-status {
  min-width: 30px;
  text-align: center;
}

.log-status.ok {
  color: #2ecc71;
}

.log-status.err {
  color: #e74c3c;
}

.log-duration {
  color: var(--text-dim);
  min-width: 60px;
  text-align: right;
}

.empty {
  text-align: center;
  padding: 30px;
  color: var(--text-dim);
}

.section {
  margin-top: 10px;
}

.section h2 {
  color: var(--text);
  margin-bottom: 15px;
}
</style>
