import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Mail,
  Phone,
  Bell,
  Cloud,
  Zap,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import IntegrationSchoolConfig from "../components/integrations/IntegrationSchoolConfig";

const integrationsList = [
  { id: "sms", name: "SMS Gateways", icon: Phone, description: "Textlocal, MSG91 for SMS notifications", color: "green" },
  { id: "email", name: "Email Services", icon: Mail, description: "SMTP, AWS SES for email delivery", color: "blue" },
  { id: "whatsapp", name: "WhatsApp Business", icon: MessageSquare, description: "Cloud API, WATI for messaging", color: "purple" },
  { id: "push", name: "Push Notifications", icon: Bell, description: "FCM for mobile app notifications", color: "orange" },
  { id: "storage", name: "Cloud Storage", icon: Cloud, description: "AWS S3, GCS for file storage", color: "indigo" },
  { id: "payments", name: "Payment Gateways", icon: CreditCard, description: "Razorpay, Stripe for fee collection", color: "cyan" },
  { id: "ai", name: "AI Services", icon: Zap, description: "OCR, NLP, Grading model endpoints", color: "amber" },
];

export default function IntegrationConfig() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const integrationId = params.get("integrationId") || "";

  const integration = useMemo(
    () => integrationsList.find((i) => i.id === integrationId),
    [integrationId]
  );

  if (!integration) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link to={createPageUrl("Integrations")}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Integrations
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Integration not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              The requested integration doesn&apos;t exist. Please go back and choose a valid integration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const Icon = integration.icon;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white shadow border border-slate-200">
            <Icon className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{integration.name}</h1>
            <p className="text-slate-600">{integration.description}</p>
          </div>
        </div>
        <div className="flex gap-2">

        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Per-school configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <IntegrationSchoolConfig integration={integration} />
        </CardContent>
      </Card>
    </div>
  );
}