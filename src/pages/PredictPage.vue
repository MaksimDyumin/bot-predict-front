<script setup lang="ts">
import TeamVue from '@/components/TeamVue.vue'
import SwitchDefault from '@/components/SwitchDefault.vue'
import { onMounted, ref, computed } from 'vue'
import { useMatchStore } from '@/store/match'
import type { Hero, Player, Team } from '@/store/store.types'
import ButtonDefault from '@/components/ButtonDefault.vue'


const matchStore = useMatchStore()
const teamASelection = ref({ team: '', heroes: [] as string[], heroPicks: [] as number[], players: [] as string[] })
const teamBSelection = ref({ team: '', heroes: [] as string[], heroPicks: [] as number[], players: [] as string[] })

const teamARef = ref<InstanceType<typeof TeamVue>>()
const teamBRef = ref<InstanceType<typeof TeamVue>>()

const heroes = computed(() => matchStore.heroes)
const players = computed(() => matchStore.players)
const teams = computed(() => matchStore.teams)
const aiModels = ref(['pro','pub'])
const addAiModelInput = ref('') 

// we pass full objects to TeamVue; no separate name arrays needed

onMounted(async () => {
  // load data from API (store will fallback to seed if API fails)
  await Promise.all([matchStore.getHeroes(), matchStore.getTeams(), matchStore.getPlayers()])
})

function onASelectHero(payload: { index: number; hero: Hero; pick: number }) {
  if (payload?.hero?.id) {
    teamASelection.value.heroes[payload.index] = payload.hero.id
    teamASelection.value.heroPicks[payload.index] = payload.pick
  }
}

function onASelectPlayer(payload: { index: number; player: Player }) {
  if (payload?.player?.id) {
    teamASelection.value.players[payload.index] = payload.player.id
  }
}

function onASelectTeam(team: Team) {
  if (team?.id) {
    teamASelection.value.team = team.id
  }
}

function onBSelectHero(payload: { index: number; hero: Hero; pick: number }) {
  if (payload?.hero?.id) {
    teamBSelection.value.heroes[payload.index] = payload.hero.id
    teamBSelection.value.heroPicks[payload.index] = payload.pick
  }
}

function onBSelectPlayer(payload: { index: number; player: Player }) {
  if (payload?.player?.id) {
    teamBSelection.value.players[payload.index] = payload.player.id
  }
}

function onBSelectTeam(team: Team) {
  if (team?.id) {
    teamBSelection.value.team = team.id
  }
}

function onASelectPos(heroPick: { pos: number, index: number }) {
  teamASelection.value.heroPicks[heroPick.index] = heroPick.pos
}

function onBSelectPos(heroPick: { pos: number, index: number }) {
  teamBSelection.value.heroPicks[heroPick.index] = heroPick.pos
}

function clearSelection() {
  teamASelection.value = { team: '', heroes: [] as string[], heroPicks: [] as number[], players: [] as string[] }
  teamBSelection.value = { team: '', heroes: [] as string[], heroPicks: [] as number[], players: [] as string[] }
  prediction.value = false
  predRes.value = {}
  predictError.value = ''
  teamARef.value?.resetSelection()
  teamBRef.value?.resetSelection()
}

const prediction = ref<boolean>(false)
const is_first_pick_dire = ref<any>(true)
const predRes = ref<any>({})
const predictError = ref('')
const showPublishModal = ref(false)
const publishCoeff = ref<number | null>(null)
const publishBet = ref<number | null>(null)

function openPublishModal() {
  showPublishModal.value = true
}

function closePublishModal() {
  showPublishModal.value = false
}

function submitPublish() {
  // basic validation
  if (!publishCoeff.value || !publishBet.value) {
    alert('Введите коэффициент и ставку')
    return
  }
  const payload = {
    coeff: publishCoeff.value,
    bet: publishBet.value,
    prediction: predRes.value,
  }
  console.log('Publish payload', payload)
  // TODO: call API/store to actually publish
  closePublishModal()
  publishCoeff.value = null
  publishBet.value = null
}

async function makePredict() {
  predictError.value = ''
  try {
    const pad = (arr: string[]) => {
      const out = arr ? arr.slice(0, 5) : []
      while (out.length < 5) out.push('')
      return out
    }
    const padPicks = (arr: number[]) => {
      const out = arr ? arr.slice(0, 5) : []
      while (out.length < 5) out.push(0)
      return out
    }
    const input = {
      is_first_pick_radiant: is_first_pick_dire.value ? 0 : 1,
      teamA: { name: teamASelection.value.team, heroes: pad(teamASelection.value.heroes), players: pad(teamASelection.value.players), heroPicks: padPicks(teamASelection.value.heroPicks) },
      teamB: { name: teamBSelection.value.team, heroes: pad(teamBSelection.value.heroes), players: pad(teamBSelection.value.players), heroPicks: padPicks(teamBSelection.value.heroPicks) },
    }
    const res: any = await matchStore.makePredict(input)
    predRes.value = res.data
    prediction.value = true
  } catch (err: any) {
    console.log(err)
  }
}

function addModelResult() {
  if (!predRes.value[addAiModelInput.value]) return console.log(`Нет модели ${addAiModelInput.value}`)
  if(aiModels.value.includes(addAiModelInput.value)) return console.log(`Модель ${addAiModelInput.value} уже есть`)
  aiModels.value.push(addAiModelInput.value)
}
</script>

<template>
  <div class="predict-page">
    <h1>Предикт</h1>

    <div class="menu-bock">
      <div class="mode-switch">
        <span class="mode-label">Перый пик</span>
        <SwitchDefault v-model="is_first_pick_dire" />
      </div>

      <div class="menu-btn-one">
        <span class="mode-label">Очистить выбор</span>
        <ButtonDefault @click="clearSelection">Очистить</ButtonDefault>
      </div>
    </div>



    <div class="teams-row">
      <div class="team-column">
        <TeamVue ref="teamARef" :pro="false" :teamName="'Team Radiant'" :heroes="heroes" :players="players" :teams="teams"
          @select-hero="onASelectHero" @select-player="onASelectPlayer" @select-team="onASelectTeam"
          @select-pos="onASelectPos" />
      </div>

      <div class="vs-center">VS</div>

      <div class="team-column">
        <TeamVue ref="teamBRef" :pro="false" :teamName="'Team Dire'" :heroes="heroes" :players="players" :teams="teams"
          @select-hero="onBSelectHero" @select-player="onBSelectPlayer" @select-team="onBSelectTeam"
          @select-pos="onBSelectPos" />
      </div>
    </div>

    <div class="actions">
      <button class="predict-button" @click="makePredict">Predict</button>
      <button class="predict-button publish" @click="openPublishModal">Опубликовать</button>
    </div>

    <div v-if="showPublishModal" class="publish-modal-backdrop" @click.self="closePublishModal">
      <div class="publish-modal">
        <header class="modal-header">
          <h3>Опубликовать предсказание</h3>
          <button class="close-btn" @click="closePublishModal">✕</button>
        </header>
        <div class="modal-body">
          <label>Коэффициент</label>
          <input type="number" v-model.number="publishCoeff" class="modal-input" />
          <label>Ставка</label>
          <input type="number" v-model.number="publishBet" class="modal-input" />
          <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px">
            <button class="predict-button" @click="submitPublish">Опубликовать</button>
            <button class="predict-button" @click="closePublishModal">Отмена</button>
          </div>
        </div>
      </div>
    </div>

    <div class="predict-result">
      <div v-if="predictError" class="error">{{ predictError }}</div>
      <div v-else-if="prediction" class="result">
          <div v-for="mode in aiModels" :key="mode" class="winner">
            <b>{{ mode }}</b> Radiant: {{ String(predRes?.[mode]?.radiant_win ?? '').slice(0,2) }}% | Dire: {{ String(predRes?.[mode]?.dire_win ?? '').slice(0,2) }}%
          </div>
          <div class="add-model-block">
            <input type="text" v-model="addAiModelInput">
            <ButtonDefault @click="addModelResult()">add model result</ButtonDefault>
          </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.predict-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.mode-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 1rem 0;
}

.menu-btn-one {
  display: flex;
  flex-direction: column;
}

.mode-label {
  font-weight: 600;
  color: #374151;
}

.teams-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.team-column {
  flex: 1;
  display: flex;
  justify-content: center
}

.menu-bock {
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-bock > * {
  margin: 0 20px;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.predict-button {
  background-color: #0ea5ff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(14, 165, 255, 0.18);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.predict-button + .predict-button {
  margin-left: 10px;
}

.predict-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(14, 165, 255, 0.2);
}

.predict-button.publish { background-color: #06b6d4 }

.publish-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}
.publish-modal {
  background: white;
  width: 90%;
  max-width: 420px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  overflow: hidden;
}
.publish-modal .modal-header { display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1rem; border-bottom:1px solid #e5e7eb }
.publish-modal .modal-body { padding:1rem }
.modal-input { width:100%; padding:0.5rem; border-radius:6px; border:1px solid #e5e7eb; margin-top:6px; margin-bottom:10px }
.close-btn { background:transparent; border:none; cursor:pointer }

.add-model-block {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.75rem;
}
.add-model-block input[type="text"] {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  min-width: 220px;
}
.add-model-block button {
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  border: none;
  background: #0ea5ff;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.add-model-block button:hover { transform: translateY(-2px); }

.vs-center {
  font-weight: 800;
  font-size: 1.25rem;
  color: #374151;
}

@media (max-width: 900px) {
  .teams-row {
    flex-direction: column;
    gap: 1.25rem
  }
}

.predict-result {
  text-align: center;
  margin-top: 1rem
}

.predict-result .error {
  color: #dc2626;
  font-weight: 600
}

.predict-result .result {
  color: #111827
}

.predict-result .winner {
  margin-bottom: 0.5rem
}
</style>