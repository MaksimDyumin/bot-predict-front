<template>
  <div class="switch-wrapper">
    <button
      type="button"
      :class="[
        'switch',
        `switch-${variant}`,
        modelValue ? 'switch-active' : 'switch-inactive'
      ]"
      role="switch"
      :aria-checked="modelValue"
      @click="toggle"
    >
      <span 
        :class="[
          'switch-handle',
          `switch-handle-${variant}`,
          modelValue ? 'switch-handle-active' : 'switch-handle-inactive'
        ]"
      />
    </button>
    <span v-if="label" class="switch-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  variant?: 'pill' | 'square';
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'pill',
  label: '',
  disabled: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>

<style scoped>
.switch-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.switch {
  position: relative;
  border: none;
  padding: 0;
  cursor: pointer;
  background: none;
}

.switch:focus {
  outline: none;
}

.switch:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* Pill Variant */
.switch-pill {
  width: 3rem;
  height: 1.75rem;
  background-color: #e5e7eb;
  transition: background-color 0.2s;
}

.switch-pill.switch-active {
  background-color: #4f46e5;
}

.switch-handle-pill {
  position: absolute;
  left: 0.25rem;
  top: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.switch-pill .switch-handle-active {
  transform: translateX(1.25rem);
}

.switch-pill {
  border-radius: 9999px;
}

/* Square Variant */
.switch-square {
  width: 2.5rem;
  height: 1.5rem;
  background-color: #e5e7eb;
  transition: background-color 0.2s;
  border-radius: 0.25rem;
}

.switch-square.switch-active {
  background-color: #4f46e5;
}

.switch-handle-square {
  position: absolute;
  left: 0.125rem;
  top: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  transition: transform 0.2s;
  border-radius: 0.125rem;
}

.switch-square .switch-handle-active {
  transform: translateX(1rem);
}

/* Label */
.switch-label {
  font-size: 0.875rem;
  color: #4b5563;
}

/* Disabled State */
.switch[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
