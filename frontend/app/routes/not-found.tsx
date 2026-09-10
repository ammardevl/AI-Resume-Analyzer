import { Link } from "react-router";
import Navbar from "../components/Navbar";

export const meta = () => [
  { title: "404 — Page Not Found | Resumind" },
  { name: "description", content: "The page you're looking for doesn't exist." },
  { name: "robots", content: "noindex" },
];

const NotFound = () => {
  return (
    <main className="reality-bg-main">
      <Navbar />
      <div className="reality-notfound">
        <p className="reality-notfound__code">404</p>
        <h1 style={{ margin: 0 }}>This page went missing from the pipeline.</h1>
        <p className="reality-form-hint">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="reality-btn reality-btn--primary reality-btn--fit">
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
