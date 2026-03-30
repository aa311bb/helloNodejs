/**
 * ============================================
 * UserController - 用户控制器
 * ============================================
 *
 * 【装饰器路由】是这节课的核心！
 *
 * 传统 Express 路由：
 *   app.get('/api/users', async (req, res) => { ... })
 *   app.post('/api/users', async (req, res) => { ... })
 *   路由和处理函数分离，文件越来越乱
 *
 * 装饰器路由：
 *   @controller('/api/users')     ← 这个类处理 /api/users 下的所有请求
 *   @httpGet('/')                 ← GET /api/users
 *   @httpGet('/:id')              ← GET /api/users/:id
 *   @httpPost('/')                ← POST /api/users
 *   路由和方法在一起，清晰整洁
 *
 * 参数装饰器（自动从请求中提取数据）：
 *   @requestParam('id')   → req.params.id      路径参数
 *   @requestBody()        → req.body            请求体
 *   @queryParam('page')   → req.query.page      查询参数
 *   不需要再手动写 req.params.xxx 了！
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
  interfaces,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../types.js'
import { UserService } from '../services/UserService.js'

// @controller(path) 装饰器
// 参数1: 基础路径
// 继承 BaseHttpController 可以使用 this.json() 等辅助方法
@controller('/api/users')
export class UserController extends BaseHttpController {

  // 构造函数注入 UserService
  // IoC 容器会自动创建 UserService 实例并传入
  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ) {
    super()
  }

  /**
   * GET /api/users?page=1&limit=10
   */
  @httpGet('/')
  public async findAll(
    @queryParam('page') page: string,
    @queryParam('limit') limit: string,
  ) {
    const result = await this.userService.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 10,
    )
    // this.json() 是 BaseHttpController 提供的方法
    // 将结果转为 JSON 响应
    return this.json(result)
  }

  /**
   * GET /api/users/:id
   */
  @httpGet('/:id')
  public async findById(@requestParam('id') id: string) {
    const user = await this.userService.findById(parseInt(id))
    if (!user) {
      return this.json({ error: '用户不存在' }, 404)
    }
    return this.json(user)
  }

  /**
   * POST /api/users
   * Body: { name, email, age?, gender? }
   */
  @httpPost('/')
  public async create(@requestBody() body: { name: string; email: string; age?: number; gender?: string }) {
    if (!body.name || !body.email) {
      return this.json({ error: 'name 和 email 是必填字段' }, 400)
    }
    const user = await this.userService.create(body)
    return this.json(user, 201)
  }

  /**
   * PUT /api/users/:id
   */
  @httpPut('/:id')
  public async update(
    @requestParam('id') id: string,
    @requestBody() body: any,
  ) {
    const user = await this.userService.findById(parseInt(id))
    if (!user) {
      return this.json({ error: '用户不存在' }, 404)
    }
    const updated = await this.userService.update(parseInt(id), body)
    return this.json(updated)
  }

  /**
   * DELETE /api/users/:id
   */
  @httpDelete('/:id')
  public async remove(@requestParam('id') id: string) {
    const user = await this.userService.findById(parseInt(id))
    if (!user) {
      return this.json({ error: '用户不存在' }, 404)
    }
    await this.userService.delete(parseInt(id))
    return this.json({ message: '删除成功', id: parseInt(id) })
  }
}
