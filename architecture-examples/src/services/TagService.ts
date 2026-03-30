/**
 * ============================================
 * TagService - 标签业务逻辑层
 * ============================================
 */

import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import { PrismaClient } from '@prisma/client'
import { TYPES } from '../types.js'

@injectable()
export class TagService {
  constructor(
    @inject(TYPES.PrismaClient) private prisma: PrismaClient
  ) {}

  /**
   * 获取所有标签（含关联文章数）
   *
   * _count：Prisma 内置的计数功能
   * 相当于 Knex 的 COUNT + GROUP BY，但不需要手写
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

  async create(data: { name: string }) {
    return await this.prisma.tag.create({ data })
  }
}
