
"use client";

import React, { useState, useMemo } from "react";
import {
  Sliders,
  Users,
  GraduationCap,
  User,
  BookOpen,
  Shield,
  GripVertical,
  Eye,
  EyeOff,
  Edit,
  ClipboardList,
  Cog,
  BrainCircuit,
  Check,
  X,
  Save,
  Download,
  Upload,
  Loader2, // Added Loader2 icon
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import SchoolIntegrations from "./SchoolIntegrations";
import { Tenant } from "@/api/entities"; // Added Tenant import
import { withRetry } from "@/components/utils/withRetry"; // Added withRetry import

// Helper
const formatName = (id) =>
  id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const allModulesConfig = {
  Core: [
    "people",
    "academics",
    "attendance",
    "examinations",
    "fees_finance",
    "communication",
    "basic_website",
    "ticket_support",
  ],
  Operations: [
    "hr_payroll",
    "hostel_meals",
    "transport_gps",
    "admissions_certificates",
    "library_inventory",
    "calendar_events",
    "website_mobile_app",
    "inventory_asset_mgmt",
  ],
  "AI Features": [
    "ai_mass_upload",
    "autonomous_db_recording",
    "auto_question_papers",
    "auto_grading",
    "smart_certificates",
    "elearning",
    "ai_chatbot",
    "custom_branding",
  ],
};

const categoryIcons = {
  Core: ClipboardList,
  Operations: Cog,
  "AI Features": BrainCircuit,
};

const allRoles = [
  { name: "Students", icon: GraduationCap, desc: "Courses, assignments & grades" },
  { name: "Parents", icon: User, desc: "Student progress & updates" },
  { name: "Teachers", icon: BookOpen, desc: "Manage classes & grading" },
  { name: "Others", icon: Shield, desc: "Custom staff/admin permissions" },
];

export default function SchoolModuleMatrix({ school = { modules: {} } }) {
  const [modulesState, setModulesState] = useState(school.modules || {});
  const [customNames, setCustomNames] = useState(() => {
    const map = {};
    Object.values(allModulesConfig).flat().forEach((id) => {
      map[id] = formatName(id);
    });
    return map;
  });
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [categoryModules, setCategoryModules] = useState(
    JSON.parse(JSON.stringify(allModulesConfig))
  );
  const [activeTab, setActiveTab] = useState("modules");
  const [saving, setSaving] = useState(false); // Added saving state

  const toggleModule = (modId) =>
    setModulesState((p) => ({ ...p, [modId]: !p[modId] }));

  const enabledCount = useMemo(
    () => Object.values(modulesState).filter(Boolean).length,
    [modulesState]
  );
  const totalModules = useMemo(
    () => Object.values(allModulesConfig).flat().length,
    []
  );

  const toggleAllModules = (enable) => {
    const allIds = Object.values(allModulesConfig).flat();
    const newState = {};
    allIds.forEach((id) => (newState[id] = enable));
    setModulesState(newState);
  };

  const startEditing = (modId) => {
    setEditingModuleId(modId);
    setEditingValue(customNames[modId] || formatName(modId));
  };

  const commitEditing = () => {
    if (!editingModuleId) return;
    const val = editingValue.trim();
    if (val) setCustomNames((p) => ({ ...p, [editingModuleId]: val }));
    setEditingModuleId(null);
    setEditingValue("");
  };

  const cancelEditing = () => {
    setEditingModuleId(null);
    setEditingValue("");
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setCategoryModules((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => (next[k] = [...prev[k]]));
      const sourceList = next[source.droppableId];
      const [moved] = sourceList.splice(source.index, 1);
      next[destination.droppableId].splice(destination.index, 0, moved);
      return next;
    });
  };

  // handleSaveModules function added
  const handleSaveModules = async () => {
    if (!school?.id) return;
    setSaving(true);
    try {
      await withRetry(() => Tenant.update(school.id, { modules: modulesState }), {
        retries: 4,
        baseDelay: 800,
      });
      // Optionally show a success message here
    } catch (error) {
      console.error("Failed to save modules:", error);
      // Optionally show an error message here
    } finally {
      setSaving(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 font-sans text-slate-900 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">School Configuration</h1>
            <p className="text-slate-600 mt-1">Customize modules and permissions for your institution</p>
          </div>
          <div className="flex gap-2">
            {/* Save Changes Button updated */}
            <Button
              size="sm"
              onClick={handleSaveModules}
              disabled={saving || !school?.id}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Roles & Permissions
            </TabsTrigger>
            <TabsTrigger value="Integrations" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            {/* Summary Card */}
            <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h3 className="text-xl font-semibold">Module Configuration</h3>
                    <p className="mt-1 text-blue-100">
                      {enabledCount} of {totalModules} modules enabled
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAllModules(false)}
                      className="flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 border-white/20"
                    >
                      <EyeOff className="h-4 w-4" />
                      Disable All
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => toggleAllModules(true)}
                      className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                      Enable All
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full mt-4">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(enabledCount / totalModules) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            {/* Modules */}
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="space-y-6">
                {Object.entries(categoryModules).map(([category, modules]) => {
                  const Icon = categoryIcons[category];
                  const enabledInCategory = modules.filter(id => modulesState[id]).length;
                  
                  return (
                    <Card key={category} className="rounded-xl overflow-hidden border-0 shadow-sm">
                      <CardHeader className="bg-slate-50 border-b border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-900">
                            {Icon && <Icon className="h-5 w-5 text-blue-600" />}
                            {category}
                          </CardTitle>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {enabledInCategory}/{modules.length} enabled
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Droppable droppableId={category}>
                          {(dropProvided, dropSnapshot) => (
                            <div
                              ref={dropProvided.innerRef}
                              {...dropProvided.droppableProps}
                              className={
                                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 rounded-lg " +
                                (dropSnapshot.isDraggingOver
                                  ? "bg-blue-50 ring-2 ring-blue-200"
                                  : "")
                              }
                            >
                              {modules.map((modId, index) => {
                                const isEnabled = !!modulesState?.[modId];
                                const modName =
                                  customNames[modId] || formatName(modId);
                                const isEditing = editingModuleId === modId;

                                return (
                                  <Draggable
                                    key={modId}
                                    draggableId={modId}
                                    index={index}
                                  >
                                    {(dragProvided, dragSnapshot) => (
                                      <div
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        className={
                                          "rounded-lg border transition-all " +
                                          (dragSnapshot.isDragging
                                            ? "bg-white shadow-lg ring-2 ring-blue-400 transform rotate-2"
                                            : "bg-white hover:shadow-md") +
                                          (isEnabled ? " border-blue-200" : " border-slate-200")
                                        }
                                      >
                                        <div
                                          className={
                                            "flex items-start gap-3 rounded-lg p-4 " +
                                            (isEnabled
                                              ? "bg-blue-50/50"
                                              : "bg-slate-50/50")
                                          }
                                        >
                                          <div
                                            {...dragProvided.dragHandleProps}
                                            className="cursor-grab pt-1 text-slate-400 hover:text-slate-600"
                                          >
                                            <GripVertical className="h-4 w-4" />
                                          </div>
                                          
                                          <div className="flex-1 min-w-0">
                                            {isEditing ? (
                                              <div className="flex flex-col gap-2">
                                                <Input
                                                  value={editingValue}
                                                  onChange={(e) =>
                                                    setEditingValue(e.target.value)
                                                  }
                                                  autoFocus
                                                  className="h-8 text-sm"
                                                />
                                                <div className="flex gap-1">
                                                  <Button size="sm" variant="outline" onClick={cancelEditing} className="h-7 px-2">
                                                    <X className="h-3 w-3" />
                                                  </Button>
                                                  <Button size="sm" onClick={commitEditing} className="h-7 px-2">
                                                    <Check className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ) : (
                                              <>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm font-medium truncate">
                                                    {modName}
                                                  </span>
                                                  <Badge
                                                    className={
                                                      "text-xs " +
                                                      (isEnabled
                                                        ? "bg-green-100 text-green-800 border-green-200"
                                                        : "bg-slate-100 text-slate-800 border-slate-200")
                                                    }
                                                  >
                                                    {isEnabled ? "Enabled" : "Disabled"}
                                                  </Badge>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <button
                                                        onClick={() => startEditing(modId)}
                                                        className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100"
                                                      >
                                                        <Edit className="h-3 w-3" />
                                                      </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>Rename module</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                  <Switch
                                                    checked={isEnabled}
                                                    onCheckedChange={() =>
                                                      toggleModule(modId)
                                                    }
                                                    className="scale-75"
                                                  />
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {dropProvided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </DragDropContext>
          </TabsContent>

          <TabsContent value="roles">
            <Card className="rounded-xl border-0 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200 rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-slate-900">
                  <Users className="h-5 w-5 text-blue-600" />
                  Roles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {allRoles.map(({ name, icon: Icon, desc }) => (
                    <Card
                      key={name}
                      className="rounded-lg border-0 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col items-start text-left">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shadow-inner">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="mt-4 text-lg font-semibold">{name}</div>
                        <p className="mt-2 text-sm text-slate-600">{desc}</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Configure
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                <Separator className="my-6" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total roles configured</span>
                  <span className="font-medium text-slate-900">
                    {allRoles.length} roles
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Integrations">
            <Card className="rounded-xl border-0 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200 rounded-t-xl">
                <CardTitle className="text-xl font-semibold text-slate-900">
                  School Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SchoolIntegrations school={school} />
              </CardContent>
            </Card>
          </TabsContent>
          {/* A placeholder TabsContent for "settings" if it's meant to be implemented later */}
          <TabsContent value="settings">
            <Card className="rounded-xl border-0 shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200 rounded-t-xl">
                <CardTitle className="text-xl font-semibold text-slate-900">
                  School Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-600">Settings configuration will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
