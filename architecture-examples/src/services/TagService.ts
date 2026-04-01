/**
 * ============================================
 * TagService - 标签业务逻辑层
 * ============================================
 *
 * 本文件演示 Prisma 的 _count 聚合功能
 */

import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { PrismaClient } from '../generated/prisma/client.js'
import { TYPES } from '../types.js'

@injectable()
export class TagService {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  /**
   * 获取所有标签（含关联文章数）
   *
   * 【_count：Prisma 内置的计数功能】
   *
   * 相当于 SQL：
   *   SELECT tags.*, COUNT(article_tags.article_id) as article_count
   *   FROM tags
   *   LEFT JOIN article_tags ON tags.id = article_tags.tag_id
   *   GROUP BY tags.id
   *
   * 但用 Prisma 只需要写：
   *   include: { _count: { select: { articles: true } } }
   *
   * Prisma 自动帮你：
   * 1. LEFT JOIN 中间表 article_tags
   * 2. GROUP BY 分组
   * 3. COUNT 统计
   * 4. 返回结果中多一个 _count.articles 字段
   *
   * 返回示例：
   * {
   *   "id": 1,
   *   "name": "Prisma",
   *   "_count": {
   *     "articles": 2   ← 这个标签关联了2篇文章
   *   }
   * }
   */
  async findAll() {
    return await this.prisma.tag.findMany({
      orderBy: { id: 'asc' },
      include: {
        _count: {
          select: { articles: true },  // 统计每个标签有多少文章
        },
      },
    })
  }

  /**
   * 创建标签
   */
  async create(data: { name: string }) {
    return await this.prisma.tag.create({ data })
  }
}
