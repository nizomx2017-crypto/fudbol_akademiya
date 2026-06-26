import { useState } from "react";
import { AUTH_TOKEN_STORAGE_KEY, login } from "../services/api.js";

export default function AuthGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY))
  );
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ login: loginValue, password });
      setIsAuthenticated(true);
    } catch (error) {
      setError(error.message);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={handleSubmit}>
        <div className="auth-logo">O</div>
        <div>
          <h1 className="auth-title">O'quv Markazi</h1>
          <p className="auth-subtitle">Tizimga kirish uchun login va parolni kiriting</p>
        </div>

        <label className="auth-field">
          <span>Login</span>
          <input
            autoFocus
            value={loginValue}
            type="text"
            autoComplete="username"
            onChange={(event) => {
              setLoginValue(event.target.value);
              setError("");
            }}
            disabled={isLoading}
          />
        </label>

        <label className="auth-field">
          <span>Parol</span>
          <input
            value={password}
            type="password"
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            disabled={isLoading}
          />
        </label>

        {error ? <p className="auth-error">{error}</p> : null}

        <button className="btn btn-primary auth-submit" type="submit" disabled={isLoading}>
          {isLoading ? "Tekshirilmoqda..." : "Kirish"}
        </button>
      </form>
    </main>
  );
}
