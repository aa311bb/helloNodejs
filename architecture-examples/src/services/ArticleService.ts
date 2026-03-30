/**
 * ============================================
 * ArticleService - 文章业务逻辑层
 * ============================================
 * 演示 Prisma 的关联查询（include）和事务（$transaction）
 */

import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { PrismaClient } from '@prisma/client'
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
   *     include: { author: true }  // 自动 JOIN，返回完整 author 对象
   *   })
   *
   * Prisma 会自动处理 JOIN，你不需要手写 SQL 的 ON 条件
   * 因为 schema 中的 @relation 已经定义了关联关系
   */
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.prisma.article.findMany({
        // include: 包含关联模型的数据
        // author: true → 自动 JOIN users 表，返回作者完整信息
        include: {
          author: {
            select: { id: true, name: true, email: true },
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
   * articles → author（多对一）
   * articles → tags → tag（多对多，通过中间表 article_tags）
   */
  async findById(id: number) {
    return await this.prisma.article.findUnique({
      where: { id },
      include: {
        // 包含作者信息
        author: {
          select: { id: true, name: true, email: true },
        },
        // 包含标签信息（通过中间表 article_tags）
        // Prisma 自动处理多对多查询
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
   */
  async create(data: { title: string; content?: string; author_id: number; price?: number }) {
    return await this.prisma.article.create({
      data: {
        title: data.title,
        content: data.content || '',
        authorId: data.author_id,
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
   */
  async delete(id: number) {
    return await this.prisma.article.delete({ where: { id } })
  }
}
