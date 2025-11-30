// src/views/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../utils/apiClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

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
      // efter login → gå til dashboard
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Noget gik galt ved login.");
    }
  }

  return (
    <div className="login-page">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-row">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn btn-primary">
          Log ind
        </button>
      </form>
    </div>
  );
}
