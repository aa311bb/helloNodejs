/**
 * Node.js Child Process 模块学习示例
 * child_process 模块用于创建子进程执行命令
 */

import { spawn, exec, execFile, fork } from 'child_process';

console.log('========== Node.js Child Process 模块示例 ==========\n');

// ============================================
// 1. spawn - 启动子进程，流式输出
// ============================================
console.log('1. spawn - 启动子进程（流式输出）');
console.log('   用途: 执行长时间运行的命令，需要实时获取输出');
console.log('   语法: spawn(command[, args][, options])');
console.log();

// 示例：在 Windows 上使用 dir，Linux/Mac 上使用 ls
const isWin = process.platform === 'win32';
const listCmd = isWin ? 'dir' : 'ls';
const listArgs = isWin ? [] : ['-la'];

console.log('   示例代码:');
console.log(`   const { spawn } = require('child_process');`);
console.log(`   const child = spawn('${listCmd}', ${JSON.stringify(listArgs)});`);
console.log();
console.log('   child.stdout.on("data", data => console.log(data.toString()))');
console.log('   child.stderr.on("data", data => console.error(data.toString()))');
console.log('   child.on("close", code => console.log("退出码:", code))');
console.log();

// ============================================
// 2. exec - 执行命令，缓冲输出
// ============================================
console.log('2. exec - 执行命令并缓冲输出');
console.log('   用途: 执行简单命令，一次性获取所有输出');
console.log('   语法: exec(command[, options][, callback])');
console.log();

console.log('   示例代码:');
console.log(`   const { exec } = require('child_process');`);
console.log(`   exec('${listCmd}', (error, stdout, stderr) => {`);
console.log(`     if (error) { console.error('错误:', error); return; }`);
console.log(`     console.log('输出:', stdout);`);
console.log(`   });`);
console.log();

// ============================================
// 3. execFile - 执行可执行文件
// ============================================
console.log('3. execFile - 执行可执行文件');
console.log('   用途: 直接执行可执行文件，比 exec 更安全');
console.log('   语法: execFile(file[, args][, options][, callback])');
console.log();

const nodeCmd = isWin ? 'node.exe' : 'node';
console.log('   示例代码:');
console.log(`   const { execFile } = require('child_process');`);
console.log(`   execFile('${nodeCmd}', ['--version'], (error, stdout) => {`);
console.log(`     console.log('Node 版本:', stdout);`);
console.log(`   });`);
console.log();

// ============================================
// 4. fork - 创建 Node.js 子进程
// ============================================
console.log('4. fork - 创建 Node.js 子进程');
console.log('   用途: 创建 Node.js 子进程，支持 IPC 通信');
console.log('   语法: fork(modulePath[, args][, options])');
console.log();

console.log('   示例代码:');
console.log(`   const { fork } = require('child_process');`);
console.log(`   const child = fork('./child.js');`);
console.log();
console.log(`   // 发送消息给子进程`);
console.log(`   child.send({ type: 'greeting', data: 'Hello' });`);
console.log();
console.log(`   // 接收子进程消息`);
console.log(`   child.on('message', msg => {`);
console.log(`     console.log('来自子进程:', msg);`);
console.log(`   });`);
console.log();

// ============================================
// 5. 同步版本
// ============================================
console.log('5. 同步版本');
console.log('   - execSync(command[, options])');
console.log('   - execFileSync(file[, args][, options])');
console.log('   - spawnSync(command[, args][, options])');
console.log();

console.log('   示例代码:');
console.log(`   const { execSync } = require('child_process');`);
console.log(`   const output = execSync('${listCmd}', { encoding: 'utf-8' });`);
console.log(`   console.log(output);`);
console.log();

// ============================================
// 6. options 选项
// ============================================
console.log('6. 常用 options 选项');
console.log('   {');
console.log('     cwd: "/path/to/dir",       // 工作目录');
console.log('     env: { NODE_ENV: "test" }, // 环境变量');
console.log('     encoding: "utf-8",         // 编码');
console.log('     timeout: 5000,             // 超时时间(ms)');
console.log('     maxBuffer: 200*1024,       // 最大缓冲区(exec)');
console.log('     shell: true,               // 使用 shell');
console.log('     detached: true,            // 独立进程');
console.log('     stdio: ["pipe","pipe","pipe"] // 标准流配置');
console.log('   }');
console.log();

// ============================================
// 7. stdio 配置
// ============================================
console.log('7. stdio 配置');
console.log('   - "pipe": 创建管道（默认）');
console.log('   - "inherit": 继承父进程');
console.log('   - "ignore": 忽略');
console.log('   - Stream: 使用指定流');
console.log();

console.log('   示例:');
console.log(`   spawn('node', ['script.js'], { stdio: 'inherit' });`);
console.log(`   spawn('node', ['script.js'], { stdio: ['pipe', 'inherit', 'pipe'] });`);
console.log();

// ============================================
// 8. 子进程事件
// ============================================
console.log('8. 子进程事件');
console.log('   child.on("close", (code, signal) => {})  // 进程关闭');
console.log('   child.on("exit", (code, signal) => {})   // 进程退出');
console.log('   child.on("error", (err) => {})           // 发生错误');
console.log('   child.on("disconnect", () => {})         // IPC 断开(fork)');
console.log('   child.on("message", (msg) => {})         // 收到消息(fork)');
console.log();

// ============================================
// 9. 子进程方法
// ============================================
console.log('9. 子进程方法');
console.log('   child.stdin.write(data)    // 写入标准输入');
console.log('   child.stdout.on("data")    // 读取标准输出');
console.log('   child.stderr.on("data")    // 读取标准错误');
console.log('   child.kill([signal])       // 发送信号终止进程');
console.log('   child.send(msg)            // 发送消息(fork)');
console.log('   child.disconnect()         // 断开 IPC 连接(fork)');
console.log('   child.unref()              // 允许父进程独立退出');
console.log('   child.ref()                // 不允许父进程独立退出');
console.log();

// ============================================
// 10. 实用示例
// ============================================
console.log('10. 实用示例');
console.log('    =================================');
console.log('    # 执行 shell 命令获取输出');
console.log(`    exec('git status', (err, stdout) => console.log(stdout))`);
console.log();
console.log('    # 实时获取命令输出');
console.log(`    spawn('npm', ['install'], { stdio: 'inherit' })`);
console.log();
console.log('    # 并行执行多个任务');
console.log(`    fork('./task1.js'), fork('./task2.js')`);
console.log();
console.log('    # 进程间通信');
console.log(`    child.send({ cmd: 'process', data })`);
console.log('    =================================');

console.log('\n========== 学习完成 ==========');
