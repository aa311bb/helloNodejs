<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>📚 Node.js 学习</h1>
      <p>从入门到精通的学习笔记</p>
    </div>
    <nav class="sidebar-nav">
      <!-- 首页 -->
      <div class="nav-section">
        <div class="nav-section-title">导航</div>
        <router-link
          :to="navData.home.path"
          class="nav-item"
          :class="{ active: $route.path === navData.home.path }"
        >
          <span class="icon">{{ navData.home.icon }}</span>
          <span class="text">{{ navData.home.title }}</span>
        </router-link>
      </div>

      <!-- 分类模块 -->
      <div
        v-for="(category, index) in navData.categories"
        :key="index"
        class="nav-section"
      >
        <div class="nav-section-title">{{ category.name }}</div>
        <router-link
          v-for="item in category.items"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: $route.path === item.path }"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="text">{{ item.title }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { navData } from '@/data/nav.js'
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 280px;
  background: rgba(0, 0, 0, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h1 {
  font-size: 1.3em;
  color: var(--primary);
  margin-bottom: 5px;
}

.sidebar-header p {
  font-size: 0.85em;
  color: var(--text-dim);
}

.sidebar-nav {
  flex: 1;
  padding: 15px 0;
}

.nav-section {
  margin-bottom: 10px;
}

.nav-section-title {
  padding: 10px 20px;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-dim);
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  gap: 10px;
}

.nav-item:hover {
  background: rgba(0, 217, 255, 0.1);
  color: var(--primary);
}

.nav-item.active {
  background: rgba(0, 217, 255, 0.15);
  color: var(--primary);
  border-left-color: var(--primary);
}

.nav-item .icon {
  font-size: 1.2em;
  width: 24px;
  text-align: center;
}

.nav-item .text {
  flex: 1;
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: -280px;
    z-index: 1000;
    transition: left 0.3s;
  }

  .sidebar.open {
    left: 0;
  }
}
</style>
