import { cn } from "~/lib/utils";

const ATS = ({
  score,
  suggestions,
}: {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}) => {
  const tone = score > 69 ? "good" : score > 49 ? "warn" : "bad";
  const icon =
    tone === "good"
      ? "/icons/ats-good.svg"
      : tone === "warn"
        ? "/icons/ats-warning.svg"
        : "/icons/ats-bad.svg";

  return (
    <div className={cn("reality-ats-card", `reality-ats-card--${tone}`)}>
      <div className="reality-ats-card__header">
        <img src={icon} alt="" width={40} height={40} />
        <p className="reality-ats-card__title">ATS Score - {score}/100</p>
      </div>
      <div className="reality-flex-col reality-gap-2">
        <p className="reality-form-hint" style={{ fontSize: "1.1rem", color: "#1d1d1f" }}>
          How well does your resume pass through Applicant Tracking Systems?
        </p>
        <p className="reality-form-hint">
          Your resume was scanned like an employer would. Here's how it
          performed:
        </p>
        {suggestions.map((suggestion, index) => (
          <div className="reality-ats-tip" key={index}>
            <img
              src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt=""
              width={16}
              height={16}
            />
            <p className="reality-form-hint">{suggestion.tip}</p>
          </div>
        ))}
        <p className="reality-form-hint">
          Want a better score? Improve your resume by applying the
          suggestions listed below.
        </p>
      </div>
    </div>
  );
};

export default ATS;
