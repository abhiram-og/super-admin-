import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, Calendar, Globe, Award, Star } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function SchoolOverviewCard({ school }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-500/15 text-green-700 border-green-300 hover:bg-green-500/20";
      case "trial": return "bg-blue-500/15 text-blue-700 border-blue-300 hover:bg-blue-500/20";
      case "suspended": return "bg-red-500/15 text-red-700 border-red-300 hover:bg-red-500/20";
      default: return "bg-gray-500/15 text-gray-700 border-gray-300 hover:bg-gray-500/20";
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "basic": return "bg-blue-500/15 text-blue-700 border-blue-300 hover:bg-blue-500/20";
      case "standard": return "bg-purple-500/15 text-purple-700 border-purple-300 hover:bg-purple-500/20";
      case "premium": return "bg-amber-500/15 text-amber-700 border-amber-300 hover:bg-amber-500/20";
      default: return "bg-gray-500/15 text-gray-700 border-gray-300 hover:bg-gray-500/20";
    }
  };

  // Calculate days remaining in trial if applicable
  const getTrialDaysRemaining = () => {
    if (school.license_state === "trial" && school.trial_ends_at) {
      const days = differenceInDays(new Date(school.trial_ends_at), new Date());
      return days > 0 ? days : 0;
    }
    return null;
  };

  const trialDaysRemaining = getTrialDaysRemaining();

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0 rounded-xl overflow-hidden bg-gradient-to-br from-white to-slate-50/70">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border-b border-slate-100 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            School Identity
          </CardTitle>
          <div className="flex items-center gap-1 text-amber-500">
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Legal Name */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Award className="w-4 h-4" />
            <span>Legal Name</span>
          </div>
          <p className="font-semibold text-slate-800 text-lg break-words pl-5">{school.name}</p>
        </div>

        {/* Slug */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <Globe className="w-4 h-4" />
            <span>URL Slug</span>
          </div>
          <p className="font-mono text-sm text-blue-600 bg-blue-50/50 px-3 py-2 rounded-lg border border-blue-100 break-all pl-5">
            {school.slug}.medhashaala.com
          </p>
        </div>

        {/* Tier & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Subscription Tier</p>
            <Badge variant="outline" className={`py-1.5 px-3 rounded-md font-medium ${getTierColor(school.tier)}`}>
              {school.tier.charAt(0).toUpperCase() + school.tier.slice(1)}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Account Status</p>
            <Badge variant="outline" className={`py-1.5 px-3 rounded-md font-medium ${getStatusColor(school.license_state)}`}>
              {school.license_state.charAt(0).toUpperCase() + school.license_state.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Dates */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="p-1.5 bg-slate-100 rounded-md">
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <span>Created on {format(new Date(school.created_date), "MMM d, yyyy")}</span>
          </div>
          
          {school.license_state === "trial" && school.trial_ends_at && (
            <div className="flex items-center gap-3 text-sm bg-amber-50/70 py-2 px-3 rounded-lg border border-amber-100">
              <div className="p-1.5 bg-amber-100 rounded-md">
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-amber-700 font-medium">
                  Trial ends on {format(new Date(school.trial_ends_at), "MMM d, yyyy")}
                </p>
                {trialDaysRemaining !== null && (
                  <p className="text-amber-600 text-xs">
                    {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}