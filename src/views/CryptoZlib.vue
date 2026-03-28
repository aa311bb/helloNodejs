<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>Crypto & Zlib</span>
      </div>
      <h1>🔐 Crypto 加密 & 📦 Zlib 压缩</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>Crypto 模块提供加密功能，包括哈希、对称加密、非对称加密、数字签名等。Zlib 模块提供数据压缩与解压功能，支持 Gzip、Deflate、Brotli 等算法。
    </div>

    <!-- 双模块切换 -->
    <div class="module-tabs">
      <button :class="{ active: activeModule === 'crypto' }" @click="activeModule = 'crypto'">
        🔐 Crypto 加密
      </button>
      <button :class="{ active: activeModule === 'zlib' }" @click="activeModule = 'zlib'">
        📦 Zlib 压缩
      </button>
    </div>

    <!-- ==================== Crypto 模块 ==================== -->
    <div v-show="activeModule === 'crypto'">
      <!-- 功能卡片 -->
      <div class="feature-grid">
        <div class="feature-card hash">
          <div class="icon">#️⃣</div>
          <h3>Hash 哈希</h3>
          <p>单向加密</p>
        </div>
        <div class="feature-card hmac">
          <div class="icon">🔑</div>
          <h3>HMAC</h3>
          <p>带密钥哈希</p>
        </div>
        <div class="feature-card aes">
          <div class="icon">🔒</div>
          <h3>AES</h3>
          <p>对称加密</p>
        </div>
        <div class="feature-card rsa">
          <div class="icon">🗝️</div>
          <h3>RSA</h3>
          <p>非对称加密</p>
        </div>
        <div class="feature-card sign">
          <div class="icon">✍️</div>
          <h3>签名</h3>
          <p>数字签名</p>
        </div>
        <div class="feature-card random">
          <div class="icon">🎲</div>
          <h3>Random</h3>
          <p>随机数</p>
        </div>
      </div>

      <!-- 哈希 -->
      <h2 class="section-title">#️⃣ 哈希算法 (Hash)</h2>
      <div class="methods-grid">
        <MethodCard
          title="crypto.createHash(algorithm)"
          desc="创建哈希实例，单向加密"
          :examples="hashExamples"
        />
      </div>

      <div class="hash-table">
        <h4>📋 常用哈希算法</h4>
        <table>
          <thead>
            <tr><th>算法</th><th>输出长度</th><th>安全性</th><th>用途</th></tr>
          </thead>
          <tbody>
            <tr><td><code>md5</code></td><td>32位</td><td class="danger">已不安全</td><td>校验和（非安全场景）</td></tr>
            <tr><td><code>sha1</code></td><td>40位</td><td class="danger">已不安全</td><td>Git（历史原因）</td></tr>
            <tr><td><code>sha256</code></td><td>64位</td><td class="safe">推荐</td><td>数据完整性、区块链</td></tr>
            <tr><td><code>sha512</code></td><td>128位</td><td class="safe">更安全</td><td>高安全场景</td></tr>
          </tbody>
        </table>
      </div>

      <!-- HMAC -->
      <h2 class="section-title">🔑 HMAC - 消息认证码</h2>
      <div class="methods-grid">
        <MethodCard
          title="crypto.createHmac(algorithm, key)"
          desc="带密钥的哈希，用于消息认证"
          :examples="hmacExamples"
        />
      </div>

      <div class="code-block">
        <h4>📝 API 签名验证示例</h4>
        <pre><code>const sign = crypto.createHmac('sha256', 'api-secret')
sign.update(JSON.stringify(params))
const signature = sign.digest('hex')

// 服务端验证签名是否一致</code></pre>
      </div>

      <!-- 对称加密 AES -->
      <h2 class="section-title">🔒 AES 对称加密</h2>
      <div class="methods-grid">
        <MethodCard
          title="crypto.createCipheriv(algorithm, key, iv)"
          desc="创建加密器"
          :examples="cipherExamples"
        />
        <MethodCard
          title="crypto.createDecipheriv(algorithm, key, iv)"
          desc="创建解密器"
          :examples="decipherExamples"
        />
      </div>

      <div class="code-block">
        <h4>📝 完整加解密示例</h4>
        <pre><code>const algorithm = 'aes-256-cbc'
const key = crypto.randomBytes(32)   // 32字节 = 256位
const iv = crypto.randomBytes(16)    // 16字节初始向量

// 加密
const cipher = crypto.createCipheriv(algorithm, key, iv)
let encrypted = cipher.update('敏感数据', 'utf8', 'hex')
encrypted += cipher.final('hex')

// 解密
const decipher = crypto.createDecipheriv(algorithm, key, iv)
let decrypted = decipher.update(encrypted, 'hex', 'utf8')
decrypted += decipher.final('utf8')</code></pre>
      </div>

      <div class="aes-table">
        <h4>📋 AES 加密模式</h4>
        <div class="mode-list">
          <div class="mode-item"><code>aes-128-cbc</code> 128位密钥，需要 padding</div>
          <div class="mode-item"><code>aes-256-cbc</code> 256位密钥，推荐使用</div>
          <div class="mode-item"><code>aes-128-gcm</code> 认证加密，需要 authTag</div>
          <div class="mode-item"><code>aes-256-gcm</code> 认证加密，最推荐</div>
        </div>
      </div>

      <!-- 非对称加密 RSA -->
      <h2 class="section-title">🗝️ RSA 非对称加密</h2>
      <div class="methods-grid">
        <MethodCard
          title="crypto.generateKeyPairSync(type, options)"
          desc="生成密钥对"
          :examples="keyPairExamples"
        />
        <MethodCard
          title="crypto.publicEncrypt(key, buffer)"
          desc="公钥加密"
          :examples="publicEncryptExamples"
        />
        <MethodCard
          title="crypto.privateDecrypt(key, buffer)"
          desc="私钥解密"
          :examples="privateDecryptExamples"
        />
      </div>

      <div class="rsa-box">
        <h4>💡 RSA 特点</h4>
        <ul>
          <li><strong>公钥加密，私钥解密</strong> - 保护数据机密性</li>
          <li><strong>私钥签名，公钥验证</strong> - 验证数据来源</li>
          <li><strong>速度慢</strong> - 适合加密少量数据（如 AES 密钥）</li>
          <li><strong>密钥长度</strong> - 推荐 2048 位或 4096 位</li>
        </ul>
      </div>

      <!-- 数字签名 -->
      <h2 class="section-title">✍️ 数字签名</h2>
      <div class="methods-grid">
        <MethodCard
          title="crypto.sign(algorithm, data, key)"
          desc="私钥签名"
          :examples="signExamples"
        />
        <MethodCard
          title="crypto.verify(algorithm, data, key, signature)"
          desc="公钥验证"
          :examples="verifyExamples"
        />
      </div>

      <!-- 随机数 -->
      <h2 class="section-title">🎲 随机数生成</h2>
      <div class="methods-grid">
        <MethodCard
          title="crypto.randomBytes(size)"
          desc="生成随机字节"
          :examples="randomBytesExamples"
        />
        <MethodCard
          title="crypto.randomUUID()"
          desc="生成 UUID v4"
          :examples="randomUUIDExamples"
        />
        <MethodCard
          title="crypto.randomInt([min,] max)"
          desc="生成随机整数"
          :examples="randomIntExamples"
        />
      </div>

      <!-- 密码哈希 -->
      <h2 class="section-title">🔐 密码存储（重要）</h2>
      <div class="methods-grid">
        <MethodCard
          title="crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)"
          desc="PBKDF2 密码派生"
          :examples="pbkdf2Examples"
        />
        <MethodCard
          title="crypto.scryptSync(password, salt, keylen)"
          desc="Scrypt 密码派生（推荐）"
          :examples="scryptExamples"
        />
      </div>

      <div class="password-box">
        <h4>💡 密码存储最佳实践</h4>
        <pre><code>// 1. 生成随机 salt
const salt = crypto.randomBytes(16)

// 2. 使用 scrypt 派生密钥
const hash = crypto.scryptSync(password, salt, 64)

// 3. 存储 salt:hash 格式
const stored = salt.toString('hex') + ':' + hash.toString('hex')

// 4. 验证时重新计算并比对</code></pre>
      </div>
    </div>

    <!-- ==================== Zlib 模块 ==================== -->
    <div v-show="activeModule === 'zlib'">
      <!-- 功能卡片 -->
      <div class="feature-grid">
        <div class="feature-card deflate">
          <div class="icon">📉</div>
          <h3>Deflate</h3>
          <p>基础压缩</p>
        </div>
        <div class="feature-card gzip">
          <div class="icon">📦</div>
          <h3>Gzip</h3>
          <p>常用格式</p>
        </div>
        <div class="feature-card brotli">
          <div class="icon">🗜️</div>
          <h3>Brotli</h3>
          <p>高压缩率</p>
        </div>
        <div class="feature-card stream">
          <div class="icon">🌊</div>
          <h3>Stream</h3>
          <p>流式处理</p>
        </div>
      </div>

      <!-- 同步压缩 -->
      <h2 class="section-title">📦 同步压缩与解压</h2>
      <div class="methods-grid">
        <MethodCard
          title="zlib.deflateSync(buffer[, options])"
          desc="Deflate 压缩"
          :examples="deflateExamples"
        />
        <MethodCard
          title="zlib.inflateSync(buffer)"
          desc="Deflate 解压"
          :examples="inflateExamples"
        />
        <MethodCard
          title="zlib.gzipSync(buffer[, options])"
          desc="Gzip 压缩"
          :examples="gzipExamples"
        />
        <MethodCard
          title="zlib.gunzipSync(buffer)"
          desc="Gzip 解压"
          :examples="gunzipExamples"
        />
      </div>

      <!-- Brotli -->
      <h2 class="section-title">🗜️ Brotli 压缩（推荐）</h2>
      <div class="methods-grid">
        <MethodCard
          title="zlib.brotliCompressSync(buffer[, options])"
          desc="Brotli 压缩"
          :examples="brotliCompressExamples"
        />
        <MethodCard
          title="zlib.brotliDecompressSync(buffer)"
          desc="Brotli 解压"
          :examples="brotliDecompressExamples"
        />
      </div>

      <div class="compare-table">
        <h4>📊 压缩算法对比</h4>
        <table>
          <thead>
            <tr><th>算法</th><th>压缩率</th><th>速度</th><th>用途</th></tr>
          </thead>
          <tbody>
            <tr><td><code>Deflate</code></td><td>中等</td><td>快</td><td>通用压缩</td></tr>
            <tr><td><code>Gzip</code></td><td>中等</td><td>快</td><td>HTTP 响应、文件</td></tr>
            <tr><td><code>Brotli</code></td><td>最高</td><td>较慢</td><td>Web 资源（推荐）</td></tr>
          </tbody>
        </table>
      </div>

      <!-- 流式压缩 -->
      <h2 class="section-title">🌊 流式压缩（大文件推荐）</h2>
      <div class="methods-grid">
        <MethodCard
          title="zlib.createGzip([options])"
          desc="创建 Gzip 压缩流"
          :examples="createGzipExamples"
        />
        <MethodCard
          title="zlib.createGunzip()"
          desc="创建 Gzip 解压流"
          :examples="createGunzipExamples"
        />
      </div>

      <div class="code-block">
        <h4>📝 文件压缩示例</h4>
        <pre><code>import fs from 'fs'
import zlib from 'zlib'

// 压缩文件
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'))

// 解压文件
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('output.txt'))</code></pre>
      </div>

      <div class="code-block">
        <h4>📝 HTTP 响应压缩</h4>
        <pre><code>import http from 'http'
import zlib from 'zlib'

http.createServer((req, res) => {
  const data = JSON.stringify({ msg: 'Hello' })

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Content-Encoding': 'gzip'
  })

  zlib.gzip(data, (err, compressed) => {
    res.end(compressed)
  })
}).listen(3000)</code></pre>
      </div>

      <!-- 压缩级别 -->
      <h2 class="section-title">⚙️ 压缩选项</h2>
      <div class="options-box">
        <h4>📋 压缩级别 (level: 1-9)</h4>
        <div class="options-list">
          <div class="option-item"><code>level: 1</code> 最快，压缩率最低</div>
          <div class="option-item"><code>level: 5</code> 平衡（默认）</div>
          <div class="option-item"><code>level: 9</code> 最慢，压缩率最高</div>
        </div>
        <pre><code>zlib.gzipSync(buffer, { level: 9 })</code></pre>
      </div>
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看实际输出：</p>
      <code>node core-examples/crypto-zlib-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>密码存储：</strong> 使用 scrypt + salt，不要用 md5/sha1</li>
        <li><strong>API 签名：</strong> HMAC 验证请求合法性</li>
        <li><strong>敏感数据：</strong> AES-256-GCM 加密</li>
        <li><strong>HTTPS：</strong> 使用 Brotli/Gzip 压缩响应</li>
        <li><strong>大文件：</strong> 使用流式压缩，避免内存溢出</li>
        <li><strong>UUID：</strong> crypto.randomUUID() 比 uuid 库更快</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MethodCard from '@/components/MethodCard.vue'

const activeModule = ref('crypto')

// Crypto 示例
const hashExamples = [
  { code: "const hash = crypto.createHash('sha256')", result: '' },
  { code: "hash.update('Hello World')", result: '' },
  { code: "hash.digest('hex')", result: "→ 'a591a6...'" }
]

const hmacExamples = [
  { code: "const hmac = crypto.createHmac('sha256', 'secret-key')", result: '' },
  { code: "hmac.update('message')", result: '' },
  { code: "hmac.digest('hex')", result: "→ 带密钥的哈希值" }
]

const cipherExamples = [
  { code: "const key = crypto.randomBytes(32)", result: '→ 256位密钥' },
  { code: "const iv = crypto.randomBytes(16)", result: '→ 初始向量' },
  { code: "const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)", result: '' },
  { code: "let enc = cipher.update('data', 'utf8', 'hex')", result: '' },
  { code: "enc += cipher.final('hex')", result: '→ 加密完成' }
]

const decipherExamples = [
  { code: "const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)", result: '' },
  { code: "let dec = decipher.update(enc, 'hex', 'utf8')", result: '' },
  { code: "dec += decipher.final('utf8')", result: '→ 原始数据' }
]

const keyPairExamples = [
  { code: "const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {", result: '' },
  { code: "  modulusLength: 2048,", result: '' },
  { code: '})', result: '→ 生成密钥对' }
]

const publicEncryptExamples = [
  { code: "const encrypted = crypto.publicEncrypt(publicKey, buffer)", result: '→ 公钥加密' }
]

const privateDecryptExamples = [
  { code: "const decrypted = crypto.privateDecrypt(privateKey, encrypted)", result: '→ 私钥解密' }
]

const signExamples = [
  { code: "const signature = crypto.sign('sha256', data, privateKey)", result: '→ 数字签名' }
]

const verifyExamples = [
  { code: "const valid = crypto.verify('sha256', data, publicKey, signature)", result: '→ true/false' }
]

const randomBytesExamples = [
  { code: "crypto.randomBytes(16).toString('hex')", result: "→ 'a1b2c3d4e5f6...'" }
]

const randomUUIDExamples = [
  { code: "crypto.randomUUID()", result: "→ '550e8400-e29b-41d4-a716...'" }
]

const randomIntExamples = [
  { code: "crypto.randomInt(1, 100)", result: '→ 1-99 随机整数' }
]

const pbkdf2Examples = [
  { code: "crypto.pbkdf2Sync('password', salt, 100000, 64, 'sha512')", result: '→ 派生密钥' }
]

const scryptExamples = [
  { code: "crypto.scryptSync('password', salt, 64)", result: '→ 推荐用于密码' }
]

// Zlib 示例
const deflateExamples = [
  { code: "const compressed = zlib.deflateSync(buffer)", result: '→ 压缩数据' }
]

const inflateExamples = [
  { code: "const original = zlib.inflateSync(compressed)", result: '→ 原始数据' }
]

const gzipExamples = [
  { code: "const gzipped = zlib.gzipSync(buffer)", result: '→ Gzip 格式' },
  { code: "zlib.gzipSync(buffer, { level: 9 })", result: '→ 最高压缩率' }
]

const gunzipExamples = [
  { code: "const original = zlib.gunzipSync(gzipped)", result: '→ 原始数据' }
]

const brotliCompressExamples = [
  { code: "const compressed = zlib.brotliCompressSync(buffer)", result: '→ 最高压缩率' }
]

const brotliDecompressExamples = [
  { code: "const original = zlib.brotliDecompressSync(compressed)", result: '→ 原始数据' }
]

const createGzipExamples = [
  { code: "fs.createReadStream('file.txt')", result: '' },
  { code: "  .pipe(zlib.createGzip())", result: '' },
  { code: "  .pipe(fs.createWriteStream('file.txt.gz'))", result: '→ 压缩文件' }
]

const createGunzipExamples = [
  { code: "fs.createReadStream('file.txt.gz')", result: '' },
  { code: "  .pipe(zlib.createGunzip())", result: '' },
  { code: "  .pipe(fs.createWriteStream('file.txt'))", result: '→ 解压文件' }
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
  font-size: 2.2em;
  color: var(--primary);
}

.intro-box {
  background: rgba(0, 217, 255, 0.1);
  border-left: 4px solid var(--primary);
  padding: 15px 20px;
  margin-bottom: 30px;
  border-radius: 0 8px 8px 0;
}

/* 模块切换标签 */
.module-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.module-tabs button {
  flex: 1;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text-dim);
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s;
}

.module-tabs button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.module-tabs button.active {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(0, 217, 255, 0.1);
}

/* 功能卡片 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  margin-bottom: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 18px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-3px);
}

.feature-card.hash { border-color: #9b59b6; }
.feature-card.hmac { border-color: #e74c3c; }
.feature-card.aes { border-color: #3498db; }
.feature-card.rsa { border-color: #f39c12; }
.feature-card.sign { border-color: #2ecc71; }
.feature-card.random { border-color: #1abc9c; }
.feature-card.deflate { border-color: #3498db; }
.feature-card.gzip { border-color: #2ecc71; }
.feature-card.brotli { border-color: #e74c3c; }
.feature-card.stream { border-color: #9b59b6; }

.feature-card .icon {
  font-size: 1.8em;
  margin-bottom: 8px;
}

.feature-card h3 {
  color: var(--text);
  font-size: 0.95em;
}

.feature-card p {
  color: var(--text-dim);
  font-size: 0.75em;
  margin-top: 5px;
}

.section-title {
  font-size: 1.4em;
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
.hash-table,
.compare-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.hash-table h4,
.compare-table h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.hash-table table,
.compare-table table {
  width: 100%;
  border-collapse: collapse;
}

.hash-table th,
.hash-table td,
.compare-table th,
.compare-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.hash-table th,
.compare-table th {
  color: var(--primary);
}

.hash-table td:first-child,
.compare-table td:first-child {
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

.safe { color: #2ecc71 !important; }
.danger { color: #e74c3c !important; }

/* AES 模式列表 */
.aes-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.aes-table h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.mode-list {
  display: grid;
  gap: 10px;
}

.mode-item {
  font-size: 0.9em;
}

.mode-item code {
  color: var(--accent);
}

/* RSA 说明框 */
.rsa-box {
  background: rgba(52, 152, 219, 0.1);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.rsa-box h4 {
  color: #3498db;
  margin-bottom: 15px;
}

.rsa-box ul {
  list-style: none;
}

.rsa-box li {
  padding: 5px 0;
}

/* 密码存储框 */
.password-box {
  background: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.password-box h4 {
  color: #2ecc71;
  margin-bottom: 15px;
}

/* 选项框 */
.options-box {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.options-box h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.options-list {
  display: grid;
  gap: 8px;
  margin-bottom: 15px;
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
