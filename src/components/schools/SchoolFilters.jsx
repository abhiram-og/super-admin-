import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function SchoolFilters({ filters, onFilterChange }) {
  const handleFilterChange = (key, value) => {
    onFilterChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <Select
          value={filters.tier}
          onValueChange={(value) => handleFilterChange('tier', value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="trial">Trial</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.health}
        onValueChange={(value) => handleFilterChange('health', value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Health" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Health</SelectItem>
          <SelectItem value="healthy">Healthy</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}