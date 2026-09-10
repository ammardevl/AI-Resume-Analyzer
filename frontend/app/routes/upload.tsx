import { useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "../../lib/pdf2img";
import { resumeApi, ApiError } from "../../lib/api";
import { useAuthStore } from "../../lib/authStore";

export const meta = () => [
  { title: "Analyze Your Resume — Resumind" },
  { name: "description", content: "Upload your resume for an instant AI-powered ATS score and improvement tips." },
];

const Upload = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login?next=/upload");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setFormError(null);
    setIsProcessing(true);
    setStatusText("Rendering a preview of your resume...");

    const imageResult = await convertPdfToImage(file);
    if (!imageResult.file) {
      setIsProcessing(false);
      setFormError(imageResult.error || "Failed to render a preview of the PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("image", imageResult.file);
    formData.append("companyName", companyName);
    formData.append("jobTitle", jobTitle);
    formData.append("jobDescription", jobDescription);

    setStatusText("Uploading and analyzing your resume...");
    try {
      const { resume } = await resumeApi.upload(formData, setProgress);
      setStatusText("Analysis complete. Redirecting...");
      navigate(`/resume/${resume.id}`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong while analyzing your resume.";
      setFormError(message);
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const companyName = String(formData.get("company-name") || "");
    const jobTitle = String(formData.get("job-title") || "");
    const jobDescription = String(formData.get("job-description") || "");

    if (!file) {
      setFormError("Please choose a PDF resume to upload.");
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  if (!isAuthenticated) return null;

  return (
    <main className="reality-bg-main">
      <Navbar />
      <section className="reality-main-section">
        <div className="reality-page-heading" style={{ paddingTop: 32, paddingBottom: 32 }}>
          <h1 className="reality-h1">Smart Feedback for your Dream Job</h1>
          {isProcessing ? (
            <>
              <h2 className="reality-h2">{statusText}</h2>
              {progress > 0 && progress < 100 && (
                <p className="reality-form-hint">Uploading: {progress}%</p>
              )}
              <div className="reality-status-scan">
                <img src="/images/resume-scan.gif" alt="Scanning resume" />
              </div>
            </>
          ) : (
            <h2 className="reality-h2">
              Drop your resume for an ATS score and improvement tips!
            </h2>
          )}

          {!isProcessing && (
            <form onSubmit={handleSubmit} className="reality-form" style={{ marginTop: 32 }}>
              <div className="reality-form-div">
                <label className="reality-label" htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  className="reality-input"
                  placeholder="Company Name"
                />
              </div>
              <div className="reality-form-div">
                <label className="reality-label" htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  className="reality-input"
                  placeholder="Job Title"
                />
              </div>
              <div className="reality-form-div">
                <label className="reality-label" htmlFor="job-description">Job Description</label>
                <textarea
                  name="job-description"
                  id="job-description"
                  className="reality-textarea"
                  placeholder="Job Description"
                  rows={5}
                />
              </div>
              <div className="reality-form-div">
                <label className="reality-label" htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={setFile} />
              </div>

              {formError && <p className="reality-form-error">{formError}</p>}

              <button className="reality-btn reality-btn--primary" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
