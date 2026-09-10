import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import ATS from "../components/feedback/ATS";
import Summary from "../components/feedback/Summary";
import Details from "../components/feedback/Details";
import { resumeApi, resolveFileUrl, ApiError } from "../../lib/api";
import { useAuthStore } from "../../lib/authStore";

export const meta = () => [
  { title: "Resume Analysis — Resumind" },
  { name: "description", content: "Your AI-powered ATS score, tone, content, structure and skills breakdown." },
  { name: "robots", content: "noindex" },
];

const ResumeDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?next=/resume/${id}`);
    }
  }, [authLoading, isAuthenticated, id, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    resumeApi
      .get(id)
      .then(({ resume }) => setResume(resume))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load resume details."),
      )
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, id]);

  const jobDescription = useMemo(
    () => resume?.jobDescription?.trim() || "No job description provided.",
    [resume],
  );

  if (!isAuthenticated) return null;

  return (
    <main className="reality-bg-main">
      <Navbar />
      <section className="reality-main-section" style={{ alignItems: "stretch" }}>
        <div style={{ margin: "0 auto", maxWidth: "1152px", width: "100%" }}>
          <div className="reality-flex-col reality-gap-4" style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: 0 }}>Resume Analysis</h1>
                <p className="reality-form-hint" style={{ marginTop: 8 }}>
                  Review your saved feedback and resume preview.
                </p>
              </div>
              <Link to="/previous" className="reality-back-button">
                Back to Your Resumes
              </Link>
            </div>

            {isLoading && <p className="reality-form-hint">Loading resume...</p>}
            {error && <p className="reality-form-error">{error}</p>}
          </div>

          {resume && !isLoading && !error && (
            <div className="reality-detail-grid">
              <div className="reality-flex-col reality-gap-4">
                <div className="reality-detail-panel">
                  <div className="reality-flex-col reality-gap-2" style={{ marginBottom: 16 }}>
                    <p className="reality-form-hint">Company</p>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
                      {resume.companyName || "Unnamed Company"}
                    </h2>
                    <p style={{ color: "#4b5563" }}>{resume.jobTitle || "No job title provided"}</p>
                  </div>
                  <div className="reality-detail-preview">
                    {resume.imagePath ? (
                      <img src={resolveFileUrl(resume.imagePath)} alt="Resume preview" />
                    ) : (
                      <div className="reality-detail-preview__empty">Resume preview unavailable.</div>
                    )}
                  </div>
                </div>

                <div className="reality-detail-panel">
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 0 }}>Job Description</h3>
                  <p style={{ color: "#4b5563", whiteSpace: "pre-wrap" }}>{jobDescription}</p>
                </div>

                <div className="reality-detail-panel">
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 0 }}>ATS Score</h3>
                  <ATS score={resume.feedback.ATS.score} suggestions={resume.feedback.ATS.tips} />
                </div>
              </div>

              <div className="reality-flex-col reality-gap-4">
                <Summary feedback={resume.feedback} />
                <Details feedback={resume.feedback} />
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ResumeDetail;
