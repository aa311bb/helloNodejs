/**
 * ============================================
 * Express + Redis 学习示例
 * ============================================
 *
 * 【什么是 Redis？】
 * Redis = REmote DIctionary Server（远程字典服务）
 * 它是一个"内存数据库"，数据存在内存中，读写速度极快（微秒级）
 *
 * 【Redis vs MySQL 对比】
 *   MySQL：数据存硬盘，慢但可靠，适合存"重要数据"（用户、订单）
 *   Redis：数据存内存，快但易丢失，适合存"热数据"（缓存、排行榜、会话）
 *
 * 【ioredis 是什么？】
 * ioredis 是 Node.js 最流行的 Redis 客户端
 * 支持所有 Redis 命令、Promise、Pipeline、集群、Lua 脚本
 *
 * 【运行方式】
 *   先确保 Redis 已启动（默认端口 6379）
 *   然后运行：node network-examples/express-redis.js
 *
 * 【Redis 五种基本数据类型】
 *   1. String（字符串）   → 最基本类型，可存文本、数字、JSON
 *   2. Hash（哈希）       → 类似 JS 对象，适合存用户信息等结构化数据
 *   3. List（列表）       → 有序列表，适合做消息队列、最新列表
 *   4. Set（集合）        → 无序去重集合，适合做标签、共同好友
 *   5. Sorted Set（有序集合）→ 带分数的排序集合，适合做排行榜
 */

// ============================================
// 1. 引入依赖
// ============================================
import express from 'express'
import Redis from 'ioredis'
import log4js from 'log4js'

// ============================================
// 2. 配置日志（log4js）
// ============================================
// 和之前 Express 示例一样，用 log4js 记录请求日志
log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: { type: 'pattern', pattern: '%[[%d{hh:mm:ss}] [%p] -%] %m' },
    },
  },
  categories: { default: { appenders: ['console'], level: 'debug' } },
})
const logger = log4js.getLogger()

// ============================================
// 3. 创建 Redis 客户端
// ============================================
// 【重要】Redis Pub/Sub 需要两个独立的客户端连接
// 原因：进入"订阅模式"的客户端只能执行 subscribe/unsubscribe 命令
// 所以我们需要：
//   - redis（普通客户端）→ 用于所有 CRUD 操作和事务
//   - subscriber（订阅客户端）→ 专门用于 Pub/Sub 订阅

// 普通客户端：用于 String/Hash/List/Set/SortedSet 操作、事务等
const redis = new Redis({
  host: '127.0.0.1',  // Redis 服务器地址
  port: 6379,         // Redis 默认端口
  // password: '',     // 如果设了密码就取消注释
  db: 0,              // 使用第 0 个数据库（Redis 默认有 16 个，0-15）
})

// 订阅客户端：专门用于 Pub/Sub（发布订阅）
const subscriber = new Redis({
  host: '127.0.0.1',
  port: 6379,
  db: 0,
})

// 连接成功事件
redis.on('connect', () => logger.info('Redis 普通客户端已连接'))
subscriber.on('connect', () => logger.info('Redis 订阅客户端已连接'))

// 错误处理
redis.on('error', (err) => logger.error('Redis 错误:', err.message))
subscriber.on('error', (err) => logger.error('Subscriber 错误:', err.message))

// ============================================
// 4. Pub/Sub SSE 连接管理
// ============================================
// SSE (Server-Sent Events) 是服务器向浏览器"推"消息的技术
// 不需要 WebSocket，浏览器原生支持（EventSource API）
//
// sseClients 记录每个频道有哪些浏览器连接在监听
// 当 Redis 收到消息时，通过 SSE 推送给所有监听的浏览器
const sseClients = new Map() // channel → Set<{ res }>

// 当订阅客户端收到消息时，推送给所有 SSE 连接
subscriber.on('message', (channel, message) => {
  logger.info(`[Pub/Sub] 收到消息: channel=${channel}, message=${message}`)
  const clients = sseClients.get(channel)
  if (clients) {
    // 遍历该频道的所有 SSE 连接，推送消息
    for (const client of clients) {
      // SSE 数据格式: "data: JSON内容\n\n"
      client.res.write(`data: ${JSON.stringify({
        channel,
        message,
        time: new Date().toISOString(),
      })}\n\n`)
    }
  }
})

// ============================================
// 5. 创建 Express 应用
// ============================================
const app = express()
const PORT = 3004

// 中间件
app.use(express.json())        // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true }))

// CORS 跨域（允许 Vue 前端访问）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  next()
})

// 请求日志中间件
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    logger.info(`${req.method} ${req.url} ${res.statusCode} (${Date.now() - start}ms)`)
  })
  next()
})

// ============================================
// 6. 首页 - API 列表
// ============================================
app.get('/', (req, res) => {
  res.json({
    service: 'Express + Redis 学习示例',
    port: PORT,
    redis: 'redis://127.0.0.1:6379',
    endpoints: {
      string: ['/api/string/set', '/api/string/get/:key', '/api/string/incr/:key', '/api/string/del/:key'],
      hash: ['/api/hash/hset', '/api/hash/hget/:key/:field', '/api/hash/hgetall/:key', '/api/hash/hdel/:key/:field'],
      list: ['/api/list/push', '/api/list/range/:key', '/api/list/pop/:key'],
      set: ['/api/set/sadd', '/api/set/smembers/:key', '/api/set/sismember/:key/:member', '/api/set/srem/:key/:member'],
      zset: ['/api/zset/zadd', '/api/zset/zrange/:key', '/api/zset/zrem/:key/:member'],
      pubsub: ['/api/pubsub/publish', '/api/pubsub/subscribe/:channel (SSE)', '/api/pubsub/unsubscribe'],
      transaction: ['/api/tx/transfer', '/api/tx/pipeline', '/api/tx/watch'],
      utils: ['/api/keys', '/api/type/:key', '/api/demo/reset'],
    },
  })
})

// ============================================
// 7. String 操作（字符串）
// ============================================
// String 是 Redis 最基本的数据类型
// 可以存：普通文本、数字（自增/自减）、JSON 字符串、二进制数据
// 最大大小：512MB

/**
 * POST /api/string/set
 * 设置字符串值
 * 对应 Redis 命令：SET key value [EX seconds]
 */
app.post('/api/string/set', async (req, res) => {
  const { key, value, expire } = req.body
  if (!key || value === undefined) {
    return res.status(400).json({ error: '需要 key 和 value 参数' })
  }

  // redis.set(key, value)
  // 等同于 Redis 命令：SET key value
  // 可选参数 EX 表示过期时间（秒）
  if (expire) {
    // SET key value EX 60  → 60秒后自动删除
    await redis.set(key, String(value), 'EX', expire)
  } else {
    await redis.set(key, String(value))
  }

  res.json({ ok: true, key, value, expire: expire || '永不过期' })
})

/**
 * GET /api/string/get/:key
 * 获取字符串值
 * 对应 Redis 命令：GET key
 */
app.get('/api/string/get/:key', async (req, res) => {
  const { key } = req.params

  // redis.get(key) 返回字符串或 null（key 不存在时）
  const value = await redis.get(key)
  if (value === null) {
    return res.json({ key, value: null, exists: false })
  }
  res.json({ key, value, exists: true })
})

/**
 * POST /api/string/incr/:key
 * 自增（计数器）
 * 对应 Redis 命令：INCR key 或 INCRBY key amount
 *
 * 这是 Redis 的"原子操作"，即使有100个请求同时自增也不会出错
 * 常用于：浏览量计数、库存扣减、限流
 */
app.post('/api/string/incr/:key', async (req, res) => {
  const { key } = req.params
  const { amount } = req.body

  let result
  if (amount) {
    // INCRBY key amount → 按指定数量增加
    result = await redis.incrby(key, amount)
  } else {
    // INCR key → 每次加1（如果 key 不存在，自动从0开始加）
    result = await redis.incr(key)
  }

  res.json({ key, value: result, operation: amount ? `+${amount}` : '+1' })
})

/**
 * DELETE /api/string/del/:key
 * 删除 key
 * 对应 Redis 命令：DEL key
 */
app.delete('/api/string/del/:key', async (req, res) => {
  // redis.del(key) 返回被删除的 key 数量（0表示不存在）
  const deleted = await redis.del(req.params.key)
  res.json({ key: req.params.key, deleted })
})

// ============================================
// 8. Hash 操作（哈希）
// ============================================
// Hash 类似 JavaScript 的对象 { field1: value1, field2: value2 }
// 适合存储结构化数据，比如用户信息：{ name: "张三", age: "25", email: "..." }
// 注意：Hash 的 field 和 value 都是字符串类型

/**
 * POST /api/hash/hset
 * 设置 Hash 字段
 * 对应 Redis 命令：HSET key field value
 */
app.post('/api/hash/hset', async (req, res) => {
  const { key, field, value } = req.body
  if (!key || !field || value === undefined) {
    return res.status(400).json({ error: '需要 key, field, value 参数' })
  }

  // HSET key field value → 设置 hash 中某个字段的值
  // 返回值：1 = 新字段，0 = 更新已有字段
  const result = await redis.hset(key, field, String(value))
  res.json({ ok: true, key, field, value, isNew: result === 1 })
})

/**
 * GET /api/hash/hget/:key/:field
 * 获取 Hash 中某个字段的值
 * 对应 Redis 命令：HGET key field
 */
app.get('/api/hash/hget/:key/:field', async (req, res) => {
  const { key, field } = req.params
  const value = await redis.hget(key, field)
  res.json({ key, field, value })
})

/**
 * GET /api/hash/hgetall/:key
 * 获取 Hash 的所有字段和值
 * 对应 Redis 命令：HGETALL key
 * 返回格式：{ field1: "value1", field2: "value2" }
 */
app.get('/api/hash/hgetall/:key', async (req, res) => {
  const { key } = req.params
  const data = await redis.hgetall(key)
  res.json({ key, fields: data, count: Object.keys(data).length })
})

/**
 * DELETE /api/hash/hdel/:key/:field
 * 删除 Hash 中的某个字段
 * 对应 Redis 命令：HDEL key field
 */
app.delete('/api/hash/hdel/:key/:field', async (req, res) => {
  const { key, field } = req.params
  const deleted = await redis.hdel(key, field)
  res.json({ key, field, deleted })
})

// ============================================
// 9. List 操作（列表）
// ============================================
// List 是一个有序的字符串列表，按插入顺序排列
// 支持从左边（LPUSH/LPOP）或右边（RPUSH/RPOP）操作
// 常用于：消息队列、最新消息列表、任务队列

/**
 * POST /api/list/push
 * 向列表推入元素
 * 对应 Redis 命令：LPUSH key value 或 RPUSH key value
 */
app.post('/api/list/push', async (req, res) => {
  const { key, value, direction } = req.body
  if (!key || !value) return res.status(400).json({ error: '需要 key 和 value' })

  let length
  if (direction === 'left') {
    // LPUSH key value → 从左边推入（新元素在最前面）
    // 常用于：把最新消息放在最前面
    length = await redis.lpush(key, String(value))
  } else {
    // RPUSH key value → 从右边推入（新元素在最后面）
    // 常用于：消息队列，先进先出（FIFO）
    length = await redis.rpush(key, String(value))
  }

  res.json({ ok: true, key, value, direction: direction || 'right', length })
})

/**
 * GET /api/list/range/:key
 * 获取列表指定范围的元素
 * 对应 Redis 命令：LRANGE key start stop
 * 索引从 0 开始，-1 表示最后一个元素
 */
app.get('/api/list/range/:key', async (req, res) => {
  const { key } = req.params
  const start = parseInt(req.query.start) || 0
  const stop = parseInt(req.query.stop) || -1

  // LRANGE key 0 -1 → 获取所有元素
  // LRANGE key 0 4  → 获取前5个元素
  const data = await redis.lrange(key, start, stop)
  const length = await redis.llen(key)  // LLEN key → 列表长度

  res.json({ key, data, length, range: [start, stop] })
})

/**
 * POST /api/list/pop/:key
 * 从列表弹出元素
 * 对应 Redis 命令：LPOP key 或 RPOP key
 */
app.post('/api/list/pop/:key', async (req, res) => {
  const { key } = req.params
  const { direction } = req.body

  let value
  if (direction === 'right') {
    value = await redis.rpop(key) // RPOP → 从右边弹出（类似出队）
  } else {
    value = await redis.lpop(key) // LPOP → 从左边弹出
  }

  res.json({ key, value, direction: direction || 'left' })
})

// ============================================
// 10. Set 操作（集合）
// ============================================
// Set 是无序的、不重复的字符串集合
// 常用于：标签系统、共同好友、去重、抽奖

/**
 * POST /api/set/sadd
 * 添加成员到集合
 * 对应 Redis 命令：SADD key member [member ...]
 */
app.post('/api/set/sadd', async (req, res) => {
  const { key, members } = req.body
  if (!key || !members || !members.length) {
    return res.status(400).json({ error: '需要 key 和 members 数组' })
  }

  // SADD key member1 member2 ...
  // 返回成功添加的成员数量（已存在的不计）
  const added = await redis.sadd(key, ...members.map(String))
  res.json({ ok: true, key, added, members })
})

/**
 * GET /api/set/smembers/:key
 * 获取集合的所有成员
 * 对应 Redis 命令：SMEMBERS key
 */
app.get('/api/set/smembers/:key', async (req, res) => {
  const { key } = req.params
  // SMEMBERS 返回集合中的所有成员（无序）
  const members = await redis.smembers(key)
  res.json({ key, members, count: members.length })
})

/**
 * GET /api/set/sismember/:key/:member
 * 判断成员是否在集合中
 * 对应 Redis 命令：SISMEMBER key member
 */
app.get('/api/set/sismember/:key/:member', async (req, res) => {
  const { key, member } = req.params
  // SISMEMBER 返回 1（存在）或 0（不存在）
  const exists = await redis.sismember(key, member)
  res.json({ key, member, exists: exists === 1 })
})

/**
 * DELETE /api/set/srem/:key/:member
 * 从集合中删除成员
 * 对应 Redis 命令：SREM key member
 */
app.delete('/api/set/srem/:key/:member', async (req, res) => {
  const { key, member } = req.params
  const removed = await redis.srem(key, member)
  res.json({ key, member, removed })
})

// ============================================
// 11. Sorted Set 操作（有序集合）
// ============================================
// Sorted Set = Set + 分数（score）+ 自动排序
// 每个成员关联一个分数，按分数从小到大排序
// 常用于：排行榜、评分系统、延迟队列

/**
 * POST /api/zset/zadd
 * 添加成员到有序集合
 * 对应 Redis 命令：ZADD key score member
 */
app.post('/api/zset/zadd', async (req, res) => {
  const { key, score, member } = req.body
  if (!key || score === undefined || !member) {
    return res.status(400).json({ error: '需要 key, score, member' })
  }

  // ZADD key score member → 添加成员，如果已存在则更新分数
  const added = await redis.zadd(key, Number(score), member)
  res.json({ ok: true, key, score, member, isNew: added > 0 })
})

/**
 * GET /api/zset/zrange/:key
 * 获取有序集合指定范围的成员
 * 对应 Redis 命令：ZRANGE key min max [WITHSCORES]
 *
 * 默认按分数从小到大排列
 * ZREVRANGE 则是从大到小（用于排行榜，分数最高的在前）
 */
app.get('/api/zset/zrange/:key', async (req, res) => {
  const { key } = req.params
  const min = parseInt(req.query.min) || 0
  const max = parseInt(req.query.max) || -1
  const withScores = req.query.withscores !== 'false'

  // ZREVRANGE key 0 -1 WITHSCORES → 按分数从大到小获取所有成员
  // 返回格式：[member1, score1, member2, score2, ...]
  const data = await redis.zrevrange(key, min, max, withScores ? 'WITHSCORES' : '')

  // 把平铺数组转成对象数组
  const members = []
  if (withScores) {
    for (let i = 0; i < data.length; i += 2) {
      members.push({ member: data[i], score: Number(data[i + 1]) })
    }
  } else {
    for (const m of data) {
      members.push({ member: m })
    }
  }

  const total = await redis.zcard(key)  // ZCARD key → 成员总数
  res.json({ key, members, total })
})

/**
 * DELETE /api/zset/zrem/:key/:member
 * 从有序集合中删除成员
 * 对应 Redis 命令：ZREM key member
 */
app.delete('/api/zset/zrem/:key/:member', async (req, res) => {
  const { key, member } = req.params
  const removed = await redis.zrem(key, member)
  res.json({ key, member, removed })
})

// ============================================
// 12. Pub/Sub 发布订阅
// ============================================
// Pub/Sub 是 Redis 的消息通信模式
// 类似微信群：有人发消息（publish），所有群成员都能收到（subscribe）
//
// 应用场景：
// - 实时聊天
// - 实时通知（订单状态变更推送）
// - 多服务之间的消息传递

/**
 * POST /api/pubsub/publish
 * 发布消息到频道
 * 对应 Redis 命令：PUBLISH channel message
 */
app.post('/api/pubsub/publish', async (req, res) => {
  const { channel, message } = req.body
  if (!channel || !message) {
    return res.status(400).json({ error: '需要 channel 和 message' })
  }

  // PUBLISH channel message → 发布消息
  // 返回值：收到消息的订阅者数量
  const receivers = await redis.publish(channel, message)
  logger.info(`[Pub/Sub] 发布: channel=${channel}, message=${message}, receivers=${receivers}`)
  res.json({ ok: true, channel, message, receivers })
})

/**
 * GET /api/pubsub/subscribe/:channel
 * 订阅频道（SSE 端点）
 *
 * 【SSE (Server-Sent Events) 详解】
 * SSE 是服务器向浏览器"推送"数据的技术
 * 和 WebSocket 的区别：
 *   WebSocket：双向通信，可以客户端↔服务器互发消息
 *   SSE：单向通信，只能服务器→客户端推消息
 *   对于 Pub/Sub 场景，SSE 就够了，而且更简单
 *
 * 浏览器端用 EventSource API 连接：
 *   const es = new EventSource('/api/pubsub/subscribe/news')
 *   es.onmessage = (e) => { console.log(e.data) }
 */
app.get('/api/pubsub/subscribe/:channel', (req, res) => {
  const { channel } = req.params

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  // 管理该频道的 SSE 客户端
  if (!sseClients.has(channel)) {
    sseClients.set(channel, new Set())
    // 第一次有人订阅这个频道，让 subscriber 也订阅
    subscriber.subscribe(channel)
    logger.info(`[Pub/Sub] 订阅频道: ${channel}`)
  }

  const client = { res }
  sseClients.get(channel).add(client)

  // 发送连接成功消息
  res.write(`data: ${JSON.stringify({ type: 'connected', channel })}\n\n`)

  // 客户端断开连接时清理
  req.on('close', () => {
    const clients = sseClients.get(channel)
    if (clients) {
      clients.delete(client)
      // 如果没人订阅了，取消 Redis 订阅
      if (clients.size === 0) {
        sseClients.delete(channel)
        subscriber.unsubscribe(channel)
        logger.info(`[Pub/Sub] 取消订阅频道: ${channel}（无客户端）`)
      }
    }
  })
})

/**
 * POST /api/pubsub/unsubscribe
 * 取消订阅
 */
app.post('/api/pubsub/unsubscribe', async (req, res) => {
  const { channel } = req.body
  if (!channel) return res.status(400).json({ error: '需要 channel' })

  // 关闭该频道所有 SSE 连接
  const clients = sseClients.get(channel)
  if (clients) {
    for (const client of clients) {
      client.res.end()
    }
    sseClients.delete(channel)
    await subscriber.unsubscribe(channel)
    logger.info(`[Pub/Sub] 取消订阅频道: ${channel}`)
  }

  res.json({ ok: true, channel, message: '已取消订阅' })
})

// ============================================
// 13. 事务（Transactions）
// ============================================
// Redis 事务通过 MULTI/EXEC 实现：
//   MULTI   → 开始事务，后续命令进入队列
//   EXEC    → 执行队列中的所有命令（原子性）
//   DISCARD → 取消事务
//   WATCH   → 监视 key，如果在 EXEC 前 key 被修改，事务自动取消
//
// 【MULTI vs Pipeline 的区别】
//   MULTI：原子性，所有命令要么全执行，要么全不执行
//   Pipeline：非原子，只是把多个命令打包一次发送（减少网络往返，更快）
//   简单说：Pipeline 快但不保证原子，MULTI 慢一点但保证原子

/**
 * POST /api/tx/transfer
 * 【MULTI 事务】银行转账演示
 *
 * 使用 Sorted Set 模拟银行账户：
 *   key = "bank:accounts"
 *   member = 用户名
 *   score = 余额
 *
 * ZINCRBY key -100 "张三"  → 张三的余额减 100
 * ZINCRBY key +100 "李四"  → 李四的余额加 100
 *
 * 用 MULTI 包裹这两步，保证原子性
 */
app.post('/api/tx/transfer', async (req, res) => {
  const { from, to, amount } = req.body
  if (!from || !to || !amount || amount <= 0) {
    return res.status(400).json({ error: '需要 from, to, amount（正数）' })
  }

  // 先检查余额是否充足
  const fromScore = await redis.zscore('bank:accounts', from)
  if (!fromScore || Number(fromScore) < amount) {
    return res.json({ ok: false, error: '余额不足', balance: Number(fromScore) || 0 })
  }

  // 使用 MULTI 事务执行转账
  // redis.multi() 创建事务，链式调用多个命令，exec() 提交
  const results = await redis.multi()
    .zincrby('bank:accounts', -amount, from)   // 扣款
    .zincrby('bank:accounts', amount, to)       // 到账
    .zscore('bank:accounts', from)              // 查询转出方余额
    .zscore('bank:accounts', to)                // 查询接收方余额
    .exec()

  // results 格式：
  // [ [null, result1], [null, result2], [null, result3], [null, result4] ]
  // 如果某条命令出错，对应位置会是 [Error, null]
  const fromBalance = Number(results[2][1])
  const toBalance = Number(results[3][1])

  logger.info(`[事务] 转账: ${from} → ${to}, 金额: ${amount}`)
  res.json({
    ok: true,
    transfer: { from, to, amount },
    after: { [from]: fromBalance, [to]: toBalance },
  })
})

/**
 * POST /api/tx/pipeline
 * 【Pipeline 批量操作】对比 Pipeline 和 MULTI 的性能
 *
 * Pipeline 把多个命令打包成一次网络请求发送
 * 不保证原子性，但速度更快（减少了 N 次网络往返 → 1 次）
 */
app.post('/api/tx/pipeline', async (req, res) => {
  const count = req.body.count || 100

  // 方式1：Pipeline（非原子，快）
  const pipelineStart = Date.now()
  const pipeline = redis.pipeline()
  for (let i = 0; i < count; i++) {
    pipeline.set(`pipeline:test:${i}`, `value-${i}`)
  }
  await pipeline.exec()
  const pipelineTime = Date.now() - pipelineStart

  // 方式2：逐条执行（普通方式，最慢）
  const normalStart = Date.now()
  for (let i = 0; i < count; i++) {
    await redis.set(`normal:test:${i}`, `value-${i}`)
  }
  const normalTime = Date.now() - normalStart

  // 清理测试数据
  const pipelineKeys = []
  const normalKeys = []
  for (let i = 0; i < count; i++) {
    pipelineKeys.push(`pipeline:test:${i}`)
    normalKeys.push(`normal:test:${i}`)
  }
  await redis.del(...pipelineKeys, ...normalKeys)

  res.json({
    count,
    pipeline: { time: `${pipelineTime}ms`, atomic: false },
    normal: { time: `${normalTime}ms` },
    speedup: `${(normalTime / (pipelineTime || 1)).toFixed(1)}x`,
  })
})

/**
 * POST /api/tx/watch
 * 【WATCH 乐观锁】演示
 *
 * WATCH key → 监视一个 key
 * 如果在 EXEC 之前，这个 key 被其他客户端修改了
 * 那么事务会自动取消（EXEC 返回 null）
 *
 * 这叫做"乐观锁"：假设冲突很少发生，只在提交时检查
 * 对比"悲观锁"：先锁住资源，用完再释放（Redis 没有悲观锁）
 */
app.post('/api/tx/watch', async (req, res) => {
  const { key, expectedValue, newValue } = req.body
  if (!key || expectedValue === undefined || newValue === undefined) {
    return res.status(400).json({ error: '需要 key, expectedValue, newValue' })
  }

  // 用 watch() 监视这个 key
  // 如果在 multi().exec() 之前，key 被别人改了
  // exec() 返回 null，表示事务被取消
  await redis.watch(key)

  const current = await redis.get(key)

  if (current !== String(expectedValue)) {
    // 值已经被改了，取消监视
    redis.unwatch()
    return res.json({
      ok: false,
      error: '值已被其他客户端修改，事务取消',
      expected: expectedValue,
      current,
    })
  }

  // 值没变，执行事务
  const result = await redis.multi().set(key, newValue).exec()

  // result 为 null 表示 WATCH 检测到 key 被修改了，事务取消
  if (result === null) {
    return res.json({
      ok: false,
      error: '并发冲突！在检查和执行之间，值被其他客户端修改了',
    })
  }

  res.json({ ok: true, key, oldValue: expectedValue, newValue })
})

// ============================================
// 14. 工具接口
// ============================================

/**
 * GET /api/keys?pattern=*
 * 查看所有匹配的 key
 * 对应 Redis 命令：SCAN（不用 KEYS，因为 KEYS 会阻塞）
 */
/**
 * GET /api/type/:key
 * 查看 key 的数据类型
 * 对应 Redis 命令：TYPE key
 */
app.get('/api/type/:key', async (req, res) => {
  const { key } = req.params
  const type = await redis.type(key)
  res.json({ key, type })
})

/**
 * GET /api/keys?pattern=*
 * 查看所有匹配的 key
 * 对应 Redis 命令：SCAN（不用 KEYS，因为 KEYS 会阻塞）
 */
app.get('/api/keys', async (req, res) => {
  const pattern = req.query.pattern || '*'
  const keys = []

  // 用 SCAN 命令遍历 key（比 KEYS * 更安全，不会阻塞 Redis）
  // SCAN 是"增量式"的，每次返回一批 key + 一个游标
  let cursor = '0'
  do {
    const [nextCursor, batch] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
    cursor = nextCursor
    keys.push(...batch)
  } while (cursor !== '0')

  res.json({ keys, count: keys.length, pattern })
})

/**
 * POST /api/demo/reset
 * 重置测试数据
 * 对应 Redis 命令：FLUSHDB（清空当前数据库）
 */
app.post('/api/demo/reset', async (req, res) => {
  // FLUSHDB 清空当前数据库的所有 key
  await redis.flushdb()
  logger.info('已清空数据库，重新插入测试数据...')
  await seedData()
  res.json({ ok: true, message: '数据已重置' })
})

/**
 * GET /api/info
 * Redis 服务器信息（用于状态检测）
 */
app.get('/api/info', async (req, res) => {
  try {
    const info = await redis.info()
    const version = info.match(/redis_version:([^\r\n]+)/)?.[1] || 'unknown'
    const usedMemory = info.match(/used_memory_human:([^\r\n]+)/)?.[1] || 'unknown'
    const connectedClients = info.match(/connected_clients:([^\r\n]+)/)?.[1] || '0'
    const totalKeys = await redis.dbsize()
    res.json({ ok: true, version, usedMemory, connectedClients, totalKeys })
  } catch {
    res.json({ ok: false })
  }
})

// ============================================
// 15. 初始化测试数据
// ============================================
async function seedData() {
  // ---- String 数据 ----
  // SET key value → 设置字符串
  await redis.set('user:1:name', '张三')
  await redis.set('user:2:name', '李四')
  await redis.set('counter:visits', '100')
  logger.info('  ✓ String 数据已插入')

  // ---- Hash 数据 ----
  // HSET key field value → 设置哈希字段
  // 一个 key 可以有多个 field-value 对
  await redis.hset('user:1', 'name', '张三', 'email', 'zhangsan@test.com', 'age', '25')
  await redis.hset('user:2', 'name', '李四', 'email', 'lisi@test.com', 'age', '30')
  await redis.hset('user:3', 'name', '王五', 'email', 'wangwu@test.com', 'age', '28')
  logger.info('  ✓ Hash 数据已插入')

  // ---- List 数据 ----
  // RPUSH key value → 从右边推入（尾部追加）
  await redis.rpush('task:queue', '处理订单', '发送邮件', '生成报告', '数据备份')
  logger.info('  ✓ List 数据已插入')

  // ---- Set 数据 ----
  // SADD key member → 添加成员
  await redis.sadd('tags:node', 'express', 'koa', 'fastify', 'nest')
  await redis.sadd('tags:python', 'django', 'flask', 'fastapi')
  await redis.sadd('tags:golang', 'gin', 'echo', 'fiber')
  logger.info('  ✓ Set 数据已插入')

  // ---- Sorted Set 数据 ----
  // ZADD key score member → 添加成员+分数
  await redis.zadd('leaderboard', 1500, '张三', 2300, '李四', 1800, '王五', 900, '赵六', 3100, '孙七')
  logger.info('  ✓ Sorted Set 数据已插入')

  // ---- 银行账户（事务演示用）----
  await redis.zadd('bank:accounts', 5000, '张三', 8000, '李四', 3000, '王五')
  logger.info('  ✓ 银行账户数据已插入')
}

// ============================================
// 16. 启动服务器
// ============================================
async function start() {
  try {
    // 测试 Redis 连接
    await redis.ping()  // PING → 返回 PONG 表示连接成功
    logger.info('Redis 连接成功 (PING → PONG)')

    // 检查是否已有数据
    const totalKeys = await redis.dbsize()
    if (totalKeys === 0) {
      logger.info('数据库为空，插入测试数据...')
      await seedData()
    } else {
      logger.info(`数据库已有 ${totalKeys} 个 key，跳过初始化`)
    }

    app.listen(PORT, () => {
      logger.info('========================================')
      logger.info('⚡ Express + Redis 服务器已启动')
      logger.info(`📍 http://localhost:${PORT}`)
      logger.info('========================================')
      logger.info('')
      logger.info('💡 测试:')
      logger.info(`   curl http://localhost:${PORT}/`)
      logger.info(`   curl http://localhost:${PORT}/api/keys`)
      logger.info(`   curl http://localhost:${PORT}/api/zset/zrange/leaderboard?withscores=true`)
      logger.info('')
    })
  } catch (err) {
    logger.error('启动失败:', err.message)
    logger.error('请确保 Redis 已启动（默认端口 6379）')
    process.exit(1)
  }
}

// 优雅退出：关闭 Redis 连接
process.on('SIGINT', async () => {
  logger.info('正在关闭...')
  redis.quit()
  subscriber.quit()
  process.exit(0)
})

start()
