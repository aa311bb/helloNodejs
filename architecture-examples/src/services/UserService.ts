/**
 * ============================================
 * UserService - 用户业务逻辑层
 * ============================================
 *
 * 核心概念：
 *
 * 【分层架构】
 *   Controller（控制器）→ 接收请求，返回响应
 *   Service（服务层）  → 处理业务逻辑 ← 你在这里
 *   Repository（数据层）→ 操作数据库（Prisma）
 *
 *   Service 被夹在 Controller 和数据库之间
 *   它不知道 HTTP 请求的存在，只知道业务规则
 *
 * 【依赖注入 DI】
 *   传统方式：this.prisma = new PrismaClient()  ← 自己创建，紧耦合
 *   DI方式：   constructor(prisma) { ... }       ← 外部传入，松耦合
 *
 *   @injectable()   → 告诉 IoC 容器："我可以被注入"
 *   @inject(TYPES)  → 告诉 IoC 容器："请把这个类型注入到这里"
 */

import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { PrismaClient, type User } from '../generated/prisma/client.js'
import { TYPES } from '../types.js'

@injectable()  // ← 必须加这个！让 Inversify 能管理这个类
export class UserService {

  // 构造函数注入
  // @inject(TYPES.PrismaClient) 告诉容器："请注入 PrismaClient 实例"
  // private prisma: PrismaClient 是 TypeScript 类型注解（编译后会被擦除）
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  /**
   * 获取用户列表（分页）
   *
   * Prisma 对比 Knex：
   *   Knex:   db('users').select('*').orderBy('id','desc').limit(10)
   *   Prisma: prisma.user.findMany({ orderBy: { id: 'desc' }, take: 10 })
   *
   * Prisma 的 API 更像操作 JavaScript 对象，不需要写 SQL 风格的链式调用
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit

    // Promise.all 同时执行两个查询，提高性能
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { id: 'desc' },  // ORDER BY id DESC
        take: limit,               // LIMIT 10
        skip,                      // OFFSET 0
      }),
      this.prisma.user.count(),    // SELECT COUNT(*)
    ])

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  /**
   * 根据 ID 查找用户
   *
   * findUnique：根据唯一字段（主键/unique）查询
   * 如果找不到返回 null
   */
  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } })
  }

  /**
   * 创建用户
   *
   * create：插入一条记录
   * data：要插入的字段
   *
   * 注意：不需要手动传 created_at / updated_at
   * Prisma schema 中的 @default(now()) 和 @updatedAt 会自动处理
   */
  async create(data: { name: string; email: string; age?: number; gender?: string }) {
    return await this.prisma.user.create({ data })
  }

  /**
   * 更新用户
   *
   * update：更新一条记录
   * where：定位哪条记录
   * data：更新哪些字段
   */
  async update(id: number, data: Partial<User>) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.age !== undefined && { age: data.age }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.status !== undefined && { status: data.status }),
      },
    })
  }

  /**
   * 删除用户
   *
   * delete：删除一条记录
   * 因为 schema 中 Article 有 onDelete: Cascade
   * 所以删除用户时，该用户的文章会自动被删除
   */
  async delete(id: number) {
    return await this.prisma.user.delete({ where: { id } })
  }
}
