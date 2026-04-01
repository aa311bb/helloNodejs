/**
 * ============================================
 * ArticleController - 文章控制器
 * ============================================
 *
 * 控制器的职责：
 * - 接收 HTTP 请求
 * - 提取请求参数（路径参数、请求体、查询参数）
 * - 调用 Service 处理业务逻辑
 * - 返回 HTTP 响应
 *
 * 控制器不包含业务逻辑！它只是一个"调度员"
 * 业务逻辑在 ArticleService 中
 *
 * 【本控制器的特殊之处】
 * - /with-tags 端点演示了 Prisma 事务（$transaction）
 * - findById 返回嵌套关联数据（文章 + 作者 + 标签）
 */

import 'reflect-metadata'
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  requestParam,
  requestBody,
  queryParam,
  BaseHttpController,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../types.js'
import { ArticleService } from '../services/ArticleService.js'

@controller('/api/articles')
export class ArticleController extends BaseHttpController {

  // 注入 ArticleService，IoC 容器自动创建并传入
  constructor(
    @inject(TYPES.ArticleService) private articleService: ArticleService
  ) {
    super()
  }

  /**
   * GET /api/articles?page=1&limit=10
   *
   * 获取文章列表（分页）
   * 每篇文章会包含作者信息（通过 Prisma include 自动 JOIN）
   */
  @httpGet('/')
  public async findAll(
    @queryParam('page') page: string,
    @queryParam('limit') limit: string,
  ) {
    const result = await this.articleService.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 10,
    )
    return this.json(result)
  }

  /**
   * GET /api/articles/:id
   *
   * 获取文章详情
   * 返回：文章 + 作者信息 + 标签列表（嵌套关联查询）
   */
  @httpGet('/:id')
  public async findById(@requestParam('id') id: string) {
    const article = await this.articleService.findById(parseInt(id))
    if (!article) {
      return this.json({ error: '文章不存在' }, 404)
    }
    return this.json(article)
  }

  /**
   * POST /api/articles
   *
   * 创建文章
   * Body: { title: string, content?: string, author_id: number, price?: number }
   */
  @httpPost('/')
  public async create(@requestBody() body: any) {
    if (!body.title || !body.author_id) {
      return this.json({ error: 'title 和 author_id 是必填字段' }, 400)
    }
    const article = await this.articleService.create(body)
    return this.json(article, 201)
  }

  /**
   * POST /api/articles/with-tags
   *
   * 【事务演示】创建文章 + 打标签（原子操作）
   * Body: { title, content?, author_id, price?, tag_ids?: number[] }
   *
   * 事务保证两步操作要么全部成功，要么全部失败
   * 不会出现"文章创建成功但标签没打上"的情况
   */
  @httpPost('/with-tags')
  public async createWithTags(@requestBody() body: any) {
    if (!body.title || !body.author_id) {
      return this.json({ error: 'title 和 author_id 是必填字段' }, 400)
    }
    const article = await this.articleService.createWithTags(body)
    return this.json(article, 201)
  }

  /**
   * PUT /api/articles/:id
   *
   * 更新文章
   * Body: { title?, content?, price?, status? }
   */
  @httpPut('/:id')
  public async update(
    @requestParam('id') id: string,
    @requestBody() body: any,
  ) {
    const updated = await this.articleService.update(parseInt(id), body)
    return this.json(updated)
  }

  /**
   * DELETE /api/articles/:id
   *
   * 删除文章
   * 注意：因为 schema 中 ArticleTag 设置了 onDelete: Cascade
   * 所以删除文章时，相关的 article_tags 记录也会自动删除
   */
  @httpDelete('/:id')
  public async remove(@requestParam('id') id: string) {
    await this.articleService.delete(parseInt(id))
    return this.json({ message: '删除成功', id: parseInt(id) })
  }
}
