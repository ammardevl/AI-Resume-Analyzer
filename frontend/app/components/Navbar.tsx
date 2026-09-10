import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../lib/authStore";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="reality-navbar">
      <Link to="/">
        <p className="reality-navbar__brand">RESUMIND</p>
      </Link>
      <div className="reality-navbar__links">
        {isAuthenticated && (
          <Link to="/previous" className="reality-navbar__link">
            Previously Analyzed
          </Link>
        )}
        {isAuthenticated ? (
          <>
            <span className="reality-navbar__user">Hi, {user?.name}</span>
            <Link to="/upload" className="reality-btn reality-btn--primary reality-btn--fit">
              Upload Resume
            </Link>
            <button
              className="reality-btn reality-btn--ghost"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="reality-navbar__link">
              Log In
            </Link>
            <Link
              to="/register"
              className="reality-btn reality-btn--primary reality-btn--fit"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
