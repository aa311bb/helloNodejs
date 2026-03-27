# 🚀 Node.js 学习笔记

系统学习 Node.js 内置模块的学习笔记，使用 Vue 3 + Vite 构建可视化学习平台。

## 📖 已学习模块

| 模块 | 描述 | 状态 |
|------|------|------|
| [📁 Path 路径](src/views/Path.vue) | 处理文件和目录路径，跨平台兼容性处理 | ✅ 已完成 |
| [💻 OS 系统](src/views/OS.vue) | 获取操作系统和硬件信息，系统监控 | ✅ 已完成 |
| [⚙️ Process 进程](src/views/Process.vue) | 进程信息与控制，环境变量，命令行参数 | ✅ 已完成 |
| [👶 Child Process](src/views/ChildProcess.vue) | 创建子进程执行命令，多进程架构 | ✅ 已完成 |
| [🎯 Events 事件](src/views/Events.vue) | 事件驱动架构核心，发布订阅模式 | ✅ 已完成 |
| [🛠️ Util 工具](src/views/Util.vue) | 实用工具函数，promisify，format，inspect | ✅ 已完成 |
| [📄 FS 文件系统](src/views/Fs.vue) | 文件系统操作，读写文件，目录管理，流式处理 | ✅ 已完成 |

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
│   │   └── Fs.vue               # FS 文件系统模块
│   ├── router/                  # 路由配置
│   ├── data/                    # 导航数据
│   └── style.css                # 全局样式
├── examples/                    # Node.js 示例代码
│   ├── path-demo.js
│   ├── os-demo.js
│   ├── process-demo.js
│   ├── child_process-demo.js
│   ├── events-demo.js
│   ├── util-demo.js
│   └── fs-demo.js
└── package.json
```

## 🛠️ 技术栈

- **前端框架**: Vue 3 + Vite
- **路由**: Vue Router 4
- **运行时**: Node.js 18+

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📚 运行示例代码

```bash
# 运行各个模块的 Node.js 示例
node examples/path-demo.js
node examples/os-demo.js
node examples/process-demo.js
node examples/child_process-demo.js
node examples/events-demo.js
node examples/util-demo.js
node examples/fs-demo.js
```

## 🔗 学习资源

- [Node.js 官方文档](https://nodejs.org/docs/latest/api/)
- [Node.js 中文网](http://nodejs.cn/api/)

## 📝 添加新模块

1. 修改 `src/data/nav.js` 添加导航
2. 修改 `src/router/index.js` 添加路由
3. 创建 `src/views/Xxx.vue` 页面
4. 创建 `examples/xxx-demo.js` 示例代码
5. 更新 `src/views/Home.vue` 添加模块描述

## 📄 License

ISC
