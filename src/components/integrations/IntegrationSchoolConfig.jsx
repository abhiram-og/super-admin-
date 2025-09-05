
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tenant } from "@/api/entities";
import { withRetry } from "@/components/utils/withRetry";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Loader2, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

// Small delay to avoid burst updates that trigger rate limits
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Further slow pacing for bulk ops to reduce 429s
const RATE_LIMIT_DELAY = 800;
const CHUNK_SIZE = 3;
const CHUNK_PAUSE = 3000;

const idToIntegrationKey = (id) => {
  if (id === "ai") return "ai_services";
  return id; // sms, email, whatsapp, push, storage already aligned
};

export default function IntegrationSchoolConfig({ integration }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [q, setQ] = useState("");

  const navigate = useNavigate();
  const integrationKey = idToIntegrationKey(integration?.id || "");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      // Use retry with a slightly higher backoff for safety
      const data = await withRetry(() => Tenant.list("-created_date"), { retries: 4, baseDelay: 800 });
      if (mounted) {
        setTenants(data);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return tenants;
    return tenants.filter(t =>
      t.display_name?.toLowerCase().includes(term) ||
      t.slug?.toLowerCase().includes(term)
    );
  }, [q, tenants]);

  const getEnabled = (t) => {
    const k = t.integrations?.[integrationKey];
    return !!(k && k.enabled);
  };

  const setLocalEnabled = (tenantId, enabled) => {
    setTenants(prev => prev.map(t => {
      if (t.id !== tenantId) return t;
      const existing = t.integrations || {};
      const sub = existing[integrationKey] || {};
      return {
        ...t,
        integrations: {
          ...existing,
          [integrationKey]: { ...sub, enabled }
        }
      };
    }));
  };

  const handleToggle = async (tenant) => {
    // Prevent rapid toggle while bulk is running
    if (bulkLoading) return;
    setTogglingId(tenant.id);
    const current = getEnabled(tenant);
    const next = !current;
    const integrations = {
      ...(tenant.integrations || {}),
      [integrationKey]: {
        ...(tenant.integrations?.[integrationKey] || {}),
        enabled: next
      }
    };
    await withRetry(() => Tenant.update(tenant.id, { integrations }), { retries: 4, baseDelay: 800 });
    setLocalEnabled(tenant.id, next);
    setTogglingId(null);
  };

  const bulkSetAll = async (enabled) => {
    if (loading) return;
    setBulkLoading(true);

    // 0) Small jitter before starting bulk to avoid clashing with other requests
    await sleep(200 + Math.floor(Math.random() * 300));

    // 1) Optimistically update local state
    setTenants(prev =>
      prev.map(t => ({
        ...t,
        integrations: {
          ...(t.integrations || {}),
          [integrationKey]: {
            ...(t.integrations?.[integrationKey] || {}),
            enabled,
          },
        },
      }))
    );

    // Build targets skipping no-op rows
    const targets = tenants.filter(t => {
      const k = t.integrations?.[integrationKey];
      const current = !!(k && k.enabled);
      return current !== enabled;
    });

    // 2) Persist sequentially with chunk pauses + retry/backoff
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const integrations = {
        ...(t.integrations || {}),
        [integrationKey]: {
          ...(t.integrations?.[integrationKey] || {}),
          enabled,
        },
      };

      await withRetry(() => Tenant.update(t.id, { integrations }), {
        retries: 5,
        baseDelay: 1400,     // heavier backoff for bulk
        maxConcurrent: 1,
      });

      await sleep(RATE_LIMIT_DELAY);
      if ((i + 1) % CHUNK_SIZE === 0) {
        await sleep(CHUNK_PAUSE);
      }
    }

    setBulkLoading(false);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4 sm:p-6 space-y-4">

        {/* Back Button */}
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search schools..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => bulkSetAll(false)}
              disabled={bulkLoading || loading}
            >
              {bulkLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
              Disable All
            </Button>
            <Button
              onClick={() => bulkSetAll(true)}
              disabled={bulkLoading || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {bulkLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Enable All
            </Button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="w-full overflow-y-auto max-h-[60vh] rounded-lg border border-slate-200">
            <Table className="min-w-[700px]">
              <TableHeader className="sticky top-0 bg-slate-50 z-10">
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Toggle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={3} className="py-6 text-center text-slate-500">
                        <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                        Loading...
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  filtered.map(t => {
                    const enabled = getEnabled(t);
                    return (
                      <TableRow key={t.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-slate-900">{t.display_name}</span>
                            <span className="text-xs text-slate-500">{t.slug}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}>
                            {enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch
                              checked={enabled}
                              onCheckedChange={() => handleToggle(t)}
                              disabled={togglingId === t.id || bulkLoading}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-slate-500">
                      No schools found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-16 rounded-lg border border-slate-200 bg-slate-100 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No schools found.</div>
          ) : (
            filtered.map(t => {
              const enabled = getEnabled(t);
              return (
                <div key={t.id} className="rounded-lg border border-slate-200 p-3 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{t.display_name}</div>
                    <div className="text-xs text-slate-500">{t.slug}</div>
                    <Badge className={`mt-2 ${enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                      {enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => handleToggle(t)}
                    disabled={togglingId === t.id || bulkLoading}
                  />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
