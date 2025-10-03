import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { PokemonSummary } from './types/pokemon';
import { fetchPokemonCollection, fetchPokemonById } from './api/pokemon';

jest.mock('./api/pokemon', () => ({
  fetchPokemonCollection: jest.fn(),
  fetchPokemonById: jest.fn(),
}));

const mockedFetchCollection = fetchPokemonCollection as jest.MockedFunction<typeof fetchPokemonCollection>;
const mockedFetchById = fetchPokemonById as jest.MockedFunction<typeof fetchPokemonById>;

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/mp2/');

    const samplePokemon: PokemonSummary[] = [
      {
        id: 1,
        name: 'bulbasaur',
        image: 'https://img/1.png',
        sprite: 'https://sprite/1.png',
        height: 7,
        weight: 69,
        baseExperience: 64,
        abilities: ['overgrow'],
        stats: [{ name: 'hp', value: 45 }],
        types: ['grass', 'poison'],
      },
      {
        id: 2,
        name: 'ivysaur',
        image: 'https://img/2.png',
        sprite: 'https://sprite/2.png',
        height: 10,
        weight: 130,
        baseExperience: 142,
        abilities: ['overgrow'],
        stats: [{ name: 'hp', value: 60 }],
        types: ['grass', 'poison'],
      },
    ];

    mockedFetchCollection.mockResolvedValue(samplePokemon);
    mockedFetchById.mockImplementation(async (id: number) => {
      const match = samplePokemon.find((entry) => entry.id === id);
      if (!match) {
        throw new Error('Not found');
      }
      return match;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation and list heading after loading data', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: /pokémon roster/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /gallery/i })).toBeInTheDocument();
  });
});
