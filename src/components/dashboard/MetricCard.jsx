import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

const colorVariants = {
  blue: { icon: "text-blue-600", bg: "bg-blue-100" },
  green: { icon: "text-green-600", bg: "bg-green-100" },
  purple: { icon: "text-purple-600", bg: "bg-purple-100" },
  red: { icon: "text-red-600", bg: "bg-red-100" },
};

export default function MetricCard({ title, value, icon: Icon, trend, trendLabel, color = "blue" }) {
  const colorClasses = colorVariants[color];
  const isPositiveTrend = trend > 0;

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm rounded-3xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`p-3 rounded-2xl ${colorClasses.bg}`}>
            <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
          </div>
        </div>
        
        {trend !== undefined && (
          <div className="flex items-center mt-4 gap-1">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              isPositiveTrend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isPositiveTrend ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{Math.abs(trend)}%</span>
            </div>
            <span className="text-xs text-slate-500">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}