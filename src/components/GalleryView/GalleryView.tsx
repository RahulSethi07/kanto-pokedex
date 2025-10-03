import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePokemon } from '../../context/PokemonContext';
import LoadingIndicator from '../Common/LoadingIndicator';
import ErrorMessage from '../Common/ErrorMessage';
import styles from './GalleryView.module.css';

const GalleryView: React.FC = () => {
  const { pokemon, loading, error } = usePokemon();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const allTypes = useMemo(() => {
    const set = new Set<string>();
    pokemon.forEach((entry) => entry.types.forEach((type) => set.add(type)));
    return Array.from(set).sort();
  }, [pokemon]);

  const filteredPokemon = useMemo(() => {
    if (selectedTypes.length === 0) {
      return pokemon;
    }

    return pokemon.filter((entry) =>
      selectedTypes.every((type) => entry.types.includes(type))
    );
  }, [pokemon, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  if (loading) {
    return <LoadingIndicator message="Building your Pokédex gallery…" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <section className={styles.wrapper} aria-labelledby="gallery-heading">
      <header className={styles.header}>
        <div>
          <h1 id="gallery-heading">Pokémon Gallery</h1>
          <p className={styles.subtitle}>
            Browse official artwork and filter by elemental types.
          </p>
        </div>
        <div className={styles.filters}>
          <h2 className={styles.filterTitle}>Filter by type</h2>
          <div className={styles.filterChips}>
            {allTypes.map((type) => {
              const isActive = selectedTypes.includes(type);

              return (
                <button
                  key={type}
                  type="button"
                  className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
                  onClick={() => toggleType(type)}
                >
                  {type}
                </button>
              );
            })}
          </div>
          <div className={styles.filterActions}>
            <span className={styles.resultCount}>
              Showing {filteredPokemon.length} of {pokemon.length}
            </span>
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => setSelectedTypes([])}
              disabled={selectedTypes.length === 0}
            >
              Clear filters
            </button>
          </div>
        </div>
      </header>

      {filteredPokemon.length === 0 ? (
        <div className={styles.emptyState}>No Pokémon match the selected types.</div>
      ) : (
        <div className={styles.grid}>
          {filteredPokemon.map((entry) => (
            <Link key={entry.id} to={`/pokemon/${entry.id}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                {entry.image ? (
                  <img src={entry.image} alt={entry.name} loading="lazy" />
                ) : (
                  <div className={styles.placeholder} aria-hidden="true">
                    ?
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.id}>#{entry.id}</span>
                <h3 className={styles.name}>{entry.name}</h3>
                <ul className={styles.typeList}>
                  {entry.types.map((type) => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default GalleryView;
