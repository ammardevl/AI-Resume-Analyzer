import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { useEffect, useState } from "react";
import { usePuterStore } from "../../lib/puter";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback for your Dream JOB!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [storedResumes, setStoredResumes] = useState<Resume[]>([]);
  const navigate = useNavigate();

  const loadResumes = async () => {
    const items = (await kv.list("resume:*", true)) as KVItem[] | undefined;
    if (!items) {
      setStoredResumes([]);
      return;
    }

    const parsed = items
      .map((item) => {
        try {
          return JSON.parse(item.value) as Resume;
        } catch {
          return null;
        }
      })
      .filter((item): item is Resume => item !== null);

    setStoredResumes(parsed);
  };

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/Auth?next=/");
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      loadResumes();
    }
  }, [auth.isAuthenticated]);

  const displayResumes = storedResumes.length > 0 ? storedResumes : resumes;

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Track your Applications & Resume Ratings</h1>
          <h2>
            Review your submissions and get instant feedback with AI Powered
            Application!
          </h2>
        </div>

        {displayResumes.length > 0 ? (
          <section className="resumes-section">
            {displayResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </section>
        ) : (
          <div className="text-center text-gray-600 mt-8">
            <p>No analyzed resumes found yet.</p>
            <p>Upload one to get started with AI-powered feedback.</p>
          </div>
        )}
      </section>
    </main>
  );
}
