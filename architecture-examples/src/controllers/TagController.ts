/**
 * ============================================
 * TagController - 标签控制器
 * ============================================
 *
 * 最简单的控制器，只有两个端点：
 * - GET  /api/tags     → 获取所有标签（附带文章计数）
 * - POST /api/tags     → 创建新标签
 *
 * 适合理解装饰器路由的基本用法
 */

import 'reflect-metadata'
import {
  controller,
  httpGet,
  httpPost,
  requestBody,
  BaseHttpController,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../types.js'
import { TagService } from '../services/TagService.js'

@controller('/api/tags')
export class TagController extends BaseHttpController {

  // 注入 TagService
  constructor(
    @inject(TYPES.TagService) private tagService: TagService
  ) {
    super()
  }

  /**
   * GET /api/tags
   *
   * 获取所有标签，包含每个标签有多少篇文章
   *
   * 返回示例：
   * [
   *   { "id": 1, "name": "Prisma", "_count": { "articles": 2 } },
   *   { "id": 2, "name": "IoC",    "_count": { "articles": 1 } },
   * ]
   *
   * _count 是 Prisma 的内置聚合功能
   * 相当于 SQL: SELECT tags.*, COUNT(article_tags.id) FROM tags LEFT JOIN article_tags ...
   */
  @httpGet('/')
  public async findAll() {
    const tags = await this.tagService.findAll()
    return this.json(tags)
  }

  /**
   * POST /api/tags
   *
   * 创建标签
   * Body: { name: string }
   */
  @httpPost('/')
  public async create(@requestBody() body: { name: string }) {
    if (!body.name) {
      return this.json({ error: 'name 是必填字段' }, 400)
    }
    const tag = await this.tagService.create(body)
    return this.json(tag, 201)
  }
}
