<template>
  <div 
    class="info-container"
    @click="handleClick"
    role="button"
    tabindex="0"
    @keyup.enter="handleClick"
  >
    <div class="id-badge">
      <span class="id-value">ID: {{ id }}</span>
    </div>
    <div class="content-section">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string | number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'click', id: string | number): void;
}>();

const handleClick = () => {
  emit('click', props.id);
};
</script>

<style scoped>
.info-container {
  position: relative;
  padding: 1.5rem 1rem 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.info-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-container:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.id-badge {
  position: absolute;
  top: 0;
  left: 1rem;
  transform: translateY(-50%);
  background-color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.id-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.875rem;
}

.content-section {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  min-height: 60px;
}

@media (max-width: 640px) {
  .info-container {
    padding-top: 1.75rem;
  }
  
  .id-badge {
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
