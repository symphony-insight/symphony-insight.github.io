import { OverviewPage } from "../pages/OverviewPage";
import { ReportReviewPage } from "../pages/ReportReviewPage";
import { MotionAffectPage } from "../pages/MotionAffectPage";
import { SessionTimelinePage } from "../pages/SessionTimelinePage";

export function resolveRoute(hash: string) {
  switch (hash) {
    case "#/child/xiaoyu/sessions":
      return <SessionTimelinePage />;
    case "#/child/xiaoyu/motion-affect":
      return <MotionAffectPage />;
    case "#/child/xiaoyu/report":
      return <ReportReviewPage />;
    default:
      return <OverviewPage />;
  }
}
