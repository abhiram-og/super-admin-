
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Activity,
  Clock,
  Shield,
  Zap,
  Globe,
  ChartBar,
  Target,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { withRetry } from "@/components/utils/withRetry";

import LicenseExpiryAlert from "../components/dashboard/LicenseExpiryAlert";
import RecentActivity from "../components/dashboard/RecentActivity";
import PlatformMetricsGrid from "../components/dashboard/PlatformMetricsGrid";
import AIQuizManager from "../components/dashboard/AIQuizManager";
import SystemHealthMonitor from "../components/dashboard/SystemHealthMonitor";
import RevenueChart from "../components/dashboard/RevenueChart";
import UserEngagementMap from "../components/dashboard/UserEngagementMap";
import TenantHealthChart from "../components/dashboard/TenantHealthChart";

// Import Django API client
import api, { mockApi } from "@/api/djangoClient";
import { mockData } from "@/api/mockData";

export default function Dashboard() {
  const [tenants, setTenants] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTenants: 0,
    activeTenants: 0,
    trialTenants: 0,
    totalUsers: 0,
    healthIssues: 0,
    revenueGrowth: 12.5,
    totalRevenue: 2450000,
    aiJobsToday: 1247,
    smsToday: 8932,
    storageUsed: 2.4, // in TB
    uptime: 99.97
  });

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 180000); // refresh every 3 minutes to reduce API pressure
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);

    try {
      // Load from in-app entities to avoid external fetch failures
      const [tenantsData, auditData] = await Promise.all([
        withRetry(() => Tenant.list()),
        withRetry(() => AuditLog.list("-created_date"))
      ]);

      setTenants(tenantsData);
      setAuditLogs(auditData);

      // Compute dashboard metrics based on entity data
      const activeTenants = tenantsData.filter(t => t.license_state === "active").length;
      const trialTenants = tenantsData.filter(t => t.license_state === "trial").length;
      const healthIssues = tenantsData.filter(t => t.health_status === "warning" || t.health_status === "critical").length;
      const totalUsers = tenantsData.reduce((sum, t) => sum + (t.usage_stats?.active_users || 0), 0);
      const totalAIJobs = tenantsData.reduce((sum, t) => sum + (t.usage_stats?.ai_jobs_today || 0), 0);
      const totalSMS = tenantsData.reduce((sum, t) => sum + (t.usage_stats?.sms_sent_today || 0), 0);
      const totalStorage = tenantsData.reduce((sum, t) => sum + (t.usage_stats?.storage_mb || 0), 0) / (1024 * 1024);

      setMetrics(prev => ({
        ...prev,
        totalTenants: tenantsData.length,
        activeTenants,
        trialTenants,
        totalUsers,
        healthIssues,
        totalRevenue: activeTenants * 59990, // mock revenue
        aiJobsToday: totalAIJobs,
        smsToday: totalSMS,
        storageUsed: totalStorage
      }));
    } catch (error) {
      console.error("Dashboard data load failed:", error);
      // Fail gracefully: show empty state rather than crash the app
      setTenants([]);
      setAuditLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 max-w-[1600px] mx-auto space-y-8">
        {/* ✅ Header Section */}
        <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                Platform Command Center
              </h1>
              <p className="text-slate-600 text-lg">
                Real-time insights across {metrics.totalTenants} school tenants
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">System Status: Operational</span>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={createPageUrl("CreateSchool")}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg rounded-2xl px-6">
                  <Building2 className="w-4 h-4 mr-2" />
                  Provision School
                </Button>
              </Link>
              <Button variant="outline" className="rounded-2xl px-6 bg-white/70 backdrop-blur-sm border-white/30">
                <ChartBar className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* ✅ Metrics + Alerts */}
        <PlatformMetricsGrid metrics={metrics} isLoading={isLoading} />
        <LicenseExpiryAlert tenants={tenants} />
        <AIQuizManager tenants={tenants} />

        {/* ✅ Graphs & Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            <RevenueChart metrics={metrics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TenantHealthChart tenants={tenants} isLoading={isLoading} />
              <UserEngagementMap tenants={tenants} />
            </div>
          </div>

          {/* ✅ Performance + Quick Actions */}
          <div className="xl:col-span-4 space-y-8">
            <SystemHealthMonitor metrics={metrics} />

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardHeader className="border-b border-slate-100/50 pb-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Quick Actions</h3>
                    <p className="text-sm text-slate-500">Platform management</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* buttons omitted for brevity */}
              </CardContent>
            </Card>

            {/* Performance Section */}
            <Card className="bg-gradient-to-br from-white/90 to-amber-50/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardHeader className="border-b border-slate-100/50 pb-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Performance</h3>
                    <p className="text-sm text-slate-500">Platform metrics</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Uptime</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-bold text-green-600">{metrics.uptime}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Response Time</span>
                    <span className="font-bold text-slate-900">127ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Error Rate</span>
                    <span className="font-bold text-green-600">0.03%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">API Calls/min</span>
                    <span className="font-bold text-slate-900">2,847</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100/50">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Award className="w-3 h-3" />
                    <span>99.9% SLA compliance this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ✅ Recent Activity */}
        <RecentActivity auditLogs={auditLogs} isLoading={isLoading} />
      </div>
    </div>
  );
}
