// Header.jsx
import styles from "./Header.module.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  // Skjul header på login siden
  if (location.pathname === "/login") {
    return null;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <header className={`app-header`}>
      <div className="container">
        <div className={styles.brand}>Habitual Tracker</div>

        <nav className={styles.nav}>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/habits">Habits</NavLink>
          <NavLink to="/stats">Statistik</NavLink>
          
          {token && (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Log ud
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
