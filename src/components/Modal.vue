<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="close">✕</button>
      </header>
      <div class="modal-body">
        <div class="modal-search">
          <input
            v-model="search"
            type="text"
            class="modal-search-input"
            placeholder="Search..."
            aria-label="Search items"
          />
        </div>

        <ul class="modal-list">
          <li v-for="(item, idx) in filteredItems" :key="idx">
            <button class="modal-item" @click="select(item)">{{ item.name ?? item.id }}</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps<{
  items: any[];
  title?: string;
}>()

const emit = defineEmits<{
  (e: 'select', item: any): void;
  (e: 'close'): void;
}>()

const search = ref<string>('')
const debounced = ref<string>('')
let timer: ReturnType<typeof setTimeout> | null = null

watch(search, (val) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    debounced.value = val.trim().toLowerCase()
    timer = null
  }, 300)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

const filteredItems = computed(() => {
  if (!debounced.value) return props.items
  return props.items.filter(i => ((i?.name ?? i?.id ?? '') as string).toLowerCase().includes(debounced.value))
})

function select(item: { name: string; [k: string]: any }) {
  emit('select', item)
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}
.modal {
  background: white;
  width: 90%;
  max-width: 480px;
  /* Fixed visual size: responsive height with a max */
  height: 70vh;
  max-height: 620px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  flex: 0 0 auto;
}
.modal-body {
  /* body grows to fill remaining modal height and becomes scrollable */
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1 1 auto;
}
.modal-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem; }
.modal-item {
  width: 100%;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
}
.modal-item:hover { background: #f8fafc; }
.modal-search { margin-bottom: 0.75rem; }
.modal-search-input { width: 100%; padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #e5e7eb; }
.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
</style>