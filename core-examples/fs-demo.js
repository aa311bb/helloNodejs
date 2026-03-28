/**
 * Node.js FS 文件系统模块学习示例
 * fs 模块提供文件系统操作功能
 */

import fs from 'fs'
import path from 'path'

console.log('========== Node.js FS 文件系统模块示例 ==========\n')

// ============================================
// 1. 同步 vs 异步 vs Promise
// ============================================
console.log('1. 三种 API 风格')
console.log('   - 同步: fs.xxxSync() - 阻塞执行')
console.log('   - 异步回调: fs.xxx(callback) - 非阻塞')
console.log('   - Promise: fs.promises.xxx() - async/await')
console.log()

// ============================================
// 2. 读取文件
// ============================================
console.log('2. 读取文件')

// 同步读取
console.log('   // 同步读取')
console.log('   const data = fs.readFileSync("file.txt", "utf8")')

// 异步回调
console.log('   // 异步回调')
console.log('   fs.readFile("file.txt", "utf8", (err, data) => { ... })')

// Promise
console.log('   // Promise (推荐)')
console.log('   const data = await fs.promises.readFile("file.txt", "utf8")')
console.log()

// ============================================
// 3. 写入文件
// ============================================
console.log('3. 写入文件')
console.log('   // 覆盖写入')
console.log('   fs.writeFileSync("file.txt", "Hello World")')
console.log('   await fs.promises.writeFile("file.txt", "Hello World")')
console.log()
console.log('   // 追加写入')
console.log('   fs.appendFileSync("file.txt", "\\nNew Line")')
console.log('   await fs.promises.appendFile("file.txt", "\\nNew Line")')
console.log()

// ============================================
// 4. 文件是否存在
// ============================================
console.log('4. 检查文件是否存在')
console.log('   // 已废弃: fs.exists()')
console.log('   // 推荐: fs.access() 或 fs.stat()')
console.log()
console.log('   fs.accessSync("file.txt", fs.constants.F_OK)')
console.log('   fs.existsSync("file.txt")  // 实际上仍可用')
console.log()

// ============================================
// 5. 获取文件信息
// ============================================
console.log('5. 获取文件信息 - stat')

// 创建临时文件用于演示
const tempFile = './temp-demo.txt'
fs.writeFileSync(tempFile, 'test content')

const stats = fs.statSync(tempFile)
console.log('   fs.statSync("file.txt"):')
console.log('     - isFile():', stats.isFile())
console.log('     - isDirectory():', stats.isDirectory())
console.log('     - size:', stats.size, 'bytes')
console.log('     - birthtime:', stats.birthtime)
console.log('     - mtime:', stats.mtime)
console.log('     - mode:', stats.mode.toString(8))
console.log()

// ============================================
// 6. 创建目录
// ============================================
console.log('6. 创建目录')
console.log('   fs.mkdirSync("dir/path")')
console.log('   fs.mkdirSync("dir/path", { recursive: true })  // 递归创建')
console.log()

// ============================================
// 7. 读取目录
// ============================================
console.log('7. 读取目录')
console.log('   fs.readdirSync("./")')
console.log('   fs.readdirSync("./", { withFileTypes: true })  // 包含类型')
console.log()

const files = fs.readdirSync('./')
console.log('   当前目录文件数:', files.length)
console.log()

// ============================================
// 8. 删除文件
// ============================================
console.log('8. 删除文件')
console.log('   fs.unlinkSync("file.txt")')
console.log('   await fs.promises.unlink("file.txt")')
console.log()

// ============================================
// 9. 删除目录
// ============================================
console.log('9. 删除目录')
console.log('   fs.rmdirSync("empty-dir")')
console.log('   fs.rmSync("dir", { recursive: true, force: true })  // Node 14.14+')
console.log()

// ============================================
// 10. 复制文件
// ============================================
console.log('10. 复制文件')
console.log('    fs.copyFileSync("src.txt", "dest.txt")')
console.log('    fs.copyFileSync("src.txt", "dest.txt", fs.constants.COPYFILE_EXCL)')
console.log()

// ============================================
// 11. 重命名/移动
// ============================================
console.log('11. 重命名/移动文件')
console.log('    fs.renameSync("old.txt", "new.txt")')
console.log('    fs.renameSync("file.txt", "dir/file.txt")  // 移动')
console.log()

// ============================================
// 12. 文件权限
// ============================================
console.log('12. 文件权限')
console.log('    fs.chmodSync("file.txt", 0o644)')
console.log('    fs.accessSync("file.txt", fs.constants.R_OK | fs.constants.W_OK)')
console.log()

console.log('    常用权限:')
console.log('      0o644 - rw-r--r-- (普通文件)')
console.log('      0o755 - rwxr-xr-x (可执行文件)')
console.log('      0o777 - rwxrwxrwx (全部权限)')
console.log()

// ============================================
// 13. 流式读写
// ============================================
console.log('13. 流式读写 (大文件推荐)')

console.log('    // 创建可读流')
console.log('    const rs = fs.createReadStream("big.txt", { encoding: "utf8" })')
console.log('    rs.on("data", chunk => console.log(chunk))')
console.log('    rs.on("end", () => console.log("Done"))')
console.log()

console.log('    // 创建可写流')
console.log('    const ws = fs.createWriteStream("output.txt")')
console.log('    ws.write("Hello\\n")')
console.log('    ws.write("World\\n")')
console.log('    ws.end()')
console.log()

console.log('    // 管道操作')
console.log('    rs.pipe(ws)')
console.log()

// ============================================
// 14. 文件监听
// ============================================
console.log('14. 文件监听')
console.log('    fs.watch("file.txt", (eventType, filename) => {')
console.log('      console.log(eventType, filename)')
console.log('    })')
console.log()

console.log('    fs.watchFile("file.txt", (curr, prev) => {')
console.log('      console.log("文件被修改")')
console.log('    })')
console.log()

// ============================================
// 15. 常用 flags
// ============================================
console.log('15. 文件打开 flags')
console.log('    "r"   - 只读')
console.log('    "r+"  - 读写')
console.log('    "w"   - 只写(覆盖)')
console.log('    "w+"  - 读写(覆盖)')
console.log('    "a"   - 追加')
console.log('    "a+"  - 读写追加')
console.log('    "ax"  - 独占创建')
console.log()

// ============================================
// 16. 实用示例
// ============================================
console.log('16. 实用示例')
console.log('    ================================')
console.log('    # 递归创建目录')
console.log('    fs.mkdirSync("a/b/c", { recursive: true })')
console.log()
console.log('    # 递归删除目录')
console.log('    fs.rmSync("dir", { recursive: true, force: true })')
console.log()
console.log('    # 确保目录存在后写入')
console.log('    fs.mkdirSync("dir", { recursive: true })')
console.log('    fs.writeFileSync("dir/file.txt", "content")')
console.log()
console.log('    # 复制整个目录')
console.log('    fs.cpSync("src", "dest", { recursive: true })')
console.log()
console.log('    # 读取 JSON 文件')
console.log('    const config = JSON.parse(fs.readFileSync("config.json"))')
console.log('    ================================')

// 清理临时文件
fs.unlinkSync(tempFile)

console.log('\n========== 学习完成 ==========')
