import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type {Player, Hero, Match, MatchInput, Team, TeamsFromComponent} from '@/store/store.types'

const BASE_API = 'http://46.181.201.172:8080' // set API base if you have one, e.g. '/api'

export const useMatchStore = defineStore('match', () => {
  const matches = ref<Match[]>([])
  const players = ref<Player[]>([])
  const heroes = ref<Hero[]>([])
  const teams = ref<Team[]>([])

  function seedIfEmpty() {
    if (players.value.length === 0) {
      players.value = [
        { id: 'p1', name: 'Player 1' },
        { id: 'p2', name: 'Player 2' },
        { id: 'p3', name: 'Player 3' },
      ]
    }
    if (heroes.value.length === 0) {
      heroes.value = [
        { id: 'h1', name: 'Hero 1' },
        { id: 'h2', name: 'Hero 2' },
        { id: 'h3', name: 'Hero 3' },
      ]
    }
    if (matches.value.length === 0) {
      matches.value = [
        {
          id: 'm1',
          date: '',
          time: '',
          pro: true,
          teamA: { name: 'Team A', players: ['p1'], heroes: ['h1'] },
          teamB: { name: 'Team B', players: ['p2'], heroes: ['h2'] },
          winner: null,
        },
      ]
    }
  }

  async function getMatches(): Promise<Match[]> {
    if (BASE_API) {
      try {
        const res = await axios.get(`${BASE_API}/matches`)
        matches.value = res.data as Match[]
        return matches.value
      } catch (e) {
        // fallback to local
        console.warn('getMatches failed, using local seed', e)
      }
    }
    seedIfEmpty()
    return matches.value
  }

  async function getTeams(): Promise<Team[]> {
    if (BASE_API) {
      try {
        const res = await axios.get(`${BASE_API}/teams`)
        teams.value = res.data as Team[]
        return teams.value
      } catch (e) {
        // fallback to local
        console.warn('getMatches failed, using local seed', e)
      }
    }
    seedIfEmpty()
    return teams.value
  }

  async function getPlayers(): Promise<Player[]> {
    if (BASE_API) {
      try {
        const res = await axios.get(`${BASE_API}/pro-players`)
        players.value = res.data as Player[]
        return players.value
      } catch (e) {
        console.warn('getPlayers failed, using local seed', e)
      }
    }
    seedIfEmpty()
    return players.value
  }

  async function getHeroes(): Promise<Hero[]> {
    if (BASE_API) {
      try {
        const res = await axios.get(`${BASE_API}/heroes`)
        heroes.value = res.data as Hero[]
        return heroes.value
      } catch (e) {
        console.warn('getHeroes failed, using local seed', e)
      }
    }
    seedIfEmpty()
    return heroes.value
  }

  async function addMatch(input: Partial<Match> & { teamA: Match['teamA']; teamB: Match['teamB'] }): Promise<Match> {
    const newMatch: Match = {
      id: input.id ?? `m_${Date.now()}`,
      date: input.date ?? '',
      time: input.time ?? '',
      pro: input.pro ?? false,
      teamA: input.teamA,
      teamB: input.teamB,
      winner: input.winner ?? null,
    }

    if (BASE_API) {
      try {
        const res = await axios.post(`${BASE_API}/matches`, newMatch, { headers: { 'Content-Type': 'application/json' } })
        const created = res.data
        matches.value.push(created as Match)
        return created as Match
      } catch (e) {
        console.warn('addMatch failed, falling back to local', e)
      }
    }

    matches.value.push(newMatch)
    return newMatch
  }

  async function editMatch(id: string, patch: Partial<Match>): Promise<Match | null> {
    const idx = matches.value.findIndex((m) => m.id === id)
    if (idx === -1) return null

    const existing = matches.value[idx]!
    const updated: Match = {
      id: existing.id,
      date: patch.date ?? existing.date,
      time: patch.time ?? existing.time,
      pro: patch.pro ?? existing.pro,
      teamA: patch.teamA ?? existing.teamA,
      teamB: patch.teamB ?? existing.teamB,
      winner: patch.winner ?? existing.winner,
    }

    if (BASE_API) {
      try {
        const res = await axios.put(`${BASE_API}/matches/${id}`, updated, { headers: { 'Content-Type': 'application/json' } })
        const remote = res.data
        matches.value[idx] = remote as Match
        return matches.value[idx]
      } catch (e) {
        console.warn('editMatch failed, updating local state', e)
      }
    }

    matches.value[idx] = updated
    return updated
  }

  /**
   * makePredict
   * - If you have a prediction API, it will call it when BASE_API is set.
   * - Otherwise returns a simple heuristic prediction based on number of heroes selected.
   */
  async function makePredict(matchIdOrData: TeamsFromComponent): Promise<any> {
    let payload: any = {}
      for (let i = 0; i < 5; i++) {
        payload[`r_h${i + 1}`] = matchIdOrData.teamA.heroes?.[i]
        payload[`d_h${i + 1}`] = matchIdOrData.teamB.heroes?.[i]
        payload[`r_p${i + 1}`] = matchIdOrData.teamA.players?.[i]
        payload[`d_p${i + 1}`] = matchIdOrData.teamB.players?.[i]

        payload[`rp_h${i + 1}`] = matchIdOrData.teamA.heroPicks?.[i]
        payload[`dp_h${i + 1}`] = matchIdOrData.teamB.heroPicks?.[i]
      }
      payload.is_first_pick_radiant = matchIdOrData.is_first_pick_radiant
      console.log(payload)
      const res = await axios.post(`${BASE_API}/draft/predict`, payload, { headers: { 'Content-Type': 'application/json' } })
      return res
  }

  return {
    matches,
    players,
    heroes,
    teams,
    getMatches,
    getPlayers,
    getHeroes,
    addMatch,
    editMatch,
    makePredict,
    getTeams,
  }
})