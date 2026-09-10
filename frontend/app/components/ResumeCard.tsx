import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { resolveFileUrl } from "~/lib/api";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  return (
    <Link to={`/resume/${id}`} className="reality-resume-card">
      <div className="reality-resume-card__header">
        <div className="reality-flex-col reality-gap-2">
          <h2 className="reality-resume-card__company">
            {companyName || "Untitled application"}
          </h2>
          <h3 className="reality-resume-card__job">{jobTitle || "—"}</h3>
        </div>
        <div>
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      <div className="reality-gradient-border">
        <img
          src={resolveFileUrl(imagePath)}
          alt={`Resume preview for ${companyName || "your application"}`}
          className="reality-resume-card__preview"
          loading="lazy"
        />
      </div>
    </Link>
  );
};

export default ResumeCard;
