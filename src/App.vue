<script setup lang="ts">
import { RouterView } from 'vue-router'
import ButtonDefault from './components/ButtonDefault.vue'
import ButtonRoute from './components/ButtonRoute.vue'
</script>

<template>
  <div class="app-container">
    <header class="header">
      <nav class="nav">
        <ButtonRoute to="/" class="nav-button">Home</ButtonRoute>
        <ButtonRoute to="/predictions" class="nav-button">Predictions</ButtonRoute>
        <ButtonRoute to="/about" class="nav-button">About</ButtonRoute>
      </nav>
    </header>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: start;
  align-items: start;
  background-color: #f8f9fa;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-button {
  text-decoration: none;
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 640px) {
  .nav {
    flex-direction: column;
    align-items: stretch;
  }

  .main {
    padding: 1rem;
  }
}
</style>
