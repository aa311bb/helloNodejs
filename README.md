# 🚀 Node.js 学习笔记

系统学习 Node.js 内置模块的学习笔记，使用 Vue 3 + Vite 构建可视化学习平台。

## 📖 已学习模块

### 核心模块

| 模块 | 描述 | 状态 |
|------|------|------|
| [📁 Path 路径](src/views/Path.vue) | 处理文件和目录路径，跨平台兼容性处理 | ✅ 已完成 |
| [💻 OS 系统](src/views/OS.vue) | 获取操作系统和硬件信息，系统监控 | ✅ 已完成 |
| [⚙️ Process 进程](src/views/Process.vue) | 进程信息与控制，环境变量，命令行参数 | ✅ 已完成 |
| [👶 Child Process](src/views/ChildProcess.vue) | 创建子进程执行命令，多进程架构 | ✅ 已完成 |
| [🎯 Events 事件](src/views/Events.vue) | 事件驱动架构核心，发布订阅模式 | ✅ 已完成 |
| [🛠️ Util 工具](src/views/Util.vue) | 实用工具函数，promisify，format，inspect | ✅ 已完成 |
| [📄 FS 文件系统](src/views/Fs.vue) | 文件系统操作，读写文件，目录管理，流式处理 | ✅ 已完成 |
| [🔐 Crypto & Zlib](src/views/CryptoZlib.vue) | 加密解密，哈希算法，数据压缩与解压 | ✅ 已完成 |

### 网络模块

| 模块 | 描述 | 状态 |
|------|------|------|
| [🌐 HTTP 服务](src/views/Http.vue) | Web服务器，反向代理，动静分离，缓存策略 | ✅ 已完成 |
| [🚂 Express 框架](src/views/Express.vue) | Express框架，路由，中间件，log4js日志 | ✅ 已完成 |

## 📁 项目结构

```
node-learn/
├── src/
│   ├── components/              # Vue 组件
│   │   ├── Sidebar.vue          # 侧边栏导航
│   │   ├── MethodCard.vue       # 方法卡片
│   │   └── ModuleCard.vue       # 模块卡片
│   ├── views/                   # 页面视图
│   │   ├── Home.vue             # 首页
│   │   ├── Path.vue             # Path 模块
│   │   ├── OS.vue               # OS 模块
│   │   ├── Process.vue          # Process 模块
│   │   ├── ChildProcess.vue     # Child Process 模块
│   │   ├── Events.vue           # Events 模块
│   │   ├── Util.vue             # Util 模块
│   │   ├── Fs.vue               # FS 文件系统模块
│   │   ├── CryptoZlib.vue       # Crypto & Zlib 模块
│   │   ├── Http.vue             # HTTP 模块
│   │   └── Express.vue          # Express 模块
│   ├── router/                  # 路由配置
│   ├── data/                    # 导航数据
│   └── style.css                # 全局样式
├── core-examples/               # 核心模块示例代码
│   ├── path-demo.js
│   ├── os-demo.js
│   ├── process-demo.js
│   ├── child_process-demo.js
│   ├── events-demo.js
│   ├── util-demo.js
│   ├── fs-demo.js
│   └── crypto-zlib-demo.js
├── network-examples/            # 网络模块示例代码
│   ├── http-demo.js             # HTTP 服务器示例
│   └── express-demo.js          # Express 服务器示例
└── package.json
```

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Vite
- **路由**: Vue Router 4
- **运行时**: Node.js 18+
- **后端框架**: Express (网络模块)
- **日志**: log4js

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动 Vue 开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📚 运行示例代码

```bash
# 核心模块示例
node core-examples/path-demo.js
node core-examples/os-demo.js
node core-examples/process-demo.js
node core-examples/child_process-demo.js
node core-examples/events-demo.js
node core-examples/util-demo.js
node core-examples/fs-demo.js
node core-examples/crypto-zlib-demo.js

# 网络模块示例
node network-examples/http-demo.js      # HTTP 服务器 (端口 3000)
node network-examples/express-demo.js   # Express 服务器 (端口 3001)
```

## 🔗 学习资源

- [Node.js 官方文档](https://nodejs.org/docs/latest/api/)
- [Node.js 中文网](http://nodejs.cn/api/)
- [Express 官方文档](https://expressjs.com/)

## 📝 添加新模块

1. 修改 `src/data/nav.js` 添加导航
2. 修改 `src/router/index.js` 添加路由
3. 创建 `src/views/Xxx.vue` 页面
4. 创建示例代码到 `core-examples/` 或 `network-examples/`
5. 更新 `src/views/Home.vue` 添加模块描述

## 📄 License

ISC
