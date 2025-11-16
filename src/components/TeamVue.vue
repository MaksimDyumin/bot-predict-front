<template>
  <div class="team-vue">
    <div class="team-block" @click="openTeamModal">{{ selectedTeamLabel }}</div>

    <div class="main-blocks">
      <div v-for="(_, idx) in 5" :key="idx" class="hero-slot-group">
        <input 
          type="number" 
          class="pick-order-input"
          :value="heroPicks[idx]"
          @input="emitPos($event, idx)"
          min="0"
          max="10"
          placeholder="Pick #"
        />
        <div
          :class="['slot-block', { selected: heroSlots[idx] !== null }]"
          @click.stop="openHeroesModal(idx)">
          <div class="slot-label">{{ heroSlots[idx]?.name || 'Choose hero' }}</div>
        </div>
      </div>
    </div>

    <div v-if="pro" class="extra-blocks">
      <div
        v-for="(_, idx) in 5"
        :key="idx"
        :class="['slot-block', 'extra', { selected: playerSlots[idx] !== null }]"
        @click.stop="openPlayersModal(idx)">
        <div class="slot-label">{{ playerSlots[idx]?.name || 'Choose player' }}</div>
      </div>
    </div>

    <Modal
      v-if="showModal"
      :items="modalItems"
      :title="modalTitle"
      @select="onModalSelect"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import type { Hero, Player, Team } from '@/store/store.types';

const props = defineProps<{
  pro?: boolean
  teamName?: string
  teams?: Team[]
  heroes?: Hero[]
  players?: Player[]
}>()

const emit = defineEmits<{
  (e: 'select-hero', payload: { index: number; hero: Hero; pick: number }): void
  (e: 'select-player', payload: { index: number; player: Player }): void
  (e: 'select-team', team: Team): void
  (e: 'select-pos', pos: any): void
}>()

const pro = computed(() => !!props.pro)

const heroSlots = ref<(Hero | null)[]>(Array(5).fill(null))
const heroPicks = ref<number[]>(Array(5).fill(0))
const playerSlots = ref<(Player | null)[]>(Array(5).fill(null))
const selectedTeam = ref<Team | null>(props.teams?.find(t => t.name === props.teamName) ?? null)

const showModal = ref(false)
const modalItems = ref<Array<Hero | Player | Team>>([])
const modalTitle = ref<string>('')
const modalMode = ref<'hero' | 'player' | 'team' | null>(null)
const modalIndex = ref<number | null>(null)

const selectedTeamLabel = computed(() => selectedTeam.value ? selectedTeam.value.name : (props.teamName ?? 'Select team'))

function emitPos(e: Event, idx: number) {
  heroPicks.value[idx] = parseInt((e.target as HTMLInputElement).value) || 0
  emit('select-pos', { pos: heroPicks.value[idx], index: idx })
}

function openTeamModal() {
  modalMode.value = 'team'
  // prefer teams provided via props, fallback to defaults
  modalItems.value = props.teams?.length ? props.teams : []
  modalTitle.value = 'Choose team'
  showModal.value = true
}

function openHeroesModal(index: number) {
  modalMode.value = 'hero'
  modalIndex.value = index
  modalItems.value = props.heroes?.length ? props.heroes : []
  modalTitle.value = 'Choose hero'
  showModal.value = true
}

function openPlayersModal(index: number) {
  modalMode.value = 'player'
  modalIndex.value = index
  modalItems.value = props.players?.length ? props.players : []
  modalTitle.value = 'Choose player'
  showModal.value = true
}

function onModalSelect(item: Hero | Player | Team) {
  if (modalMode.value === 'hero' && modalIndex.value !== null) {
    heroSlots.value[modalIndex.value] = item as Hero
    emit('select-hero', { index: modalIndex.value, hero: item as Hero, pick: heroPicks.value[modalIndex.value] ?? 0 })
  } else if (modalMode.value === 'player' && modalIndex.value !== null) {
    playerSlots.value[modalIndex.value] = item as Player
    emit('select-player', { index: modalIndex.value, player: item as Player })
  } else if (modalMode.value === 'team') {
    selectedTeam.value = item as Team
    emit('select-team', item as Team)
  }
  
  closeModal()
}

function closeModal() {
  showModal.value = false
  modalMode.value = null
  modalIndex.value = null
  modalItems.value = []
  modalTitle.value = ''
}

function resetSelection() {
  heroSlots.value = Array(5).fill(null)
  heroPicks.value = Array(5).fill(0)
  playerSlots.value = Array(5).fill(null)
  selectedTeam.value = props.teams?.find(t => t.name === props.teamName) ?? null
}

defineExpose({ resetSelection })
</script>

<style scoped>
.team-vue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.team-block {
  width: 220px;
  height: 56px;
  background: #111827;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
}

.main-blocks, .extra-blocks {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  width: 100%;
  max-width: 700px;
}

.hero-slot-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pick-order-input {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.8rem;
  text-align: center;
  font-weight: 600;
  background: #f3f4f6;
}

.pick-order-input:focus {
  outline: none;
  border-color: #0ea5ff;
  background: #fff;
}

.slot-block {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
  cursor: pointer;
}

.slot-block.extra {
  background: #f9fafb;
}

.slot-block.selected {
  background: #e6f9ff;
  border-color: #38bdf8;
  box-shadow: 0 6px 18px rgba(14,165,255,0.12);
}

.slot-block.extra.selected {
  background: #f0f9ff;
  border-color: #60a5fa;
}

.slot-label {
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 900px) {
  .main-blocks, .extra-blocks { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 520px) {
  .main-blocks, .extra-blocks { grid-template-columns: repeat(2, 1fr); }
}
</style>