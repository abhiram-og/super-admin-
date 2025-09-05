
import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Tenant, AuditLog } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SchoolOverviewCard from "../components/schooldetails/SchoolOverviewCard";
import SchoolUsageStats from "../components/schooldetails/SchoolUsageStats";
import SchoolModuleMatrix from "../components/schooldetails/SchoolModuleMatrix";
import SchoolDataSummary from "../components/schooldetails/SchoolDataSummary";
import RecentActivity from "../components/dashboard/RecentActivity";
import { ArrowLeft } from "lucide-react";

export default function SchoolDetails() {
  const [school, setSchool] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const loadSchoolData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [schoolData, auditData] = await Promise.all([
        Tenant.get(id),
        AuditLog.filter({ target: `tenant_id=${id}` }, "-created_date", 10),
      ]);
      setSchool(schoolData);
      setAuditLogs(auditData);
    } catch (error) {
      console.error("Error loading school details:", error);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    loadSchoolData();
  }, [loadSchoolData]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!school) {
    return <div className="p-4 text-center">School not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link to={createPageUrl("Schools")}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">{school.display_name}</h1>
          <p className="text-sm sm:text-base text-slate-600">
            Detailed view of the school tenant and its resources.
          </p>
        </div>
      </div>

      {/* Reworked Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Overview - full width */}
        <div className="lg:col-span-12">
          <SchoolOverviewCard school={school} />
        </div>

        {/* Data Summary (4) + Usage Stats (8) */}
        <div className="lg:col-span-4">
          <SchoolDataSummary school={school} />
        </div>
        <div className="lg:col-span-8">
          <SchoolUsageStats school={school} />
        </div>

        {/* Module Matrix - full width */}
        <div className="lg:col-span-12">
          <SchoolModuleMatrix school={school} />
        </div>

        {/* Recent Activity - full width */}
        <div className="lg:col-span-12">
          <RecentActivity auditLogs={auditLogs} isLoading={false} />
        </div>
      </div>
    </div>
  );
}
