import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function AuthGate({ children }) {
  const { isAuthenticated, signIn } = useAuth();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn({ login: loginValue, password });
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
