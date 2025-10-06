// Header.jsx
import styles from './Header.module.css';

export default function Header(){
  return (
    <header className={`app-header`}>
      <div className="container">
        <div className={styles.brand}>Habitual Tracker</div>
        <nav className={styles.nav}>
          <a href="/">Forside</a>
          <a href="/habits">Habits</a>
          <a href="/routines">Daily</a>
          <a href="/todos">To-Do</a>
          <a href="/stats">Statistik</a>
        </nav>
      </div>
    </header>
  );
}