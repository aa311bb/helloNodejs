/**
 * Node.js Events 模块学习示例
 * events 模块提供了事件驱动架构的核心功能
 */

import EventEmitter from 'events'

console.log('========== Node.js Events 模块示例 ==========\n')

// ============================================
// 1. 创建 EventEmitter 实例
// ============================================
console.log('1. 创建 EventEmitter 实例')
console.log('   const EventEmitter = require("events")')
console.log('   const emitter = new EventEmitter()')
console.log()

// ============================================
// 2. on - 注册事件监听器
// ============================================
console.log('2. on(eventName, listener) - 注册事件监听器')
console.log('   用途: 为指定事件注册监听器，可注册多个')
console.log()

const emitter = new EventEmitter()

emitter.on('greet', (name) => {
  console.log(`   监听器1: 你好, ${name}!`)
})

emitter.on('greet', (name) => {
  console.log(`   监听器2: 欢迎你, ${name}!`)
})

console.log('   emitter.on("greet", (name) => { ... })')
console.log('   emitter.emit("greet", "张三")')
emitter.emit('greet', '张三')
console.log()

// ============================================
// 3. emit - 触发事件
// ============================================
console.log('3. emit(eventName[, ...args]) - 触发事件')
console.log('   用途: 按顺序调用所有监听器')
console.log('   返回: true 如果事件有监听器，否则 false')
console.log()

const result = emitter.emit('greet', '李四')
console.log('   emit 返回值:', result)

const noListener = emitter.emit('noevent')
console.log('   无监听器事件返回:', noListener)
console.log()

// ============================================
// 4. once - 单次监听
// ============================================
console.log('4. once(eventName, listener) - 单次监听')
console.log('   用途: 监听器最多调用一次后自动移除')
console.log()

const onceEmitter = new EventEmitter()
onceEmitter.once('connect', () => {
  console.log('   首次连接成功!')
})

console.log('   第一次触发:')
onceEmitter.emit('connect')
console.log('   第二次触发:')
onceEmitter.emit('connect')
console.log('   (监听器已被移除，无输出)')
console.log()

// ============================================
// 5. off / removeListener - 移除监听器
// ============================================
console.log('5. off(eventName, listener) - 移除指定监听器')
console.log('   别名: removeListener()')
console.log()

const offEmitter = new EventEmitter()
const handler = (msg) => console.log(`   收到: ${msg}`)

offEmitter.on('message', handler)
console.log('   注册监听器后:')
offEmitter.emit('message', 'Hello')

offEmitter.off('message', handler)
console.log('   移除监听器后:')
offEmitter.emit('message', 'World')
console.log('   (无输出)')
console.log()

// ============================================
// 6. removeAllListeners - 移除所有监听器
// ============================================
console.log('6. removeAllListeners([eventName]) - 移除所有监听器')
console.log('   不传参则移除所有事件的所有监听器')
console.log()

const allEmitter = new EventEmitter()
allEmitter.on('a', () => console.log('   a事件'))
allEmitter.on('a', () => console.log('   a事件2'))
allEmitter.on('b', () => console.log('   b事件'))

console.log('   listenerCount("a"):', allEmitter.listenerCount('a'))
allEmitter.removeAllListeners('a')
console.log('   移除后 listenerCount("a"):', allEmitter.listenerCount('a'))
console.log()

// ============================================
// 7. listenerCount - 获取监听器数量
// ============================================
console.log('7. listenerCount(eventName) - 获取监听器数量')
console.log()

const countEmitter = new EventEmitter()
countEmitter.on('test', () => {})
countEmitter.on('test', () => {})
countEmitter.on('test', () => {})
console.log('   listenerCount("test"):', countEmitter.listenerCount('test'))
console.log()

// ============================================
// 8. listeners - 获取监听器数组
// ============================================
console.log('8. listeners(eventName) - 获取监听器数组副本')
console.log()

const listEmitter = new EventEmitter()
const fn1 = () => {}
const fn2 = () => {}
listEmitter.on('data', fn1)
listEmitter.on('data', fn2)
console.log('   listeners("data").length:', listEmitter.listeners('data').length)
console.log()

// ============================================
// 9. prependListener - 添加到监听器数组开头
// ============================================
console.log('9. prependListener() - 添加监听器到开头')
console.log()

const preEmitter = new EventEmitter()
preEmitter.on('order', () => console.log('   第二个执行'))
preEmitter.prependListener('order', () => console.log('   第一个执行'))
preEmitter.emit('order')
console.log()

// ============================================
// 10. prependOnceListener - 单次添加到开头
// ============================================
console.log('10. prependOnceListener() - 单次监听器添加到开头')
console.log()

// ============================================
// 11. setMaxListeners - 设置最大监听器数
// ============================================
console.log('11. setMaxListeners(n) - 设置最大监听器数')
console.log('   默认: 10, 超过会警告(内存泄漏提示)')
console.log('   设为 Infinity 或 0 表示不限制')
console.log()

const maxEmitter = new EventEmitter()
maxEmitter.setMaxListeners(20)
console.log('   getMaxListeners():', maxEmitter.getMaxListeners())
console.log()

// ============================================
// 12. eventNames - 获取所有事件名
// ============================================
console.log('12. eventNames() - 获取所有已注册的事件名')
console.log()

const namesEmitter = new EventEmitter()
namesEmitter.on('click', () => {})
namesEmitter.on('hover', () => {})
namesEmitter.on('submit', () => {})
console.log('   eventNames():', namesEmitter.eventNames())
console.log()

// ============================================
// 13. rawListeners - 获取原始监听器
// ============================================
console.log('13. rawListeners(eventName) - 获取原始监听器数组')
console.log('   与 listeners() 不同，包含 once 的包装')
console.log()

// ============================================
// 14. 错误处理
// ============================================
console.log('14. 错误处理 - error 事件')
console.log('   如果没有 error 监听器，Node.js 会抛出异常并退出')
console.log()

const errEmitter = new EventEmitter()
errEmitter.on('error', (err) => {
  console.log('   捕获到错误:', err.message)
})
errEmitter.emit('error', new Error('出错了!'))
console.log()

// ============================================
// 15. 继承 EventEmitter
// ============================================
console.log('15. 继承 EventEmitter 创建自定义类')
console.log()

class MyEmitter extends EventEmitter {
  constructor() {
    super()
    this.count = 0
  }

  increment() {
    this.count++
    this.emit('incremented', this.count)
  }
}

const myEmitter = new MyEmitter()
myEmitter.on('incremented', (count) => {
  console.log(`   计数器增加到: ${count}`)
})

console.log('   class MyEmitter extends EventEmitter { ... }')
myEmitter.increment()
myEmitter.increment()
console.log()

// ============================================
// 16. 特殊事件
// ============================================
console.log('16. 特殊事件 - newListener / removeListener')
console.log('   newListener: 添加监听器时触发')
console.log('   removeListener: 移除监听器时触发')
console.log()

const specialEmitter = new EventEmitter()
specialEmitter.on('newListener', (event, listener) => {
  console.log(`   新监听器被添加: "${event}"`)
})
specialEmitter.on('removeListener', (event, listener) => {
  console.log(`   监听器被移除: "${event}"`)
})

const tempHandler = () => console.log('temp')
specialEmitter.on('temp', tempHandler)
specialEmitter.off('temp', tempHandler)
console.log()

// ============================================
// 17. 异步 vs 同步
// ============================================
console.log('17. 监听器执行顺序')
console.log('   监听器按注册顺序同步执行')
console.log('   可用 setImmediate/process.nextTick 异步处理')
console.log()

const asyncEmitter = new EventEmitter()
asyncEmitter.on('async', (data) => {
  setImmediate(() => {
    console.log('   异步处理:', data)
  })
  console.log('   同步执行')
})
asyncEmitter.emit('async', 'hello')
console.log('   emit 后的代码')
console.log()

// ============================================
// 18. 实用示例
// ============================================
console.log('18. 实用示例')
console.log('    ================================')
console.log('    # 简单发布订阅模式')
console.log('    class PubSub extends EventEmitter {}')
console.log()
console.log('    # 流式数据处理')
console.log('    stream.on("data", chunk => {})')
console.log('    stream.on("end", () => {})')
console.log()
console.log('    # 事件驱动状态机')
console.log('    fsm.on("enter", state => {})')
console.log('    fsm.on("exit", state => {})')
console.log('    ================================')

console.log('\n========== 学习完成 ==========')
