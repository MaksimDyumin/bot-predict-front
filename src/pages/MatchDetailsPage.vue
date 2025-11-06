<script setup lang="ts">
import TeamVue from '@/components/TeamVue.vue'
import SwitchDefault from '@/components/SwitchDefault.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isPro = ref(true)
const matchId = ref(String(route.params.id ?? ''))
const matchDate = ref('')
const matchTime = ref('')
const teamAWon = ref(true)
const teamASelection = ref({ team: '', heroes: [] as string[], players: [] as string[] })
const teamBSelection = ref({ team: '', heroes: [] as string[], players: [] as string[] })

function onASelectHero(payload: { index: number; hero: string }) {
  teamASelection.value.heroes[payload.index] = payload.hero
}

function onASelectPlayer(payload: { index: number; player: string }) {
  teamASelection.value.players[payload.index] = payload.player
}

function onASelectTeam(team: string) {
  teamASelection.value.team = team
}

function onBSelectHero(payload: { index: number; hero: string }) {
  teamBSelection.value.heroes[payload.index] = payload.hero
}

function onBSelectPlayer(payload: { index: number; player: string }) {
  teamBSelection.value.players[payload.index] = payload.player
}

function onBSelectTeam(team: string) {
  teamBSelection.value.team = team
}
</script>

<template>
  <div class="match-details">
    <h1 class="title">Матч #{{ matchId || route.params.id }}</h1>

    <div class="match-details-controls">
      <div class="match-details-row">
        <div class="input-group">
          <label for="match-id">ID матча:</label>
          <input id="match-id" type="text" v-model="matchId" placeholder="Введите ID матча" />
        </div>

        <div class="input-group">
          <label for="match-date">Дата:</label>
          <input id="match-date" type="date" v-model="matchDate" />
        </div>

        <div class="input-group">
          <label for="match-time">Время:</label>
          <input id="match-time" type="text" v-model="matchTime" placeholder="чч:мм" />
        </div>
      </div>

      <div class="settings-row">
        <div class="mode-switch">
          <span class="mode-label">Про матч:</span>
          <SwitchDefault v-model="isPro" />
        </div>

        <div class="winner-switch">
          <span class="mode-label">Победитель:</span>
          <SwitchDefault v-model="teamAWon">
            <template #on>Team A</template>
            <template #off>Team B</template>
          </SwitchDefault>
        </div>
      </div>
    </div>

    <div class="teams-row">
      <div :class="['team-column', { winner: !teamAWon }]">
        <div class="winner-badge" v-if="!teamAWon">Победитель</div>
        <TeamVue :pro="isPro" :teamName="'Team A'" @select-hero="onASelectHero" @select-player="onASelectPlayer" @select-team="onASelectTeam" />
      </div>

      <div class="vs-center">VS</div>

      <div :class="['team-column', { winner: teamAWon }]">
        <div class="winner-badge" v-if="teamAWon">Победитель</div>
        <TeamVue :pro="isPro" :teamName="'Team B'" @select-hero="onBSelectHero" @select-player="onBSelectPlayer" @select-team="onBSelectTeam" />
      </div>
    </div>

    <div class="actions">
      <button class="edit-button">Edit</button>
    </div>
  </div>
</template>

<style scoped>
.match-details {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  text-align: center;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.match-details-controls {
  margin-bottom: 1rem;
}

.match-details-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 1rem 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label { font-weight: 600; color: #374151 }

.input-group input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 200px;
}

.input-group input:focus { outline: none; border-color: #0ea5ff; box-shadow: 0 0 0 2px rgba(14,165,255,0.1) }

.settings-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 1rem 0;
}

.mode-switch, .winner-switch { display:flex; align-items:center; gap:0.75rem }

.mode-label { font-weight:600; color:#374151 }

.teams-row { display:flex; align-items:center; justify-content:center; gap:2rem; margin-top:1.5rem }

.team-column {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
}

.team-column.winner {
  box-shadow: 0 10px 30px rgba(16,185,129,0.12);
  border: 2px solid #10b981;
  border-radius: 0.5rem;
  transform: translateY(-3px);
}

.winner-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  box-shadow: 0 6px 18px rgba(16,185,129,0.12);
}

.actions { display:flex; justify-content:center; margin-top:2.5rem }

.edit-button {
  background-color: #0ea5ff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(14,165,255,0.18);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.edit-button:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(14,165,255,0.2) }

.vs-center { font-weight:800; font-size:1.25rem; color:#374151 }

@media (max-width: 900px) {
  .match-details-row { flex-direction: column; align-items: center }
  .input-group input { width: 100%; min-width: 250px }
  .settings-row { flex-direction: column; gap: 1rem }
  .teams-row { flex-direction: column; gap: 1.25rem }
}
</style>