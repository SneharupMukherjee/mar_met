import { CaseStudyReport } from '@/components/case-study/CaseStudyReport';
import { buildCaseStudyReportData } from '@/lib/data/caseStudySelectors';
import { getWeeklyReportsData } from '@/lib/data/client';

export default async function CaseStudyPage() {
  const weeklyReports = await getWeeklyReportsData();
  const reportData = buildCaseStudyReportData(weeklyReports);

  return <CaseStudyReport data={reportData} />;
}
