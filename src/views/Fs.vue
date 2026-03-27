<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>FS 文件系统</span>
      </div>
      <h1>📄 FS 文件系统模块</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>FS 模块提供文件系统操作功能，包括读写文件、创建删除目录、文件监听等。支持同步、异步回调和 Promise 三种 API 风格。使用 <code>const fs = require('fs')</code> 或 <code>import fs from 'fs'</code> 引入。
    </div>

    <!-- 核心功能 -->
    <div class="feature-grid">
      <div class="feature-card read">
        <div class="icon">📖</div>
        <h3>readFile</h3>
        <p>读取文件</p>
      </div>
      <div class="feature-card write">
        <div class="icon">✏️</div>
        <h3>writeFile</h3>
        <p>写入文件</p>
      </div>
      <div class="feature-card dir">
        <div class="icon">📁</div>
        <h3>mkdir/readdir</h3>
        <p>目录操作</p>
      </div>
      <div class="feature-card stat">
        <div class="icon">📊</div>
        <h3>stat</h3>
        <p>文件信息</p>
      </div>
      <div class="feature-card stream">
        <div class="icon">🌊</div>
        <h3>Stream</h3>
        <p>流式读写</p>
      </div>
      <div class="feature-card watch">
        <div class="icon">👁️</div>
        <h3>watch</h3>
        <p>文件监听</p>
      </div>
    </div>

    <!-- API 风格 -->
    <h2 class="section-title">📚 三种 API 风格</h2>
    <div class="api-style-grid">
      <div class="api-card sync">
        <h4>同步 API</h4>
        <code>fs.readFileSync(path, encoding)</code>
        <p>阻塞执行，简单直接</p>
      </div>
      <div class="api-card callback">
        <h4>异步回调</h4>
        <code>fs.readFile(path, encoding, callback)</code>
        <p>非阻塞，回调处理结果</p>
      </div>
      <div class="api-card promise">
        <h4>Promise API</h4>
        <code>fs.promises.readFile(path, encoding)</code>
        <p>推荐使用，支持 async/await</p>
      </div>
    </div>

    <!-- 读取文件 -->
    <h2 class="section-title">📖 读取文件</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.readFileSync(path[, options])"
        desc="同步读取文件内容"
        :examples="readSyncExamples"
      />
      <MethodCard
        title="fs.readFile(path[, options], callback)"
        desc="异步回调读取文件"
        :examples="readCallbackExamples"
      />
      <MethodCard
        title="fs.promises.readFile(path[, options])"
        desc="Promise 方式读取（推荐）"
        :examples="readPromiseExamples"
      />
    </div>

    <!-- 写入文件 -->
    <h2 class="section-title">✏️ 写入文件</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.writeFileSync(path, data[, options])"
        desc="同步写入文件（覆盖）"
        :examples="writeSyncExamples"
      />
      <MethodCard
        title="fs.appendFileSync(path, data[, options])"
        desc="同步追加内容"
        :examples="appendExamples"
      />
    </div>

    <div class="code-block">
      <h4>📝 写入 flags 说明</h4>
      <pre><code>// 常用 flags:
// 'w'   - 写入（覆盖），文件不存在则创建
// 'wx'  - 写入，文件存在则失败
// 'w+'  - 读写（覆盖）
// 'a'   - 追加，文件不存在则创建
// 'a+'  - 读写追加
// 'r'   - 只读
// 'r+'  - 读写

fs.writeFileSync('file.txt', 'content', { flag: 'a' })</code></pre>
    </div>

    <!-- 文件信息 -->
    <h2 class="section-title">📊 文件信息 stat</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.statSync(path)"
        desc="获取文件/目录信息"
        :examples="statExamples"
      />
    </div>

    <div class="stat-table">
      <h4>📋 Stats 对象常用属性/方法</h4>
      <table>
        <thead>
          <tr><th>属性/方法</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>isFile()</code></td><td>是否为文件</td></tr>
          <tr><td><code>isDirectory()</code></td><td>是否为目录</td></tr>
          <tr><td><code>size</code></td><td>文件大小（字节）</td></tr>
          <tr><td><code>birthtime</code></td><td>创建时间</td></tr>
          <tr><td><code>mtime</code></td><td>修改时间</td></tr>
          <tr><td><code>atime</code></td><td>访问时间</td></tr>
          <tr><td><code>ctime</code></td><td>状态改变时间</td></tr>
          <tr><td><code>mode</code></td><td>文件权限</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 目录操作 -->
    <h2 class="section-title">📁 目录操作</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.mkdirSync(path[, options])"
        desc="创建目录"
        :examples="mkdirExamples"
      />
      <MethodCard
        title="fs.readdirSync(path[, options])"
        desc="读取目录内容"
        :examples="readdirExamples"
      />
      <MethodCard
        title="fs.rmdirSync(path)"
        desc="删除空目录"
        :examples="rmdirExamples"
      />
      <MethodCard
        title="fs.rmSync(path[, options])"
        desc="删除文件或目录（Node 14.14+）"
        :examples="rmExamples"
      />
    </div>

    <!-- 删除操作 -->
    <h2 class="section-title">🗑️ 删除操作</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.unlinkSync(path)"
        desc="删除文件"
        :examples="unlinkExamples"
      />
      <MethodCard
        title="fs.rmSync(path, { recursive: true })"
        desc="递归删除目录"
        :examples="rmRecursiveExamples"
      />
    </div>

    <!-- 复制和移动 -->
    <h2 class="section-title">📋 复制与移动</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.copyFileSync(src, dest[, mode])"
        desc="复制文件"
        :examples="copyExamples"
      />
      <MethodCard
        title="fs.cpSync(src, dest[, options])"
        desc="复制目录（Node 16.7+）"
        :examples="cpDirExamples"
      />
      <MethodCard
        title="fs.renameSync(oldPath, newPath)"
        desc="重命名/移动文件"
        :examples="renameExamples"
      />
    </div>

    <!-- 检查文件 -->
    <h2 class="section-title">🔍 检查文件是否存在</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.existsSync(path)"
        desc="检查文件/目录是否存在"
        :examples="existsExamples"
      />
      <MethodCard
        title="fs.accessSync(path[, mode])"
        desc="检查文件权限"
        :examples="accessExamples"
      />
    </div>

    <div class="access-table">
      <h4>📋 access 常量</h4>
      <div class="constants-list">
        <div class="constant-item"><code>fs.constants.F_OK</code> 文件存在</div>
        <div class="constant-item"><code>fs.constants.R_OK</code> 可读</div>
        <div class="constant-item"><code>fs.constants.W_OK</code> 可写</div>
        <div class="constant-item"><code>fs.constants.X_OK</code> 可执行</div>
      </div>
    </div>

    <!-- 流式读写 -->
    <h2 class="section-title">🌊 流式读写（大文件推荐）</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.createReadStream(path[, options])"
        desc="创建可读流"
        :examples="createReadStreamExamples"
      />
      <MethodCard
        title="fs.createWriteStream(path[, options])"
        desc="创建可写流"
        :examples="createWriteStreamExamples"
      />
    </div>

    <div class="code-block">
      <h4>📝 管道操作 - 复制大文件</h4>
      <pre><code>const rs = fs.createReadStream('source.txt')
const ws = fs.createWriteStream('dest.txt')

rs.pipe(ws)
  .on('finish', () => console.log('复制完成'))
  .on('error', err => console.error(err))</code></pre>
    </div>

    <!-- 文件监听 -->
    <h2 class="section-title">👁️ 文件监听</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.watch(filename[, options], listener)"
        desc="监听文件/目录变化"
        :examples="watchExamples"
      />
      <MethodCard
        title="fs.watchFile(filename[, options], listener)"
        desc="轮询监听文件变化"
        :examples="watchFileExamples"
      />
    </div>

    <!-- 文件权限 -->
    <h2 class="section-title">🔐 文件权限</h2>
    <div class="methods-grid">
      <MethodCard
        title="fs.chmodSync(path, mode)"
        desc="修改文件权限"
        :examples="chmodExamples"
      />
    </div>

    <div class="chmod-table">
      <h4>📋 常用权限值（八进制）</h4>
      <table>
        <thead>
          <tr><th>值</th><th>符号</th><th>说明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>0o644</code></td><td>rw-r--r--</td><td>普通文件（所有者读写，其他人只读）</td></tr>
          <tr><td><code>0o755</code></td><td>rwxr-xr-x</td><td>可执行文件/目录</td></tr>
          <tr><td><code>0o777</code></td><td>rwxrwxrwx</td><td>全部权限</td></tr>
          <tr><td><code>0o600</code></td><td>rw-------</td><td>仅所有者可读写</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 实用示例 -->
    <h2 class="section-title">💡 实用示例</h2>
    <div class="code-block">
      <h4>递归创建目录并写入文件</h4>
      <pre><code>fs.mkdirSync('a/b/c', { recursive: true })
fs.writeFileSync('a/b/c/file.txt', 'content')</code></pre>
    </div>

    <div class="code-block">
      <h4>读取 JSON 配置文件</h4>
      <pre><code>const config = JSON.parse(
  fs.readFileSync('config.json', 'utf8')
)</code></pre>
    </div>

    <div class="code-block">
      <h4>遍历目录所有文件</h4>
      <pre><code>function walkDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      walkDir(fullPath)  // 递归
    } else {
      console.log(fullPath)
    }
  }
}</code></pre>
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看实际输出：</p>
      <code>node examples/fs-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>推荐 Promise API：</strong> <code>const { promises } = require('fs')</code></li>
        <li><strong>大文件用流：</strong> 使用 <code>createReadStream</code> / <code>createWriteStream</code></li>
        <li><strong>递归创建目录：</strong> <code>fs.mkdirSync(path, { recursive: true })</code></li>
        <li><strong>递归删除目录：</strong> <code>fs.rmSync(path, { recursive: true, force: true })</code></li>
        <li><strong>检查存在性：</strong> <code>fs.existsSync()</code> 虽然简单，但存在竞态条件</li>
        <li><strong>复制目录：</strong> <code>fs.cpSync(src, dest, { recursive: true })</code></li>
        <li><strong>路径拼接：</strong> 配合 <code>path.join()</code> 确保跨平台兼容</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import MethodCard from '@/components/MethodCard.vue'

// 读取文件示例
const readSyncExamples = [
  { code: "const fs = require('fs')", result: '' },
  { code: "const data = fs.readFileSync('file.txt', 'utf8')", result: '→ 文件内容字符串' },
  { code: "const buffer = fs.readFileSync('file.txt')", result: '→ Buffer 对象' }
]

const readCallbackExamples = [
  { code: "fs.readFile('file.txt', 'utf8', (err, data) => {", result: '' },
  { code: "  if (err) throw err", result: '' },
  { code: "  console.log(data)", result: '' },
  { code: '})', result: '' }
]

const readPromiseExamples = [
  { code: "const fs = require('fs/promises')", result: '' },
  { code: "const data = await fs.readFile('file.txt', 'utf8')", result: '→ 推荐' }
]

// 写入文件示例
const writeSyncExamples = [
  { code: "fs.writeFileSync('file.txt', 'Hello World')", result: '→ 覆盖写入' },
  { code: "fs.writeFileSync('file.txt', 'content', { flag: 'a' })", result: '→ 追加' }
]

const appendExamples = [
  { code: "fs.appendFileSync('file.txt', 'New Line')", result: '→ 追加内容' },
  { code: "fs.appendFileSync('log.txt', date + '\\n')", result: '→ 日志记录' }
]

// stat 示例
const statExamples = [
  { code: "const stats = fs.statSync('file.txt')", result: '' },
  { code: "stats.isFile()", result: '→ true' },
  { code: "stats.isDirectory()", result: '→ false' },
  { code: "stats.size", result: '→ 1024 (bytes)' },
  { code: "stats.mtime", result: '→ 修改时间 Date 对象' }
]

// 目录操作示例
const mkdirExamples = [
  { code: "fs.mkdirSync('dir')", result: '→ 创建单层目录' },
  { code: "fs.mkdirSync('a/b/c', { recursive: true })", result: '→ 递归创建多层' }
]

const readdirExamples = [
  { code: "const files = fs.readdirSync('./')", result: '→ 文件名数组' },
  { code: "fs.readdirSync('./', { withFileTypes: true })", result: '→ Dirent 对象数组' }
]

const rmdirExamples = [
  { code: "fs.rmdirSync('empty-dir')", result: '→ 仅能删除空目录' }
]

const rmExamples = [
  { code: "fs.rmSync('file.txt')", result: '→ 删除文件' },
  { code: "fs.rmSync('dir', { recursive: true })", result: '→ 删除目录及内容' },
  { code: "fs.rmSync('dir', { recursive: true, force: true })", result: '→ 忽略不存在错误' }
]

// 删除操作示例
const unlinkExamples = [
  { code: "fs.unlinkSync('file.txt')", result: '→ 删除文件' },
  { code: "await fs.promises.unlink('file.txt')", result: '→ Promise 版本' }
]

const rmRecursiveExamples = [
  { code: "fs.rmSync('my-dir', {", result: '' },
  { code: "  recursive: true,", result: '→ 递归删除' },
  { code: "  force: true", result: '→ 不报错不存在' },
  { code: '})', result: '' }
]

// 复制移动示例
const copyExamples = [
  { code: "fs.copyFileSync('src.txt', 'dest.txt')", result: '→ 复制文件' },
  { code: "fs.copyFileSync('a.txt', 'b.txt', fs.constants.COPYFILE_EXCL)", result: '→ 目标存在则失败' }
]

const cpDirExamples = [
  { code: "fs.cpSync('src-dir', 'dest-dir', {", result: '' },
  { code: "  recursive: true", result: '' },
  { code: '})', result: '→ 复制整个目录' }
]

const renameExamples = [
  { code: "fs.renameSync('old.txt', 'new.txt')", result: '→ 重命名' },
  { code: "fs.renameSync('file.txt', 'dir/file.txt')", result: '→ 移动文件' }
]

// 检查文件示例
const existsExamples = [
  { code: "fs.existsSync('file.txt')", result: '→ true / false' },
  { code: "fs.existsSync('./dir')", result: '→ 检查目录是否存在' }
]

const accessExamples = [
  { code: "fs.accessSync('file.txt', fs.constants.R_OK)", result: '→ 可读则通过' },
  { code: "fs.accessSync('file.txt', fs.constants.W_OK)", result: '→ 可写则通过' },
  { code: "fs.accessSync('file', fs.constants.F_OK | fs.constants.R_OK)", result: '→ 存在且可读' }
]

// 流示例
const createReadStreamExamples = [
  { code: "const rs = fs.createReadStream('big.txt', {", result: '' },
  { code: "  encoding: 'utf8',", result: '' },
  { code: "  highWaterMark: 64 * 1024", result: '→ 64KB chunks' },
  { code: '})', result: '' },
  { code: "rs.on('data', chunk => console.log(chunk))", result: '' },
  { code: "rs.on('end', () => console.log('Done'))", result: '' }
]

const createWriteStreamExamples = [
  { code: "const ws = fs.createWriteStream('output.txt')", result: '' },
  { code: "ws.write('Line 1\\n')", result: '' },
  { code: "ws.write('Line 2\\n')", result: '' },
  { code: "ws.end()", result: '→ 关闭流' }
]

// 监听示例
const watchExamples = [
  { code: "fs.watch('file.txt', (eventType, filename) => {", result: '' },
  { code: "  console.log(eventType, filename)", result: '→ change/rename' },
  { code: '})', result: '' }
]

const watchFileExamples = [
  { code: "fs.watchFile('file.txt', (curr, prev) => {", result: '' },
  { code: "  if (curr.mtime !== prev.mtime) {", result: '' },
  { code: "    console.log('文件被修改')", result: '' },
  { code: "  }", result: '' },
  { code: '})', result: '' }
]

// 权限示例
const chmodExamples = [
  { code: "fs.chmodSync('script.sh', 0o755)", result: '→ 设为可执行' },
  { code: "fs.chmodSync('secret.txt', 0o600)", result: '→ 仅所有者可读写' }
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-3px);
}

.feature-card.read { border-color: #3498db; }
.feature-card.write { border-color: #2ecc71; }
.feature-card.dir { border-color: #f39c12; }
.feature-card.stat { border-color: #9b59b6; }
.feature-card.stream { border-color: #1abc9c; }
.feature-card.watch { border-color: #e74c3c; }

.feature-card .icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.feature-card h3 {
  color: var(--text);
  font-family: 'Courier New', monospace;
  font-size: 0.95em;
}

.feature-card p {
  color: var(--text-dim);
  font-size: 0.8em;
  margin-top: 5px;
}

/* API 风格卡片 */
.api-style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.api-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.api-card.sync { border-left: 4px solid #e74c3c; }
.api-card.callback { border-left: 4px solid #f39c12; }
.api-card.promise { border-left: 4px solid #2ecc71; }

.api-card h4 {
  color: var(--primary);
  margin-bottom: 10px;
}

.api-card code {
  display: block;
  font-size: 0.85em;
  color: var(--text);
  margin-bottom: 10px;
  word-break: break-all;
}

.api-card p {
  color: var(--text-dim);
  font-size: 0.85em;
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

/* 表格样式 */
.stat-table,
.chmod-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.stat-table h4,
.chmod-table h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.stat-table table,
.chmod-table table {
  width: 100%;
  border-collapse: collapse;
}

.stat-table th,
.stat-table td,
.chmod-table th,
.chmod-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-table th,
.chmod-table th {
  color: var(--primary);
}

.stat-table td:first-child,
.chmod-table td:first-child {
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

/* access 常量 */
.access-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.access-table h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.constants-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.constant-item {
  font-size: 0.9em;
}

.constant-item code {
  color: var(--accent);
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
