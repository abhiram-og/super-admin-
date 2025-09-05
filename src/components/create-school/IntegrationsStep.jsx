import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Mail,
  Phone,
  Bell,
  Cloud,
  Zap,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  HelpCircle,
  Sliders,
  Lock,
} from "lucide-react";

const integrationOptions = [
  {
    id: "sms",
    name: "SMS Service",
    icon: Phone,
    description: "SMS notifications for attendance, fees, and announcements",
    required: false,
    color: "green",
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["MSG91", "Textlocal", "AWS SNS"], placeholder: "Select SMS provider" },
      { key: "api_key", label: "API Key", type: "password", placeholder: "Enter API key" },
      { key: "sender_id", label: "Sender ID", type: "text", placeholder: "SCHOOL" },
      { key: "daily_limit", label: "Daily Limit", type: "number", placeholder: "1000" },
    ],
  },
  {
    id: "email",
    name: "Email Service",
    icon: Mail,
    description: "Email notifications and communication",
    required: false,
    color: "blue",
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["AWS SES", "SendGrid", "SMTP"], placeholder: "Select email provider" },
      { key: "smtp_host", label: "SMTP Host", type: "text", placeholder: "smtp.gmail.com" },
      { key: "smtp_port", label: "SMTP Port", type: "number", placeholder: "587" },
      { key: "username", label: "Username", type: "email", placeholder: "school@domain.com" },
      { key: "password", label: "Password", type: "password", placeholder: "Email password" },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: MessageSquare,
    description: "WhatsApp messaging for important notifications",
    required: false,
    color: "purple",
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["WhatsApp Cloud API", "WATI", "Gupshup"], placeholder: "Select WhatsApp provider" },
      { key: "access_token", label: "Access Token", type: "password", placeholder: "WhatsApp access token" },
      { key: "phone_number", label: "Business Phone", type: "tel", placeholder: "+911234567890" },
    ],
  },
  {
    id: "push",
    name: "Push Notifications",
    icon: Bell,
    description: "Mobile app push notifications",
    required: false,
    color: "orange",
    fields: [
      { key: "fcm_server_key", label: "FCM Server Key", type: "password", placeholder: "Firebase server key" },
      { key: "fcm_sender_id", label: "FCM Sender ID", type: "text", placeholder: "Firebase sender ID" },
    ],
  },
  {
    id: "storage",
    name: "Cloud Storage",
    icon: Cloud,
    description: "File storage for documents and media",
    required: true,
    color: "indigo",
    fields: [
      { key: "provider", label: "Provider", type: "select", options: ["AWS S3", "Google Cloud Storage", "Local"], placeholder: "Select storage provider" },
      { key: "bucket_name", label: "Bucket Name", type: "text", placeholder: "school-files" },
      { key: "access_key", label: "Access Key", type: "password", placeholder: "Storage access key" },
      { key: "secret_key", label: "Secret Key", type: "password", placeholder: "Storage secret key" },
    ],
  },
  {
    id: "ai_services",
    name: "AI Services",
    icon: Zap,
    description: "AI-powered features (Premium tier)",
    required: false,
    color: "amber",
    premium: true,
    fields: [
      { key: "ocr_provider", label: "OCR Provider", type: "select", options: ["Google Vision", "AWS Textract", "Azure OCR"], placeholder: "Select OCR provider" },
      { key: "nlp_provider", label: "NLP Provider", type: "select", options: ["OpenAI", "Google AI", "AWS Comprehend"], placeholder: "Select NLP provider" },
      { key: "api_key", label: "API Key", type: "password", placeholder: "AI service API key" },
    ],
  },
];

const colorVariants = {
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "bg-green-100 text-green-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "bg-blue-100 text-blue-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "bg-purple-100 text-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "bg-orange-100 text-orange-600" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", icon: "bg-indigo-100 text-indigo-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "bg-amber-100 text-amber-600" },
};

export default function IntegrationsStep({ data, updateData }) {
  const [expandedIntegration, setExpandedIntegration] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleIntegrationToggle = (integrationId, enabled) => {
    const updatedIntegrations = {
      ...data.integrations,
      [integrationId]: {
        ...data.integrations[integrationId],
        enabled,
      },
    };
    updateData({ integrations: updatedIntegrations });

    if (enabled) {
      setExpandedIntegration(integrationId); // open the enabled one
    } else if (expandedIntegration === integrationId) {
      setExpandedIntegration(null); // collapse if you turned this one off
    }
  };

  const handleFieldChange = (integrationId, fieldKey, value) => {
    const updatedIntegrations = {
      ...data.integrations,
      [integrationId]: {
        ...data.integrations[integrationId],
        [fieldKey]: value,
      },
    };
    updateData({ integrations: updatedIntegrations });
  };

  const isIntegrationAvailable = (integration) => {
    if (integration.premium) return data.tier === "premium";
    return true;
  };

  const toggleIntegrationExpansion = (integrationId) => {
    setExpandedIntegration((prev) => (prev === integrationId ? null : integrationId));
  };

  const enableAllIntegrations = () => {
    const updates = {};
    integrationOptions.forEach((integration) => {
      if (isIntegrationAvailable(integration) && !integration.required) {
        updates[integration.id] = { enabled: true };
      }
    });
    updateData({ integrations: { ...data.integrations, ...updates } });
  };

  const disableAllIntegrations = () => {
    const updates = {};
    integrationOptions.forEach((integration) => {
      if (!integration.required) {
        updates[integration.id] = { enabled: false };
      }
    });
    updateData({ integrations: { ...data.integrations, ...updates } });
    setExpandedIntegration(null);
  };

  const enabledCount = Object.values(data.integrations).filter((i) => i.enabled).length;
  const totalAvailable = integrationOptions.filter((i) => isIntegrationAvailable(i) && !i.required).length;

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Integration Configuration</h2>
          <p className="text-slate-600">Configure external services for communication, storage, and AI features.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-50 text-slate-600 px-3 py-1">
            {data.tier?.toUpperCase() || "STANDARD"} Tier
          </Badge>
          <Button variant="outline" size="icon" onClick={() => setShowHelp((s) => !s)} className="rounded-full">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Help */}
      <AnimatePresence>
        {showHelp && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Integration Setup Guide</h4>
                    <p className="text-sm text-blue-700">
                      Configure now or later from the admin panel. Storage has defaults if not configured. Premium features require the Premium tier.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2 mb-2">
        <Button variant="outline" size="sm" onClick={enableAllIntegrations} className="text-xs">
          <Check className="w-4 h-4 mr-1" /> Enable All
        </Button>
        <Button variant="outline" size="sm" onClick={disableAllIntegrations} className="text-xs">
          <X className="w-4 h-4 mr-1" /> Disable All
        </Button>
        <div className="ml-auto text-xs text-slate-500 flex items-center">
          <span className="mr-2">Enabled:</span>
          <span className="font-semibold">
            {enabledCount}/{totalAvailable}
          </span>
        </div>
      </div>

      {/* SERVICES LIST — one-per-line */}
      <div className="space-y-4">
        {integrationOptions.map((integration) => {
          const IntegrationIcon = integration.icon;
          const isEnabled = data.integrations[integration.id]?.enabled || false;
          const isAvailable = isIntegrationAvailable(integration);
          const integrationData = data.integrations[integration.id] || {};
          const colors = colorVariants[integration.color];
          const isExpanded = expandedIntegration === integration.id; // no auto-open for required

          return (
            <Card
              key={integration.id}
              className={`w-full overflow-hidden transition-all duration-200 ${
                !isAvailable ? "opacity-60 border-slate-100" : colors.border
              } ${isEnabled ? "ring-2 ring-blue-400 shadow-md" : "shadow-sm"}`}
            >
              {/* COMPACT ONE-LINE HEADER */}
              <CardHeader
                className={`py-3 ${isEnabled ? colors.bg : "bg-white"}`}
                onClick={() => toggleIntegrationExpansion(integration.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* left: icon + name + badges (all in ONE line, truncated) */}
                  <div className="min-w-0 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.icon}`}>
                      <IntegrationIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex items-center gap-2">
                      <CardTitle className="text-base font-semibold truncate">{integration.name}</CardTitle>
                      {integration.required && <Badge className="bg-red-100 text-red-700 text-[10px]">Required</Badge>}
                      {integration.premium && <Badge className="bg-amber-100 text-amber-700 text-[10px]">Premium</Badge>}
                    </div>
                  </div>

                  {/* right: switch + chevron (kept inline) */}
                  <div className="flex items-center gap-2">
                    {!integration.required && (
                      <Switch
                        checked={isEnabled && isAvailable}
                        disabled={!isAvailable}
                        onCheckedChange={(checked) => handleIntegrationToggle(integration.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </div>
              </CardHeader>

              {/* EXPANDED CONTENT */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <CardContent className="pt-4">
                      {(isEnabled || integration.required) && isAvailable ? (
                        <>
                          {/* put the description here, not in the header */}
                          <p className="text-sm text-slate-600 mb-3">{integration.description}</p>

                          <div className="grid grid-cols-1 gap-4">
                            {integration.fields.map((field) => (
                              <div key={field.key} className="space-y-2">
                                <Label htmlFor={`${integration.id}-${field.key}`} className="text-sm flex items-center">
                                  {field.label}
                                  {field.type === "password" && <Lock className="w-3 h-3 ml-1 text-slate-400" />}
                                </Label>
                                {field.type === "select" ? (
                                  <select
                                    id={`${integration.id}-${field.key}`}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                    value={integrationData[field.key] || ""}
                                    onChange={(e) => handleFieldChange(integration.id, field.key, e.target.value)}
                                  >
                                    <option value="">{field.placeholder}</option>
                                    {field.options?.map((option) => (
                                      <option key={option} value={option.toLowerCase().replace(/\s/g, "_")}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <Input
                                    id={`${integration.id}-${field.key}`}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={integrationData[field.key] || ""}
                                    onChange={(e) => handleFieldChange(integration.id, field.key, e.target.value)}
                                    className="focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {integration.id === "storage" && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="flex items-center gap-2 text-blue-800">
                                <Info className="w-4 h-4" />
                                <p className="text-sm font-medium">Storage Configuration</p>
                              </div>
                              <p className="text-xs text-blue-700 mt-1">
                                Default local storage will be used if cloud storage is not configured. For production, cloud storage is recommended.
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-4 text-center">
                          {!isAvailable ? (
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                              <div className="flex items-center gap-2 text-amber-800 justify-center">
                                <AlertCircle className="w-4 h-4" />
                                <p className="text-sm font-medium">Premium Feature</p>
                              </div>
                              <p className="text-xs text-amber-700 mt-1">This integration requires Premium tier. Upgrade to access AI-powered features.</p>
                            </div>
                          ) : (
                            <p className="text-slate-500 text-sm">Enable this integration to configure its settings.</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-slate-50 border-slate-200">
        <div className="px-6 pt-4 pb-1 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-600" />
          <span className="font-semibold">Configuration Summary</span>
        </div>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Enabled Integrations</span>
                <span className="font-medium">
                  {enabledCount} of {totalAvailable}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Storage</span>
                <span className={data.integrations.storage?.enabled ? "text-green-600 font-medium" : "text-slate-600"}>
                  {data.integrations.storage?.enabled ? "Configured" : "Using defaults"}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Communication</span>
                <span className={data.integrations.sms?.enabled || data.integrations.email?.enabled ? "text-green-600 font-medium" : "text-slate-600"}>
                  {data.integrations.sms?.enabled || data.integrations.email?.enabled ? "Available" : "Not configured"}
                </span>
              </div>
              {data.tier === "premium" && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">AI Services</span>
                  <span className={data.integrations.ai_services?.enabled ? "text-green-600 font-medium" : "text-slate-600"}>
                    {data.integrations.ai_services?.enabled ? "Enabled" : "Available (not configured)"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
