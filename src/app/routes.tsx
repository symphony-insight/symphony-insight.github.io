import { OverviewPage } from "../pages/OverviewPage";
import { ReportMethodPage } from "../pages/ReportMethodPage";
import { ReportReviewPage } from "../pages/ReportReviewPage";
import { MotionAffectPage } from "../pages/MotionAffectPage";
import { RubricGuidePage } from "../pages/RubricGuidePage";
import { SessionTimelinePage } from "../pages/SessionTimelinePage";

export function resolveRoute(hash: string) {
  if (hash.endsWith("/sessions")) return <SessionTimelinePage />;
  if (hash.endsWith("/motion-affect")) return <MotionAffectPage />;
  if (hash.endsWith("/report-method")) return <ReportMethodPage />;
  if (hash.endsWith("/report")) return <ReportReviewPage />;
  if (hash.endsWith("/rubrics")) return <RubricGuidePage />;
  return <OverviewPage />;
}
