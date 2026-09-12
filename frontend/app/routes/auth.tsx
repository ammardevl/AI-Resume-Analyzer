import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "../../lib/puter";

export const meta = () => [
  { title: "Sign In — Resumind" },
  { name: "description", content: "Sign in with your free Puter account to save and revisit your resume analyses." },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next") || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next, { replace: true });
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="reality-bg-auth">
      <div className="reality-gradient-border reality-auth-card">
        <section className="reality-auth-card__inner">
          <div className="reality-auth-card__header">
            <h1 className="reality-h1" style={{ fontSize: "2.5rem" }}>Welcome!</h1>
            <h2 className="reality-h2">Log in to continue your job journey</h2>
          </div>

          <div className="reality-w-full">
            {isLoading ? (
              <button className="reality-auth-button reality-is-loading" disabled>
                Signing you in...
              </button>
            ) : auth.isAuthenticated ? (
              <button className="reality-auth-button" onClick={auth.signOut}>
                Sign Out
              </button>
            ) : (
              <button className="reality-auth-button" onClick={auth.signIn}>
                Continue with Puter
              </button>
            )}
          </div>

          <p className="reality-form-hint reality-text-center">
            Resumind uses{" "}
            <a href="https://puter.com" target="_blank" rel="noreferrer">
              Puter
            </a>{" "}
            for free accounts, storage and AI — no card, no separate
            password to create here. A window will open to sign in or
            create a free Puter account.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Auth;
