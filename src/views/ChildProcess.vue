<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>Child Process</span>
      </div>
      <h1>👶 Child Process 子进程模块</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>child_process 模块用于创建子进程执行命令。通过它可以在 Node.js 中执行 shell 命令、运行其他程序、实现多进程并发。使用 <code>const { spawn, exec, fork } = require('child_process')</code> 引入。
    </div>

    <!-- 四种方法对比 -->
    <div class="compare-grid">
      <div class="compare-card spawn">
        <div class="card-icon">🚀</div>
        <h3>spawn</h3>
        <p class="desc">流式输出，适合长时间任务</p>
        <div class="features">
          <span>✓ 实时输出</span>
          <span>✓ 大数据量</span>
          <span>✓ 交互式</span>
        </div>
      </div>
      <div class="compare-card exec">
        <div class="card-icon">📦</div>
        <h3>exec</h3>
        <p class="desc">缓冲输出，适合简单命令</p>
        <div class="features">
          <span>✓ 一次性获取</span>
          <span>✓ Shell 语法</span>
          <span>✓ 方便简单</span>
        </div>
      </div>
      <div class="compare-card execfile">
        <div class="card-icon">📄</div>
        <h3>execFile</h3>
        <p class="desc">执行可执行文件</p>
        <div class="features">
          <span>✓ 更安全</span>
          <span>✓ 无 Shell</span>
          <span>✓ 性能更好</span>
        </div>
      </div>
      <div class="compare-card fork">
        <div class="card-icon">🔀</div>
        <h3>fork</h3>
        <p class="desc">创建 Node.js 子进程</p>
        <div class="features">
          <span>✓ IPC 通信</span>
          <span>✓ 消息传递</span>
          <span>✓ 多进程架构</span>
        </div>
      </div>
    </div>

    <!-- spawn -->
    <h2 class="section-title">🚀 spawn - 流式执行</h2>
    <div class="methods-grid">
      <MethodCard
        title="spawn(command[, args][, options])"
        desc="启动子进程执行命令，通过流获取输出"
        :examples="spawnExamples"
      />
    </div>

    <div class="code-block">
      <h4>📝 完整示例</h4>
      <pre><code>const { spawn } = require('child_process')

// 执行 ls -la 命令
const child = spawn('ls', ['-la'])

// 监听标准输出
child.stdout.on('data', (data) => {
  console.log(`输出: ${data}`)
})

// 监听错误输出
child.stderr.on('data', (data) => {
  console.error(`错误: ${data}`)
})

// 监听进程退出
child.on('close', (code) => {
  console.log(`子进程退出码: ${code}`)
})</code></pre>
    </div>

    <!-- exec -->
    <h2 class="section-title">📦 exec - 缓冲执行</h2>
    <div class="methods-grid">
      <MethodCard
        title="exec(command[, options][, callback])"
        desc="执行命令并缓冲输出，一次性返回结果"
        :examples="execExamples"
      />
    </div>

    <div class="code-block">
      <h4>📝 完整示例</h4>
      <pre><code>const { exec } = require('child_process')

// 执行命令，回调获取结果
exec('git status', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error}`)
    return
  }
  console.log(`输出: ${stdout}`)
  console.error(`错误: ${stderr}`)
})

// 使用 Promise
const util = require('util')
const execPromise = util.promisify(exec)

async function run() {
  const { stdout, stderr } = await execPromise('npm --version')
  console.log('npm 版本:', stdout)
}</code></pre>
    </div>

    <!-- execFile -->
    <h2 class="section-title">📄 execFile - 执行文件</h2>
    <div class="methods-grid">
      <MethodCard
        title="execFile(file[, args][, options][, callback])"
        desc="直接执行可执行文件，不经过 shell"
        :examples="execFileExamples"
      />
    </div>

    <div class="code-block">
      <h4>📝 完整示例</h4>
      <pre><code>const { execFile } = require('child_process')

// 执行 node 获取版本
execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) throw error
  console.log('Node 版本:', stdout)
})

// 执行 Python 脚本
execFile('python', ['script.py', 'arg1', 'arg2'], (err, stdout) => {
  console.log(stdout)
})</code></pre>
    </div>

    <!-- fork -->
    <h2 class="section-title">🔀 fork - Node.js 子进程</h2>
    <div class="methods-grid">
      <MethodCard
        title="fork(modulePath[, args][, options])"
        desc="创建 Node.js 子进程，支持 IPC 通信"
        :examples="forkExamples"
      />
    </div>

    <div class="code-block">
      <h4>📝 父进程 parent.js</h4>
      <pre><code>const { fork } = require('child_process')

// 创建子进程
const child = fork('./child.js')

// 发送消息给子进程
child.send({ type: 'task', data: 'Hello from parent' })

// 接收子进程消息
child.on('message', (msg) => {
  console.log('来自子进程:', msg)
})

// 子进程退出
child.on('exit', (code) => {
  console.log('子进程退出:', code)
})</code></pre>
    </div>

    <div class="code-block">
      <h4>📝 子进程 child.js</h4>
      <pre><code>// 接收父进程消息
process.on('message', (msg) => {
  console.log('来自父进程:', msg)

  // 处理任务
  const result = doWork(msg.data)

  // 发送结果给父进程
  process.send({ type: 'result', data: result })
})

function doWork(data) {
  return `处理完成: ${data}`
}</code></pre>
    </div>

    <!-- 同步版本 -->
    <h2 class="section-title">⏱️ 同步版本</h2>
    <div class="methods-grid">
      <MethodCard
        title="execSync(command[, options])"
        desc="同步执行命令，阻塞直到完成"
        :examples="syncExamples"
      />
      <MethodCard
        title="execFileSync(file[, args][, options])"
        desc="同步执行可执行文件"
        :examples="execFileSyncExamples"
      />
      <MethodCard
        title="spawnSync(command[, args][, options])"
        desc="同步启动子进程"
        :examples="spawnSyncExamples"
      />
    </div>

    <!-- Options -->
    <h2 class="section-title">⚙️ Options 配置</h2>
    <div class="options-table">
      <table>
        <thead>
          <tr>
            <th>选项</th>
            <th>类型</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>cwd</code></td>
            <td>string</td>
            <td>子进程的工作目录</td>
          </tr>
          <tr>
            <td><code>env</code></td>
            <td>object</td>
            <td>环境变量（默认 process.env）</td>
          </tr>
          <tr>
            <td><code>encoding</code></td>
            <td>string</td>
            <td>字符编码（默认 'utf8'）</td>
          </tr>
          <tr>
            <td><code>timeout</code></td>
            <td>number</td>
            <td>超时时间（毫秒）</td>
          </tr>
          <tr>
            <td><code>maxBuffer</code></td>
            <td>number</td>
            <td>最大缓冲区大小（exec 默认 200KB）</td>
          </tr>
          <tr>
            <td><code>shell</code></td>
            <td>boolean/string</td>
            <td>是否使用 shell 执行</td>
          </tr>
          <tr>
            <td><code>detached</code></td>
            <td>boolean</td>
            <td>子进程是否独立于父进程</td>
          </tr>
          <tr>
            <td><code>stdio</code></td>
            <td>array/string</td>
            <td>标准流配置</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- stdio 配置 -->
    <h2 class="section-title">📡 stdio 配置</h2>
    <div class="methods-grid">
      <MethodCard
        title="stdio 选项"
        desc="配置子进程的标准输入/输出/错误流"
        :examples="stdioExamples"
      />
    </div>

    <div class="stdio-visual">
      <div class="stdio-item">
        <span class="index">0</span>
        <span class="name">stdin</span>
        <span class="desc">标准输入</span>
      </div>
      <div class="stdio-item">
        <span class="index">1</span>
        <span class="name">stdout</span>
        <span class="desc">标准输出</span>
      </div>
      <div class="stdio-item">
        <span class="index">2</span>
        <span class="name">stderr</span>
        <span class="desc">标准错误</span>
      </div>
    </div>

    <!-- 子进程事件 -->
    <h2 class="section-title">⚡ 子进程事件</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="event in eventMethods"
        :key="event.title"
        :title="event.title"
        :desc="event.desc"
        :examples="event.examples"
      />
    </div>

    <!-- 子进程方法 -->
    <h2 class="section-title">🔧 子进程方法</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in childMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看实际输出：</p>
      <code>node core-examples/child_process-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>选择方法：</strong> 简单命令用 exec，大数据/实时用 spawn，Node 子进程用 fork</li>
        <li><strong>避免 Shell 注入：</strong> execFile 比 exec 更安全，不经过 shell 解析</li>
        <li><strong>Promise 化：</strong> <code>const execAsync = util.promisify(exec)</code></li>
        <li><strong>继承 stdio：</strong> <code>spawn('npm', ['test'], { stdio: 'inherit' })</code></li>
        <li><strong>超时控制：</strong> 设置 timeout 选项，防止子进程卡死</li>
        <li><strong>进程管理：</strong> 使用 child.kill() 终止子进程</li>
        <li><strong>错误处理：</strong> 始终监听 'error' 事件处理异常</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import MethodCard from '@/components/MethodCard.vue'

const spawnExamples = [
  { code: "spawn('ls', ['-la'])", result: '→ ChildProcess 实例' },
  { code: "spawn('npm', ['install'])", result: '→ 实时输出安装进度' },
  { code: "spawn('node', ['app.js'], { cwd: './server' })", result: '→ 指定工作目录' }
]

const execExamples = [
  { code: "exec('ls -la | grep .js', callback)", result: '→ 支持 shell 管道语法' },
  { code: "exec('git status', (err, stdout) => {})", result: '→ 回调获取结果' },
  { code: "exec('npm test', { timeout: 30000 })", result: '→ 设置 30 秒超时' }
]

const execFileExamples = [
  { code: 'execFile("node", ["--version"])', result: '→ 获取 Node 版本' },
  { code: 'execFile("python", ["script.py"])', result: '→ 执行 Python 脚本' },
  { code: 'execFile("./build.sh")', result: '→ 执行 shell 脚本' }
]

const forkExamples = [
  { code: "fork('./worker.js')", result: '→ 创建 Node.js 子进程' },
  { code: "fork('./server.js', { silent: true })", result: '→ 静默模式' },
  { code: "child.send({ data: 'hello' })", result: '→ IPC 发送消息' }
]

const syncExamples = [
  { code: "execSync('npm --version')", result: '→ 同步获取 npm 版本' },
  { code: "execSync('git status', { encoding: 'utf-8' })", result: '→ 返回字符串' }
]

const execFileSyncExamples = [
  { code: 'execFileSync("node", ["--version"])', result: '→ Buffer 或字符串' }
]

const spawnSyncExamples = [
  { code: 'spawnSync("ls", ["-la"])', result: '→ { pid, output, stdout, stderr, status }' }
]

const stdioExamples = [
  { code: "stdio: 'pipe'", result: '→ 默认，创建管道' },
  { code: "stdio: 'inherit'", result: '→ 继承父进程 stdio' },
  { code: "stdio: 'ignore'", result: '→ 忽略 /dev/null' },
  { code: "stdio: ['pipe', 'inherit', 'pipe']", result: '→ 分别配置 stdin/stdout/stderr' }
]

const eventMethods = [
  {
    title: 'child.on("close", callback)',
    desc: '子进程关闭时触发',
    examples: [{ code: 'child.on("close", (code, signal) => {})', result: '→ code: 退出码, signal: 信号' }]
  },
  {
    title: 'child.on("exit", callback)',
    desc: '子进程退出时触发',
    examples: [{ code: 'child.on("exit", (code, signal) => {})', result: '→ 在 close 之前触发' }]
  },
  {
    title: 'child.on("error", callback)',
    desc: '子进程出错时触发',
    examples: [{ code: 'child.on("error", (err) => {})', result: '→ 如命令不存在等错误' }]
  },
  {
    title: 'child.on("message", callback)',
    desc: '收到子进程消息（仅 fork）',
    examples: [{ code: 'child.on("message", (msg) => {})', result: '→ IPC 通信' }]
  },
  {
    title: 'child.on("disconnect", callback)',
    desc: 'IPC 连接断开（仅 fork）',
    examples: [{ code: 'child.on("disconnect", () => {})', result: '→ 调用 disconnect() 后触发' }]
  },
  {
    title: 'child.stdout.on("data", callback)',
    desc: '标准输出数据',
    examples: [{ code: 'child.stdout.on("data", data => {})', result: '→ Buffer 或字符串' }]
  },
  {
    title: 'child.stderr.on("data", callback)',
    desc: '标准错误数据',
    examples: [{ code: 'child.stderr.on("data", data => {})', result: '→ Buffer 或字符串' }]
  },
  {
    title: 'child.stdin.write(data)',
    desc: '写入标准输入',
    examples: [{ code: 'child.stdin.write("input data\\n")', result: '→ 向子进程发送输入' }]
  }
]

const childMethods = [
  {
    title: 'child.kill([signal])',
    desc: '终止子进程',
    examples: [
      { code: 'child.kill()', result: '→ 发送 SIGTERM' },
      { code: 'child.kill("SIGKILL")', result: '→ 强制终止' }
    ]
  },
  {
    title: 'child.send(message)',
    desc: '发送消息给子进程（仅 fork）',
    examples: [{ code: 'child.send({ cmd: "start", data: {} })', result: '→ IPC 消息' }]
  },
  {
    title: 'child.disconnect()',
    desc: '断开 IPC 连接（仅 fork）',
    examples: [{ code: 'child.disconnect()', result: '→ 关闭父子进程通信' }]
  },
  {
    title: 'child.unref()',
    desc: '允许父进程独立退出',
    examples: [{ code: 'child.unref()', result: '→ 父进程可以不等子进程结束' }]
  },
  {
    title: 'child.ref()',
    desc: '不允许父进程独立退出',
    examples: [{ code: 'child.ref()', result: '→ 恢复默认行为' }]
  },
  {
    title: 'child.pid',
    desc: '子进程 PID',
    examples: [{ code: 'child.pid', result: '→ 12345' }]
  }
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

/* 四种方法对比 */
.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.compare-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.compare-card:hover {
  transform: translateY(-5px);
}

.compare-card.spawn { border-color: #2ecc71; }
.compare-card.spawn:hover { box-shadow: 0 10px 30px rgba(46, 204, 113, 0.2); }

.compare-card.exec { border-color: #3498db; }
.compare-card.exec:hover { box-shadow: 0 10px 30px rgba(52, 152, 219, 0.2); }

.compare-card.execfile { border-color: #9b59b6; }
.compare-card.execfile:hover { box-shadow: 0 10px 30px rgba(155, 89, 182, 0.2); }

.compare-card.fork { border-color: #e74c3c; }
.compare-card.fork:hover { box-shadow: 0 10px 30px rgba(231, 76, 60, 0.2); }

.card-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.compare-card h3 {
  color: var(--text);
  margin-bottom: 8px;
}

.compare-card .desc {
  color: var(--text-dim);
  font-size: 0.9em;
  margin-bottom: 15px;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.features span {
  font-size: 0.8em;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  color: var(--text-dim);
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

/* 代码块 */
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

/* Options 表格 */
.options-table {
  overflow-x: auto;
  margin-bottom: 30px;
}

.options-table table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.options-table th,
.options-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.options-table th {
  background: rgba(0, 217, 255, 0.2);
  color: var(--primary);
}

.options-table td:first-child {
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

/* stdio 可视化 */
.stdio-visual {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
}

.stdio-item {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 15px 25px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stdio-item .index {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--primary);
}

.stdio-item .name {
  font-family: 'Courier New', monospace;
  color: var(--accent);
}

.stdio-item .desc {
  font-size: 0.85em;
  color: var(--text-dim);
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
