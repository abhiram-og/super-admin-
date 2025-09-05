import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

// Mock data for the chart
const revenueData = [
  { name: 'Jan', revenue: 1800000 },
  { name: 'Feb', revenue: 2100000 },
  { name: 'Mar', revenue: 2000000 },
  { name: 'Apr', revenue: 2300000 },
  { name: 'May', revenue: 2200000 },
  { name: 'Jun', revenue: 2450000 },
  { name: 'Jul', revenue: 2600000 },
];

export default function RevenueChart({ metrics }) {
  return (
    <Card className="bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
      <CardHeader className="border-b border-slate-100/50 pb-6">
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Revenue & Growth</h3>
            <p className="text-sm text-slate-500">Monthly recurring revenue (MRR)</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-baseline gap-4 mb-4">
            <p className="text-4xl font-bold text-slate-900">₹{(metrics.totalRevenue / 100000).toFixed(2)}L</p>
            <div className="flex items-center text-green-600 font-semibold">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{metrics.revenueGrowth}% vs last month</span>
            </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₹${value/100000}L`} />
                <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: "1rem", border: "1px solid #e0e7ff" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fill="url(#colorRevenue)" strokeWidth={2} />
            </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}