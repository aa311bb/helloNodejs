<template>
  <div class="method-card">
    <h3>{{ title }}</h3>
    <p class="desc">{{ desc }}</p>
    <div class="code-example">
      <div
        v-for="(example, index) in examples"
        :key="index"
        class="example-item"
      >
        <div class="code" v-html="example.code"></div>
        <div class="result" v-html="example.result"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    default: '',
  },
  examples: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.method-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.method-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 217, 255, 0.15);
}

.method-card h3 {
  color: var(--primary);
  margin-bottom: 10px;
  font-family: 'Courier New', monospace;
}

.method-card .desc {
  color: var(--text-dim);
  font-size: 0.9em;
  margin-bottom: 15px;
}

.code-example {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
}

.example-item:not(:last-child) {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.code {
  color: var(--accent);
}

.result {
  color: var(--primary);
  margin-top: 5px;
  padding-top: 8px;
}
</style>
