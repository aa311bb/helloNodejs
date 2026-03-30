<template>
  <div class="content-wrapper">
    <!-- Hero -->
    <div class="home-hero">
      <h1>🚀 Node.js 学习笔记</h1>
      <p>系统学习 Node.js 内置模块，掌握后端开发核心技能</p>
      <span class="version">v18.x LTS</span>
    </div>

    <!-- 已学模块 -->
    <h2 class="section-title">📖 已学习模块</h2>
    <div class="modules-grid">
      <ModuleCard
        v-for="module in modules"
        :key="module.path"
        :icon="module.icon"
        :title="module.title"
        :desc="getModuleDesc(module.path)"
        :to="module.path"
      />
    </div>

    <!-- 学习资源 -->
    <div class="tips-box">
      <h3>🔗 学习资源</h3>
      <ul>
        <li>
          <strong>Node.js 官方文档：</strong>
          <a href="https://nodejs.org/docs/latest/api/" target="_blank">
            https://nodejs.org/docs/latest/api/
          </a>
        </li>
        <li>
          <strong>Node.js 中文网：</strong>
          <a href="http://nodejs.cn/api/" target="_blank">
            http://nodejs.cn/api/
          </a>
        </li>
        <li><strong>示例代码位置：</strong><code>examples/</code> 目录</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { getAllModules } from '@/data/nav.js'
import ModuleCard from '@/components/ModuleCard.vue'

const modules = getAllModules()

// 模块描述映射
const moduleDescMap = {
  '/path': '处理文件和目录路径，跨平台兼容性处理',
  '/os': '获取操作系统和硬件信息，系统监控',
  '/process': '进程信息与控制，环境变量，命令行参数',
  '/child-process': '创建子进程执行命令，多进程架构',
  '/events': '事件驱动架构核心，发布订阅模式',
  '/util': '实用工具函数，promisify，format，inspect',
  '/fs': '文件系统操作，读写文件，目录管理，流式处理',
  '/crypto-zlib': '加密解密，哈希算法，数据压缩与解压',
  '/http': 'Web服务器，反向代理，动静分离，缓存策略',
  '/express': 'Express框架，路由，中间件，log4js日志',
  '/express-mysql': 'MySQL数据库，Knex查询构建器，CRUD，连表，事务'
}

const getModuleDesc = (path) => moduleDescMap[path] || ''
</script>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 40px;
}

.home-hero {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
}

.home-hero h1 {
  font-size: 3em;
  color: var(--primary);
  margin-bottom: 15px;
  text-shadow: 0 0 30px rgba(0, 217, 255, 0.5);
}

.home-hero p {
  font-size: 1.2em;
  color: var(--text-dim);
  max-width: 600px;
  margin: 0 auto;
}

.home-hero .version {
  margin-top: 20px;
  padding: 5px 15px;
  background: rgba(0, 217, 255, 0.2);
  border-radius: 20px;
  display: inline-block;
  font-size: 0.9em;
  color: var(--primary);
}

.section-title {
  font-size: 1.5em;
  color: var(--text);
  margin: 40px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.tips-box {
  background: rgba(0, 217, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
}

.tips-box h3 {
  color: var(--primary);
  margin-bottom: 15px;
}

.tips-box ul {
  list-style: none;
}

.tips-box li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.tips-box li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary);
}

.tips-box a {
  color: var(--primary);
}
</style>
