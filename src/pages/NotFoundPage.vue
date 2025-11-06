<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn't exist.</p>
    <ButtonRoute to="/" class="home-button">Go Home</ButtonRoute>
  </div>
</template>

<script setup lang="ts">
import ButtonRoute from '@/components/ButtonRoute.vue';
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
}

.home-button {
  margin-top: 2rem;
}
</style>