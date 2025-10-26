// Header.jsx
import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';

export default function Header(){
  return (
    <header className={`app-header`}>
      <div className="container">
        <div className={styles.brand}>Habitual Tracker</div>

        <nav className={styles.nav}>
          <NavLink to="/">Forside</NavLink>
          <NavLink to="/habits">Habits</NavLink>
          <NavLink to="/routines">Daily</NavLink>
          <NavLink to="/todos">To-Do</NavLink>
          <NavLink to="/stats">Statistik</NavLink>
          <NavLink to="/profile">Profil</NavLink>
        </nav>
      </div>
    </header>
  );
}