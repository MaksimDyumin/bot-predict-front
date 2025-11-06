<template>
  <button
    @click="$emit('click', $event)"
    class="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      sizeClasses[size],
      variantClasses[variant],
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
  >
    <span v-if="loading" class="mr-2">
      <span class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
    </span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
});

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<style scoped>
.inline-flex {
  display: inline-flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.font-medium {
  font-weight: 500;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-200 {
  transition-duration: 200ms;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}

.opacity-50 {
  opacity: 0.5;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Size variants */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

/* Color variants */
.bg-indigo-600 {
  background-color: #4f46e5;
}

.bg-indigo-700:hover {
  background-color: #4338ca;
}

.bg-gray-600 {
  background-color: #4b5563;
}

.bg-gray-700:hover {
  background-color: #374151;
}

.bg-emerald-600 {
  background-color: #059669;
}

.bg-emerald-700:hover {
  background-color: #047857;
}

.bg-red-600 {
  background-color: #dc2626;
}

.bg-red-700:hover {
  background-color: #b91c1c;
}

.bg-amber-500 {
  background-color: #f59e0b;
}

.bg-amber-600:hover {
  background-color: #d97706;
}

.text-white {
  color: #ffffff;
}
</style>
