<template>
  <div class="team-vue">
    <div class="team-block" @click="openTeamModal">{{ selectedTeamLabel }}</div>

    <div class="main-blocks">
      <div
        v-for="(slot, idx) in 5"
        :key="idx"
        class="slot-block"
        @click.stop="openHeroesModal(idx)">
        <div class="slot-label">{{ heroSlots[idx] || 'Choose hero' }}</div>
      </div>
    </div>

    <div v-if="pro" class="extra-blocks">
      <div
        v-for="(slot, idx) in 5"
        :key="idx"
        class="slot-block extra"
        @click.stop="openPlayersModal(idx)">
        <div class="slot-label">{{ playerSlots[idx] || 'Choose player' }}</div>
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

const props = defineProps<{
  pro?: boolean
  teamName?: string
  teams?: string[]
  heroes?: string[]
  players?: string[]
}>()

const emit = defineEmits<{
  (e: 'select-hero', payload: { index: number; hero: string }): void
  (e: 'select-player', payload: { index: number; player: string }): void
  (e: 'select-team', team: string): void
}>()

const pro = computed(() => !!props.pro)

// default items if not provided
const defaultHeroes = [ 'Hero A', 'Hero B', 'Hero C', 'Hero D', 'Hero E' ]
const defaultPlayers = [ 'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5' ]
const defaultTeams = [ 'Team Liquid', 'Team Secret', 'OG', 'Nigma', 'Virtus.pro' ]

const heroSlots = ref<(string | null)[]>(Array(5).fill(null))
const playerSlots = ref<(string | null)[]>(Array(5).fill(null))
const selectedTeam = ref<string | null>(props.teamName ?? null)

const showModal = ref(false)
const modalItems = ref<string[]>([])
const modalTitle = ref<string>('')
const modalMode = ref<'hero' | 'player' | 'team' | null>(null)
const modalIndex = ref<number | null>(null)

const selectedTeamLabel = computed(() => selectedTeam.value ? selectedTeam.value : (props.teamName ?? 'Select team'))

function openTeamModal() {
  modalMode.value = 'team'
  // prefer teams provided via props, fallback to defaults
  if (props.teams?.length) {
    modalItems.value = props.teamName ? [props.teamName, ...props.teams] : props.teams
  } else {
    modalItems.value = props.teamName ? [props.teamName, ...defaultTeams] : defaultTeams
  }
  modalTitle.value = 'Choose team'
  showModal.value = true
}

function openHeroesModal(index: number) {
  modalMode.value = 'hero'
  modalIndex.value = index
  modalItems.value = props.heroes?.length ? props.heroes : defaultHeroes
  modalTitle.value = 'Choose hero'
  showModal.value = true
}

function openPlayersModal(index: number) {
  modalMode.value = 'player'
  modalIndex.value = index
  modalItems.value = props.players?.length ? props.players : defaultPlayers
  modalTitle.value = 'Choose player'
  showModal.value = true
}

function onModalSelect(item: string) {
  if (modalMode.value === 'hero' && modalIndex.value !== null) {
    heroSlots.value[modalIndex.value] = item
    emit('select-hero', { index: modalIndex.value, hero: item })
  } else if (modalMode.value === 'player' && modalIndex.value !== null) {
    playerSlots.value[modalIndex.value] = item
    emit('select-player', { index: modalIndex.value, player: item })
  } else if (modalMode.value === 'team') {
    selectedTeam.value = item
    emit('select-team', item)
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