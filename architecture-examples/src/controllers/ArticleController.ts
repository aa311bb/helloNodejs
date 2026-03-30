/**
 * ============================================
 * ArticleController - 文章控制器
 * ============================================
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

  constructor(
    @inject(TYPES.ArticleService) private articleService: ArticleService
  ) {
    super()
  }

  /** GET /api/articles */
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

  /** GET /api/articles/:id */
  @httpGet('/:id')
  public async findById(@requestParam('id') id: string) {
    const article = await this.articleService.findById(parseInt(id))
    if (!article) {
      return this.json({ error: '文章不存在' }, 404)
    }
    return this.json(article)
  }

  /** POST /api/articles */
  @httpPost('/')
  public async create(@requestBody() body: any) {
    if (!body.title || !body.author_id) {
      return this.json({ error: 'title 和 author_id 是必填字段' }, 400)
    }
    const article = await this.articleService.create(body)
    return this.json(article, 201)
  }

  /** POST /api/articles/with-tags （事务：创建文章+打标签） */
  @httpPost('/with-tags')
  public async createWithTags(@requestBody() body: any) {
    if (!body.title || !body.author_id) {
      return this.json({ error: 'title 和 author_id 是必填字段' }, 400)
    }
    const article = await this.articleService.createWithTags(body)
    return this.json(article, 201)
  }

  /** PUT /api/articles/:id */
  @httpPut('/:id')
  public async update(
    @requestParam('id') id: string,
    @requestBody() body: any,
  ) {
    const updated = await this.articleService.update(parseInt(id), body)
    return this.json(updated)
  }

  /** DELETE /api/articles/:id */
  @httpDelete('/:id')
  public async remove(@requestParam('id') id: string) {
    await this.articleService.delete(parseInt(id))
    return this.json({ message: '删除成功', id: parseInt(id) })
  }
}
