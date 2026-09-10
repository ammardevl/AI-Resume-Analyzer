import { cn } from "~/lib/utils";
import ScoreGauge from "../ScoreGauge";

const ScoreBadge = ({ score }: { score: number }) => {
  const tone = score > 69 ? "green" : score > 49 ? "yellow" : "red";
  const badgeText = score > 69 ? "Strong" : score > 49 ? "Good Start" : "Needs Work";
  return (
    <div className={cn("reality-score-badge", `reality-score-badge--${tone}`)}>
      <p className={cn("reality-score-badge__text", `reality-text-${tone}`)}>{badgeText}</p>
    </div>
  );
};

const Category = ({ title, score }: { title: string; score: number }) => {
  const tone = score > 69 ? "green" : score > 49 ? "yellow" : "red";
  return (
    <div className="reality-summary-row">
      <div className="reality-summary-row__category">
        <div className="reality-flex-col" style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <p style={{ fontSize: "1.4rem", margin: 0 }}>{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p style={{ fontSize: "1.4rem", margin: 0 }}>
          <span className={`reality-text-${tone}`}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="reality-summary-card">
      <div className="reality-summary-card__top">
        <ScoreGauge score={feedback.overallScore} />
        <div className="reality-flex-col reality-gap-2">
          <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>Your Resume Score</h2>
          <p className="reality-form-hint">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>
      <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;
