<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>OS 系统</span>
      </div>
      <h1>💻 OS 系统模块</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>OS 模块是 Node.js 内置模块，用于获取操作系统相关信息。使用
      <code>const os = require('os')</code> 引入。常用于系统监控、跨平台兼容性处理等场景。
    </div>

    <!-- 系统信息仪表板 -->
    <div class="dashboard">
      <div class="dash-card">
        <div class="icon">💻</div>
        <div class="label">操作系统</div>
        <div class="value">Windows</div>
      </div>
      <div class="dash-card">
        <div class="icon">🔧</div>
        <div class="label">平台</div>
        <div class="value">win32</div>
      </div>
      <div class="dash-card">
        <div class="icon">⚡</div>
        <div class="label">CPU架构</div>
        <div class="value">x64</div>
      </div>
      <div class="dash-card">
        <div class="icon">🔲</div>
        <div class="label">CPU核心</div>
        <div class="value">8核</div>
      </div>
      <div class="dash-card">
        <div class="icon">💾</div>
        <div class="label">总内存</div>
        <div class="value">16GB</div>
      </div>
      <div class="dash-card">
        <div class="icon">⏱️</div>
        <div class="label">运行时间</div>
        <div class="value">24h+</div>
      </div>
    </div>

    <!-- 系统基本信息 -->
    <h2 class="section-title">🖥️ 系统基本信息</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in systemMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- CPU信息 -->
    <h2 class="section-title">⚡ CPU 信息</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in cpuMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 内存信息 -->
    <h2 class="section-title">💾 内存信息</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in memoryMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 内存可视化 -->
    <div class="memory-visual">
      <h3>内存使用示意</h3>
      <div class="memory-bar">
        <div class="memory-used" :style="{ width: '65%' }">已用 65%</div>
        <div class="memory-free" :style="{ width: '35%' }">可用 35%</div>
      </div>
      <div class="memory-legend">
        <div class="legend-item">
          <span class="color used"></span>
          <span>已使用</span>
        </div>
        <div class="legend-item">
          <span class="color free"></span>
          <span>可用</span>
        </div>
      </div>
    </div>

    <!-- 用户和目录 -->
    <h2 class="section-title">👤 用户与目录</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in userMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 网络信息 -->
    <h2 class="section-title">🌐 网络信息</h2>
    <div class="methods-grid" style="grid-template-columns: 1fr;">
      <MethodCard
        title="os.networkInterfaces()"
        desc="返回网络接口信息（包含IP地址）"
        :examples="[
          { code: 'os.networkInterfaces()', result: '→ { 以太网: [{ address, netmask, family, mac, internal }], ... }' }
        ]"
      />
    </div>

    <!-- 网络接口示意 -->
    <div class="network-cards">
      <div class="network-card">
        <h4>📡 以太网</h4>
        <div class="ip-row"><span class="label">IPv4</span><span class="value">192.168.1.100</span></div>
        <div class="ip-row"><span class="label">IPv6</span><span class="value">fe80::1234:5678</span></div>
        <div class="ip-row"><span class="label">MAC</span><span class="value">00:1a:2b:3c:4d:5e</span></div>
      </div>
      <div class="network-card">
        <h4>📶 Wi-Fi</h4>
        <div class="ip-row"><span class="label">IPv4</span><span class="value">192.168.1.101</span></div>
        <div class="ip-row"><span class="label">IPv6</span><span class="value">fe80::abcd:ef12</span></div>
        <div class="ip-row"><span class="label">MAC</span><span class="value">aa:bb:cc:dd:ee:ff</span></div>
      </div>
      <div class="network-card">
        <h4>🔄 Loopback</h4>
        <div class="ip-row"><span class="label">IPv4</span><span class="value">127.0.0.1</span></div>
        <div class="ip-row"><span class="label">IPv6</span><span class="value">::1</span></div>
        <div class="ip-row"><span class="label">Internal</span><span class="value">true</span></div>
      </div>
    </div>

    <!-- 常量 -->
    <h2 class="section-title">📝 常量</h2>
    <table class="constants-table">
      <thead>
        <tr>
          <th>常量</th>
          <th>说明</th>
          <th>Windows值</th>
          <th>Linux值</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>os.EOL</td>
          <td>行结束符</td>
          <td>'\r\n'</td>
          <td>'\n'</td>
        </tr>
        <tr>
          <td>os.devNull</td>
          <td>空设备路径</td>
          <td>'\\\\.\\null'</td>
          <td>'/dev/null'</td>
        </tr>
        <tr>
          <td>os.constants.signals</td>
          <td>信号常量</td>
          <td colspan="2">SIGINT, SIGTERM, SIGKILL 等</td>
        </tr>
        <tr>
          <td>os.constants.errno</td>
          <td>错误码常量</td>
          <td colspan="2">EACCES, ENOENT, EEXIST 等</td>
        </tr>
      </tbody>
    </table>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看实际输出：</p>
      <code>node examples/os-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>跨平台判断：</strong> <code>os.platform() === 'win32'</code> 判断是否Windows</li>
        <li><strong>内存单位转换：</strong> <code>(bytes / 1024³).toFixed(2) + ' GB'</code></li>
        <li><strong>获取本机IP：</strong>遍历 os.networkInterfaces() 获取非内部的 IPv4 地址</li>
        <li><strong>跨平台换行符：</strong>使用 os.EOL 代替硬编码 '\n' 或 '\r\n'</li>
        <li><strong>临时文件：</strong>使用 os.tmpdir() 获取临时目录存放临时文件</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import MethodCard from '@/components/MethodCard.vue'

const systemMethods = [
  {
    title: 'os.type()',
    desc: '返回操作系统类型',
    examples: [{ code: 'os.type()', result: "→ 'Windows_NT' | 'Linux' | 'Darwin'" }]
  },
  {
    title: 'os.platform()',
    desc: '返回操作系统平台（用于跨平台判断）',
    examples: [{ code: 'os.platform()', result: "→ 'win32' | 'linux' | 'darwin' | 'freebsd'" }]
  },
  {
    title: 'os.release()',
    desc: '返回操作系统版本号',
    examples: [{ code: 'os.release()', result: "→ '10.0.22621' // Windows版本" }]
  },
  {
    title: 'os.hostname()',
    desc: '返回主机名',
    examples: [{ code: 'os.hostname()', result: "→ 'DESKTOP-XXXXX'" }]
  },
  {
    title: 'os.arch()',
    desc: '返回CPU架构',
    examples: [{ code: 'os.arch()', result: "→ 'x64' | 'arm' | 'arm64' | 'ia32'" }]
  },
  {
    title: 'os.version()',
    desc: '返回操作系统版本字符串（较新API）',
    examples: [{ code: 'os.version()', result: "→ 'Windows 11 Pro'" }]
  }
]

const cpuMethods = [
  {
    title: 'os.cpus()',
    desc: '返回CPU核心信息数组',
    examples: [{ code: 'os.cpus()', result: '→ [{ model, speed, times }, ...]' }]
  },
  {
    title: 'os.loadavg()',
    desc: '返回系统负载平均值（仅Unix有效）',
    examples: [{ code: 'os.loadavg()', result: '→ [1.5, 1.2, 1.0] // [1分钟, 5分钟, 15分钟]' }]
  }
]

const memoryMethods = [
  {
    title: 'os.totalmem()',
    desc: '返回系统总内存（字节）',
    examples: [{ code: 'os.totalmem()', result: '→ 17179869184 // bytes' }]
  },
  {
    title: 'os.freemem()',
    desc: '返回空闲内存（字节）',
    examples: [{ code: 'os.freemem()', result: '→ 8589934592 // bytes' }]
  }
]

const userMethods = [
  {
    title: 'os.homedir()',
    desc: '返回当前用户主目录',
    examples: [{ code: "os.homedir()", result: "→ 'C:\\\\Users\\\\Admin' // Win\n→ '/home/user' // Linux" }]
  },
  {
    title: 'os.tmpdir()',
    desc: '返回系统临时目录',
    examples: [{ code: 'os.tmpdir()', result: "→ 'C:\\\\Users\\\\...\\\\AppData\\\\Local\\\\Temp'" }]
  },
  {
    title: 'os.userInfo()',
    desc: '返回当前用户信息',
    examples: [{ code: 'os.userInfo()', result: '→ { uid, gid, username, homedir, shell }' }]
  },
  {
    title: 'os.uptime()',
    desc: '返回系统运行时间（秒）',
    examples: [{ code: 'os.uptime()', result: '→ 86400 // 秒 = 24小时' }]
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

/* 仪表板 */
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
  font-size: 1.2em;
  font-weight: bold;
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

/* 内存可视化 */
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

.memory-bar {
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
}

.memory-used {
  background: linear-gradient(90deg, #ff6b6b, #ee5a24);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.memory-free {
  background: linear-gradient(90deg, #00d9ff, #00a8cc);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.memory-legend {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-item .color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-item .color.used {
  background: linear-gradient(90deg, #ff6b6b, #ee5a24);
}

.legend-item .color.free {
  background: linear-gradient(90deg, #00d9ff, #00a8cc);
}

/* 网络卡片 */
.network-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.network-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  border-left: 3px solid var(--primary);
}

.network-card h4 {
  color: var(--primary);
  margin-bottom: 10px;
}

.network-card .ip-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9em;
}

.network-card .ip-row .label {
  color: var(--text-dim);
}

.network-card .ip-row .value {
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

/* 常量表格 */
.constants-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.constants-table th,
.constants-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.constants-table th {
  background: rgba(0, 217, 255, 0.2);
  color: var(--primary);
}

.constants-table td:first-child {
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

.constants-table tr:hover {
  background: rgba(255, 255, 255, 0.05);
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
