import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, HardDrive, MessageSquare, Zap, Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const StatItem = ({ icon: Icon, title, value, total, unit }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <span className="text-sm font-semibold">{value.toLocaleString()} / {total.toLocaleString()} {unit}</span>
    </div>
    <Progress value={(value / total) * 100} />
  </div>
);

export default function SchoolUsageStats({ school }) {
  const usage = school.usage_stats || {};
  
  // Assuming some dummy quota for demonstration
  const quotas = {
    storage: 50 * 1024, // 50GB in MB
    sms: 10000,
    ai_jobs: 500,
    users: 2000
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-green-600" />
          Usage & Quotas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <StatItem icon={HardDrive} title="Storage" value={usage.storage_mb || 0} total={quotas.storage} unit="MB" />
        <StatItem icon={MessageSquare} title="SMS Credits" value={usage.sms_sent_today || 0} total={quotas.sms} unit="sent" />
        <StatItem icon={Users} title="Active Users" value={usage.active_users || 0} total={quotas.users} unit="users" />
        <StatItem icon={Zap} title="AI Jobs" value={usage.ai_jobs_today || 0} total={quotas.ai_jobs} unit="jobs" />
      </CardContent>
    </Card>
  );
}