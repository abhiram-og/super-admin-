import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const colorVariants = {
  green: { text: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
  blue: { text: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
  orange: { text: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
  indigo: { text: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' },
  cyan: { text: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-200' },
  amber: { text: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' }
};

export default function IntegrationCard({ integration, onConfigure }) {
  const Icon = integration.icon;
  const colors = colorVariants[integration.color] || colorVariants.blue;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          <CardTitle>{integration.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 h-10">{integration.description}</p>
        <div className="mt-4">
          <Badge variant="outline" className={`${colors.border} ${colors.bg} ${colors.text}`}>
            Status: Active
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onConfigure(integration.id)}>
          Configure
        </Button>
      </CardFooter>
    </Card>
  );
}