/**
 * Node.js Process 模块学习示例
 * Process 是全局对象，无需 require，直接使用
 */

console.log('========== Node.js Process 模块示例 ==========\n');

// 1. process.argv - 命令行参数
console.log('1. process.argv - 命令行参数');
console.log('   process.argv:', process.argv);
console.log('   - process.argv[0]: Node.js 可执行文件路径');
console.log('   - process.argv[1]: 当前执行的脚本路径');
console.log('   - process.argv[2+]: 传入的参数');
console.log();

// 2. process.env - 环境变量
console.log('2. process.env - 环境变量');
console.log('   process.env.NODE_ENV:', process.env.NODE_ENV || '(未设置)');
console.log('   process.env.PATH:', process.env.PATH?.substring(0, 50) + '...');
console.log('   process.env.HOME / USERPROFILE:', process.env.HOME || process.env.USERPROFILE);
console.log();

// 3. process.cwd() - 当前工作目录
console.log('3. process.cwd() - 当前工作目录');
console.log('   process.cwd():', process.cwd());
console.log();

// 4. process.pid - 进程ID
console.log('4. process.pid - 进程ID');
console.log('   process.pid:', process.pid);
console.log();

// 5. process.version / process.versions - 版本信息
console.log('5. process.version / process.versions - 版本信息');
console.log('   process.version:', process.version);
console.log('   process.versions:', JSON.stringify(process.versions, null, 2).replace(/\n/g, '\n   '));
console.log();

// 6. process.platform / process.arch - 平台信息
console.log('6. process.platform / process.arch - 平台信息');
console.log('   process.platform:', process.platform);
console.log('   process.arch:', process.arch);
console.log();

// 7. process.title - 进程标题
console.log('7. process.title - 进程标题');
console.log('   process.title:', process.title);
console.log();

// 8. process.memoryUsage() - 内存使用
console.log('8. process.memoryUsage() - 内存使用情况');
const mem = process.memoryUsage();
console.log('   process.memoryUsage():');
console.log('     - rss (常驻内存):', (mem.rss / 1024 / 1024).toFixed(2), 'MB');
console.log('     - heapTotal (堆总量):', (mem.heapTotal / 1024 / 1024).toFixed(2), 'MB');
console.log('     - heapUsed (堆使用):', (mem.heapUsed / 1024 / 1024).toFixed(2), 'MB');
console.log('     - external (外部内存):', (mem.external / 1024 / 1024).toFixed(2), 'MB');
console.log();

// 9. process.cpuUsage() - CPU使用
console.log('9. process.cpuUsage() - CPU使用情况');
const cpu = process.cpuUsage();
console.log('   process.cpuUsage():');
console.log('     - user (用户态):', (cpu.user / 1000).toFixed(2), 'ms');
console.log('     - system (内核态):', (cpu.system / 1000).toFixed(2), 'ms');
console.log();

// 10. process.uptime() - 进程运行时间
console.log('10. process.uptime() - 进程运行时间');
console.log('    process.uptime():', process.uptime().toFixed(2), '秒');
console.log();

// 11. process.hrtime() - 高精度时间
console.log('11. process.hrtime() - 高精度时间');
const hrTime = process.hrtime();
console.log('    process.hrtime():', hrTime);
console.log('    - 秒:', hrTime[0]);
console.log('    - 纳秒:', hrTime[1]);
console.log();

// 12. process.nextTick() - 下一个事件循环
console.log('12. process.nextTick() - 下一个事件循环执行');
console.log('    (同步代码执行完毕后立即执行)');
process.nextTick(() => {
    console.log('    [nextTick] 我在下一个事件循环执行！');
});
console.log('    我先执行（同步代码）');
console.log();

// 13. 标准流
console.log('13. process.stdin / stdout / stderr - 标准流');
console.log('    process.stdin:', typeof process.stdin);
console.log('    process.stdout:', typeof process.stdout);
console.log('    process.stderr:', typeof process.stderr);
console.log();

// 14. 进程退出码
console.log('14. process.exitCode - 退出码');
console.log('    process.exitCode:', process.exitCode);
console.log('    常见退出码:');
console.log('      0 - 正常退出');
console.log('      1 - 未捕获的致命异常');
console.log('      2 - 未使用的保留码');
console.log('      3 - JavaScript 解析错误');
console.log('      4 - JavaScript 评估失败');
console.log();

// 15. process.execPath / process.execArgv
console.log('15. process.execPath / process.execArgv');
console.log('    process.execPath:', process.execPath);
console.log('    process.execArgv:', process.execArgv);
console.log();

// 16. process.config - 编译配置
console.log('16. process.config - Node.js 编译配置');
console.log('    process.config.target_defaults.default_configuration:',
    process.config?.target_defaults?.default_configuration || 'N/A');
console.log();

// 17. process.argv0 - 原始 argv[0]
console.log('17. process.argv0 - 原始 Node 可执行文件路径');
console.log('    process.argv0:', process.argv0);
console.log();

// 18. 实用示例
console.log('18. 实用示例');
console.log('    ================================');
console.log('    Node.js 版本:', process.version);
console.log('    运行平台:', process.platform, '(' + process.arch + ')');
console.log('    进程 ID:', process.pid);
console.log('    工作目录:', process.cwd());
console.log('    内存使用:', (mem.heapUsed / 1024 / 1024).toFixed(2), 'MB');
console.log('    运行时间:', process.uptime().toFixed(2), '秒');
console.log('    ================================');

console.log('\n========== 学习完成 ==========');
