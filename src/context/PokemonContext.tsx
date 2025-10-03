import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchPokemonById, fetchPokemonCollection } from '../api/pokemon';
import { PokemonContextValue, PokemonSummary } from '../types/pokemon';

const PokemonContext = createContext<PokemonContextValue | undefined>(undefined);

const PokemonProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPokemon = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await fetchPokemonCollection();

        if (!cancelled) {
          setPokemon(results);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load Pokémon data. Please try again later.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPokemon();

    return () => {
      cancelled = true;
    };
  }, []);

  const getPokemonById = useCallback(
    (id: number) => pokemon.find((entry) => entry.id === id),
    [pokemon]
  );

  const getPokemonIndex = useCallback(
    (id: number) => pokemon.findIndex((entry) => entry.id === id),
    [pokemon]
  );

  const loadPokemonById = useCallback(
    async (id: number) => {
      const existing = getPokemonById(id);

      if (existing) {
        return existing;
      }

      try {
        const fetched = await fetchPokemonById(id);

        setPokemon((prev) => {
          if (prev.some((entry) => entry.id === fetched.id)) {
            return prev;
          }

          return [...prev, fetched].sort((a, b) => a.id - b.id);
        });

        return fetched;
      } catch (err) {
        setError('Unable to load Pokémon details. Please try again later.');
        return undefined;
      }
    },
    [getPokemonById]
  );

  const value: PokemonContextValue = useMemo(
    () => ({
      pokemon,
      loading,
      error,
      getPokemonById,
      getPokemonIndex,
      loadPokemonById,
    }),
    [pokemon, loading, error, getPokemonById, getPokemonIndex, loadPokemonById]
  );

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
};

const usePokemon = (): PokemonContextValue => {
  const context = useContext(PokemonContext);

  if (!context) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }

  return context;
};

export { PokemonProvider, usePokemon };
