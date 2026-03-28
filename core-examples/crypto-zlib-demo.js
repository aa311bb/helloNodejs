/**
 * Node.js Crypto 加密模块 & Zlib 压缩模块学习示例
 */

import crypto from 'crypto'
import zlib from 'zlib'

console.log('========== Crypto 加密模块 & Zlib 压缩模块示例 ==========\n')

// ============================================
// 一、CRYPTO 加密模块
// ============================================
console.log('╔══════════════════════════════════════════╗')
console.log('║         一、CRYPTO 加密模块               ║')
console.log('╚══════════════════════════════════════════╝\n')

// ============================================
// 1. 哈希算法
// ============================================
console.log('1. 哈希算法 (Hash) - 单向加密')
console.log('   ================================')

// 创建哈希
const hash = crypto.createHash('sha256')
hash.update('Hello World')
console.log('   crypto.createHash("sha256").update("Hello World").digest("hex")')
console.log('   →', hash.digest('hex'))
console.log()

// 常用哈希算法
console.log('   常用哈希算法:')
console.log('   - md5:    32位十六进制（已不安全）')
console.log('   - sha1:   40位十六进制（已不安全）')
console.log('   - sha256: 64位十六进制（推荐）')
console.log('   - sha512: 128位十六进制（更安全）')
console.log()

// ============================================
// 2. HMAC 消息认证码
// ============================================
console.log('2. HMAC - 带密钥的哈希')
console.log('   ================================')

const hmac = crypto.createHmac('sha256', 'my-secret-key')
hmac.update('message')
console.log('   crypto.createHmac("sha256", "secret").update("message").digest("hex")')
console.log('   →', hmac.digest('hex'))
console.log()

// ============================================
// 3. 对称加密 (AES)
// ============================================
console.log('3. 对称加密 AES - 加密解密用同一密钥')
console.log('   ================================')

const algorithm = 'aes-256-cbc'
const key = crypto.randomBytes(32)  // 32字节密钥
const iv = crypto.randomBytes(16)   // 16字节初始向量

// 加密
const cipher = crypto.createCipheriv(algorithm, key, iv)
let encrypted = cipher.update('敏感数据', 'utf8', 'hex')
encrypted += cipher.final('hex')
console.log('   加密:')
console.log('   algorithm:', algorithm)
console.log('   key (32 bytes):', key.toString('hex').slice(0, 16) + '...')
console.log('   iv  (16 bytes):', iv.toString('hex'))
console.log('   原文: "敏感数据"')
console.log('   密文:', encrypted)
console.log()

// 解密
const decipher = crypto.createDecipheriv(algorithm, key, iv)
let decrypted = decipher.update(encrypted, 'hex', 'utf8')
decrypted += decipher.final('utf8')
console.log('   解密:')
console.log('   →', decrypted)
console.log()

// ============================================
// 4. 非对称加密 (RSA)
// ============================================
console.log('4. 非对称加密 RSA - 公钥加密，私钥解密')
console.log('   ================================')

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
})

const rsaEncrypted = crypto.publicEncrypt(publicKey, Buffer.from('秘密消息'))
const rsaDecrypted = crypto.privateDecrypt(privateKey, rsaEncrypted)

console.log('   crypto.generateKeyPairSync("rsa", { modulusLength: 2048 })')
console.log('   公钥加密: crypto.publicEncrypt(publicKey, buffer)')
console.log('   私钥解密: crypto.privateDecrypt(privateKey, encrypted)')
console.log('   原文: "秘密消息"')
console.log('   解密后:', rsaDecrypted.toString())
console.log()

// ============================================
// 5. 数字签名
// ============================================
console.log('5. 数字签名 - 私钥签名，公钥验证')
console.log('   ================================')

const data = Buffer.from('重要文档内容')
const sign = crypto.sign('sha256', data, privateKey)
const verify = crypto.verify('sha256', data, publicKey, sign)

console.log('   crypto.sign("sha256", data, privateKey)')
console.log('   签名:', sign.toString('hex').slice(0, 32) + '...')
console.log('   crypto.verify("sha256", data, publicKey, sign)')
console.log('   验证结果:', verify)  // true
console.log()

// ============================================
// 6. 随机数
// ============================================
console.log('6. 随机数生成')
console.log('   ================================')
console.log('   crypto.randomBytes(16).toString("hex")')
console.log('   →', crypto.randomBytes(16).toString('hex'))
console.log()
console.log('   crypto.randomUUID()')
console.log('   →', crypto.randomUUID())
console.log()
console.log('   crypto.randomInt(1, 100)')
console.log('   →', crypto.randomInt(1, 100))
console.log()

// ============================================
// 7. 密码哈希 (PBKDF2 / scrypt)
// ============================================
console.log('7. 密码哈希 (推荐用于存储密码)')
console.log('   ================================')

// PBKDF2
const salt = crypto.randomBytes(16)
const password = 'user-password'
const hashedPassword = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512')

console.log('   PBKDF2:')
console.log('   crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)')
console.log('   iterations: 100000 (越高越安全但越慢)')
console.log('   结果:', hashedPassword.toString('hex').slice(0, 32) + '...')
console.log()

// scrypt (更推荐)
const scryptHash = crypto.scryptSync(password, salt, 64)
console.log('   scrypt (更推荐):')
console.log('   crypto.scryptSync(password, salt, keylen)')
console.log('   结果:', scryptHash.toString('hex').slice(0, 32) + '...')
console.log()

// ============================================
// 8. 常用加密模式
// ============================================
console.log('8. AES 加密模式')
console.log('   ================================')
console.log('   aes-128-cbc  - 128位密钥，CBC模式')
console.log('   aes-256-cbc  - 256位密钥，CBC模式（推荐）')
console.log('   aes-128-gcm  - 128位密钥，GCM模式（认证加密）')
console.log('   aes-256-gcm  - 256位密钥，GCM模式（推荐）')
console.log()

// ============================================
// 二、ZLIB 压缩模块
// ============================================
console.log('\n╔══════════════════════════════════════════╗')
console.log('║         二、ZLIB 压缩模块                 ║')
console.log('╚══════════════════════════════════════════╝\n')

// ============================================
// 1. 同步压缩/解压
// ============================================
console.log('1. 同步压缩与解压')
console.log('   ================================')

const original = 'Hello World! '.repeat(10)
console.log('   原始数据:', original.length, 'bytes')

// Deflate 压缩
const deflated = zlib.deflateSync(Buffer.from(original))
console.log('   deflateSync:', deflated.length, 'bytes')
console.log('   压缩率:', ((1 - deflated.length / original.length) * 100).toFixed(1) + '%')

// Inflate 解压
const inflated = zlib.inflateSync(deflated)
console.log('   inflateSync:', inflated.toString().slice(0, 20) + '...')
console.log()

// Gzip 压缩
const gzipped = zlib.gzipSync(Buffer.from(original))
console.log('   gzipSync:', gzipped.length, 'bytes')

// Gunzip 解压
const gunzipped = zlib.gunzipSync(gzipped)
console.log('   gunzipSync:', gunzipped.toString().slice(0, 20) + '...')
console.log()

// ============================================
// 2. 异步压缩 (回调)
// ============================================
console.log('2. 异步回调方式')
console.log('   ================================')
console.log('   zlib.deflate(buffer, (err, result) => { ... })')
console.log('   zlib.gzip(buffer, (err, result) => { ... })')
console.log()

// ============================================
// 3. Promise 方式
// ============================================
console.log('3. Promise 方式 (推荐)')
console.log('   ================================')
console.log('   import { promisify } from "util"')
console.log('   const gzip = promisify(zlib.gzip)')
console.log('   const compressed = await gzip(buffer)')
console.log()

// ============================================
// 4. 流式压缩
// ============================================
console.log('4. 流式压缩 (大文件推荐)')
console.log('   ================================')
console.log('   // 压缩文件')
console.log('   fs.createReadStream("input.txt")')
console.log('     .pipe(zlib.createGzip())')
console.log('     .pipe(fs.createWriteStream("input.txt.gz"))')
console.log()
console.log('   // 解压文件')
console.log('   fs.createReadStream("input.txt.gz")')
console.log('     .pipe(zlib.createGunzip())')
console.log('     .pipe(fs.createWriteStream("output.txt"))')
console.log()

// ============================================
// 5. 压缩算法对比
// ============================================
console.log('5. 压缩算法对比')
console.log('   ================================')

const testData = Buffer.from('ABCDEFGHIJ'.repeat(100))

const deflateResult = zlib.deflateSync(testData)
const gzipResult = zlib.gzipSync(testData)
const brotliResult = zlib.brotliCompressSync(testData)

console.log('   原始大小:', testData.length, 'bytes')
console.log('   Deflate:', deflateResult.length, 'bytes')
console.log('   Gzip:   ', gzipResult.length, 'bytes')
console.log('   Brotli: ', brotliResult.length, 'bytes (压缩率最高)')
console.log()

// ============================================
// 6. 压缩级别
// ============================================
console.log('6. 压缩级别 (level: 1-9)')
console.log('   ================================')
console.log('   zlib.gzipSync(buffer, { level: 1 })  // 最快，压缩率低')
console.log('   zlib.gzipSync(buffer, { level: 5 })  // 平衡')
console.log('   zlib.gzipSync(buffer, { level: 9 })  // 最慢，压缩率高')
console.log()

// ============================================
// 实用示例
// ============================================
console.log('\n========== 实用示例 ==========\n')

console.log('1. 密码存储:')
console.log('   const salt = crypto.randomBytes(16)')
console.log('   const hash = crypto.scryptSync(password, salt, 64)')
console.log('   存储: salt.toString("hex") + ":" + hash.toString("hex")')
console.log()

console.log('2. API 签名验证:')
console.log('   const sign = crypto.createHmac("sha256", secret)')
console.log('   sign.update(JSON.stringify(params))')
console.log('   const signature = sign.digest("hex")')
console.log()

console.log('3. 文件压缩:')
console.log('   fs.createReadStream("big.log")')
console.log('     .pipe(zlib.createGzip())')
console.log('     .pipe(fs.createWriteStream("big.log.gz"))')
console.log()

console.log('4. HTTPS 响应压缩:')
console.log('   const zlib = require("zlib")')
console.log('   res.writeHead(200, { "Content-Encoding": "gzip" })')
console.log('   zlib.gzipSync(data)')
console.log()

console.log('========== 学习完成 ==========')
