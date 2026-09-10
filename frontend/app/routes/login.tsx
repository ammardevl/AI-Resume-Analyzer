import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../../lib/authStore";

export const meta = () => [
  { title: "Log In — Resumind" },
  { name: "description", content: "Log in to view your previously analyzed resumes." },
];

const Login = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate(next, { replace: true });
  }, [isAuthenticated, next, navigate]);

  useEffect(() => clearError, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <main className="reality-bg-auth">
      <div className="reality-gradient-border reality-auth-card">
        <section className="reality-auth-card__inner">
          <div className="reality-auth-card__header">
            <h1 className="reality-h1" style={{ fontSize: "2.5rem" }}>Welcome back!</h1>
            <h2 className="reality-h2">Log in to continue your job journey</h2>
          </div>

          <form className="reality-form" onSubmit={handleSubmit}>
            <div className="reality-form-div">
              <label className="reality-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="reality-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="reality-form-div">
              <label className="reality-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="reality-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="reality-form-error">{error}</p>}
            <button className="reality-auth-button" type="submit" disabled={isLoading}>
              {isLoading ? "Signing you in..." : "Log In"}
            </button>
          </form>

          <p className="reality-auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Login;
