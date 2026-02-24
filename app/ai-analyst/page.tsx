import { DashboardPage } from '@/components/DashboardPage';
import { AIAnalyst } from '@/components/AIAnalyst';

export default async function AIAnalystPage() {
    return (
        <DashboardPage title="AI Analyst" description="Interact with the data, review anomalies, and read auto-generated insights.">
            <div className="mt-6">
                <AIAnalyst />
            </div>
        </DashboardPage>
    );
}
