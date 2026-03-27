<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>Events 事件</span>
      </div>
      <h1>🎯 Events 事件模块</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>Events 模块是 Node.js 事件驱动架构的核心，它提供了 EventEmitter 类来实现发布-订阅模式。大多数 Node.js API 都基于此模块构建，如 Stream、HTTP 等。使用 <code>const EventEmitter = require('events')</code> 引入。
    </div>

    <!-- 核心概念 -->
    <div class="concept-grid">
      <div class="concept-card emit">
        <div class="icon">📢</div>
        <h3>emit</h3>
        <p>触发事件</p>
      </div>
      <div class="concept-card on">
        <div class="icon">👂</div>
        <h3>on</h3>
        <p>注册监听器</p>
      </div>
      <div class="concept-card once">
        <div class="icon">1️⃣</div>
        <h3>once</h3>
        <p>单次监听</p>
      </div>
      <div class="concept-card off">
        <div class="icon">❌</div>
        <h3>off</h3>
        <p>移除监听器</p>
      </div>
    </div>

    <!-- 创建实例 -->
    <h2 class="section-title">📦 创建 EventEmitter 实例</h2>
    <div class="code-block">
      <pre><code>const EventEmitter = require('events')

// 方式1: 直接实例化
const emitter = new EventEmitter()

// 方式2: 继承创建自定义类
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter()</code></pre>
    </div>

    <!-- 常用方法 -->
    <h2 class="section-title">🔧 常用方法</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in methods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 事件监听流程 -->
    <h2 class="section-title">🔄 事件监听流程</h2>
    <div class="flow-diagram">
      <div class="flow-step">
        <div class="step-num">1</div>
        <div class="step-content">
          <h4>注册监听器</h4>
          <code>emitter.on('event', callback)</code>
        </div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="step-num">2</div>
        <div class="step-content">
          <h4>触发事件</h4>
          <code>emitter.emit('event', data)</code>
        </div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="step-num">3</div>
        <div class="step-content">
          <h4>执行回调</h4>
          <p>按注册顺序同步执行</p>
        </div>
      </div>
    </div>

    <!-- 特殊事件 -->
    <h2 class="section-title">⚡ 特殊事件</h2>
    <div class="methods-grid">
      <MethodCard
        title="newListener 事件"
        desc="任何监听器注册时触发"
        :examples="newListenerExamples"
      />
      <MethodCard
        title="removeListener 事件"
        desc="任何监听器移除时触发"
        :examples="removeListenerExamples"
      />
      <MethodCard
        title="error 事件"
        desc="错误处理，无监听器时 Node.js 会抛出异常"
        :examples="errorExamples"
      />
    </div>

    <!-- 监听器管理 -->
    <h2 class="section-title">📋 监听器管理</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in manageMethods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 继承示例 -->
    <h2 class="section-title">🏗️ 继承 EventEmitter</h2>
    <div class="code-block">
      <h4>📝 自定义类示例</h4>
      <pre><code>const EventEmitter = require('events')

class Counter extends EventEmitter {
  constructor() {
    super()
    this.count = 0
  }

  increment() {
    this.count++
    this.emit('incremented', this.count)
  }
}

const counter = new Counter()

// 监听事件
counter.on('incremented', (count) => {
  console.log('计数器增加到:', count)
})

// 触发
counter.increment() // 输出: 计数器增加到: 1
counter.increment() // 输出: 计数器增加到: 2</code></pre>
    </div>

    <!-- 实际应用 -->
    <h2 class="section-title">💡 实际应用场景</h2>
    <div class="app-grid">
      <div class="app-card">
        <h4>📡 发布订阅系统</h4>
        <p>实现简单的消息广播</p>
      </div>
      <div class="app-card">
        <h4>🔄 状态管理</h4>
        <p>状态变化通知</p>
      </div>
      <div class="app-card">
        <h4>📊 流式处理</h4>
        <p>Stream 的 data/end/error 事件</p>
      </div>
      <div class="app-card">
        <h4>🌐 网络请求</h4>
        <p>HTTP 的 request/response 事件</p>
      </div>
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看实际输出：</p>
      <code>node examples/events-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>移除监听器：</strong> 保存回调函数引用才能用 off() 移除</li>
        <li><strong>内存泄漏：</strong> 监听器未移除会导致内存泄漏，setMaxListeners() 可调整上限</li>
        <li><strong>错误处理：</strong> 始终监听 error 事件防止进程崩溃</li>
        <li><strong>异步执行：</strong> 监听器同步执行，可用 setImmediate() 异步化</li>
        <li><strong>一次性事件：</strong> 连接成功、初始化完成等场景用 once()</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import MethodCard from '@/components/MethodCard.vue'

const methods = [
  {
    title: 'emitter.on(eventName, listener)',
    desc: '注册监听器，可多次注册同一事件',
    examples: [
      { code: "emitter.on('greet', (name) => console.log(`Hello ${name}`))", result: '' },
      { code: "emitter.emit('greet', 'World')", result: '→ Hello World' }
    ]
  },
  {
    title: 'emitter.once(eventName, listener)',
    desc: '单次监听器，触发一次后自动移除',
    examples: [
      { code: "emitter.once('connect', () => console.log('首次连接!'))", result: '' },
      { code: "emitter.emit('connect')", result: '→ 首次连接!' },
      { code: "emitter.emit('connect')", result: '→ (无输出)' }
    ]
  },
  {
    title: 'emitter.emit(eventName[, ...args])',
    desc: '触发事件，按顺序执行所有监听器',
    examples: [
      { code: "emitter.emit('data', { id: 1, value: 'test' })", result: '→ 传递多个参数' },
      { code: "// 返回值", result: '' },
      { code: "emitter.emit('noevent')", result: '→ false (无监听器)' }
    ]
  },
  {
    title: 'emitter.off(eventName, listener)',
    desc: '移除指定监听器（需同一函数引用）',
    examples: [
      { code: "const handler = (msg) => console.log(msg)", result: '' },
      { code: "emitter.on('msg', handler)", result: '' },
      { code: "emitter.off('msg', handler)", result: '→ 移除成功' }
    ]
  },
  {
    title: 'emitter.removeAllListeners([eventName])',
    desc: '移除所有或指定事件的所有监听器',
    examples: [
      { code: "emitter.removeAllListeners('greet')", result: '→ 移除 greet 的所有监听器' },
      { code: "emitter.removeAllListeners()", result: '→ 移除所有监听器' }
    ]
  },
  {
    title: 'emitter.prependListener(eventName, listener)',
    desc: '添加监听器到开头',
    examples: [
      { code: "emitter.on('order', () => console.log('第二个'))", result: '' },
      { code: "emitter.prependListener('order', () => console.log('第一个'))", result: '' }
    ]
  },
  {
    title: 'emitter.prependOnceListener(eventName, listener)',
    desc: '添加单次监听器到开头',
    examples: [
      { code: "emitter.prependOnceListener('init', () => {})", result: '' }
    ]
  }
]

const newListenerExamples = [
  { code: "emitter.on('newListener', (event, listener) => {", result: '' },
  { code: "  console.log('新监听器:', event)", result: '' },
  { code: '})', result: '' }
]

const removeListenerExamples = [
  { code: "emitter.on('removeListener', (event, listener) => {", result: '' },
  { code: "  console.log('移除监听器:', event)", result: '' },
  { code: '})', result: '' }
]

const errorExamples = [
  { code: "emitter.on('error', (err) => {", result: '' },
  { code: "  console.error('捕获错误:', err)", result: '' },
  { code: '})', result: '' },
  { code: "// 无 error 监听器时:", result: 'Node.js 抛出异常并退出' }
]

const manageMethods = [
  {
    title: 'emitter.setMaxListeners(n)',
    desc: '设置最大监听器数量（默认10，超过会警告）',
    examples: [
      { code: "emitter.setMaxListeners(20)", result: '→ 提高上限' },
      { code: "emitter.setMaxListeners(Infinity)", result: '→ 不限制' }
    ]
  },
  {
    title: 'emitter.getMaxListeners()',
    desc: '获取当前最大监听器数量',
    examples: [
      { code: "emitter.getMaxListeners()", result: '→ 10 (默认值)' }
    ]
  },
  {
    title: 'emitter.eventNames()',
    desc: '获取所有已注册的事件名数组',
    examples: [
      { code: "emitter.on('foo', () => {})", result: '' },
      { code: "emitter.on('bar', () => {})", result: '' },
      { code: "emitter.eventNames()", result: "→ ['foo', 'bar']" }
    ]
  },
  {
    title: 'emitter.listenerCount(eventName)',
    desc: '获取指定事件的监听器数量',
    examples: [
      { code: "emitter.listenerCount('foo')", result: '→ 2' }
    ]
  },
  {
    title: 'emitter.listeners(eventName)',
    desc: '获取指定事件的监听器数组副本',
    examples: [
      { code: "emitter.listeners('foo')", result: '→ [Function, Function]' }
    ]
  },
  {
    title: 'emitter.rawListeners(eventName)',
    desc: '获取原始监听器数组（包含 once 包装）',
    examples: [
      { code: "emitter.rawListeners('foo')", result: '→ 返回原始引用' }
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

.module-header h1{
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

/* 核心概念卡片 */
.concept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.concept-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.concept-card:hover {
  transform: translateY(-3px);
}

.concept-card.emit { border-color: #2ecc71; }
.concept-card.on { border-color: #3498db; }
.concept-card.once { border-color: #f1c40f; }
.concept-card.off { border-color: #e74c3c; }

.concept-card .icon{
  font-size: 2em;
  margin-bottom: 10px;
}

.concept-card h3 {
  color: var(--text);
  font-family: 'Courier New', monospace;
}

.concept-card p{
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

.code-block pre{
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: var(--text);
  line-height: 1.6;
}

/* 流程图 */
.flow-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.flow-step {
  background: rgba(0, 217, 255, 0.1);
  border: 2px solid var(--primary);
  border-radius: 12px;
  padding: 20px 30px;
  text-align: center;
}

.step-num {
  width: 40px;
  height: 40px;
  background: var(--primary);
  color: var(--bg-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  margin: 0 auto 10px;
}

.step-content h4 {
  color: var(--primary);
  margin-bottom: 8px;
}

.step-content code{
  font-size: 0.85em;
  color: var(--accent);
}

.step-content p{
  color: var(--text-dim);
  font-size: 0.9em;
}

.flow-arrow {
  font-size: 2em;
  color: var(--primary);
}

/* 应用场景 */
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.app-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.app-card h4 {
  color: var(--accent);
  margin-bottom: 8px;
}

.app-card p{
  color: var(--text-dim);
  font-size: 0.85em;
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
