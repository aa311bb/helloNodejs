/**
 * Node.js Util 模块学习示例
 * util 模块提供实用工具函数
 */

import util from 'util'

console.log('========== Node.js Util 模块示例 ==========\n')

// ============================================
// 1. promisify - 将回调风格转为 Promise
// ============================================
console.log('1. util.promisify(fn) - 回调转 Promise')
console.log('   用途: 将 Node.js 回调风格函数转为 Promise')
console.log()

// 示例：将 setTimeout 转为 Promise 版本
const setTimeoutPromise = util.promisify(setTimeout)

console.log('   const setTimeoutPromise = util.promisify(setTimeout)')
console.log('   await setTimeoutPromise(1000)')
console.log('   // 1秒后继续执行')
console.log()

// 示例：模拟回调函数
function readFileCallback(path, callback) {
  setTimeout(() => {
    callback(null, `文件内容: ${path}`)
  }, 100)
}

const readFilePromise = util.promisify(readFileCallback)
console.log('   // 原回调风格函数转为 Promise:')
console.log('   readFilePromise("test.txt").then(data => console.log(data))')
readFilePromise('test.txt').then(data => {
  console.log(`   结果: ${data}`)
})
console.log()

// ============================================
// 2. callbackify - Promise 转回调
// ============================================
console.log('2. util.callbackify(fn) - Promise 转回调')
console.log('   用途: 将 async/await 函数转为回调风格')
console.log()

async function asyncFunction() {
  return '异步结果'
}

const callbackFunction = util.callbackify(asyncFunction)
console.log('   const callbackFunction = util.callbackify(asyncFunction)')
callbackFunction((err, result) => {
  console.log(`   回调结果: ${result}`)
})
console.log()

// ============================================
// 3. format - 字符串格式化
// ============================================
console.log('3. util.format(format[, ...args]) - 字符串格式化')
console.log('   占位符: %s(字符串) %d(数字) %j(JSON) %%(百分号)')
console.log()

console.log('   util.format("Hello %s", "World"):', util.format('Hello %s', 'World'))
console.log('   util.format("数字: %d", 42):', util.format('数字: %d', 42))
console.log('   util.format("对象: %j", {a: 1}):', util.format('对象: %j', {a: 1}))
console.log('   util.format("%s有%d个苹果", "小明", 3):', util.format('%s有%d个苹果', '小明', 3))
console.log()

// ============================================
// 4. inspect - 对象检查/格式化
// ============================================
console.log('4. util.inspect(object[, options]) - 对象检查')
console.log('   用途: 将对象转为字符串，用于调试')
console.log()

const obj = { a: 1, b: { c: 2, d: [1, 2, 3] } }
console.log('   默认输出:')
console.log('  ', util.inspect(obj))
console.log()

console.log('   深度设为 1 (showHidden: true, depth: 1):')
console.log('  ', util.inspect(obj, { depth: 1 }))
console.log()

console.log('   彩色输出 (colors: true):')
console.log('  ', util.inspect(obj, { colors: true, depth: null }))
console.log()

// ============================================
// 5. inspect 选项
// ============================================
console.log('5. inspect 常用选项')
console.log('   {')
console.log('     showHidden: true,    // 显示不可枚举属性')
console.log('     depth: null,         // 无限递归深度')
console.log('     colors: true,        // 彩色输出')
console.log('     compact: false,      // 紧凑格式')
console.log('     sorted: true,        // 排序属性')
console.log('     breakLength: 80,     // 换行长度')
console.log('   }')
console.log()

// ============================================
// 6. isDeepStrictEqual - 深度比较
// ============================================
console.log('6. util.isDeepStrictEqual(a, b) - 深度严格相等')
console.log()

console.log('   isDeepStrictEqual({a: 1}, {a: 1}):', util.isDeepStrictEqual({a: 1}, {a: 1}))
console.log('   isDeepStrictEqual({a: 1}, {a: 2}):', util.isDeepStrictEqual({a: 1}, {a: 2}))
console.log('   isDeepStrictEqual([1,2,3], [1,2,3]):', util.isDeepStrictEqual([1,2,3], [1,2,3]))
console.log('   isDeepStrictEqual([1,2], [1,2,3]):', util.isDeepStrictEqual([1,2], [1,2,3]))
console.log()

// ============================================
// 7. deprecate - 标记废弃
// ============================================
console.log('7. util.deprecate(fn, msg) - 标记函数废弃')
console.log('   用途: 标记 API 已废弃，调用时输出警告')
console.log()

const oldFunction = util.deprecate(() => {
  return '旧函数返回值'
}, 'oldFunction 已废弃，请使用 newFunction')

console.log('   const oldFunction = util.deprecate(() => {}, "已废弃")')
console.log('   oldFunction() // 会输出 DeprecationWarning')
oldFunction()
console.log()

// ============================================
// 8. types - 类型判断工具
// ============================================
console.log('8. util.types - 类型判断工具')
console.log()

console.log('   util.types.isArrayBuffer(new ArrayBuffer(8)):', util.types.isArrayBuffer(new ArrayBuffer(8)))
console.log('   util.types.isDate(new Date()):', util.types.isDate(new Date()))
console.log('   util.types.isMap(new Map()):', util.types.isMap(new Map()))
console.log('   util.types.isSet(new Set()):', util.types.isSet(new Set()))
console.log('   util.types.isPromise(Promise.resolve()):', util.types.isPromise(Promise.resolve()))
console.log('   util.types.isRegExp(/test/):', util.types.isRegExp(/test/))
console.log('   util.types.isTypedArray(new Uint8Array()):', util.types.isTypedArray(new Uint8Array()))
console.log()

// ============================================
// 9. getSystemErrorMap - 系统错误映射
// ============================================
console.log('9. util.getSystemErrorMap() - 系统错误码映射')
console.log()

const errorMap = util.getSystemErrorMap()
console.log('   错误码数量:', errorMap.size)
const firstError = errorMap.entries().next().value
if (firstError) {
  console.log('   示例:', firstError)
}
console.log()

// ============================================
// 10. getSystemErrorName - 错误码名称
// ============================================
console.log('10. util.getSystemErrorName(err) - 获取错误名称')
console.log()

console.log('    getSystemErrorName(-1):', util.getSystemErrorName(-1))
console.log('    getSystemErrorName(-2):', util.getSystemErrorName(-2))
console.log()

// ============================================
// 11. parseEnv - 解析 env 文件
// ============================================
console.log('11. util.parseEnv(envString) - 解析 .env 文件内容')
console.log()

const envContent = `
# 注释
DB_HOST=localhost
DB_PORT=5432
EMPTY=
QUOTED="hello world"
`
console.log('    输入:')
console.log(envContent)
console.log('    parseEnv 结果:')
console.log(util.parseEnv(envContent))
console.log()

// ============================================
// 12. styleText - 终端文本样式
// ============================================
console.log('12. util.styleText(format, text) - 终端文本样式')
console.log()

console.log('    红色文本:', util.styleText('red', '这是红色'))
console.log('    绿色文本:', util.styleText('green', '这是绿色'))
console.log('    粗体:', util.styleText('bold', '这是粗体'))
console.log('    下划线:', util.styleText('underline', '这是下划线'))
console.log('    组合样式:', util.styleText(['red', 'bold'], '红色粗体'))
console.log()

// ============================================
// 13. inherits - 继承（已废弃）
// ============================================
console.log('13. util.inherits(constructor, superConstructor)')
console.log('    ⚠️ 已废弃，推荐使用 ES6 class extends')
console.log()

// ============================================
// 14. 实用示例
// ============================================
console.log('14. 实用示例')
console.log('    ================================')
console.log('    # promisify 文件操作')
console.log('    const fs = require("fs")')
console.log('    const readFile = util.promisify(fs.readFile)')
console.log('    const data = await readFile("file.txt", "utf8")')
console.log()
console.log('    # 格式化日志')
console.log('    console.log(util.format("[%s] %s", new Date(), msg))')
console.log()
console.log('    # 调试对象')
console.log('    console.log(util.inspect(obj, { depth: null, colors: true }))')
console.log('    ================================')

console.log('\n========== 学习完成 ==========')
