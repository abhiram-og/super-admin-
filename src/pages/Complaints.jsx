
import React, { useState, useEffect } from 'react';
import { Ticket, Tenant } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  MessageSquare,
  ChevronsRight,
  MoreVertical,
  TriangleAlert
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { withRetry } from "@/components/utils/withRetry";

export default function Complaints() {
  const [tickets, setTickets] = useState([]);
  const [tenants, setTenants] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ticketData, tenantData] = await Promise.all([
        withRetry(() => Ticket.list('-created_date')),
        withRetry(() => Tenant.list())
      ]);
      setTickets(ticketData);
      const tenantMap = tenantData.reduce((acc, tenant) => {
        acc[tenant.id] = tenant.display_name;
        return acc;
      }, {});
      setTenants(tenantMap);
    } catch (error) {
      console.error("Error loading complaints:", error);
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return <Badge className="bg-blue-100 text-blue-800">Open</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'resolved': return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'closed': return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'critical': return <Badge variant="destructive" className="animate-pulse"><TriangleAlert className="w-3 h-3 mr-1" />Critical</Badge>;
      case 'medium': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Medium</Badge>;
      default: return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Complaints & Support Tickets</h1>
        <p className="text-slate-600">Manage and resolve issues reported by schools.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Tickets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop/tablet table */}
          <div className="w-full overflow-x-auto hidden md:block">
            <Table className="min-w-[720px]">
             <TableHeader>
               <TableRow className="bg-slate-50">
                 <TableHead>School</TableHead>
                 <TableHead>Subject</TableHead>
                 <TableHead>Priority</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead>Last Updated</TableHead>
                 <TableHead>Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {isLoading ? (
                 Array(5).fill(0).map((_, i) => (
                   <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                 ))
               ) : (
                 tickets.map(ticket => (
                   <TableRow key={ticket.id}>
                     <TableCell className="font-medium whitespace-nowrap">{tenants[ticket.tenant_id] || 'Unknown School'}</TableCell>
                     <TableCell className="max-w-[260px]">
                       <p className="max-w-xs truncate">{ticket.subject}</p>
                       <p className="text-xs text-slate-500 break-words">{ticket.category.replace(/_/g, ' ')}</p>
                     </TableCell>
                     <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                     <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                     <TableCell className="whitespace-nowrap min-w-[120px]">{formatDistanceToNow(new Date(ticket.updated_date))} ago</TableCell>
                     <TableCell>
                       <Button variant="outline" size="sm">
                         View <ChevronsRight className="w-4 h-4 ml-1" />
                       </Button>
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
              tickets.map(ticket => (
                <div key={ticket.id} className="border border-slate-200 rounded-lg p-3 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold break-words">{tenants[ticket.tenant_id] || 'Unknown School'}</div>
                      <div className="text-sm text-slate-800 mt-0.5 break-words">{ticket.subject}</div>
                      <div className="text-xs text-slate-500 mt-0.5 break-words">{ticket.category.replace(/_/g, ' ')}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{formatDistanceToNow(new Date(ticket.updated_date))} ago</div>
                      <div className="flex items-center gap-2 mt-2">
                        {getPriorityBadge(ticket.priority)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">
                      View <ChevronsRight className="w-4 h-4 ml-1" />
                    </Button>
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
