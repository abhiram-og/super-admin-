import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function TenantHealthChart({ tenants, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
        <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Healthy", count: tenants.filter(t => t.health_status === "healthy").length, fill: "#22c55e" },
    { name: "Warning", count: tenants.filter(t => t.health_status === "warning").length, fill: "#facc15" },
    { name: "Critical", count: tenants.filter(t => t.health_status === "critical").length, fill: "#ef4444" },
  ];

  return (
    <Card className="bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl h-full">
      <CardHeader className="border-b border-slate-100/50 pb-6">
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Tenant Health</h3>
            <p className="text-sm text-slate-500">Distribution of health status</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis type="number" stroke="#64748b" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid #e0e7ff" }} />
            <Bar dataKey="count" fill="fill" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}