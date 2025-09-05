import React, { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Building2, 
  MoreVertical,
  Eye,
  UserPlus,
  Pause,
  Play,
  Settings,
  Calendar,
  Users,
  HardDrive,
  MessageSquare,
  Activity,
  Zap
} from "lucide-react";

export default function SchoolCard({ school, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "trial": return "bg-blue-100 text-blue-800";
      case "suspended": return "bg-red-100 text-red-800";
      case "expired": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case "healthy": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case "basic": return "bg-blue-100 text-blue-800";
      case "standard": return "bg-purple-100 text-purple-800";
      case "premium": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAction = async (action) => {
    setIsUpdating(true);
    try {
      if (onUpdate) onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate days remaining for trial
  const daysRemaining = school.license_state === "trial" && school.trial_ends_at 
    ? differenceInDays(new Date(school.trial_ends_at), new Date())
    : null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      {/* Header with health indicator */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-start">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <Building2 className="w-5 h-5 text-slate-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 text-base break-words">
              {school.display_name}
            </h3>
            <p className="text-sm text-slate-500 break-all mt-1">
              {school.slug}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className={`w-2 h-2 rounded-full ${getHealthColor(school.health_status)}`}
            title={`Health: ${school.health_status}`}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-7 h-7" disabled={isUpdating}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>School Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleAction("invite")}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("configure")}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleAction(school.license_state === "suspended" ? "activate" : "suspend")
                }
              >
                {school.license_state === "suspended" ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Activate
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Suspend
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Badges */}
      <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2">
        <Badge className={`${getTierColor(school.tier)} capitalize`}>
          {school.tier}
        </Badge>
        <Badge className={`${getStatusColor(school.license_state)} capitalize`}>
          {school.license_state?.replace("_", " ")}
        </Badge>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <div>
            <p className="font-medium text-slate-900">{school.usage_stats?.active_users || 0}</p>
            <p className="text-xs text-slate-500">Users</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-slate-400" />
          <div>
            <p className="font-medium text-slate-900">
              {((school.usage_stats?.storage_mb || 0) / 1024).toFixed(1)}GB
            </p>
            <p className="text-xs text-slate-500">Storage</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <div>
            <p className="font-medium text-slate-900">{school.usage_stats?.sms_sent_today || 0}</p>
            <p className="text-xs text-slate-500">SMS Today</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-400" />
          <div>
            <p className="font-medium text-slate-900">{school.usage_stats?.ai_jobs_today || 0}</p>
            <p className="text-xs text-slate-500">AI Jobs</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <Link to={createPageUrl(`SchoolDetails?id=${school.id}`)} className="block mb-3">
          <Button variant="outline" className="w-full justify-center">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </Link>
        
        <div className="flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Created {format(new Date(school.created_date), "MMM d, yyyy")}</span>
          </div>
          
          {school.license_state === "trial" && school.trial_ends_at && (
            <div className={`flex items-center gap-1 font-medium ${
              daysRemaining <= 7 ? "text-red-600" : "text-amber-600"
            }`}>
              <Zap className="w-3 h-3" />
              <span>{daysRemaining > 0 ? `${daysRemaining}d` : "Expired"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}