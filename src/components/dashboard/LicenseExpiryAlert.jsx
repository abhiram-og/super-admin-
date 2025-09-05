import React from "react";
import { format, isWithinInterval, addDays } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LicenseExpiryAlert({ tenants }) {
  // Find tenants with licenses expiring in the next 7 days
  const now = new Date();
  const weekFromNow = addDays(now, 7);
  
  const expiringTenants = tenants.filter(tenant => {
    if (tenant.license_state !== 'trial' || !tenant.trial_ends_at) return false;
    const expiryDate = new Date(tenant.trial_ends_at);
    return isWithinInterval(expiryDate, { start: now, end: weekFromNow });
  });

  if (expiringTenants.length === 0) return null;

  return (
    <Alert className="border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex-1">
          <p className="font-medium text-amber-800 mb-2">
            {expiringTenants.length} school{expiringTenants.length > 1 ? 's have' : ' has'} trial{expiringTenants.length > 1 ? 's' : ''} expiring soon
          </p>
          <div className="flex flex-wrap gap-2">
            {expiringTenants.slice(0, 3).map(tenant => (
              <Badge key={tenant.id} variant="outline" className="bg-white text-amber-800 border-amber-200">
                {tenant.display_name} • {format(new Date(tenant.trial_ends_at), 'MMM d')}
              </Badge>
            ))}
            {expiringTenants.length > 3 && (
              <Badge variant="outline" className="bg-white text-amber-800 border-amber-200">
                +{expiringTenants.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        <Link to={createPageUrl("Schools")}>
          <Button variant="outline" size="sm" className="ml-4 bg-white hover:bg-amber-50 border-amber-200">
            <Calendar className="w-4 h-4 mr-2" />
            Manage
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  );
}