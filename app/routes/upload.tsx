import Navbar from "~/components/Navbar";
import { useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "../../lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "../../lib/pdf2img";
import { generateUUID } from "../../lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

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
    setIsProcessing(true);
    setStatusText("Upload the File...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile)
      return setStatusText(
        "Error: Failed to upload the file. Please try again.",
      );

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusText("Error: Failed to convert PDF to image.");

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Error: Failed to upload image");

    setStatusText("Preparing Data...");
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

    if (!feedback) return setStatusText("Error: Failed to analyze resume...");
    const rawContent =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    let parsedFeedback: Feedback | null = null;
    try {
      parsedFeedback = JSON.parse(rawContent);
    } catch (err) {
      try {
        const match = rawContent.match(/\{[\s\S]*\}/);
        parsedFeedback = match ? JSON.parse(match[0]) : null;
      } catch {
        parsedFeedback = null;
      }
    }

    if (!parsedFeedback) {
      return setStatusText(
        "Error: Unable to parse feedback from the AI response. Please try again.",
      );
    }

    data.feedback = parsedFeedback;
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete. Redirecting...");
    navigate(`/resume/${uuid}`);

    console.log(data);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) {
      return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart Feedback for your Dream Job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="Image"
                className="w-full"
              />
            </>
          ) : (
            <h2>Drop your Resume for an ATS Score and Improvement tips!</h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Company Name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Job Title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  name="job-description"
                  id="job-description"
                  placeholder="Job Description"
                  rows={5}
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit">
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
