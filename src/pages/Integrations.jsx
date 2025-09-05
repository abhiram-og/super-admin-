
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Bell, 
  Cloud, 
  Zap,
  CreditCard
} from "lucide-react";
import IntegrationCard from "../components/integrations/IntegrationCard";
import IntegrationSchoolConfig from "../components/integrations/IntegrationSchoolConfig";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const integrationsList = [
  { id: 'sms', name: 'SMS Gateways', icon: Phone, description: "Textlocal, MSG91 for SMS notifications", color: 'green' },
  { id: 'email', name: 'Email Services', icon: Mail, description: "SMTP, AWS SES for email delivery", color: 'blue' },
  { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageSquare, description: "Cloud API, WATI for messaging", color: 'purple' },
  { id: 'push', name: 'Push Notifications', icon: Bell, description: "FCM for mobile app notifications", color: 'orange' },
  { id: 'storage', name: 'Cloud Storage', icon: Cloud, description: "AWS S3, GCS for file storage", color: 'indigo' },
  { id: 'payments', name: 'Payment Gateways', icon: CreditCard, description: "Razorpay, Stripe for fee collection", color: 'cyan' },
  { id: 'ai', name: 'AI Services', icon: Zap, description: "OCR, NLP, Grading model endpoints", color: 'amber' }
];

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState(null); // kept if referenced elsewhere
  const navigate = useNavigate();

  const handleConfigure = (integrationId) => {
    navigate(createPageUrl(`IntegrationConfig?integrationId=${integrationId}`));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Integrations</h1>
          <p className="text-slate-600">
            Manage global settings for third-party services. Schools can override these settings.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsList.map((integration) => (
          <IntegrationCard 
            key={integration.id} 
            integration={integration} 
            onConfigure={handleConfigure} 
          />
        ))}
      </div>
      
      {/* Config moved to dedicated page */}
    </div>
  );
}
