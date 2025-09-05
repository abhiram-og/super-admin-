import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Building2, Settings, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const getActionIcon = (action) => {
  if (action.includes('tenant')) return Building2;
  if (action.includes('user') || action.includes('invite')) return User;
  if (action.includes('integration') || action.includes('module')) return Settings;
  return Shield;
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export default function RecentActivity({ auditLogs, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {auditLogs.map((log) => {
            const ActionIcon = getActionIcon(log.action);
            return (
              <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="p-2 bg-slate-100 rounded-full">
                  <ActionIcon className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 break-words">
                    {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 break-words">
                    By {log.actor_email} • {log.target}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {format(new Date(log.created_date), 'MMM d, h:mm a')}
                  </p>
                </div>
                <Badge variant="outline" className={getSeverityColor(log.severity)}>
                  {log.severity}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}