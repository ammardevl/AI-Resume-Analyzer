import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useAuthStore } from "../../lib/authStore";
import { resumeApi } from "../../lib/api";

export const meta = () => [
  { title: "Previously Analyzed Resumes — Resumind" },
  { name: "description", content: "All the resumes you've analyzed with Resumind, in one place." },
];

const Previous = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login?next=/previous");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    resumeApi
      .list()
      .then(({ resumes }) => setResumes(resumes))
      .catch(() => setError("Couldn't load your resumes right now."))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <main className="reality-bg-main">
      <Navbar />
      <section className="reality-main-section">
        <div className="reality-page-heading">
          <h1 className="reality-h1">Previously Analyzed</h1>
          <h2 className="reality-h2">Every resume you've scored, all in one place.</h2>
        </div>

        {isLoading && <p className="reality-form-hint">Loading your resumes...</p>}
        {error && <p className="reality-form-error">{error}</p>}

        {!isLoading && !error && resumes.length === 0 && (
          <div className="reality-empty-state">
            <p>You haven't analyzed a resume yet.</p>
            <Link to="/upload" className="reality-btn reality-btn--primary reality-btn--fit">
              Analyze your first resume
            </Link>
          </div>
        )}

        {resumes.length > 0 && (
          <section className="reality-resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </section>
        )}
      </section>
    </main>
  );
};

export default Previous;
