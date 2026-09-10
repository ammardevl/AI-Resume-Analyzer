import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  const tone = score > 69 ? "green" : score > 39 ? "yellow" : "red";
  return (
    <div className={cn("reality-badge", `reality-badge--${tone}`)}>
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt=""
        width={16}
        height={16}
      />
      <p className={cn("reality-badge__text", `reality-badge__text--${tone}`)}>
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => (
  <div className="reality-category-header">
    <p className="reality-category-header__title">{title}</p>
    <ScoreBadge score={categoryScore} />
  </div>
);

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => (
  <div className="reality-flex-col reality-gap-4" style={{ alignItems: "center", width: "100%" }}>
    <div className="reality-category-tips-grid">
      {tips.map((tip, index) => (
        <div className="reality-category-tip-row" key={index}>
          <img
            src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
            alt=""
            width={18}
            height={18}
          />
          <p className="reality-form-hint" style={{ fontSize: "1rem" }}>{tip.tip}</p>
        </div>
      ))}
    </div>
    <div className="reality-tip-explanations">
      {tips.map((tip, index) => (
        <div
          key={index + tip.tip}
          className={cn(
            "reality-tip-explanation",
            tip.type === "good"
              ? "reality-tip-explanation--good"
              : "reality-tip-explanation--improve",
          )}
        >
          <div className="reality-tip-explanation__head">
            <img
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
              alt=""
              width={18}
              height={18}
            />
            <p className="reality-tip-explanation__title">{tip.tip}</p>
          </div>
          <p>{tip.explanation}</p>
        </div>
      ))}
    </div>
  </div>
);

const Details = ({ feedback }: { feedback: Feedback }) => {
  const sections: { id: string; title: string; score: number; tips: any[] }[] = [
    { id: "tone-style", title: "Tone & Style", score: feedback.toneAndStyle.score, tips: feedback.toneAndStyle.tips },
    { id: "content", title: "Content", score: feedback.content.score, tips: feedback.content.tips },
    { id: "structure", title: "Structure", score: feedback.structure.score, tips: feedback.structure.tips },
    { id: "skills", title: "Skills", score: feedback.skills.score, tips: feedback.skills.tips },
  ];

  return (
    <div className="reality-w-full">
      <Accordion>
        {sections.map((section) => (
          <AccordionItem id={section.id} key={section.id}>
            <AccordionHeader itemId={section.id}>
              <CategoryHeader title={section.title} categoryScore={section.score} />
            </AccordionHeader>
            <AccordionContent itemId={section.id}>
              <CategoryContent tips={section.tips} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;
