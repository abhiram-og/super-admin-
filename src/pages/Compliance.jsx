import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  FileText,
  Clock,
  Trash2,
  AlertTriangle,
  Download
} from "lucide-react";

const complianceAreas = [
  { id: 'consent', title: "Consent Management", icon: ShieldCheck, description: "Manage consent records for data processing, media, and notifications." },
  { id: 'retention', title: "Data Retention Policies", icon: Clock, description: "Define automated data retention and deletion schedules per module." },
  { id: 'erasure', title: "Right to Erasure", icon: Trash2, description: "Process and log data erasure requests from individuals." },
  { id: 'export', title: "Data Export", icon: FileText, description: "Provide tools for exporting user data in a structured format." },
  { id: 'breach', title: "Breach Register", icon: AlertTriangle, description: "Log and manage data breach incidents and resolutions." }
];

export default function Compliance() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance & Privacy</h1>
          <p className="text-slate-600">
            Tools and records for DPDP compliance and data governance.
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Compliance Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complianceAreas.map(area => {
          const AreaIcon = area.icon;
          return (
            <Card key={area.id} className="shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <AreaIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{area.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 h-12">{area.description}</p>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Manage {area.title.split(' ')[0]}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            This section provides a centralized hub for all data privacy and compliance activities. 
            Each area above will link to a dedicated management screen where you can define policies, 
            review requests, and maintain logs as required by regulations like India's DPDP Act.
            The "Export Compliance Report" would generate a comprehensive document detailing all policies, consents, and actions for auditing purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}