<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>Util 工具</span>
      </div>
      <h1>🛠️ Util 工具模块</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>Util 模块提供了一系列实用工具函数，最常用的是 <code>promisify</code>（回调转Promise）和 <code>format</code>（字符串格式化）。使用 <code>const util = require('util')</code> 引入。
    </div>

    <!-- 核心功能 -->
    <div class="feature-grid">
      <div class="feature-card promisify">
        <div class="icon">🔄</div>
        <h3>promisify</h3>
        <p>回调 → Promise</p>
      </div>
      <div class="feature-card callbackify">
        <div class="icon">🔙</div>
        <h3>callbackify</h3>
        <p>Promise → 回调</p>
      </div>
      <div class="feature-card format">
        <div class="icon">📝</div>
        <h3>format</h3>
        <p>字符串格式化</p>
      </div>
      <div class="feature-card inspect">
        <div class="icon">🔍</div>
        <h3>inspect</h3>
        <p>对象调试输出</p>
      </div>
    </div>

    <!-- promisify -->
    <h2 class="section-title">🔄 promisify - 回调转 Promise</h2>
    <div class="methods-grid">
      <MethodCard
        title="util.promisify(original)"
        desc="将回调风格函数转为返回 Promise 的函数"
        :examples="promisifyExamples"
      />
    </div>

    <div class="code-block">
      <h4>📝 完整示例</h4>
      <pre><code>const util = require('util')
const fs = require('fs')

// 传统回调风格
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// 使用 promisify
const readFile = util.promisify(fs.readFile)

async function read() {
  try {
    const data = await readFile('file.txt', 'utf8')
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}</code></pre>
    </div>

    <!-- callbackify -->
    <h2 class="section-title">🔙 callbackify - Promise 转回调</h2>
    <div class="methods-grid">
      <MethodCard
        title="util.callbackify(asyncFn)"
        desc="将 async/await 函数转为回调风格"
        :examples="callbackifyExamples"
      />
    </div>

    <!-- format -->
    <h2 class="section-title">📝 format - 字符串格式化</h2>
    <div class="methods-grid">
      <MethodCard
        title="util.format(format[, ...args])"
        desc="格式化字符串，类似 printf"
        :examples="formatExamples"
      />
    </div>

    <div class="format-table">
      <h4>📋 占位符说明</h4>
      <table>
        <thead>
          <tr><th>占位符</th><th>说明</th><th>示例</th></tr>
        </thead>
        <tbody>
          <tr><td><code>%s</code></td><td>字符串</td><td>util.format('%s', 'hello')</td></tr>
          <tr><td><code>%d</code></td><td>数字</td><td>util.format('%d', 123)</td></tr>
          <tr><td><code>%i</code></td><td>整数</td><td>util.format('%i', 123.45)</td></tr>
          <tr><td><code>%f</code></td><td>浮点数</td><td>util.format('%f', 123.45)</td></tr>
          <tr><td><code>%j</code></td><td>JSON</td><td>util.format('%j', {a:1})</td></tr>
          <tr><td><code>%o</code></td><td>对象</td><td>util.format('%o', obj)</td></tr>
          <tr><td><code>%O</code></td><td>对象(详细)</td><td>util.format('%O', obj)</td></tr>
          <tr><td><code>%%</code></td><td>百分号</td><td>util.format('100%%')</td></tr>
        </tbody>
      </table>
    </div>

    <!-- inspect -->
    <h2 class="section-title">🔍 inspect - 对象检查</h2>
    <div class="methods-grid">
      <MethodCard
        title="util.inspect(object[, options])"
        desc="将对象转换为字符串，用于调试"
        :examples="inspectExamples"
      />
    </div>

    <div class="inspect-options">
      <h4>📋 inspect 选项</h4>
      <div class="options-list">
        <div class="option-item"><code>depth: null</code> 无限递归深度</div>
        <div class="option-item"><code>colors: true</code> 启用颜色</div>
        <div class="option-item"><code>showHidden: true</code> 显示不可枚举属性</div>
        <div class="option-item"><code>maxArrayLength: null</code> 显示完整数组</div>
        <div class="option-item"><code>compact: false</code> 格式化输出</div>
        <div class="option-item"><code>sorted: true</code> 排序对象属性</div>
      </div>
    </div>

    <!-- types -->
    <h2 class="section-title">🔎 types - 类型判断</h2>
    <div class="methods-grid">
      <MethodCard
        title="util.types"
        desc="提供各种类型判断方法"
        :examples="typesExamples"
      />
    </div>

    <!-- 其他方法 -->
    <h2 class="section-title">🔧 其他方法</h2>
    <div class="methods-grid">
      <MethodCard
        title="util.isDeepStrictEqual(val1, val2)"
        desc="深度严格相等比较"
        :examples="deepEqualExamples"
      />
      <MethodCard
        title="util.deprecate(fn, msg[, code])"
        desc="标记函数为废弃"
        :examples="deprecateExamples"
      />
      <MethodCard
        title="util.getSystemErrorMap()"
        desc="获取系统错误码映射"
        :examples="getSystemErrorMapExamples"
      />
      <MethodCard
        title="util.getSystemErrorName(err)"
        desc="获取错误码对应的名称"
        :examples="getSystemErrorNameExamples"
      />
      <MethodCard
        title="util.styleText(format, text)"
        desc="文本样式化（Node.js 20+）"
        :examples="styleTextExamples"
      />
      <MethodCard
        title="util.parseEnv(content)"
        desc="解析 .env 文件内容（Node.js 20.6+）"
        :examples="parseEnvExamples"
      />
    </div>

    <!-- 废弃方法 -->
    <h2 class="section-title">⚠️ 已废弃方法</h2>
    <div class="deprecated-box">
      <ul>
        <li><code>util.isArray()</code> → 使用 <code>Array.isArray()</code></li>
        <li><code>util.isBoolean()</code> → 使用 <code>typeof val === 'boolean'</code></li>
        <li><code>util.isNull()</code> → 使用 <code>val === null</code></li>
        <li><code>util.isNullOrUndefined()</code> → 使用 <code>val == null</code></li>
        <li><code>util.isNumber()</code> → 使用 <code>typeof val === 'number'</code></li>
        <li><code>util.isString()</code> → 使用 <code>typeof val === 'string'</code></li>
        <li><code>util.isSymbol()</code> → 使用 <code>typeof val === 'symbol'</code></li>
        <li><code>util.isUndefined()</code> → 使用 <code>val === undefined</code></li>
        <li><code>util.isObject()</code></li>
        <li><code>util.isDate()</code></li>
        <li><code>util.isError()</code></li>
        <li><code>util.isFunction()</code></li>
        <li><code>util.isPrimitive()</code></li>
        <li><code>util.isBuffer()</code></li>
        <li><code>util.inherits()</code> → 使用 ES6 <code>extends</code></li>
      </ul>
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看实际输出：</p>
      <code>node core-examples/util-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>Promise 化：</strong> <code>const readFile = util.promisify(fs.readFile)</code></li>
        <li><strong>调试对象：</strong> <code>console.log(util.inspect(obj, { depth: null, colors: true }))</code></li>
        <li><strong>格式化日志：</strong> <code>util.format('[%s] %s', new Date().toISOString(), msg)</code></li>
        <li><strong>标记废弃：</strong> 用 <code>util.deprecate()</code> 标记即将移除的 API</li>
        <li><strong>类型判断：</strong> <code>util.types.isProxy(obj)</code> 判断代理对象</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import MethodCard from '@/components/MethodCard.vue'

const promisifyExamples = [
  { code: "const util = require('util')", result: '' },
  { code: "const fs = require('fs')", result: '' },
  { code: "const readFile = util.promisify(fs.readFile)", result: '' },
  { code: "const data = await readFile('file.txt', 'utf8')", result: '→ Promise 形式' }
]

const callbackifyExamples = [
  { code: "async function asyncFn() { return 'result' }", result: '' },
  { code: "const callbackFn = util.callbackify(asyncFn)", result: '' },
  { code: "callbackFn((err, result) => {", result: '' },
  { code: "  if (err) throw err", result: '' },
  { code: "  console.log(result)", result: '→ result' },
  { code: '})', result: '' }
]

const formatExamples = [
  { code: "util.format('%s:%d', 'age', 25)", result: "→ 'age:25'" },
  { code: "util.format('JSON: %j', {a: 1})", result: "→ \"JSON: {\\\"a\\\":1}\"" },
  { code: "util.format('Hello', 'World')", result: "→ 'Hello World'" },
  { code: "util.format('%%%s%%', 'hi')", result: "→ '%hi%'" }
]

const inspectExamples = [
  { code: "util.inspect({ a: 1 })", result: "→ \"{ a: 1 }\"" },
  { code: "util.inspect(obj, { depth: null })", result: '→ 无限深度' },
  { code: "util.inspect(obj, { colors: true })", result: '→ 带颜色' },
  { code: "util.inspect(obj, { showHidden: true })", result: '→ 显示隐藏属性' }
]

const typesExamples = [
  { code: "util.types.isProxy(obj)", result: '→ 判断是否为 Proxy' },
  { code: "util.types.isPromise(val)", result: '→ 判断是否为 Promise' },
  { code: "util.types.isMap(val)", result: '→ 判断是否为 Map' },
  { code: "util.types.isSet(val)", result: '→ 判断是否为 Set' },
  { code: "util.types.isArrayBuffer(val)", result: '→ 判断是否为 ArrayBuffer' },
  { code: "util.types.isDate(val)", result: '→ 判断是否为 Date' },
  { code: "util.types.isRegExp(val)", result: '→ 判断是否为 RegExp' }
]

const deepEqualExamples = [
  { code: "util.isDeepStrictEqual({ a: 1 }, { a: 1 })", result: '→ true' },
  { code: "util.isDeepStrictEqual([1, 2], [1, 2])", result: '→ true' },
  { code: "util.isDeepStrictEqual({ a: 1 }, { a: 2 })", result: '→ false' }
]

const deprecateExamples = [
  { code: "const oldFn = util.deprecate(() => {", result: '' },
  { code: "  // 旧实现", result: '' },
  { code: "}, 'oldFn is deprecated, use newFn instead')", result: '' },
  { code: "", result: '' },
  { code: "oldFn()", result: '→ 输出废弃警告' }
]

const styleTextExamples = [
  { code: "util.styleText('red', 'error')", result: '→ 红色文本' },
  { code: "util.styleText(['red', 'bold'], 'error')", result: '→ 红色加粗' },
  { code: "util.styleText('green', 'success')", result: '→ 绿色文本' }
]

const getSystemErrorMapExamples = [
  { code: 'util.getSystemErrorMap()', result: '→ Map { errno => { name, message } }' }
]

const getSystemErrorNameExamples = [
  { code: 'util.getSystemErrorName(-2)', result: '→ "ENOENT"' }
]

const parseEnvExamples = [
  { code: 'util.parseEnv("KEY=value")', result: '→ { KEY: "value" }' }
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
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

.feature-card.promisify { border-color: #2ecc71; }
.feature-card.callbackify { border-color: #3498db; }
.feature-card.format { border-color: #f1c40f; }
.feature-card.inspect { border-color: #9b59b6; }

.feature-card .icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.feature-card h3 {
  color: var(--text);
  font-family: 'Courier New', monospace;
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

/* 格式化表格 */
.format-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.format-table h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.format-table table {
  width: 100%;
  border-collapse: collapse;
}

.format-table th,
.format-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.format-table th {
  color: var(--primary);
}

.format-table td:first-child {
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

/* inspect 选项 */
.inspect-options {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.inspect-options h4 {
  color: var(--primary);
  margin-bottom: 15px;
}

.options-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
}

.option-item {
  font-size: 0.9em;
}

.option-item code {
  color: var(--accent);
}

/* 废弃方法 */
.deprecated-box {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.deprecated-box ul {
  list-style: none;
  columns: 2;
  column-gap: 30px;
}

.deprecated-box li {
  padding: 5px 0;
  color: var(--text-dim);
  font-size: 0.9em;
}

.deprecated-box code {
  color: var(--secondary);
}

@media (max-width: 768px) {
  .deprecated-box ul {
    columns: 1;
  }
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
