import React, { useState, useEffect, useCallback } from "react";
import api, { mockApi } from "@/api/djangoClient";
import { mockData } from "@/api/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Search,
  Filter,
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
  Plus,
  LayoutGrid,
  Table as TableIcon,
  BarChart3,
  Download,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { withRetry } from "@/components/utils/withRetry";

import SchoolCard from "../components/schools/SchoolCard";
import SchoolFilters from "../components/schools/SchoolFilters";

export default function Schools() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    tier: "all",
    status: "all",
    health: "all"
  });
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    setIsLoading(true);
    try {
      // Try to load from Django API first
      const data = await withRetry(() => api.schools.list());
      setSchools(data.results || data || []);
    } catch (error) {
      console.error('Error loading schools from API:', error);
      // Fallback to mock data
      try {
        const mockResponse = await mockApi.schools.list();
        setSchools(mockResponse.results || mockData.schools);
      } catch (mockError) {
        console.error('Error loading mock schools:', mockError);
        setSchools([]);
      }
    }
    setIsLoading(false);
  };

  // Memoize filtering logic to satisfy exhaustive-deps
  const applyFilters = useCallback(() => {
    let filtered = schools;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tier filter
    if (filters.tier !== "all") {
      filtered = filtered.filter(school => 
        school.tier === filters.tier || 
        school.tier_name === filters.tier
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(school => 
        school.status === filters.status || 
        school.license_state === filters.status
      );
    }

    // Health filter
    if (filters.health !== "all") {
      filtered = filtered.filter(school => school.health_status === filters.health);
    }

    setFilteredSchools(filtered);
  }, [schools, searchTerm, filters]);

  // Replace previous effect dependency array to use the memoized filter function
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'trial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'standard': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">School Management</h1>
            <p className="text-slate-600 mt-1">Manage all school tenants and their configurations</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
              className="flex items-center gap-2"
            >
              {viewMode === "cards" ? (
                <>
                  <TableIcon className="w-4 h-4" />
                  Table View
                </>
              ) : (
                <>
                  <LayoutGrid className="w-4 h-4" />
                  Card View
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={loadSchools}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Link to={createPageUrl("CreateSchool")}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New School
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Schools</p>
                <p className="text-2xl font-bold text-slate-900">{schools.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Schools</p>
                <p className="text-2xl font-bold text-green-700">
                  {schools.filter(s => s.status === 'active' || s.license_state === 'active').length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Trial Schools</p>
                <p className="text-2xl font-bold text-blue-700">
                  {schools.filter(s => s.status === 'trial' || s.license_state === 'trial').length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Issues Detected</p>
                <p className="text-2xl font-bold text-red-700">
                  {schools.filter(s => s.health_status === 'critical').length}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search schools by name or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <SchoolFilters filters={filters} onFilterChange={setFilters} />
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {filteredSchools.length} of {schools.length} schools
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter className="w-4 h-4" />
            <span>Filtered by: {filters.tier !== 'all' ? `${filters.tier} tier` : 'all tiers'}, {filters.status !== 'all' ? filters.status : 'all statuses'}, {filters.health !== 'all' ? filters.health : 'all health'}</span>
          </div>
        </div>

        {/* Schools Display */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="border-slate-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-100"></div>
                </Card>
              ))
            ) : (
              filteredSchools.map((school) => (
                <SchoolCard key={school.id} school={school} onUpdate={loadSchools} />
              ))
            )}
          </div>
        ) : (
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">School</TableHead>
                      <TableHead className="font-semibold text-slate-700">Tier</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Health</TableHead>
                      <TableHead className="font-semibold text-slate-700">Users</TableHead>
                      <TableHead className="font-semibold text-slate-700">Storage</TableHead>
                      <TableHead className="font-semibold text-slate-700">Created</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right w-16">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i} className="animate-pulse">
                          <TableCell><div className="h-4 bg-slate-200 rounded w-32"></div></TableCell>
                          <TableCell><div className="h-6 bg-slate-200 rounded-full w-16"></div></TableCell>
                          <TableCell><div className="h-6 bg-slate-200 rounded-full w-16"></div></TableCell>
                          <TableCell><div className="h-4 bg-slate-200 rounded w-12"></div></TableCell>
                          <TableCell><div className="h-4 bg-slate-200 rounded w-8"></div></TableCell>
                          <TableCell><div className="h-4 bg-slate-200 rounded w-16"></div></TableCell>
                          <TableCell><div className="h-4 bg-slate-200 rounded w-20"></div></TableCell>
                          <TableCell><div className="h-8 bg-slate-200 rounded w-8 ml-auto"></div></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      filteredSchools.map((school) => (
                        <TableRow
                          key={school.id}
                          className="hover:bg-slate-50 cursor-pointer group"
                          onClick={() => navigate(createPageUrl(`SchoolDetails?id=${school.id}`))}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 group-hover:text-blue-600">
                                  {school.name || school.display_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {school.code || school.slug}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getTierColor(school.tier) + " capitalize"}>
                              {school.tier}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(school.license_state) + " capitalize"}>
                              {school.license_state}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getHealthColor(school.health_status)}`}></div>
                              <span className="text-sm capitalize">{school.health_status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-medium">{school.usage_stats?.active_users || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <HardDrive className="w-4 h-4 text-slate-400" />
                              <span className="text-sm font-medium">{(school.usage_stats?.storage_mb || 0) / 1024} GB</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-600">
                              {format(new Date(school.created_date), 'MMM d, yyyy')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="opacity-70 group-hover:opacity-100">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>School Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Invite Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="w-4 h-4 mr-2" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  {school.license_state === 'suspended' ? (
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
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && filteredSchools.length === 0 && (
          <Card className="text-center py-12 border-slate-200">
            <CardContent>
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No schools found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
              <Button onClick={() => {
                setSearchTerm("");
                setFilters({ tier: "all", status: "all", health: "all" });
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}