<template>
  <router-link :to="to" class="module-card">
    <div class="icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ desc }}</p>
    <div class="meta">
      <span>✅ 已完成</span>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '📦'
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.module-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 25px;
  text-decoration: none;
  color: var(--text);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transform: scaleX(0);
  transition: transform 0.3s;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  border-color: var(--primary);
}

.module-card:hover::before {
  transform: scaleX(1);
}

.module-card .icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.module-card h3 {
  font-size: 1.3em;
  margin-bottom: 10px;
  color: var(--text);
}

.module-card p {
  font-size: 0.9em;
  color: var(--text-dim);
  margin-bottom: 15px;
}

.module-card .meta {
  display: flex;
  gap: 15px;
  font-size: 0.8em;
  color: var(--text-dim);
}
</style>
