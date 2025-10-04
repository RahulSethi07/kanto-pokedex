import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className={styles.appShell}>
    <header className={styles.navbar}>
      <div className={styles.brand}>Kanto Pokédex</div>
      <nav className={styles.navLinks} aria-label="Primary navigation">
        <NavLink
          to="/list"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          List
        </NavLink>
        <NavLink
          to="/gallery"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          Gallery
        </NavLink>
      </nav>
    </header>
    <main className={styles.mainContent}>{children}</main>
    <footer className={styles.footer}>
      Data provided by <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>
    </footer>
  </div>
);

export default Layout;
