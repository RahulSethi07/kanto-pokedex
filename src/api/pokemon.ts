import axios from 'axios';
import { PokemonAPIResponse, PokemonSummary } from '../types/pokemon';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
});

interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: Array<{
    ability: { name: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
  types: Array<{
    slot: number;
    type: { name: string };
  }>;
  sprites: {
    front_default: string | null;
    other?: {
      [key: string]: {
        front_default: string | null;
      } | undefined;
      ['official-artwork']?: {
        front_default: string | null;
      };
    };
  };
}

const selectImage = (detail: PokemonDetailResponse): { image: string; sprite: string | null } => {
  const official = detail.sprites.other?.['official-artwork']?.front_default ?? null;
  const defaultSprite = detail.sprites.front_default ?? null;

  return {
    image: official ?? defaultSprite ?? '',
    sprite: defaultSprite,
  };
};

const normalizePokemon = (detail: PokemonDetailResponse): PokemonSummary => {
  const { image, sprite } = selectImage(detail);

  return {
    id: detail.id,
    name: detail.name,
    image,
    sprite,
    height: detail.height,
    weight: detail.weight,
    baseExperience: detail.base_experience,
    abilities: detail.abilities.map(({ ability }) => ability.name),
    stats: detail.stats.map(({ base_stat, stat }) => ({
      name: stat.name,
      value: base_stat,
    })),
    types: detail.types
      .sort((a, b) => a.slot - b.slot)
      .map(({ type }) => type.name),
  };
};

export const fetchPokemonCollection = async (limit = 151): Promise<PokemonSummary[]> => {
  const { data } = await api.get<PokemonAPIResponse>(`/pokemon?limit=${limit}&offset=0`);

  const detailResults = await Promise.all(
    data.results.map(async (entry) => {
      try {
        const { data: detail } = await api.get<PokemonDetailResponse>(entry.url);
        return normalizePokemon(detail);
      } catch (error) {
        // Skip entries that fail to load so the UI can continue rendering.
        return null;
      }
    })
  );

  return detailResults.filter((item): item is PokemonSummary => Boolean(item)).sort((a, b) => a.id - b.id);
};

export const fetchPokemonById = async (id: number): Promise<PokemonSummary> => {
  const { data } = await api.get<PokemonDetailResponse>(`/pokemon/${id}`);
  return normalizePokemon(data);
};
