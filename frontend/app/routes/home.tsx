import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { Link } from "react-router";
import { useAuthStore } from "../../lib/authStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind — Free AI Resume & ATS Score Checker" },
    {
      name: "description",
      content:
        "Get instant, AI-powered feedback on your resume's ATS score, tone, content, structure and skills — free with Resumind.",
    },
  ];
}

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <main className="reality-bg-main">
      <Navbar />
      <section className="reality-main-section">
        <div className="reality-page-heading">
          <h1 className="reality-h1">Track your Applications &amp; Resume Ratings</h1>
          <h2 className="reality-h2">
            Review your submissions and get instant feedback with an
            AI-powered ATS score.
          </h2>
          <Link
            to={isAuthenticated ? "/upload" : "/register"}
            className="reality-btn reality-btn--primary reality-btn--fit"
          >
            {isAuthenticated ? "Analyze a Resume" : "Get Started — It's Free"}
          </Link>
        </div>

        <section className="reality-resumes-section" aria-label="Example resume scores">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </section>

        {isAuthenticated && (
          <p className="reality-form-hint">
            Looking for a resume you already analyzed?{" "}
            <Link to="/previous">See your previous results</Link>.
          </p>
        )}
      </section>
    </main>
  );
}
