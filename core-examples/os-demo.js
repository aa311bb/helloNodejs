/**
 * Node.js OS 模块学习示例
 * OS模块用于获取操作系统和硬件相关信息
 */

const os = require('os');

console.log('========== Node.js OS 模块示例 ==========\n');

// 1. os.type() - 操作系统类型
console.log('1. os.type() - 操作系统类型');
console.log('   os.type():', os.type());
console.log();

// 2. os.platform() - 操作系统平台
console.log('2. os.platform() - 操作系统平台');
console.log('   os.platform():', os.platform());
console.log('   常见值: "win32", "linux", "darwin"(Mac), "freebsd"');
console.log();

// 3. os.release() - 操作系统版本
console.log('3. os.release() - 操作系统版本');
console.log('   os.release():', os.release());
console.log();

// 4. os.hostname() - 主机名
console.log('4. os.hostname() - 主机名');
console.log('   os.hostname():', os.hostname());
console.log();

// 5. os.arch() - CPU 架构
console.log('5. os.arch() - CPU 架构');
console.log('   os.arch():', os.arch());
console.log('   常见值: "x64", "arm", "arm64", "ia32"');
console.log();

// 6. os.cpus() - CPU 信息
console.log('6. os.cpus() - CPU 详细信息');
const cpus = os.cpus();
console.log('   CPU 核心数:', cpus.length);
console.log('   第一个核心信息:');
console.log('     - 型号:', cpus[0].model);
console.log('     - 速度:', cpus[0].speed, 'MHz');
console.log();

// 7. os.totalmem() - 总内存
console.log('7. os.totalmem() - 系统总内存');
const totalMem = os.totalmem();
console.log('   os.totalmem():', totalMem, 'bytes');
console.log('   换算:', (totalMem / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log();

// 8. os.freemem() - 空闲内存
console.log('8. os.freemem() - 空闲内存');
const freeMem = os.freemem();
console.log('   os.freemem():', freeMem, 'bytes');
console.log('   换算:', (freeMem / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('   内存使用率:', ((1 - freeMem / totalMem) * 100).toFixed(1), '%');
console.log();

// 9. os.uptime() - 系统运行时间
console.log('9. os.uptime() - 系统运行时间(秒)');
const uptime = os.uptime();
console.log('   os.uptime():', uptime, '秒');
const hours = Math.floor(uptime / 3600);
const minutes = Math.floor((uptime % 3600) / 60);
const seconds = Math.floor(uptime % 60);
console.log('   换算:', `${hours}小时 ${minutes}分钟 ${seconds}秒`);
console.log();

// 10. os.loadavg() - 系统负载平均值
console.log('10. os.loadavg() - 系统负载平均值');
console.log('    os.loadavg():', os.loadavg());
console.log('    [1分钟, 5分钟, 15分钟] 的平均负载');
console.log();

// 11. os.homedir() - 用户主目录
console.log('11. os.homedir() - 当前用户主目录');
console.log('    os.homedir():', os.homedir());
console.log();

// 12. os.tmpdir() - 临时目录
console.log('12. os.tmpdir() - 系统临时目录');
console.log('    os.tmpdir():', os.tmpdir());
console.log();

// 13. os.endianness() - 字节序
console.log('13. os.endianness() - CPU 字节序');
console.log('    os.endianness():', os.endianness());
console.log('    "BE" = 大端序, "LE" = 小端序');
console.log();

// 14. os.networkInterfaces() - 网络接口
console.log('14. os.networkInterfaces() - 网络接口信息');
const networks = os.networkInterfaces();
console.log('    可用的网络接口:');
Object.keys(networks).forEach(name => {
    console.log(`    - ${name}:`);
    networks[name].forEach((iface, i) => {
        console.log(`      [${i}] ${iface.family} - ${iface.address}`);
    });
});
console.log();

// 15. os.userInfo() - 当前用户信息
console.log('15. os.userInfo() - 当前用户信息');
const userInfo = os.userInfo();
console.log('    os.userInfo():');
console.log('      - 用户名:', userInfo.username);
console.log('      - 用户ID:', userInfo.uid);
console.log('      - 组ID:', userInfo.gid);
console.log('      - Shell:', userInfo.shell);
console.log('      - 主目录:', userInfo.homedir);
console.log();

// 16. os.EOL - 行结束符
console.log('16. os.EOL - 系统行结束符');
console.log('    os.EOL:', JSON.stringify(os.EOL));
console.log('    Windows: "\\r\\n", Linux/Mac: "\\n"');
console.log();

// 17. os.devNull - 空设备路径
console.log('17. os.devNull - 空设备路径');
console.log('    os.devNull:', os.devNull);
console.log();

// 18. 实用示例：系统监控
console.log('18. 实用示例 - 简单系统监控');
console.log('    ================================');
console.log('    操作系统:', os.type(), os.release());
console.log('    平台:', os.platform(), '| 架构:', os.arch());
console.log('    主机名:', os.hostname());
console.log('    CPU:', cpus[0].model);
console.log('    CPU核心数:', cpus.length);
console.log('    总内存:', (totalMem / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('    可用内存:', (freeMem / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('    内存使用率:', ((1 - freeMem / totalMem) * 100).toFixed(1), '%');
console.log('    系统运行时间:', `${hours}小时${minutes}分钟`);
console.log('    ================================');

console.log('\n========== 学习完成 ==========');
