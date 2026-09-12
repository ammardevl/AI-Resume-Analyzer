import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "../../lib/puter";

export const meta = () => [
  { title: "Previously Analyzed Resumes — Resumind" },
  { name: "description", content: "All the resumes you've analyzed with Resumind, in one place." },
];

const Previous = () => {
  const { auth, kv, fs, isLoading: puterLoading } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const objectUrlsRef = useRef<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!puterLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/previous");
    }
  }, [puterLoading, auth.isAuthenticated, navigate]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const loadResumes = async () => {
      setIsLoading(true);
      const items = (await kv.list("resume:*", true)) as KVItem[] | undefined;

      const parsed = (items || [])
        .map((item) => {
          try {
            return JSON.parse(item.value) as Resume;
          } catch {
            return null;
          }
        })
        .filter((item): item is Resume => item !== null);

      setResumes(parsed);
      setIsLoading(false);
    };

    loadResumes();
  }, [auth.isAuthenticated, kv]);

  useEffect(() => {
    objectUrlsRef.current.forEach(URL.revokeObjectURL);
    objectUrlsRef.current = [];
    setImageUrls({});

    if (!resumes.length) return;

    let active = true;
    const loadImages = async () => {
      const urls: Record<string, string> = {};

      for (const resume of resumes) {
        if (!resume.imagePath || resume.imagePath.startsWith("/images/") || resume.imagePath.startsWith("http")) {
          continue;
        }
        try {
          const blob = await fs.read(resume.imagePath);
          if (blob) {
            const url = URL.createObjectURL(blob);
            objectUrlsRef.current.push(url);
            urls[resume.id] = url;
          }
        } catch {
          // ignore individual image load failures
        }
      }

      if (active) setImageUrls(urls);
    };

    loadImages();

    return () => {
      active = false;
      objectUrlsRef.current.forEach(URL.revokeObjectURL);
      objectUrlsRef.current = [];
    };
  }, [resumes, fs]);

  if (!auth.isAuthenticated) return null;

  return (
    <main className="reality-bg-main">
      <Navbar />
      <section className="reality-main-section">
        <div className="reality-page-heading">
          <h1 className="reality-h1">Previously Analyzed</h1>
          <h2 className="reality-h2">Every resume you've scored, all in one place.</h2>
        </div>

        {isLoading && <p className="reality-form-hint">Loading your resumes...</p>}

        {!isLoading && resumes.length === 0 && (
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
              <ResumeCard
                key={resume.id}
                resume={{ ...resume, imagePath: imageUrls[resume.id] ?? resume.imagePath }}
              />
            ))}
          </section>
        )}
      </section>
    </main>
  );
};

export default Previous;
