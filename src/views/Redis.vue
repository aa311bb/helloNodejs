<template>
  <div class="content-wrapper">
    <h1>⚡ Express + Redis</h1>
    <p class="desc">Redis 内存数据库：五种数据类型、Pub/Sub 发布订阅、事务、持久化</p>

    <!-- 服务器状态 -->
    <div :class="['server-status', serverOnline ? 'online' : 'offline']">
      <span class="dot"></span>
      <span v-if="serverOnline">Redis 服务器已连接 (localhost:3004)</span>
      <span v-else>
        Redis 服务器未启动 — 请先运行:
        <code>node network-examples/express-redis.js</code>
      </span>
    </div>

    <template v-if="serverOnline">
      <!-- Redis 五种数据类型速查 -->
      <div class="section">
        <h2>📊 Redis 五种数据类型</h2>
        <div class="type-grid">
          <div v-for="t in dataTypes" :key="t.name" class="type-card" @click="activeDataType = t.key">
            <div class="type-icon">{{ t.icon }}</div>
            <div class="type-name">{{ t.name }}</div>
            <div class="type-desc">{{ t.desc }}</div>
            <div class="type-example">{{ t.example }}</div>
          </div>
        </div>
      </div>

      <!-- 主 Tabs -->
      <div class="section">
        <div class="tabs">
          <button v-for="tab in mainTabs" :key="tab.key"
            :class="['tab-btn', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key">{{ tab.label }}</button>
        </div>

        <!-- ==================== 基础操作 ==================== -->
        <div v-if="activeTab === 'basic'" class="tab-content">
          <!-- 数据类型子 tabs -->
          <div class="sub-tabs">
            <button v-for="t in dataTypes" :key="t.key"
              :class="['sub-tab-btn', { active: activeDataType === t.key }]"
              @click="activeDataType = t.key">{{ t.icon }} {{ t.name }}</button>
          </div>

          <!-- String 操作 -->
          <div v-if="activeDataType === 'string'" class="ops-panel">
            <div class="ops-row">
              <input v-model="strForm.key" placeholder="key *" />
              <input v-model="strForm.value" placeholder="value *" />
              <input v-model.number="strForm.expire" placeholder="过期秒数（可选）" type="number" />
              <button class="btn btn-primary" @click="stringSet">SET</button>
            </div>
            <div class="ops-row">
              <input v-model="strForm.key" placeholder="key" />
              <button class="btn" @click="stringGet">GET</button>
              <button class="btn" @click="stringIncr">INCR</button>
              <button class="btn btn-del" @click="stringDel">DEL</button>
            </div>
          </div>

          <!-- Hash 操作 -->
          <div v-if="activeDataType === 'hash'" class="ops-panel">
            <div class="ops-row">
              <input v-model="hashForm.key" placeholder="key *" />
              <input v-model="hashForm.field" placeholder="field *" />
              <input v-model="hashForm.value" placeholder="value *" />
              <button class="btn btn-primary" @click="hashSet">HSET</button>
            </div>
            <div class="ops-row">
              <input v-model="hashForm.key" placeholder="key" />
              <input v-model="hashForm.field" placeholder="field" />
              <button class="btn" @click="hashGet">HGET</button>
              <button class="btn" @click="hashGetAll">HGETALL</button>
              <button class="btn btn-del" @click="hashDel">HDEL</button>
            </div>
          </div>

          <!-- List 操作 -->
          <div v-if="activeDataType === 'list'" class="ops-panel">
            <div class="ops-row">
              <input v-model="listForm.key" placeholder="key *" />
              <input v-model="listForm.value" placeholder="value *" />
              <select v-model="listForm.direction">
                <option value="left">LPUSH（左/头部）</option>
                <option value="right">RPUSH（右/尾部）</option>
              </select>
              <button class="btn btn-primary" @click="listPush">PUSH</button>
            </div>
            <div class="ops-row">
              <input v-model="listForm.key" placeholder="key" />
              <button class="btn" @click="listRange">LRANGE</button>
              <button class="btn" @click="listPop">POP</button>
            </div>
          </div>

          <!-- Set 操作 -->
          <div v-if="activeDataType === 'set'" class="ops-panel">
            <div class="ops-row">
              <input v-model="setForm.key" placeholder="key *" />
              <input v-model="setForm.member" placeholder="member（多个用逗号分隔）*" />
              <button class="btn btn-primary" @click="setAdd">SADD</button>
            </div>
            <div class="ops-row">
              <input v-model="setForm.key" placeholder="key" />
              <button class="btn" @click="setMembers">SMEMBERS</button>
              <input v-model="setForm.member" placeholder="member" style="max-width:150px" />
              <button class="btn" @click="setIsMember">SISMEMBER</button>
              <button class="btn btn-del" @click="setRem">SREM</button>
            </div>
          </div>

          <!-- Sorted Set 操作 -->
          <div v-if="activeDataType === 'zset'" class="ops-panel">
            <div class="ops-row">
              <input v-model="zsetForm.key" placeholder="key *" />
              <input v-model.number="zsetForm.score" placeholder="score（分数）*" type="number" />
              <input v-model="zsetForm.member" placeholder="member *" />
              <button class="btn btn-primary" @click="zsetAdd">ZADD</button>
            </div>
            <div class="ops-row">
              <input v-model="zsetForm.key" placeholder="key" />
              <button class="btn" @click="zsetRange">ZRANGE（排行榜）</button>
              <input v-model="zsetForm.member" placeholder="member" style="max-width:150px" />
              <button class="btn btn-del" @click="zsetRem">ZREM</button>
            </div>
          </div>

          <!-- 结果展示 -->
          <div v-if="apiResult" class="result-box">
            <div class="result-header">
              <span>执行结果</span>
              <button class="btn-sm" @click="apiResult = null">清除</button>
            </div>
            <pre>{{ JSON.stringify(apiResult, null, 2) }}</pre>
          </div>
        </div>

        <!-- ==================== Pub/Sub 发布订阅 ==================== -->
        <div v-if="activeTab === 'pubsub'" class="tab-content">
          <p class="tab-desc">Pub/Sub 类似微信群：订阅频道后，任何人发布消息，所有订阅者都能收到</p>
          <div class="pubsub-layout">
            <!-- 订阅面板 -->
            <div class="pubsub-panel">
              <h3>📡 订阅频道</h3>
              <div class="ops-row">
                <input v-model="pubsubForm.channel" placeholder="频道名称" />
                <button class="btn btn-primary" @click="subscribeChannel">订阅</button>
              </div>
              <div v-for="ch in subscribedChannels" :key="ch" class="subscribed-item">
                <span class="channel-tag">{{ ch }}</span>
                <button class="btn-sm btn-del" @click="unsubscribeChannel(ch)">取消</button>
              </div>
              <div v-if="!subscribedChannels.length" class="empty-sm">未订阅任何频道</div>
            </div>
            <!-- 发布面板 -->
            <div class="pubsub-panel">
              <h3>📢 发布消息</h3>
              <div class="ops-row">
                <input v-model="pubsubForm.channel" placeholder="频道名称" />
                <input v-model="pubsubForm.message" placeholder="消息内容" />
                <button class="btn btn-primary" @click="publishMessage">发布</button>
              </div>
            </div>
          </div>
          <!-- 消息日志 -->
          <div v-if="pubsubMessages.length" class="msg-log">
            <h3>📨 收到的消息</h3>
            <div v-for="(msg, i) in pubsubMessages" :key="i" class="msg-item">
              <span class="msg-channel">{{ msg.channel }}</span>
              <span class="msg-text">{{ msg.message }}</span>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
          </div>
        </div>

        <!-- ==================== 事务 ==================== -->
        <div v-if="activeTab === 'transaction'" class="tab-content">
          <!-- 银行转账 -->
          <div class="tx-card">
            <h3>🏦 MULTI 事务 — 银行转账</h3>
            <p class="tx-desc">Sorted Set 模拟账户余额，MULTI 保证转账原子性（要么全成功，要么全失败）</p>
            <div class="leaderboard-preview">
              <span v-for="a in bankAccounts" :key="a.member" class="account-chip">
                {{ a.member }}: ¥{{ a.score }}
              </span>
            </div>
            <div class="ops-row">
              <select v-model="txForm.from">
                <option value="" disabled>转出方</option>
                <option v-for="a in bankAccounts" :key="a.member" :value="a.member">{{ a.member }} (¥{{ a.score }})</option>
              </select>
              <span class="arrow-icon">→</span>
              <select v-model="txForm.to">
                <option value="" disabled>接收方</option>
                <option v-for="a in bankAccounts" :key="a.member" :value="a.member">{{ a.member }}</option>
              </select>
              <input v-model.number="txForm.amount" placeholder="金额" type="number" />
              <button class="btn btn-primary" @click="bankTransfer">转账</button>
            </div>
            <div v-if="txResult" class="result-box">
              <pre>{{ JSON.stringify(txResult, null, 2) }}</pre>
            </div>
          </div>

          <!-- Pipeline 对比 -->
          <div class="tx-card">
            <h3>⚡ Pipeline vs 普通请求</h3>
            <p class="tx-desc">Pipeline 把多个命令打包成一次网络请求，性能提升显著</p>
            <div class="ops-row">
              <input v-model.number="pipelineCount" placeholder="操作数量" type="number" />
              <button class="btn btn-primary" @click="testPipeline">性能对比</button>
            </div>
            <div v-if="pipelineResult" class="result-box">
              <pre>{{ JSON.stringify(pipelineResult, null, 2) }}</pre>
            </div>
          </div>

          <!-- WATCH 乐观锁 -->
          <div class="tx-card">
            <h3>🔒 WATCH 乐观锁</h3>
            <p class="tx-desc">WATCH 监视 key，如果在 EXEC 前被别人改了，事务自动取消</p>
            <div class="ops-row">
              <input v-model="watchForm.key" placeholder="key *" />
              <input v-model="watchForm.expectedValue" placeholder="当前值（expected）*" />
              <input v-model="watchForm.newValue" placeholder="新值 *" />
              <button class="btn btn-primary" @click="testWatch">执行 WATCH</button>
            </div>
            <div v-if="watchResult" class="result-box">
              <pre>{{ JSON.stringify(watchResult, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- ==================== 高级概念 ==================== -->
        <div v-if="activeTab === 'concepts'" class="tab-content">
          <!-- 持久化 -->
          <h3>💾 Redis 持久化</h3>
          <p class="tab-desc">Redis 数据存在内存中，重启就没了。持久化就是把内存数据保存到硬盘。</p>
          <div class="concept-grid">
            <div class="concept-card rdb">
              <h4>RDB（快照）</h4>
              <p>定时把整个数据库"拍照"保存为 .rdb 文件</p>
              <div class="concept-detail">
                <p><strong>原理：</strong>fork() 子进程 → 把内存数据写入磁盘</p>
                <p><strong>触发条件：</strong></p>
                <pre>save 900 1      # 900秒内至少1次修改
save 300 10     # 300秒内至少10次修改
save 60 10000   # 60秒内至少10000次修改</pre>
                <p><strong>优点：</strong>文件小、恢复快、适合备份</p>
                <p><strong>缺点：</strong>可能丢失最近几分钟的数据</p>
              </div>
            </div>
            <div class="concept-card aof">
              <h4>AOF（追加日志）</h4>
              <p>每条写命令都追加到 .aof 文件</p>
              <div class="concept-detail">
                <p><strong>原理：</strong>每执行一条 SET/DEL 等，就追加记录到日志文件</p>
                <p><strong>fsync 策略：</strong></p>
                <pre>appendonly yes          # 开启 AOF
appendfsync always     # 每条命令都刷盘（最安全，最慢）
appendfsync everysec   # 每秒刷盘（默认，推荐）
appendfsync no         # 由操作系统决定（最快）</pre>
                <p><strong>优点：</strong>最多丢1秒数据、日志可读</p>
                <p><strong>缺点：</strong>文件比 RDB 大、恢复较慢</p>
              </div>
            </div>
          </div>

          <!-- RDB vs AOF 对比表 -->
          <div class="compare-table-wrap">
            <table class="compare-table">
              <thead><tr><th>对比项</th><th>RDB</th><th>AOF</th></tr></thead>
              <tbody>
                <tr><td>持久化方式</td><td>定时快照</td><td>追加写命令日志</td></tr>
                <tr><td>数据安全</td><td>可能丢几分钟数据</td><td>最多丢1秒</td></tr>
                <tr><td>文件大小</td><td>小（二进制压缩）</td><td>大（文本日志）</td></tr>
                <tr><td>恢复速度</td><td>快</td><td>慢（要重放命令）</td></tr>
                <tr><td>对性能影响</td><td>fork 时可能卡顿</td><td>取决于 fsync 策略</td></tr>
                <tr><td>推荐场景</td><td>备份、灾备</td><td>主持久化方案</td></tr>
              </tbody>
            </table>
          </div>

          <!-- 主从复制 -->
          <h3 style="margin-top:30px">🔗 主从复制</h3>
          <p class="tab-desc">一个 Master（主）+ 多个 Slave（从），主负责写，从负责读，实现读写分离</p>
          <div class="replication-diagram">
            <div class="replica-row">
              <div class="replica-node master">
                <div class="replica-icon">✍️</div>
                <div class="replica-title">Master（主节点）</div>
                <div class="replica-desc">处理所有写操作<br/>同步数据给 Slave</div>
              </div>
              <div class="replica-arrows">
                <div class="replica-arrow">→ 复制</div>
                <div class="replica-arrow">→ 复制</div>
              </div>
              <div class="replica-slaves">
                <div class="replica-node slave">
                  <div class="replica-icon">📖</div>
                  <div class="replica-title">Slave 1</div>
                  <div class="replica-desc">只读，分担读请求</div>
                </div>
                <div class="replica-node slave">
                  <div class="replica-icon">📖</div>
                  <div class="replica-title">Slave 2</div>
                  <div class="replica-desc">只读，数据备份</div>
                </div>
              </div>
            </div>
          </div>
          <div class="concept-detail" style="margin-top:15px">
            <p><strong>配置方式：</strong>在 Slave 的 redis.conf 中添加 <code>replicaof 主节点IP 端口</code></p>
            <p><strong>读写分离：</strong>写请求走 Master，读请求走 Slave，提高并发能力</p>
            <p><strong>哨兵（Sentinel）：</strong>自动监控 Master，如果挂了自动把 Slave 提升为 Master</p>
            <p><strong>Redis Cluster：</strong>生产环境推荐，支持数据分片、自动故障转移</p>
          </div>
        </div>
      </div>

      <!-- 所有 Key 浏览器 -->
      <div class="section">
        <h3>🔑 Key 浏览器</h3>
        <div class="ops-row">
          <input v-model="keyPattern" placeholder="匹配模式（如 user:*）" />
          <button class="btn btn-primary" @click="fetchKeys">查询</button>
          <button class="btn" @click="resetData" style="margin-left:auto">重置测试数据</button>
        </div>
        <div v-if="allKeys.length" class="keys-grid">
          <div v-for="k in allKeys" :key="k" class="key-item" @click="inspectKey(k)">{{ k }}</div>
        </div>
      </div>
    </template>

    <!-- 离线提示 -->
    <template v-else>
      <div class="offline-tips">
        <h3>📦 启动步骤</h3>
        <ol>
          <li>确保 Redis 已启动（默认端口 6379）</li>
          <li>安装依赖: <code>npm install ioredis</code></li>
          <li>启动服务: <code>node network-examples/express-redis.js</code></li>
        </ol>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const BASE = 'http://localhost:3004'
const serverOnline = ref(false)
let checkTimer = null

// 主 tabs
const mainTabs = [
  { key: 'basic', label: '📝 基础操作' },
  { key: 'pubsub', label: '📡 Pub/Sub' },
  { key: 'transaction', label: '🔒 事务' },
  { key: 'concepts', label: '📖 高级概念' },
]
const activeTab = ref('basic')

// 数据类型
const dataTypes = [
  { key: 'string', name: 'String', icon: '📝', desc: '最基本类型，可存文本、数字', example: 'SET key value' },
  { key: 'hash', name: 'Hash', icon: '🗂️', desc: '字段-值对，类似 JS 对象', example: 'HSET user:1 name 张三' },
  { key: 'list', name: 'List', icon: '📋', desc: '有序列表，可做队列', example: 'LPUSH queue task1' },
  { key: 'set', name: 'Set', icon: '🏷️', desc: '无序去重集合', example: 'SADD tags node' },
  { key: 'zset', name: 'Sorted Set', icon: '🏆', desc: '带分数排序，做排行榜', example: 'ZADD rank 1500 张三' },
]
const activeDataType = ref('string')

// 表单
const strForm = ref({ key: '', value: '', expire: '' })
const hashForm = ref({ key: '', field: '', value: '' })
const listForm = ref({ key: '', value: '', direction: 'right' })
const setForm = ref({ key: '', member: '' })
const zsetForm = ref({ key: '', score: '', member: '' })

// 结果
const apiResult = ref(null)

// Pub/Sub
const pubsubForm = ref({ channel: 'news', message: '' })
const subscribedChannels = ref([])
const pubsubMessages = ref([])
const eventSources = ref({})

// 事务
const bankAccounts = ref([])
const txForm = ref({ from: '', to: '', amount: 100 })
const txResult = ref(null)
const pipelineCount = ref(100)
const pipelineResult = ref(null)
const watchForm = ref({ key: 'counter:visits', expectedValue: '', newValue: '' })
const watchResult = ref(null)

// Key 浏览
const keyPattern = ref('*')
const allKeys = ref([])

// ========== 通用方法 ==========
async function api(method, path, body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + path, opts)
  return await res.json()
}

async function checkServer() {
  try {
    const res = await fetch(BASE + '/api/info', { signal: AbortSignal.timeout(2000) })
    serverOnline.value = res.ok
    if (res.ok && !bankAccounts.value.length) {
      await refreshBankAccounts()
    }
  } catch {
    serverOnline.value = false
  }
}

async function refreshBankAccounts() {
  const data = await api('GET', '/api/zset/zrange/bank:accounts?withscores=true')
  if (data.members) bankAccounts.value = data.members
}

// ========== String 操作 ==========
async function stringSet() {
  apiResult.value = await api('POST', '/api/string/set', strForm.value)
}
async function stringGet() {
  apiResult.value = await api('GET', `/api/string/get/${strForm.value.key}`)
}
async function stringIncr() {
  apiResult.value = await api('POST', `/api/string/incr/${strForm.value.key}`, {})
}
async function stringDel() {
  apiResult.value = await api('DELETE', `/api/string/del/${strForm.value.key}`)
}

// ========== Hash 操作 ==========
async function hashSet() {
  apiResult.value = await api('POST', '/api/hash/hset', hashForm.value)
}
async function hashGet() {
  apiResult.value = await api('GET', `/api/hash/hget/${hashForm.value.key}/${hashForm.value.field}`)
}
async function hashGetAll() {
  apiResult.value = await api('GET', `/api/hash/hgetall/${hashForm.value.key}`)
}
async function hashDel() {
  apiResult.value = await api('DELETE', `/api/hash/hdel/${hashForm.value.key}/${hashForm.value.field}`)
}

// ========== List 操作 ==========
async function listPush() {
  apiResult.value = await api('POST', '/api/list/push', listForm.value)
}
async function listRange() {
  apiResult.value = await api('GET', `/api/list/range/${listForm.value.key}`)
}
async function listPop() {
  apiResult.value = await api('POST', `/api/list/pop/${listForm.value.key}`, { direction: listForm.value.direction })
}

// ========== Set 操作 ==========
async function setAdd() {
  const members = setForm.value.member.split(',').map(s => s.trim()).filter(Boolean)
  apiResult.value = await api('POST', '/api/set/sadd', { key: setForm.value.key, members })
}
async function setMembers() {
  apiResult.value = await api('GET', `/api/set/smembers/${setForm.value.key}`)
}
async function setIsMember() {
  apiResult.value = await api('GET', `/api/set/sismember/${setForm.value.key}/${setForm.value.member}`)
}
async function setRem() {
  apiResult.value = await api('DELETE', `/api/set/srem/${setForm.value.key}/${setForm.value.member}`)
}

// ========== Sorted Set 操作 ==========
async function zsetAdd() {
  apiResult.value = await api('POST', '/api/zset/zadd', zsetForm.value)
}
async function zsetRange() {
  apiResult.value = await api('GET', `/api/zset/zrange/${zsetForm.value.key}?withscores=true`)
}
async function zsetRem() {
  apiResult.value = await api('DELETE', `/api/zset/zrem/${zsetForm.value.key}/${zsetForm.value.member}`)
}

// ========== Pub/Sub ==========
function subscribeChannel(channel) {
  channel = channel || pubsubForm.value.channel
  if (!channel || subscribedChannels.value.includes(channel)) return
  const es = new EventSource(`${BASE}/api/pubsub/subscribe/${channel}`)
  es.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'connected') return
      pubsubMessages.value.unshift({
        channel: data.channel,
        message: data.message,
        time: new Date().toLocaleTimeString(),
      })
      if (pubsubMessages.value.length > 50) pubsubMessages.value.pop()
    } catch {}
  }
  eventSources.value[channel] = es
  subscribedChannels.value.push(channel)
}
async function unsubscribeChannel(channel) {
  if (eventSources.value[channel]) {
    eventSources.value[channel].close()
    delete eventSources.value[channel]
  }
  subscribedChannels.value = subscribedChannels.value.filter(c => c !== channel)
  await api('POST', '/api/pubsub/unsubscribe', { channel })
}
async function publishMessage() {
  const { channel, message } = pubsubForm.value
  if (!channel || !message) return
  const result = await api('POST', '/api/pubsub/publish', { channel, message })
  pubsubForm.value.message = ''
}

// ========== 事务 ==========
async function bankTransfer() {
  txResult.value = await api('POST', '/api/tx/transfer', txForm.value)
  await refreshBankAccounts()
}
async function testPipeline() {
  pipelineResult.value = await api('POST', '/api/tx/pipeline', { count: pipelineCount.value })
}
async function testWatch() {
  watchResult.value = await api('POST', '/api/tx/watch', watchForm.value)
}

// ========== 工具 ==========
async function fetchKeys() {
  const data = await api('GET', `/api/keys?pattern=${keyPattern.value}`)
  allKeys.value = data.keys || []
}
async function inspectKey(key) {
  const type = await api('GET', `/api/type/${key}`)
  if (type.type === 'string') apiResult.value = await api('GET', `/api/string/get/${key}`)
  else if (type.type === 'hash') apiResult.value = await api('GET', `/api/hash/hgetall/${key}`)
  else if (type.type === 'list') apiResult.value = await api('GET', `/api/list/range/${key}`)
  else if (type.type === 'set') apiResult.value = await api('GET', `/api/set/smembers/${key}`)
  else if (type.type === 'zset') apiResult.value = await api('GET', `/api/zset/zrange/${key}?withscores=true`)
  activeTab.value = 'basic'
}
async function resetData() {
  await api('POST', '/api/demo/reset')
  await fetchKeys()
  await refreshBankAccounts()
}

onMounted(() => {
  checkServer()
  checkTimer = setInterval(checkServer, 5000)
})
onUnmounted(() => {
  clearInterval(checkTimer)
  Object.values(eventSources.value).forEach(es => es.close())
})
</script>

<style scoped>
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 30px 40px; }
h1 { font-size: 2em; color: var(--primary); margin-bottom: 8px; }
h2 { color: var(--text); margin-bottom: 15px; }
h3 { color: var(--text); margin: 0 0 12px; }
.desc { color: var(--text-dim); margin-bottom: 20px; }

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

.section { margin-top: 25px; }
.tab-desc { color: var(--text-dim); font-size: .9em; margin-bottom: 15px; line-height: 1.6; }

/* 数据类型卡片 */
.type-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.type-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 15px; cursor: pointer; transition: all .2s; }
.type-card:hover { background: rgba(0,217,255,.08); border-color: var(--primary); transform: translateY(-2px); }
.type-icon { font-size: 1.8em; margin-bottom: 5px; }
.type-name { font-weight: 700; color: var(--primary); font-size: 1.05em; }
.type-desc { font-size: .82em; color: var(--text-dim); margin: 5px 0; }
.type-example { font-family: monospace; font-size: .78em; color: #f39c12; background: rgba(0,0,0,.2); padding: 4px 8px; border-radius: 4px; }

/* Tabs */
.tabs { display: flex; gap: 5px; margin-bottom: 20px; flex-wrap: wrap; }
.tab-btn { padding: 8px 18px; border: 1px solid rgba(255,255,255,.15); border-radius: 6px; background: transparent; color: var(--text-dim); cursor: pointer; font-size: .9em; transition: all .2s; }
.tab-btn:hover { border-color: var(--primary); color: var(--primary); }
.tab-btn.active { background: var(--primary); color: #000; border-color: var(--primary); font-weight: 600; }

.sub-tabs { display: flex; gap: 5px; margin-bottom: 15px; flex-wrap: wrap; }
.sub-tab-btn { padding: 6px 14px; border: 1px solid rgba(255,255,255,.1); border-radius: 20px; background: transparent; color: var(--text-dim); cursor: pointer; font-size: .85em; transition: all .2s; }
.sub-tab-btn:hover { border-color: var(--primary); }
.sub-tab-btn.active { background: rgba(0,217,255,.15); color: var(--primary); border-color: var(--primary); }

/* 操作面板 */
.ops-panel { background: rgba(0,0,0,.15); border-radius: 8px; padding: 15px; }
.ops-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; flex-wrap: wrap; }
.ops-row:last-child { margin-bottom: 0; }
.ops-row input, .ops-row select { flex: 1; min-width: 120px; padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,.15); background: rgba(0,0,0,.3); color: var(--text); font-size: .9em; }

.btn { padding: 6px 16px; border-radius: 6px; border: 1px solid rgba(255,255,255,.15); background: transparent; color: var(--text-dim); cursor: pointer; font-size: .85em; transition: all .2s; white-space: nowrap; }
.btn:hover { border-color: var(--primary); color: var(--primary); }
.btn-primary { background: var(--primary); color: #000; border-color: var(--primary); font-weight: 600; }
.btn-primary:hover { opacity: .85; color: #000; }
.btn-del { color: #e74c3c; border-color: rgba(231,76,60,.3); }
.btn-del:hover { background: rgba(231,76,60,.15); }
.btn-sm { padding: 3px 10px; border-radius: 4px; border: none; cursor: pointer; font-size: .8em; background: rgba(255,255,255,.1); color: var(--text-dim); }
.btn-sm:hover { background: rgba(255,255,255,.2); }

/* 结果展示 */
.result-box { background: rgba(0,0,0,.3); border-radius: 8px; margin-top: 12px; overflow: hidden; }
.result-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(0,217,255,.08); font-size: .85em; color: var(--primary); }
.result-box pre { padding: 12px; margin: 0; font-size: .82em; line-height: 1.5; white-space: pre-wrap; color: #2ecc71; max-height: 300px; overflow-y: auto; }

/* Pub/Sub */
.pubsub-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.pubsub-panel { background: rgba(255,255,255,.04); border-radius: 8px; padding: 15px; }
.subscribed-item { display: flex; align-items: center; gap: 8px; padding: 5px 0; }
.channel-tag { background: rgba(0,217,255,.15); color: var(--primary); padding: 2px 10px; border-radius: 12px; font-size: .85em; }
.empty-sm { color: var(--text-dim); font-size: .85em; padding: 10px 0; }
.msg-log { margin-top: 20px; }
.msg-item { display: flex; gap: 12px; padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,.03); font-size: .88em; }
.msg-channel { color: var(--primary); font-weight: 600; min-width: 80px; }
.msg-text { flex: 1; }
.msg-time { color: var(--text-dim); font-size: .82em; }

/* 事务卡片 */
.tx-card { background: rgba(255,255,255,.04); border-radius: 10px; padding: 20px; margin-bottom: 15px; }
.tx-desc { color: var(--text-dim); font-size: .88em; margin-bottom: 12px; }
.leaderboard-preview { display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.account-chip { background: rgba(243,156,18,.12); color: #f39c12; padding: 4px 12px; border-radius: 16px; font-size: .85em; }
.arrow-icon { font-size: 1.2em; color: var(--primary); }

/* 高级概念 */
.concept-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
.concept-card { background: rgba(255,255,255,.04); border-radius: 10px; padding: 20px; }
.concept-card.rdb { border-left: 3px solid #3498db; }
.concept-card.aof { border-left: 3px solid #e67e22; }
.concept-card h4 { color: var(--primary); margin: 0 0 10px; font-size: 1.05em; }
.concept-detail p { font-size: .88em; line-height: 1.7; margin: 5px 0; color: var(--text-dim); }
.concept-detail strong { color: var(--text); }
.concept-detail code { background: rgba(0,0,0,.3); padding: 1px 6px; border-radius: 3px; color: #f39c12; font-size: .85em; }
.concept-detail pre { background: rgba(0,0,0,.3); padding: 8px 12px; border-radius: 6px; font-size: .8em; line-height: 1.5; margin: 8px 0; white-space: pre-wrap; color: #2ecc71; }

/* 对比表 */
.compare-table-wrap { overflow-x: auto; margin-top: 15px; }
.compare-table { width: 100%; border-collapse: collapse; font-size: .88em; }
.compare-table th { background: rgba(0,217,255,.1); padding: 10px 15px; text-align: left; color: var(--primary); }
.compare-table td { padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,.05); color: var(--text-dim); }

/* 主从复制图 */
.replication-diagram { background: rgba(0,0,0,.15); border-radius: 10px; padding: 25px; }
.replica-row { display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; }
.replica-node { background: rgba(255,255,255,.06); border-radius: 10px; padding: 15px; text-align: center; min-width: 140px; }
.replica-node.master { border: 2px solid #2ecc71; }
.replica-node.slave { border: 2px solid #3498db; }
.replica-icon { font-size: 1.8em; margin-bottom: 5px; }
.replica-title { font-weight: 700; font-size: .95em; margin-bottom: 3px; }
.replica-node.master .replica-title { color: #2ecc71; }
.replica-node.slave .replica-title { color: #3498db; }
.replica-desc { font-size: .8em; color: var(--text-dim); line-height: 1.4; }
.replica-arrows { display: flex; flex-direction: column; gap: 15px; }
.replica-arrow { color: var(--primary); font-size: .9em; font-weight: 600; }
.replica-slaves { display: flex; gap: 15px; }

/* Key 浏览器 */
.keys-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.key-item { background: rgba(255,255,255,.06); padding: 4px 12px; border-radius: 6px; font-size: .82em; cursor: pointer; transition: all .15s; color: var(--text-dim); }
.key-item:hover { background: rgba(0,217,255,.12); color: var(--primary); }

@media (max-width: 768px) {
  .pubsub-layout { grid-template-columns: 1fr; }
  .concept-grid { grid-template-columns: 1fr; }
  .replica-row { flex-direction: column; }
}
</style>
