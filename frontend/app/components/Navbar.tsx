import { Link, useNavigate } from "react-router";
import { usePuterStore } from "../../lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <nav className="reality-navbar">
      <Link to="/">
        <p className="reality-navbar__brand">RESUMIND</p>
      </Link>
      <div className="reality-navbar__links">
        {auth.isAuthenticated && (
          <Link to="/previous" className="reality-navbar__link">
            Previously Analyzed
          </Link>
        )}
        {auth.isAuthenticated ? (
          <>
            <span className="reality-navbar__user">Hi, {auth.user?.username}</span>
            <Link to="/upload" className="reality-btn reality-btn--primary reality-btn--fit">
              Upload Resume
            </Link>
            <button className="reality-btn reality-btn--ghost" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/auth" className="reality-btn reality-btn--primary reality-btn--fit">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
