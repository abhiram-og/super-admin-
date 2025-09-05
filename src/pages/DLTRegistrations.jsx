import React, { useState, useEffect } from 'react';
import { DLTRegistration, Tenant } from '@/api/entities';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  ClipboardCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileEdit
} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import DLTRegistrationForm from '../components/dlt/DLTRegistrationForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { withRetry } from "@/components/utils/withRetry";

export default function DLTRegistrations() {
  const [dltData, setDltData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tenants, dltRegs] = await Promise.all([
        withRetry(() => Tenant.list()),
        withRetry(() => DLTRegistration.list())
      ]);
      const combinedData = tenants.map(tenant => {
        const reg = dltRegs.find(r => r.tenant_id === tenant.id) || { tenant_id: tenant.id, status: 'not_submitted' };
        return { ...tenant, dlt: reg };
      });
      setDltData(combinedData);
    } catch (error) {
      console.error("Error loading DLT data:", error);
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'submitted': return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Submitted</Badge>;
      case 'resubmission_required': return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Resubmission</Badge>;
      case 'not_submitted': return <Badge variant="secondary">Not Submitted</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleManageClick = (school) => {
    setSelectedSchool(school);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = () => {
    setIsDialogOpen(false);
    loadData();
  };

  const filtered = dltData.filter(d => d.display_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">DLT Registrations</h1>
        <p className="text-slate-600">Track and manage DLT compliance for school SMS communications.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Search schools..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="w-full overflow-x-auto hidden md:block">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>School Name</TableHead>
                  <TableHead>Principal Entity ID</TableHead>
                  <TableHead>DLT Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : (
                  filtered.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.display_name}</TableCell>
                      <TableCell className="break-words">{item.dlt?.principal_entity_id || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(item.dlt?.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleManageClick(item)}>
                          <FileEdit className="w-3 h-3 mr-2" /> Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden p-4 space-y-3">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : (
              filtered.map(item => (
                <div key={item.id} className="border border-slate-200 rounded-lg p-3 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold break-words">{item.display_name}</div>
                      <div className="text-xs text-slate-500 mt-0.5 break-words">PEID: {item.dlt?.principal_entity_id || 'N/A'}</div>
                      <div className="mt-2">{getStatusBadge(item.dlt?.status)}</div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0" onClick={() => handleManageClick(item)}>
                      <FileEdit className="w-3 h-3 mr-1" /> Manage
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedSchool && (
          <DialogContent className="max-w-full sm:max-w-2xl mx-2">
            <div className="overflow-x-hidden"> {/* prevent any horizontal overflow */}
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">DLT Registration for {selectedSchool.display_name}</DialogTitle>
              </DialogHeader>
              <DLTRegistrationForm school={selectedSchool} dltRecord={selectedSchool.dlt} onSubmitSuccess={handleFormSubmit} />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
