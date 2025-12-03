// src/views/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../utils/apiClient";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle mellem login/register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Nulstil form når man skifter mellem login/register
  function toggleMode() {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await apiPost("/api/Login/login", {
        email,
        password,
      });

      if (!res || !res.token) {
        setError("Forkert email eller password.");
        return;
      }

      localStorage.setItem("token", res.token);
      console.log("Token saved to localStorage:", res.token.substring(0, 20) + "...");
      setSuccess("Login succesfuld! Omdirigerer...");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Noget gik galt ved login.");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validering
    if (password !== confirmPassword) {
      setError("Passwords matcher ikke!");
      return;
    }

    if (password.length < 4) {
      setError("Password skal være mindst 4 tegn.");
      return;
    }

    try {
      const res = await apiPost("/api/Login/register", {
        email,
        password,
      });

      setSuccess("Bruger oprettet! Du kan nu logge ind.");
      
      // Skift automatisk til login efter 1.5 sekunder
      setTimeout(() => {
        setIsLogin(true);
        setConfirmPassword("");
        setError("");
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Email er allerede i brug eller noget gik galt.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{isLogin ? "Log ind" : "Opret bruger"}</h1>
        
        <form 
          onSubmit={isLogin ? handleLogin : handleRegister} 
          className="login-form"
        >
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.dk"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-row">
              <label htmlFor="confirm-password">Bekræft password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <button type="submit" className="btn btn-primary">
            {isLogin ? "Log ind" : "Opret bruger"}
          </button>
        </form>

        <div className="login-toggle">
          {isLogin ? (
            <p>
              Har du ikke en bruger?{" "}
              <button onClick={toggleMode} className="toggle-btn">
                Opret en her
              </button>
            </p>
          ) : (
            <p>
              Har du allerede en bruger?{" "}
              <button onClick={toggleMode} className="toggle-btn">
                Log ind her
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
