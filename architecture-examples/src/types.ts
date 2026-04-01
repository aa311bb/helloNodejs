/**
 * ============================================
 * TYPES - IoC 容器的类型标识常量
 * ============================================
 *
 * 【为什么需要 TYPES？】
 *
 * IoC 容器需要一个"标识"来区分不同的绑定关系
 * 就像字典需要 key 来查找 value：
 *
 *   container.bind(标识).to(类)     ← 注册：把这个标识和这个类绑定
 *   container.get(标识)             ← 查找：返回这个标识对应的实例
 *   @inject(标识)                   ← 注入：在构造函数中自动传入实例
 *
 * 【为什么用 Symbol 而不是字符串？】
 *
 *   字符串：  'UserService'     ← 可能和其他变量重名，不唯一
 *   Symbol：  Symbol('UserService')  ← 每次创建都是唯一的
 *   Symbol.for()：Symbol.for('UserService') ← 全局注册表，保证唯一且可重复获取
 *
 *   用 Symbol.for() 的好处：
 *   - 即使在不同文件中 import，拿到的都是同一个 Symbol
 *   - 不会和任何字符串变量名冲突
 *   - TypeScript 可以提供类型检查
 */

export const TYPES = {
  // ============================================
  // Service 层标识
  // ============================================
  // 每个标识对应容器中的一个 Service 绑定
  // 当 Controller 通过 @inject(TYPES.UserService) 请求时
  // 容器就会返回 UserService 的实例
  UserService: Symbol.for('UserService'),
  ArticleService: Symbol.for('ArticleService'),
  TagService: Symbol.for('TagService'),

  // ============================================
  // 数据库标识
  // ============================================
  // PrismaClient 是数据库客户端
  // 所有 Service 都依赖它来操作数据库
  PrismaClient: Symbol.for('PrismaClient'),
}
