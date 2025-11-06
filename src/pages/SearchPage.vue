<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TeaminfoHolder from '@/components/TeaminfoHolder.vue'
import { useMatchStore } from '@/store/match'
import type { Match } from '@/store/store.types'

const router = useRouter()
const matchStore = useMatchStore()
const matches = ref<Match[]>([])

onMounted(async () => {
  await matchStore.getMatches()
  matches.value = matchStore.matches
})

const query = ref<string>('')

// Sample matches with Dire and Radiant teams

const filteredMatches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return matches.value
  return matches.value.filter(m => 
    String(m.id).includes(q)
  )
})
</script>

<template>
  <div class="search-page">
    <h1 class="title">Поиск команд</h1>

    <div class="search-input-wrapper">
      <input
        v-model="query"
        type="text"
        placeholder="Введите имя команды или ID..."
        class="search-input"
        aria-label="Search teams"
      />
    </div>

    <section class="cards-block">
      <div v-if="filteredMatches.length === 0" class="empty">Матчи не найдены</div>
      <div v-else class="cards-grid">
        <TeaminfoHolder 
          v-for="match in filteredMatches" 
          :key="match.id" 
          :id="match.id"
          @click="router.push(`/match/${match.id}`)"
        >
          <div class="match-content">
            <span class="dire-team">{{ match.teamA.name }}</span>
            <span class="vs">vs</span>
            <span class="radiant-team">{{ match.teamA.name }}</span>
          </div>
        </TeaminfoHolder>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  min-height: 60vh;
}

.title {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  max-width: 640px;
  padding: 1rem 1.25rem;
  font-size: 1.125rem;
  border-radius: 0.6rem;
  border: 1px solid #d1d5db;
  box-shadow: 0 2px 6px rgba(16,24,40,0.03);
}

.cards-block {
  display: block;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.match-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.dire-team {
  color: #ef4444;
  font-weight: 600;
}

.radiant-team {
  color: #22c55e;
  font-weight: 600;
}

.vs {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.empty {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}

@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>