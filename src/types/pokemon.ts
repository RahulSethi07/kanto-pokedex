export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonSummary {
  id: number;
  name: string;
  image: string;
  sprite: string | null;
  height: number;
  weight: number;
  baseExperience: number;
  abilities: string[];
  stats: PokemonStat[];
  types: string[];
}

export interface PokemonContextValue {
  pokemon: PokemonSummary[];
  loading: boolean;
  error: string | null;
  getPokemonById: (id: number) => PokemonSummary | undefined;
  getPokemonIndex: (id: number) => number;
  loadPokemonById: (id: number) => Promise<PokemonSummary | undefined>;
}
