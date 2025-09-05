import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Server, MessageSquare, Zap } from 'lucide-react';

const HealthItem = ({ title, status, color }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
            <span className="text-sm font-medium text-slate-700">{title}</span>
        </div>
        <span className={`text-sm font-semibold text-${color.split('-')[1]}-600`}>
            {status}
        </span>
    </div>
);

export default function SystemHealthMonitor({ metrics }) {
    return (
        <Card className="bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader className="border-b border-slate-100/50 pb-6">
                <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                        <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">System Monitor</h3>
                        <p className="text-sm text-slate-500">Live service status</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
                <HealthItem title="API Services" status="Operational" color="bg-green-500" />
                <HealthItem title="Database" status="Operational" color="bg-green-500" />
                <HealthItem title="SMS Gateway" status="Operational" color="bg-green-500" />
                <HealthItem title="AI Services" status="Minor Latency" color="bg-yellow-500" />
                <HealthItem title="Storage Provider" status="Operational" color="bg-green-500" />
                <HealthItem title="Push Notifications" status="Operational" color="bg-green-500" />
            </CardContent>
        </Card>
    );
}