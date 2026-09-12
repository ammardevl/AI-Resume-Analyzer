import { useEffect, useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "../../lib/pdf2img";
import { generateUUID } from "../../lib/utils";
import { prepareInstructions } from "../../constants";
import { usePuterStore } from "../../lib/puter";

export const meta = () => [
  { title: "Analyze Your Resume — Resumind" },
  { name: "description", content: "Upload your resume for an instant AI-powered ATS score and improvement tips." },
];

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/upload");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

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
    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) {
      setIsProcessing(false);
      return setFormError("Failed to upload the file. Please try again.");
    }

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) {
      setIsProcessing(false);
      return setFormError(imageFile.error || "Failed to convert PDF to image.");
    }

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) {
      setIsProcessing(false);
      return setFormError("Failed to upload the preview image.");
    }

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data: Resume = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: {
        overallScore: 0,
        ATS: { score: 0, tips: [] },
        toneAndStyle: { score: 0, tips: [] },
        content: { score: 0, tips: [] },
        structure: { score: 0, tips: [] },
        skills: { score: 0, tips: [] },
      },
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription }),
    );

    if (!feedback) {
      setIsProcessing(false);
      return setFormError("Failed to analyze the resume. Please try again.");
    }

    const rawContent =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    let parsedFeedback: Feedback | null = null;
    try {
      parsedFeedback = JSON.parse(rawContent);
    } catch {
      try {
        const match = rawContent.match(/\{[\s\S]*\}/);
        parsedFeedback = match ? JSON.parse(match[0]) : null;
      } catch {
        parsedFeedback = null;
      }
    }

    if (!parsedFeedback) {
      setIsProcessing(false);
      return setFormError("Unable to parse feedback from the AI response. Please try again.");
    }

    data.feedback = parsedFeedback;
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete. Redirecting...");
    navigate(`/resume/${uuid}`);
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

  if (!auth.isAuthenticated) return null;

  return (
    <main className="reality-bg-main">
      <Navbar />
      <section className="reality-main-section">
        <div className="reality-page-heading" style={{ paddingTop: 32, paddingBottom: 32 }}>
          <h1 className="reality-h1">Smart Feedback for your Dream Job</h1>
          {isProcessing ? (
            <>
              <h2 className="reality-h2">{statusText}</h2>
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
