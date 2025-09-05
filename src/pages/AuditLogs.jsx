
import React, { useState, useEffect, useCallback } from "react";
import { AuditLog } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FileText, 
  Search, 
  Download,
  Clock, 
  User, 
  Building2, 
  Settings, 
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { withRetry } from "@/components/utils/withRetry";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);
  
  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await withRetry(() => AuditLog.list('-created_date'));
      setLogs(data);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
    setIsLoading(false);
  };
  
  // Memoize filter logic to satisfy exhaustive-deps and avoid re-creating on each render
  const applyFilters = useCallback(() => {
    let filtered = logs;
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.actor_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredLogs(filtered);
  }, [logs, searchTerm]);

  // Trigger filtering whenever inputs change (via memoized function)
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('tenant') || action.includes('school')) return <Building2 className="w-4 h-4" />;
    if (action.includes('user') || action.includes('invite') || action.includes('staff')) return <User className="w-4 h-4" />;
    if (action.includes('integration') || action.includes('module')) return <Settings className="w-4 h-4" />;
    if (action.includes('impersonation')) return <Shield className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-600">Track all privileged actions across the platform.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs (CSV)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by actor, action, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop/tablet table */}
          <div className="w-full overflow-x-auto hidden md:block">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="font-medium">
                            {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="break-words">{log.actor_email}</TableCell>
                      <TableCell className="max-w-[260px] break-words">{log.target}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className={getSeverityColor(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.created_date), "MMM d, yyyy 'at' hh:mm a")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile list view */}
          <div className="md:hidden p-4 space-y-3">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border border-slate-200 rounded-lg p-3 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        <div className="font-medium text-sm break-words">
                          {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 break-words">
                        {log.actor_email}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 break-words">
                        {log.target}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {format(new Date(log.created_date), "MMM d, hh:mm a")}
                      </div>
                    </div>
                    <Badge variant="outline" className={`${getSeverityColor(log.severity)} shrink-0`}>
                      {log.severity}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
