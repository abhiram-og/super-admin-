import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, GraduationCap } from 'lucide-react';

const DataCard = ({ icon: Icon, title, count, color }) => (
  <div className={`p-4 rounded-lg flex items-center gap-4 bg-${color}-50 border border-${color}-100`}>
    <Icon className={`w-6 h-6 text-${color}-600`} />
    <div>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="text-xl font-bold text-slate-900">{count.toLocaleString()}</p>
    </div>
  </div>
);

export default function SchoolDataSummary({ school }) {
  // Mock data as we don't have user entities yet
  const studentCount = (school.usage_stats?.active_users || 0) * 0.8;
  const parentCount = (school.usage_stats?.active_users || 0) * 0.7;
  const staffCount = (school.usage_stats?.active_users || 0) * 0.2;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Data Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DataCard icon={GraduationCap} title="Students" count={Math.round(studentCount)} color="blue" />
        <DataCard icon={User} title="Parents" count={Math.round(parentCount)} color="purple" />
        <DataCard icon={Users} title="Staff" count={Math.round(staffCount)} color="green" />
      </CardContent>
    </Card>
  );
}