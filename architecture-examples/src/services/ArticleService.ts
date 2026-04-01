/**
 * ============================================
 * ArticleService - 文章业务逻辑层
 * ============================================
 *
 * 本文件演示 Prisma 的三个核心高级功能：
 *
 * 1. include（关联查询）- 自动 JOIN 关联表
 *    相当于 SQL 的 JOIN，但不需要手写 ON 条件
 *    Prisma 根据 schema 中的 @relation 自动处理
 *
 * 2. 嵌套 include - 多层关联查询
 *    文章 → 作者（多对一）
 *    文章 → 标签（多对多，通过中间表）
 *
 * 3. $transaction（事务）- 保证多个操作的原子性
 *    创建文章 + 打标签，要么全成功，要么全失败
 */

import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { PrismaClient } from '../generated/prisma/client.js'
import { TYPES } from '../types.js'

@injectable()
export class ArticleService {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  /**
   * 获取文章列表（含作者信息）
   *
   * 【Prisma include 关联查询】
   *
   * Knex 连表写法：
   *   db('articles')
   *     .select('articles.*', 'users.name as author_name')
   *     .join('users', 'articles.author_id', 'users.id')
   *
   * Prisma 连表写法：
   *   prisma.article.findMany({
   *     include: { author: true }  // 自动 JOIN users 表，返回完整 author 对象
   *   })
   *
   * Prisma 会自动处理 JOIN，你不需要手写 SQL 的 ON 条件
   * 因为 schema 中的 @relation 已经定义了关联关系
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit

    // Promise.all 同时执行两个独立的查询，提高性能
    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
        // include: 包含关联模型的数据
        // author: true → 自动 JOIN users 表，返回作者完整信息
        include: {
          author: {
            select: { id: true, name: true, email: true },  // 只返回部分字段
          },
        },
        orderBy: { id: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.article.count(),
    ])

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  /**
   * 获取文章详情（包含作者和标签）
   *
   * 【嵌套 include】
   *
   * 数据关系：
   *   articles → author（多对一，直接关联）
   *   articles → tags → tag（多对多，通过中间表 article_tags）
   *
   * Prisma 自动处理多层 JOIN：
   *   1. JOIN users 获取作者信息
   *   2. JOIN article_tags 获取中间表数据
   *   3. JOIN tags 获取标签详情
   *
   * 你只需要写 include 嵌套结构，SQL 全自动生成
   */
  async findById(id: number) {
    return await this.prisma.article.findUnique({
      where: { id },
      include: {
        // 第一层：包含作者信息（多对一）
        author: {
          select: { id: true, name: true, email: true },
        },
        // 第二层：包含标签信息（多对多，通过中间表 article_tags）
        tags: {
          include: {
            tag: true,  // 中间表 → 标签表的完整数据
          },
        },
      },
    })
  }

  /**
   * 创建文章（普通方式）
   *
   * Prisma vs Knex 插入对比：
   *   Knex:   db('articles').insert({ title, content, author_id })
   *   Prisma: prisma.article.create({ data: { title, content, authorId } })
   *
   * 注意字段名差异：
   *   Knex 用数据库列名（snake_case）：author_id
   *   Prisma 用模型属性名（camelCase）：authorId
   *   Prisma 会自动把 authorId 映射到 author_id 列
   */
  async create(data: { title: string; content?: string; author_id: number; price?: number }) {
    return await this.prisma.article.create({
      data: {
        title: data.title,
        content: data.content || '',
        authorId: data.author_id,  // 接口用 snake_case，Prisma 用 camelCase
        price: data.price || 0,
      },
    })
  }

  /**
   * 【事务】创建文章 + 打标签（原子操作）
   *
   * $transaction(callback) 是 Prisma 的事务 API
   *
   * 事务的 ACID 特性：
   * - Atomicity（原子性）：全部成功或全部失败
   * - Consistency（一致性）：数据从一个一致状态变到另一个一致状态
   * - Isolation（隔离性）：事务之间互不影响
   * - Durability（持久性）：提交后数据永久保存
   *
   * 对比 Knex 事务：
   *   Knex:   const trx = await db.transaction(); trx.commit(); trx.rollback();
   *   Prisma: prisma.$transaction(async (tx) => { ... })  // 自动 commit/rollback
   *
   * Prisma 的交互式事务更简洁：
   * - callback 正常执行完 → 自动 commit
   * - callback 抛出错误 → 自动 rollback
   */
  async createWithTags(data: { title: string; content?: string; author_id: number; price?: number; tag_ids?: number[] }) {
    return await this.prisma.$transaction(async (tx) => {
      // tx 是事务客户端，所有操作通过 tx 执行
      // 步骤1：创建文章
      const article = await tx.article.create({
        data: {
          title: data.title,
          content: data.content || '',
          authorId: data.author_id,
          price: data.price || 0,
        },
      })

      // 步骤2：创建文章-标签关联
      if (data.tag_ids && data.tag_ids.length > 0) {
        await tx.articleTag.createMany({
          data: data.tag_ids.map(tagId => ({
            articleId: article.id,
            tagId,
          })),
        })
      }

      // 如果上面任一步骤出错，整个事务自动回滚
      // 两步都成功，返回文章
      return article
    })
    // $transaction 结束后自动 commit
  }

  /**
   * 更新文章
   *
   * 使用展开运算符(...)实现"只更新传入的字段"
   * 如果某个字段是 undefined，就不会被包含在更新数据中
   */
  async update(id: number, data: any) {
    return await this.prisma.article.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.status !== undefined && { status: data.status }),
      },
    })
  }

  /**
   * 删除文章
   *
   * 因为 Prisma schema 中 ArticleTag 设置了 onDelete: Cascade
   * 删除文章时，中间表 article_tags 中的关联记录也会自动删除
   * 不需要手动清理中间表数据
   */
  async delete(id: number) {
    return await this.prisma.article.delete({ where: { id } })
  }
}
