/**
 * ============================================
 * TYPES - 类型标识常量
 * ============================================
 *
 * IoC 容器用这些标识来绑定和查找依赖
 * 就像字典的 key，容器根据 key 找到对应的实例
 *
 * Symbol.for() 创建全局唯一的标识
 * 确保每次 import 都是同一个标识
 */

export const TYPES = {
  // Service 层标识
  UserService: Symbol.for('UserService'),
  ArticleService: Symbol.for('ArticleService'),
  TagService: Symbol.for('TagService'),

  // 数据库标识
  PrismaClient: Symbol.for('PrismaClient'),
}
