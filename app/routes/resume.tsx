import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import ATS from "../components/feedback/ATS";
import Summary from "../components/feedback/Summary";
import Details from "../components/feedback/Details";
import { usePuterStore } from "../../lib/puter";

const ResumeDetail = () => {
  const { id } = useParams();
  const { auth, kv, fs } = usePuterStore();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResume = async () => {
    if (!id) {
      setError("Invalid resume ID.");
      setIsLoading(false);
      return;
    }

    const resumeValue = await kv.get(`resume:${id}`);
    if (!resumeValue) {
      setError("Resume data not found.");
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(resumeValue) as Resume;
      setResume(parsed);

      if (parsed.imagePath) {
        const blob = await fs.read(parsed.imagePath);
        if (blob) {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        }
      }
    } catch (err) {
      setError("Failed to load resume details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated === false) {
      navigate(`/Auth?next=/resume/${id}`);
    }
  }, [auth.isAuthenticated, id, navigate]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      loadResume();
    }
  }, [auth.isAuthenticated, id]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const jobDescription = useMemo(
    () => resume?.jobDescription?.trim() || "No job description provided.",
    [resume],
  );

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />
      <section className="main-section py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold">Resume Analysis</h1>
                <p className="text-gray-500 mt-2">
                  Review your saved feedback and resume preview.
                </p>
              </div>
              <Link
                to="/"
                className="rounded-full bg-slate-900 px-5 py-3 text-white hover:bg-slate-800"
              >
                Back to Dashboard
              </Link>
            </div>

            {isLoading && <p>Loading resume...</p>}
            {error && <p className="text-red-600">{error}</p>}
          </div>

          {resume && !isLoading && !error && (
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-md">
                  <div className="flex flex-col gap-3 mb-4">
                    <p className="text-sm text-gray-500">Company</p>
                    <h2 className="text-2xl font-semibold">
                      {resume.companyName || "Unnamed Company"}
                    </h2>
                    <p className="text-base text-gray-600">
                      {resume.jobTitle || "No job title provided"}
                    </p>
                  </div>
                  <div className="rounded-3xl overflow-hidden border border-gray-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Resume Preview"
                        className="w-full h-[420px] object-cover"
                      />
                    ) : (
                      <div className="bg-slate-100 p-10 text-center text-gray-500">
                        Resume preview unavailable.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="bg-white rounded-3xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-3">
                      Job Description
                    </h3>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {jobDescription}
                    </p>
                  </div>
                  <div className="bg-white rounded-3xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-3">ATS Score</h3>
                    <ATS
                      score={resume.feedback.ATS.score}
                      suggestions={resume.feedback.ATS.tips}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
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
