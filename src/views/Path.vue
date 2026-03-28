<template>
  <div class="content-wrapper">
    <!-- 头部 -->
    <div class="module-header">
      <div class="breadcrumb">
        <router-link to="/">首页</router-link> / <span>Path 路径</span>
      </div>
      <h1>📁 Path 路径模块</h1>
    </div>

    <div class="intro-box">
      <strong>简介：</strong>Path 模块是 Node.js 内置模块，用于处理文件路径。使用
      <code>const path = require('path')</code> 引入。它会自动处理不同操作系统（Windows/Unix）的路径差异。
    </div>

    <!-- 路径结构图解 -->
    <div class="path-diagram">
      <h3>路径结构解析</h3>
      <div class="path-visual">
        <span class="path-part root">C:</span>
        <span class="path-sep">\</span>
        <span class="path-part dir">Users</span>
        <span class="path-sep">\</span>
        <span class="path-part dir">Admin</span>
        <span class="path-sep">\</span>
        <span class="path-part dir">project</span>
        <span class="path-sep">\</span>
        <span class="path-part file">app</span>
        <span class="path-part ext">.js</span>
      </div>
      <div class="legend">
        <div class="legend-item"><span class="color root"></span>Root (根目录)</div>
        <div class="legend-item"><span class="color dir"></span>Dir (目录)</div>
        <div class="legend-item"><span class="color file"></span>Base name (文件名)</div>
        <div class="legend-item"><span class="color ext"></span>Ext (扩展名)</div>
      </div>
    </div>

    <!-- 方法卡片 -->
    <h2 class="section-title">🔧 常用方法</h2>
    <div class="methods-grid">
      <MethodCard
        v-for="method in methods"
        :key="method.title"
        :title="method.title"
        :desc="method.desc"
        :examples="method.examples"
      />
    </div>

    <!-- 运行示例 -->
    <div class="run-box">
      <h3>🚀 运行 Node.js 示例代码</h3>
      <p>在终端运行以下命令查看实际输出：</p>
      <code>node core-examples/path-demo.js</code>
    </div>

    <!-- 实用技巧 -->
    <div class="tips-box">
      <h3>💡 实用技巧</h3>
      <ul>
        <li><strong>始终使用 path.join() 而不是字符串拼接</strong> - 自动处理跨平台分隔符问题</li>
        <li><strong>获取配置文件路径：</strong> <code>path.join(__dirname, 'config.json')</code></li>
        <li><strong>获取上级目录：</strong> <code>path.join(__dirname, '..')</code></li>
        <li><strong>检查文件类型：</strong> <code>path.extname(file) === '.js'</code></li>
        <li><strong>path.resolve() vs path.join()：</strong> resolve 返回绝对路径，join 返回相对路径</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import MethodCard from '@/components/MethodCard.vue'

const methods = [
  {
    title: 'path.join([...paths])',
    desc: '将多个路径片段拼接成一个路径，自动处理分隔符',
    examples: [
      { code: "path.join('/foo', 'bar', 'baz')", result: "→ '/foo/bar/baz'" },
      { code: "path.join('public', 'images', 'logo.png')", result: "→ 'public/images/logo.png'" },
      { code: "path.join('/foo', '..', 'bar')", result: "→ '/bar' // .. 返回上一级" }
    ]
  },
  {
    title: 'path.resolve([...paths])',
    desc: '从右到左解析路径，返回绝对路径',
    examples: [
      { code: "path.resolve('foo', 'bar')", result: "→ '/当前目录/foo/bar'" },
      { code: "path.resolve('/foo', './bar')", result: "→ '/foo/bar'" }
    ]
  },
  {
    title: 'path.basename(path[, ext])',
    desc: '获取路径中的最后一部分（文件名）',
    examples: [
      { code: "path.basename('/foo/bar/baz.txt')", result: "→ 'baz.txt'" },
      { code: "path.basename('/foo/bar/baz.txt', '.txt')", result: "→ 'baz' // 去掉扩展名" }
    ]
  },
  {
    title: 'path.dirname(path)',
    desc: '获取路径中的目录部分',
    examples: [
      { code: "path.dirname('/foo/bar/baz.txt')", result: "→ '/foo/bar'" },
      { code: "path.dirname('./app.js')", result: "→ '.'" }
    ]
  },
  {
    title: 'path.extname(path)',
    desc: '获取文件的扩展名（最后一个点之后的内容）',
    examples: [
      { code: "path.extname('app.js')", result: "→ '.js'" },
      { code: "path.extname('file.tar.gz')", result: "→ '.gz' // 只返回最后一个" }
    ]
  },
  {
    title: 'path.parse(path)',
    desc: '将路径解析为一个对象',
    examples: [
      { code: "path.parse('/home/user/file.txt')", result: "→ { root, dir, base, ext, name }" }
    ]
  },
  {
    title: 'path.format(obj)',
    desc: '从对象生成路径字符串（与parse相反）',
    examples: [
      { code: "path.format({ dir: '/home/user', base: 'file.txt' })", result: "→ '/home/user/file.txt'" }
    ]
  },
  {
    title: 'path.normalize(path)',
    desc: '规范化路径（处理多余的点和斜杠）',
    examples: [
      { code: "path.normalize('/foo/bar//baz/./quux/..')", result: "→ '/foo/bar/baz'" }
    ]
  },
  {
    title: 'path.isAbsolute(path)',
    desc: '判断是否为绝对路径',
    examples: [
      { code: "path.isAbsolute('/foo/bar')", result: "→ true" },
      { code: "path.isAbsolute('./foo')", result: "→ false" }
    ]
  },
  {
    title: 'path.relative(from, to)',
    desc: '获取从 from 到 to 的相对路径',
    examples: [
      { code: "path.relative('/data/test/aaa', '/data/impl/bbb')", result: "→ '../../impl/bbb'" }
    ]
  },
  {
    title: 'path.sep',
    desc: '平台特定的路径分隔符',
    examples: [
      { code: "// Windows", result: "path.sep → '\\\\'" },
      { code: "// Linux/Mac", result: "path.sep → '/'" }
    ]
  },
  {
    title: '__dirname & __filename',
    desc: '特殊变量（不是path模块的方法）',
    examples: [
      { code: "__dirname", result: "→ 当前文件所在目录的绝对路径" },
      { code: "__filename", result: "→ 当前文件的绝对路径" }
    ]
  }
]
</script>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 40px;
}

.module-header {
  margin-bottom: 30px;
}

.module-header .breadcrumb {
  font-size: 0.9em;
  color: var(--text-dim);
  margin-bottom: 10px;
}

.module-header .breadcrumb a {
  color: var(--primary);
  text-decoration: none;
}

.module-header h1 {
  font-size: 2.5em;
  color: var(--primary);
}

.intro-box {
  background: rgba(0, 217, 255, 0.1);
  border-left: 4px solid var(--primary);
  padding: 15px 20px;
  margin-bottom: 30px;
  border-radius: 0 8px 8px 0;
}

.intro-box code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--primary);
}

/* 路径图解 */
.path-diagram {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
  text-align: center;
}

.path-diagram h3 {
  color: var(--primary);
  margin-bottom: 20px;
}

.path-visual {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin: 20px 0;
}

.path-part {
  padding: 10px 15px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.path-part.root { background: #e74c3c; color: white; }
.path-part.dir { background: #3498db; color: white; }
.path-part.file { background: #2ecc71; color: white; }
.path-part.ext { background: #f1c40f; color: #333; }

.path-sep {
  color: var(--text-dim);
  font-size: 1.2em;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
}

.legend-item .color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-item .color.root { background: #e74c3c; }
.legend-item .color.dir { background: #3498db; }
.legend-item .color.file { background: #2ecc71; }
.legend-item .color.ext { background: #f1c40f; }

.section-title {
  font-size: 1.5em;
  color: var(--text);
  margin: 30px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.run-box {
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid var(--secondary);
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  text-align: center;
}

.run-box h3 {
  color: var(--secondary);
  margin-bottom: 15px;
}

.run-box code {
  background: rgba(0, 0, 0, 0.4);
  padding: 10px 20px;
  border-radius: 6px;
  display: inline-block;
  font-size: 1.1em;
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
</style>
