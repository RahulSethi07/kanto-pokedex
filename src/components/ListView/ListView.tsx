import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemon } from '../../context/PokemonContext';
import LoadingIndicator from '../Common/LoadingIndicator';
import ErrorMessage from '../Common/ErrorMessage';
import styles from './ListView.module.css';
import { PokemonSummary } from '../../types/pokemon';

type SortKey = 'name' | 'id' | 'height' | 'weight' | 'baseExperience';
type SortOrder = 'asc' | 'desc';

const formatName = (name: string) => name.replace(/-/g, ' ');

const compareByKey = (a: PokemonSummary, b: PokemonSummary, key: SortKey) => {
  switch (key) {
    case 'id':
      return a.id - b.id;
    case 'height':
      return a.height - b.height;
    case 'weight':
      return a.weight - b.weight;
    case 'baseExperience':
      return a.baseExperience - b.baseExperience;
    case 'name':
    default:
      return a.name.localeCompare(b.name);
  }
};

const ListView: React.FC = () => {
  const { pokemon, loading, error } = usePokemon();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredPokemon = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    const filtered = pokemon.filter((entry) =>
      entry.name.toLowerCase().includes(normalizedQuery)
    );

    const sorted = [...filtered].sort((a, b) => {
      const comparison = compareByKey(a, b, sortKey);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [pokemon, searchTerm, sortKey, sortOrder]);

  if (loading) {
    return <LoadingIndicator message="Loading Pokémon roster…" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className={styles.wrapper} aria-labelledby="list-heading">
      <header className={styles.header}>
        <div>
          <h1 id="list-heading">Pokémon Roster</h1>
          <p className={styles.subtitle}>
            Search, sort, and explore the first-generation Pokemons.
          </p>
        </div>
        <div className={styles.controls}>
          <label className={styles.controlGroup}>
            <span className={styles.label}>Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Type a name…"
              className={styles.searchInput}
            />
          </label>
          <label className={styles.controlGroup}>
            <span className={styles.label}>Sort by</span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className={styles.select}
            >
              <option value="id">Pokédex ID</option>
              <option value="name">Name</option>
              <option value="height">Height</option>
              <option value="weight">Weight</option>
              <option value="baseExperience">Base experience</option>
            </select>
          </label>
          <button
            type="button"
            className={styles.orderButton}
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          >
            {sortOrder === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
          </button>
        </div>
      </header>

      <div className={styles.summary}>
        Showing {filteredPokemon.length} of {pokemon.length} Pokémon
      </div>

      {filteredPokemon.length === 0 ? (
        <div className={styles.emptyState}>No Pokémon match your search.</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Types</th>
                <th scope="col">Height</th>
                <th scope="col">Weight</th>
                <th scope="col">Experience</th>
                <th aria-label="View details" />
              </tr>
            </thead>
            <tbody>
              {filteredPokemon.map((entry) => (
                <tr key={entry.id}>
                  <td>#{entry.id}</td>
                  <td className={styles.nameCell}>{formatName(entry.name)}</td>
                  <td>{entry.types.join(', ')}</td>
                  <td>{entry.height}</td>
                  <td>{entry.weight}</td>
                  <td>{entry.baseExperience}</td>
                  <td>
                    <Link className={styles.viewLink} to={`/pokemon/${entry.id}`}>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ListView;
