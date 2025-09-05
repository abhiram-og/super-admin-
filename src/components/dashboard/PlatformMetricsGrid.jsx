import React from 'react';
import MetricCard from './MetricCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Zap, MessageSquare, HardDrive } from 'lucide-react';

export default function PlatformMetricsGrid({ metrics, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Revenue (Monthly)"
        value={`₹${(metrics.totalRevenue / 100000).toFixed(2)}L`}
        icon={DollarSign}
        trend={metrics.revenueGrowth}
        trendLabel="vs last month"
        color="green"
      />
      <MetricCard
        title="AI Jobs Today"
        value={metrics.aiJobsToday.toLocaleString()}
        icon={Zap}
        trend={-5}
        trendLabel="% vs yesterday"
        color="purple"
      />
      <MetricCard
        title="SMS Sent Today"
        value={metrics.smsToday.toLocaleString()}
        icon={MessageSquare}
        trend={+8}
        trendLabel="% vs yesterday"
        color="blue"
      />
      <MetricCard
        title="Total Storage Used"
        value={`${metrics.storageUsed.toFixed(2)} TB`}
        icon={HardDrive}
        trend={+2}
        trendLabel="% vs last week"
        color="red"
      />
    </div>
  );
}