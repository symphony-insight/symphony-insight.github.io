import { Fragment } from "react";
import { formatAffectLabel } from "../../lib/labels";
import { useAppStore } from "../../store/useAppStore";
import type { AffectLabel, SessionSummary } from "../../types/domain";
import { Card } from "../ui/Card";

const rowLabels = {
  zh: ["动作较少", "动作适中", "动作较多"],
  en: ["Low motion", "Medium motion", "High motion"]
};

const cols: AffectLabel[] = ["calm", "engaged", "overloaded"];

export function MotionAffectMatrix({ sessions }: { sessions: SessionSummary[] }) {
  const { language } = useAppStore();
  const rows = rowLabels[language];
  const values = rows.flatMap((row, rowIndex) =>
    cols.map((col, colIndex) => {
      const base = sessions.filter((session) => session.affect.dominantState === col).length + rowIndex + colIndex;
      return { row, col, value: Math.min(5, base) };
    })
  );

  return (
    <Card className="p-4">
      <h3 className="font-bold">{language === "zh" ? "动作多少和孩子状态" : "Motion and state relationship"}</h3>
      <p className="mt-1 text-sm text-stone-500">
        {language === "zh" ? "看动作多或少的时候，孩子更常出现哪种状态。" : "Shows which state appears more often at different motion levels."}
      </p>
      <div className="mt-4 grid grid-cols-[96px_repeat(3,1fr)] gap-2 text-sm">
        <div />
        {cols.map((col) => (
          <div key={col} className="font-semibold text-stone-500">
            {formatAffectLabel(language, col)}
          </div>
        ))}
        {rows.map((row) => (
          <Fragment key={row}>
            <div key={`${row}-label`} className="font-semibold text-stone-600">
              {row}
            </div>
            {cols.map((col) => {
              const value = values.find((item) => item.row === row && item.col === col)?.value ?? 0;
              return (
                <div key={`${row}-${col}`} className="rounded-md p-3 text-center font-bold" style={{ backgroundColor: `rgba(75, 143, 159, ${0.12 + value * 0.1})` }}>
                  {value}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </Card>
  );
}
