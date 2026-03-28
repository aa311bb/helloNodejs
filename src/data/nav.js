// 导航数据 - 添加新模块只需修改这里
export const navData = {
  home: {
    icon: '🏠',
    title: '首页',
    path: '/'
  },
  categories: [
    {
      name: '核心模块',
      items: [
        {
          icon: '📁',
          title: 'Path 路径',
          path: '/path'
        },
        {
          icon: '💻',
          title: 'OS 系统',
          path: '/os'
        },
        {
          icon: '⚙️',
          title: 'Process 进程',
          path: '/process'
        },
        {
          icon: '👶',
          title: 'Child Process',
          path: '/child-process'
        },
        {
          icon: '🎯',
          title: 'Events 事件',
          path: '/events'
        },
        {
          icon: '🛠️',
          title: 'Util 工具',
          path: '/util'
        },
        {
          icon: '📄',
          title: 'FS 文件系统',
          path: '/fs'
        },
        {
          icon: '🔐',
          title: 'Crypto & Zlib',
          path: '/crypto-zlib'
        }
      ]
    },
    {
      name: '网络模块',
      items: [
        {
          icon: '🌐',
          title: 'HTTP 服务',
          path: '/http'
        },
        {
          icon: '🚂',
          title: 'Express 框架',
          path: '/express'
        }
      ]
    }
  ]
}

// 获取所有模块（用于首页卡片展示）
export const getAllModules = () => {
  const modules = []
  navData.categories.forEach(category => {
    category.items.forEach(item => {
      modules.push({
        ...item,
        category: category.name
      })
    })
  })
  return modules
}
