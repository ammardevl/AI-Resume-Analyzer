import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../lib/authStore";

export const meta = () => [
  { title: "Create Account — Resumind" },
  { name: "description", content: "Create a free Resumind account to save and revisit your resume analyses." },
];

const Register = () => {
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => clearError, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <main className="reality-bg-auth">
      <div className="reality-gradient-border reality-auth-card">
        <section className="reality-auth-card__inner">
          <div className="reality-auth-card__header">
            <h1 className="reality-h1" style={{ fontSize: "2.5rem" }}>Create your account</h1>
            <h2 className="reality-h2">Track every application and its ATS score</h2>
          </div>

          <form className="reality-form" onSubmit={handleSubmit}>
            <div className="reality-form-div">
              <label className="reality-label" htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                className="reality-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
                minLength={8}
                autoComplete="new-password"
                className="reality-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="reality-form-hint">At least 8 characters.</p>
            </div>
            {error && <p className="reality-form-error">{error}</p>}
            <button className="reality-auth-button" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="reality-auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Register;
