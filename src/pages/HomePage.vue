<script setup lang="ts">
import ButtonRoute from '@/components/ButtonRoute.vue';
</script>

<template>
  <div class="home">
    <h1 class="title">Bot Predict</h1>
    <div class="content">
      <div class="buttons-container">
        <ButtonRoute 
          to="/search" 
          class="main-button"
        >
          Поиск
        </ButtonRoute>
        <ButtonRoute 
          to="/predict" 
          class="main-button"
        >
          Предикт
        </ButtonRoute>
        <ButtonRoute 
          to="/add-match" 
          class="main-button"
        >
          Добавить матч
        </ButtonRoute>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 4rem;
  text-align: center;
}

.content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 400px;
}

.main-button {
  width: 100%;
  padding: 1.5rem !important;
  font-size: 1.25rem !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
