<script setup lang="ts">
import TeamVue from '@/components/TeamVue.vue'
import SwitchDefault from '@/components/SwitchDefault.vue'
import { onMounted, ref, computed } from 'vue'
import { useMatchStore } from '@/store/match'


const matchStore = useMatchStore()
const isPro = ref(true)
const teamASelection = ref({ team: '', heroes: [] as string[], players: [] as string[] })
const teamBSelection = ref({ team: '', heroes: [] as string[], players: [] as string[] })

const heroMap = computed(() => Object.fromEntries(matchStore.heroes.map(h => [h.name, h.id])))
const playerMap = computed(() => Object.fromEntries(matchStore.players.map(p => [p.name ?? p.id, p.id])))
const teamMap = computed(() => Object.fromEntries(matchStore.teams.map(t => [t.name, t.id])))

const heroNames = computed(() => matchStore.heroes.map(h => h.name))
const playerNames = computed(() => matchStore.players.map(p => p.name ?? p.id))
const teamNames = computed(() => matchStore.teams.map(t => t.name))

onMounted(async ()=>{
  // load data from API (store will fallback to seed if API fails)
  await Promise.all([matchStore.getHeroes(), matchStore.getTeams(), matchStore.getPlayers()])
})

function onASelectHero(payload: { index: number; hero: string }) {
  const id = heroMap.value[payload.hero]
  if (id) teamASelection.value.heroes[payload.index] = id
}

function onASelectPlayer(payload: { index: number; player: string }) {
  const id = playerMap.value[payload.player]
  if (id) teamASelection.value.players[payload.index] = id
}

function onASelectTeam(team: string) {
  const id = teamMap.value[team]
  if (id) teamASelection.value.team = id
}

function onBSelectHero(payload: { index: number; hero: string }) {
  const id = heroMap.value[payload.hero]
  if (id) teamBSelection.value.heroes[payload.index] = id
}

function onBSelectPlayer(payload: { index: number; player: string }) {
  const id = playerMap.value[payload.player]
  if (id) teamBSelection.value.players[payload.index] = id
}

function onBSelectTeam(team: string) {
  const id = teamMap.value[team]
  if (id) teamBSelection.value.team = id
}

const prediction = ref<boolean>(false)
const is_first_pick_dire = ref<any>(true)
const predRes = ref<any>({})
const predictError = ref('')

async function makePredict() {
  predictError.value = ''
  try {
    const pad = (arr: string[]) => {
      const out = arr ? arr.slice(0, 5) : []
      while (out.length < 5) out.push('')
      return out
    }
    const input = {
      is_first_pick_radiant: is_first_pick_dire.value ? 0 : 1,
      teamA: { name: teamASelection.value.team, heroes: pad(teamASelection.value.heroes), players: pad(teamASelection.value.players) },
      teamB: { name: teamBSelection.value.team, heroes: pad(teamBSelection.value.heroes), players: pad(teamBSelection.value.players) },
    }
    const res: any = await matchStore.makePredict(input)
    predRes.value = res
    prediction.value = true
    console.log(res)
  } catch (err: any) {
    console.log(err)
  }
}
</script>

<template>
  <div class="predict-page">
    <h1>Предикт</h1>

    <div class="mode-switch">
      <span class="mode-label">Перый пик</span>
      <SwitchDefault v-model="is_first_pick_dire" />
    </div>

    <div class="teams-row">
      <div class="team-column">
        <TeamVue
          :pro="true"
          :teamName="'Team Radiant'"
          :heroes="heroNames"
          :players="playerNames"
          :teams="teamNames"
          @select-hero="onASelectHero"
          @select-player="onASelectPlayer"
          @select-team="onASelectTeam"
        />
      </div>

      <div class="vs-center">VS</div>

      <div class="team-column">
        <TeamVue
          :pro="true"
          :teamName="'Team Dire'"
          :heroes="heroNames"
          :players="playerNames"
          :teams="teamNames"
          @select-hero="onBSelectHero"
          @select-player="onBSelectPlayer"
          @select-team="onBSelectTeam"
        />
      </div>
    </div>

    <div class="actions">
      <button class="predict-button" @click="makePredict">Predict</button>
    </div>

    <div class="predict-result">
      <div v-if="predictError" class="error">{{ predictError }}</div>
      <div v-else-if="prediction" class="result">
        <div class="winner">Pro: Radiant: {{ `${predRes.data.pro.radiant_win}`.slice(0,2) }}% | Dire: {{ `${predRes.data.pro.dire_win}`.slice(0,2) }}%</div>
        <div class="winner">Pub: Radiant: {{ `${predRes.data?.pub?.radiant_win}`.slice(0,2) }}% | Dire: {{ `${predRes.data?.pub?.dire_win}`.slice(0,2) }}%</div>
        
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

.team-column { flex: 1; display:flex; justify-content:center }

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
  box-shadow: 0 6px 18px rgba(14,165,255,0.18);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.predict-button:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(14,165,255,0.2); }

.vs-center {
  font-weight: 800;
  font-size: 1.25rem;
  color: #374151;
}

@media (max-width: 900px) {
  .teams-row { flex-direction: column; gap: 1.25rem }
}

.predict-result { text-align: center; margin-top: 1rem }
.predict-result .error { color: #dc2626; font-weight: 600 }
.predict-result .result { color: #111827 }
.predict-result .winner { margin-bottom: 0.5rem }
</style>