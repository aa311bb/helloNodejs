<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>Process 进程</span>
      </div>
      <h1>⚙️ Process 进程模块</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>Process 是 Node.js 的全局对象，<strong>无需 require</strong>，可直接使用。它提供了当前 Node.js 进程的信息和控制能力，如命令行参数、环境变量、标准流、进程退出等。
    </div>

    <!-- 进程信息仪表板 -->
    <div class="dashboard">
      <div class="dash-card">
        <div class="icon">🔢</div>
        <div class="label">进程 ID</div>
        <div class="value">process.pid</div>
      </div>
      <div class="dash-card">
        <div class="icon">📌</div>
        <div class="label">平台</div>
        <div class="value">{{ platform }}</div>
      </div>
      <div class="dash-card">
        <div class="icon">📦</div>
        <div class="label">Node 版本</div>
        <div class="value">v18.x</div>
      </div>
      <div class="dash-card">
        <div class="icon">🏗️</div>
        <div class="label">架构</div>
        <div class="value">x64</div>
      </div>
      <div class="dash-card">
        <div class="icon">⏱️</div>
        <div class="label">运行时间</div>
        <div class="value">uptime()</div>
      </div>
      <div class="dash-card">
        <div class="icon">💾</div>
        <div class="label">内存</div>
        <div class="value">memoryUsage()</div>
      </div>
    </div>

    <!-- 命令行参数 -->
    <h2 class="section-title">🖥️ 命令行参数</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in argMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 环境变量 -->
    <h2 class="section-title">🌍 环境变量</h2>
    <div class="methods-grid">
      <MethodCard
        title="process.env"
        desc="获取/设置环境变量对象"
        :examples="envExamples"
      />
    </div>

    <div class="env-box">
      <h4>💡 常用环境变量</h4>
      <div class="env-list">
        <div class="env-item"><code>NODE_ENV</code> 运行环境</div>
        <div class="env-item"><code>PATH</code> 系统路径</div>
        <div class="env-item"><code>HOME</code> 用户主目录</div>
        <div class="env-item"><code>USER</code> 当前用户名</div>
        <div class="env-item"><code>PWD</code> 当前目录</div>
        <div class="env-item"><code>TZ</code> 时区</div>
      </div>
    </div>

    <!-- 目录操作 -->
    <h2 class="section-title">📁 目录操作</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in dirMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 进程信息 -->
    <h2 class="section-title">📊 进程信息</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in infoMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 资源使用 -->
    <h2 class="section-title">📈 资源使用</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in resourceMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 内存可视化 -->
    <div class="memory-visual">
      <h3>memoryUsage() 内存结构</h3>
      <div class="memory-diagram">
        <div class="mem-block rss">
          <div class="mem-label">RSS</div>
          <div class="mem-desc">常驻内存集</div>
        </div>
        <div class="mem-block heap">
          <div class="mem-label">Heap</div>
          <div class="mem-sub">
            <span class="total">Total</span>
            <span class="used">Used</span>
          </div>
        </div>
        <div class="mem-block external">
          <div class="mem-label">External</div>
          <div class="mem-desc">外部内存</div>
        </div>
      </div>
    </div>

    <!-- 事件循环 -->
    <h2 class="section-title">🔄 事件循环</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in loopMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 标准流 -->
    <h2 class="section-title">📡 标准流</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in streamMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 进程控制 -->
    <h2 class="section-title">🚦 进程控制</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in controlMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 常见退出码 -->
    <div class="exit-codes-box">
      <h4>📋 常见退出码</h4>
      <table class="exit-table">
        <thead>
          <tr>
            <th>码</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>0</td><td>正常退出</td></tr>
          <tr><td>1</td><td>未捕获的致命异常</td></tr>
          <tr><td>3</td><td>JavaScript 解析错误</td></tr>
          <tr><td>4</td><td>JavaScript 评估失败</td></tr>
          <tr><td>5</td><td>致命错误</td></tr>
          <tr><td>6</td><td>非函数异常处理</td></tr>
          <tr><td>7</td><td>异常处理失败</td></tr>
          <tr><td>9</td><td>无效参数</td></tr>
          <tr><td>128+</td><td>信号退出（如 SIGKILL = 137）</td></tr>
        </tbody>
      </table>
    </div>

    <!-- 进程事件 -->
    <h2 class="section-title">⚡ 进程事件</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in eventMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 信号列表 -->
    <div class="signals-box">
      <h4>📡 常见信号</h4>
      <div class="signal-list">
        <div class="signal-item"><code>SIGINT</code> 中断 (Ctrl+C)</div>
        <div class="signal-item"><code>SIGTERM</code> 终止请求</div>
        <div class="signal-item"><code>SIGKILL</code> 强制终止（无法捕获）</div>
        <div class="signal-item"><code>SIGHUP</code> 挂起/终端关闭</div>
        <div class="signal-item"><code>SIGUSR1/SIGUSR2</code> 用户自定义</div>
      </div>
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看实际输出：</p>
      <code>node core-examples/process-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>获取命令行参数：</strong> <code>const args = process.argv.slice(2)</code></li>
        <li><strong>判断环境：</strong> <code>process.env.NODE_ENV === 'production'</code></li>
        <li><strong>优雅退出：</strong> 监听 SIGINT/SIGTERM 事件，清理资源后再退出</li>
        <li><strong>内存监控：</strong> 定时调用 <code>process.memoryUsage()</code> 监控内存</li>
        <li><strong>错误处理：</strong> 始终监听 <code>uncaughtException</code> 和 <code>unhandledRejection</code></li>
        <li><strong>process.nextTick vs setTimeout：</strong> nextTick 更快，在当前阶段完成后立即执行</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import MethodCard from '@/components/MethodCard.vue'

const platform = typeof navigator !== 'undefined' ? navigator.platform : 'win32'

// 命令行参数
const argMethods = [
  {
    title: 'process.argv',
    desc: '获取命令行参数数组',
    examples: [
      { code: 'node app.js arg1 arg2', result: '' },
      { code: 'process.argv[0]', result: '→ Node.js 可执行文件路径' },
      { code: 'process.argv[1]', result: '→ 当前执行的脚本路径' },
      { code: 'process.argv[2]', result: '→ 第一个参数 arg1' }
    ]
  },
  {
    title: 'process.argv0',
    desc: '原始的 argv[0] 值（Node 可执行文件路径）',
    examples: [
      { code: 'process.argv0', result: '→ "/usr/local/bin/node"' }
    ]
  },
  {
    title: 'process.execPath',
    desc: 'Node.js 可执行文件的绝对路径',
    examples: [
      { code: 'process.execPath', result: '→ "C:\\Program Files\\nodejs\\node.exe"' }
    ]
  },
  {
    title: 'process.execArgv',
    desc: 'Node.js 特定的命令行选项',
    examples: [
      { code: 'node --harmony app.js', result: 'process.execArgv → ["--harmony"]' }
    ]
  }
]

// 环境变量
const envExamples = [
  { code: 'process.env.NODE_ENV', result: '→ "development" | "production"' },
  { code: 'process.env.PATH', result: '→ 系统PATH环境变量' },
  { code: 'process.env.MY_VAR = "test"', result: '→ 设置自定义环境变量' }
]

// 目录操作
const dirMethods = [
  {
    title: 'process.cwd()',
    desc: '获取当前工作目录',
    examples: [
      { code: 'process.cwd()', result: '→ "/home/user/project"' }
    ]
  },
  {
    title: 'process.chdir(path)',
    desc: '切换当前工作目录',
    examples: [
      { code: 'process.chdir("/tmp")', result: '→ 切换到 /tmp 目录' },
      { code: 'process.cwd()', result: '→ "/tmp"' }
    ]
  }
]

// 进程信息
const infoMethods = [
  { title: 'process.pid', desc: '当前进程的 PID', examples: [{ code: 'process.pid', result: '→ 12345' }] },
  { title: 'process.ppid', desc: '父进程的 PID', examples: [{ code: 'process.ppid', result: '→ 1000' }] },
  {
    title: 'process.title',
    desc: '获取/设置进程标题（在任务管理器中显示）',
    examples: [
      { code: 'process.title', result: '→ "node"' },
      { code: 'process.title = "MyApp"', result: '→ 设置进程名称' }
    ]
  },
  {
    title: 'process.platform',
    desc: '运行平台',
    examples: [{ code: 'process.platform', result: '→ "win32" | "linux" | "darwin"' }]
  },
  {
    title: 'process.arch',
    desc: 'CPU 架构',
    examples: [{ code: 'process.arch', result: '→ "x64" | "arm" | "arm64"' }]
  },
  {
    title: 'process.version',
    desc: 'Node.js 版本',
    examples: [{ code: 'process.version', result: '→ "v18.17.0"' }]
  },
  {
    title: 'process.versions',
    desc: 'Node.js 及其依赖的版本信息',
    examples: [{ code: 'process.versions', result: '→ { node, v8, uv, zlib, openssl, ... }' }]
  },
  {
    title: 'process.config',
    desc: 'Node.js 编译配置',
    examples: [{ code: 'process.config', result: '→ { target_defaults, variables }' }]
  }
]

// 资源使用
const resourceMethods = [
  {
    title: 'process.memoryUsage()',
    desc: '获取内存使用情况',
    examples: [{ code: 'process.memoryUsage()', result: '→ { rss, heapTotal, heapUsed, external }' }]
  },
  {
    title: 'process.cpuUsage()',
    desc: '获取 CPU 使用时间',
    examples: [
      { code: 'process.cpuUsage()', result: '→ { user: 12345, system: 6789 }' },
      { code: '// user: 用户态时间(微秒)', result: '' },
      { code: '// system: 内核态时间(微秒)', result: '' }
    ]
  },
  {
    title: 'process.uptime()',
    desc: 'Node.js 进程运行时间（秒）',
    examples: [{ code: 'process.uptime()', result: '→ 3600.5' }]
  },
  {
    title: 'process.hrtime()',
    desc: '高精度时间（纳秒级）',
    examples: [
      { code: 'process.hrtime()', result: '→ [秒, 纳秒]' },
      { code: 'const start = process.hrtime()', result: '' },
      { code: 'const diff = process.hrtime(start)', result: '→ 计算耗时' }
    ]
  }
]

// 事件循环
const loopMethods = [
  {
    title: 'process.nextTick(callback)',
    desc: '在当前操作完成后立即执行回调（优先于 Promise）',
    examples: [
      { code: 'console.log("start")', result: '' },
      { code: 'process.nextTick(() => {', result: '' },
      { code: '  console.log("nextTick")', result: '' },
      { code: '})', result: '' },
      { code: 'console.log("end")', result: '→ start → end → nextTick' }
    ]
  },
  {
    title: 'process.tickCallback()',
    desc: '运行微任务回调（通常不需要手动调用）',
    examples: [{ code: '// 内部使用', result: '' }]
  }
]

// 标准流
const streamMethods = [
  {
    title: 'process.stdin',
    desc: '标准输入流（可读流）',
    examples: [
      { code: 'process.stdin.on("data", chunk => {', result: '' },
      { code: '  console.log("输入:", chunk.toString())', result: '' },
      { code: '})', result: '' }
    ]
  },
  {
    title: 'process.stdout',
    desc: '标准输出流（可写流）',
    examples: [{ code: 'process.stdout.write("Hello\\n")', result: '→ 输出到控制台' }]
  },
  {
    title: 'process.stderr',
    desc: '标准错误流（可写流）',
    examples: [{ code: 'process.stderr.write("Error!\\n")', result: '→ 输出错误信息' }]
  }
]

// 进程控制
const controlMethods = [
  {
    title: 'process.exit([code])',
    desc: '退出进程',
    examples: [
      { code: 'process.exit(0)', result: '→ 正常退出' },
      { code: 'process.exit(1)', result: '→ 异常退出' }
    ]
  },
  {
    title: 'process.exitCode',
    desc: '获取/设置退出码',
    examples: [{ code: 'process.exitCode = 1', result: '→ 进程自然结束时使用此退出码' }]
  },
  {
    title: 'process.abort()',
    desc: '立即中止进程（生成核心转储）',
    examples: [{ code: 'process.abort()', result: '→ 强制终止，不执行任何回调' }]
  },
  {
    title: 'process.kill(pid[, signal])',
    desc: '向进程发送信号',
    examples: [
      { code: 'process.kill(pid, "SIGTERM")', result: '→ 终止进程' },
      { code: 'process.kill(pid, "SIGKILL")', result: '→ 强制终止' }
    ]
  }
]

// 进程事件
const eventMethods = [
  {
    title: 'process.on("exit", callback)',
    desc: '进程退出时触发（无法阻止退出）',
    examples: [
      { code: 'process.on("exit", code => {', result: '' },
      { code: '  console.log("退出码:", code)', result: '' },
      { code: '})', result: '' }
    ]
  },
  {
    title: 'process.on("uncaughtException")',
    desc: '捕获未处理的异常',
    examples: [
      { code: 'process.on("uncaughtException", err => {', result: '' },
      { code: '  console.error("未捕获异常:", err)', result: '' },
      { code: '})', result: '' }
    ]
  },
  {
    title: 'process.on("unhandledRejection")',
    desc: '捕获未处理的 Promise 拒绝',
    examples: [
      { code: 'process.on("unhandledRejection", (reason) => {', result: '' },
      { code: '  console.error("未处理的拒绝:", reason)', result: '' },
      { code: '})', result: '' }
    ]
  },
  {
    title: 'process.on("SIGINT")',
    desc: '捕获中断信号（Ctrl+C）',
    examples: [
      { code: 'process.on("SIGINT", () => {', result: '' },
      { code: '  console.log("收到 SIGINT")', result: '' },
      { code: '  process.exit(0)', result: '' },
      { code: '})', result: '' }
    ]
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

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.dash-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s;
}

.dash-card:hover {
  transform: translateY(-3px);
}

.dash-card .icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.dash-card .label {
  color: var(--text-dim);
  font-size: 0.85em;
  margin-bottom: 5px;
}

.dash-card .value {
  color: var(--primary);
  font-size: 0.95em;
  font-weight: bold;
  font-family: 'Courier New', monospace;
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

.env-box {
  background: rgba(255, 217, 61, 0.1);
  border: 1px solid var(--accent);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.env-box h4 {
  color: var(--accent);
  margin-bottom: 15px;
}

.env-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.env-item {
  font-size: 0.9em;
  color: var(--text-dim);
}

.env-item code {
  color: var(--accent);
}

.memory-visual {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
}

.memory-visual h3 {
  color: var(--primary);
  margin-bottom: 20px;
}

.memory-diagram {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.mem-block {
  padding: 20px 30px;
  border-radius: 8px;
  text-align: center;
  min-width: 120px;
}

.mem-block.rss {
  background: rgba(231, 76, 60, 0.3);
  border: 2px solid #e74c3c;
}

.mem-block.heap {
  background: rgba(52, 152, 219, 0.3);
  border: 2px solid #3498db;
}

.mem-block.external {
  background: rgba(46, 204, 113, 0.3);
  border: 2px solid #2ecc71;
}

.mem-label {
  font-weight: bold;
  font-size: 1.1em;
  color: var(--text);
}

.mem-desc {
  font-size: 0.85em;
  color: var(--text-dim);
  margin-top: 5px;
}

.mem-sub {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 0.85em;
}

.mem-sub .total { color: #3498db; }
.mem-sub .used { color: #e74c3c; }

.exit-codes-box {
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.exit-codes-box h4 {
  color: var(--secondary);
  margin-bottom: 15px;
}

.exit-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.exit-table th,
.exit-table td {
  padding: 10px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.exit-table th {
  background: rgba(255, 107, 107, 0.2);
  color: var(--secondary);
}

.exit-table td:first-child {
  color: var(--accent);
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.signals-box {
  background: rgba(0, 217, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.signals-box h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.signal-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.signal-item {
  font-size: 0.9em;
  color: var(--text-dim);
}

.signal-item code {
  color: var(--primary);
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
