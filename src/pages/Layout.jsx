

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Building2,
  Users,
  Settings,
  Activity,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Menu,
  Bell,
  Search,
  MessageSquare, // Added import
  ClipboardCheck, // Added import
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Overview",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
    description: "Platform insights"
  },
  {
    title: "Schools",
    url: createPageUrl("Schools"),
    icon: Building2,
    description: "Tenant management"
  },
  {
    title: "Provision School",
    url: createPageUrl("CreateSchool"),
    icon: Users,
    description: "Add new tenant"
  },
  {
    title: "Integrations",
    url: createPageUrl("Integrations"),
    icon: Zap,
    description: "Global services"
  },
  {
    title: "Compliance",
    url: createPageUrl("Compliance"),
    icon: Shield,
    description: "DPDP & audit"
  },
  {
    title: "Audit Logs",
    url: createPageUrl("AuditLogs"),
    icon: FileText,
    description: "System activities"
  }
];

const supportNavItems = [ // New array defined
  {
    title: "Complaints",
    url: createPageUrl("Complaints"),
    icon: MessageSquare,
    description: "School support tickets"
  },
  {
    title: "DLT Registrations",
    url: createPageUrl("DLTRegistrations"),
    icon: ClipboardCheck,
    description: "SMS header approvals"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      {/* Global cross-platform normalization and responsive safety */}
      <style>{`
        /* Base normalization (complements Tailwind preflight) */
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { height: 100%; }
        body, h1, h2, h3, h4, h5, h6, p, figure { margin: 0; }
        a { color: inherit; text-decoration: none; }
        [hidden] { display: none !important; }

        /* Prevent horizontal page scroll on all devices */
        html, body {
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }
        #root { overflow-x: hidden; }

        /* Improve text rendering and cross-OS consistency */
        body {
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
                       "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          background-color: #f8fafc; /* slate-50 */
          overflow-wrap: anywhere; /* break long words/URLs to avoid overflow */
          word-break: break-word;
        }

        /* Prevent unwanted font-size zoom on mobile inputs and unify tap highlight */
        html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
        input, select, textarea, button { font: inherit; font-size: 16px; -webkit-tap-highlight-color: transparent; }

        /* Media defaults for responsiveness */
        img, svg, video, canvas, audio, iframe { display: block; max-width: 100%; height: auto; }
        img { image-rendering: -webkit-optimize-contrast; }

        /* Remove number input spinners for consistency */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        /* Accessible and consistent focus style */
        :focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Safe-area padding for iOS notch devices */
        .safe-area {
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
          padding-top: calc(env(safe-area-inset-top));
          padding-bottom: calc(env(safe-area-inset-bottom));
        }
      `}</style>

      <div className="min-h-screen flex w-full bg-slate-50 antialiased safe-area overflow-x-hidden">
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">MedhaShaala</h2>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Super Admin</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Platform Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg group ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{item.title}</span>
                            <p className="text-xs text-slate-500 group-hover:text-blue-600">{item.description}</p>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* New SidebarGroup for Support & Comms */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Support & Comms
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {supportNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg group ${
                          location.pathname === item.url ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                          <item.icon className="w-5 h-5" />
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{item.title}</span>
                            <p className="text-xs text-slate-500 group-hover:text-blue-600">{item.description}</p>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Active Schools</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      24
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Trial Expires</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      3
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Health Issues</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      1
                    </Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">SA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">Super Admin</p>
                <p className="text-xs text-slate-500 truncate">Platform Controller</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
          {/* Top Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{currentPageName || 'Dashboard'}</h1>
                  <p className="text-sm text-slate-500">Multi-tenant platform management</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-auto bg-slate-50 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

