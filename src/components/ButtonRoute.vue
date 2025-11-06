<template>
  <button
    @click="handleClick"
    class="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  to?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  to: '',
  disabled: false
});

const router = useRouter();

const handleClick = () => {
  if (props.to && !props.disabled) {
    router.push(props.to);
  }
};
</script>
