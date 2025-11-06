export interface Player {
  id: string
  name?: string
  teamId?: string
}

export interface Hero {
  id: string
  name: string
}

export interface Team {
  id: string
  name: string
}

export interface Match {
  id: string
  date?: string
  time?: string
  pro?: boolean
  teamA: { name?: string; players: string[]; heroes: string[] }
  teamB: { name?: string; players: string[]; heroes: string[] }
  winner?: 'A' | 'B' | null
}

export interface TeamsFromComponent {
  pro?: boolean
  is_first_pick_radiant?: any
  teamA: { name?: string; players: string[]; heroes: string[] }
  teamB: { name?: string; players: string[]; heroes: string[] }
}

// Prediction payload shape expected by the server
export interface PredictPayload {
  is_first_pick_radiant: number
  // radiant heroes
  r_h1: number
  r_h2: number
  r_h3: number
  r_h4: number
  r_h5: number
  // dire heroes
  d_h1: number
  d_h2: number
  d_h3: number
  d_h4: number
  d_h5: number
  // radiant players
  r_p1: number
  r_p2: number
  r_p3: number
  r_p4: number
  r_p5: number
  // dire players
  d_p1: number
  d_p2: number
  d_p3: number
  d_p4: number
  d_p5: number
}

// MatchInput is now the prediction payload shape
export type MatchInput = PredictPayload