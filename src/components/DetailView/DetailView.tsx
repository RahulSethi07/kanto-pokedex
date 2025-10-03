import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePokemon } from '../../context/PokemonContext';
import LoadingIndicator from '../Common/LoadingIndicator';
import ErrorMessage from '../Common/ErrorMessage';
import styles from './DetailView.module.css';

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pokemon, loading, error, getPokemonById, getPokemonIndex, loadPokemonById } = usePokemon();

  const pokemonId = useMemo(() => {
    if (!id) {
      return null;
    }

    const parsed = Number(id);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [id]);

  const [isFetching, setIsFetching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const currentPokemon = pokemonId ? getPokemonById(pokemonId) : undefined;

  useEffect(() => {
    if (!pokemonId) {
      setNotFound(true);
      return;
    }

    if (currentPokemon) {
      setNotFound(false);
      return;
    }

    setIsFetching(true);
    setNotFound(false);

    void loadPokemonById(pokemonId).then((result) => {
      if (!result) {
        setNotFound(true);
      }
    }).finally(() => {
      setIsFetching(false);
    });
  }, [pokemonId, currentPokemon, loadPokemonById]);

  const currentIndex = pokemonId !== null ? getPokemonIndex(pokemonId ?? 0) : -1;
  const previousPokemon = currentIndex > 0 ? pokemon[currentIndex - 1] : undefined;
  const nextPokemon = currentIndex >= 0 && currentIndex < pokemon.length - 1 ? pokemon[currentIndex + 1] : undefined;

  if (loading || isFetching) {
    return <LoadingIndicator message="Loading Pokémon details…" />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!pokemonId || notFound || !currentPokemon) {
    return (
      <div className={styles.wrapper}>
        <ErrorMessage message="We couldn't find that Pokémon. Try another one from the list." />
        <Link to="/list" className={styles.backLink}>
          Back to roster
        </Link>
      </div>
    );
  }

  const { image, name, id: currentId, types, height, weight, baseExperience, abilities, stats, sprite } = currentPokemon;

  const navigateTo = (targetId: number | undefined) => {
    if (!targetId) {
      return;
    }

    navigate(`/pokemon/${targetId}`);
  };

  return (
    <section className={styles.wrapper} aria-labelledby="detail-heading">
      <header className={styles.header}>
        <div>
          <Link to="/list" className={styles.backLink}>
            ← Back to roster
          </Link>
          <div className={styles.titleRow}>
            <h1 id="detail-heading">{name}</h1>
            <span className={styles.pokedexId}>#{currentId}</span>
          </div>
          <ul className={styles.typeList}>
            {types.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </div>
        <div className={styles.navButtons}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => navigateTo(previousPokemon?.id)}
            disabled={!previousPokemon}
          >
            ← Previous
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => navigateTo(nextPokemon?.id)}
            disabled={!nextPokemon}
          >
            Next →
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <figure className={styles.figure}>
          {image ? (
            <img src={image} alt={name} />
          ) : (
            sprite ? <img src={sprite} alt={name} /> : <div className={styles.placeholder}>?</div>
          )}
        </figure>

        <section className={styles.panel} aria-label="About this Pokémon">
          <h2>Profile</h2>
          <dl className={styles.metaList}>
            <div>
              <dt>Height</dt>
              <dd>{height}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{weight}</dd>
            </div>
            <div>
              <dt>Base experience</dt>
              <dd>{baseExperience}</dd>
            </div>
          </dl>

          <div className={styles.sectionBlock}>
            <h3>Abilities</h3>
            <ul>
              {abilities.map((ability) => (
                <li key={ability}>{ability}</li>
              ))}
            </ul>
          </div>

          <div className={styles.sectionBlock}>
            <h3>Battle stats</h3>
            <ul className={styles.statsList}>
              {stats.map((stat) => (
                <li key={stat.name}>
                  <span className={styles.statName}>{stat.name}</span>
                  <span className={styles.statValue}>{stat.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
};

export default DetailView;
