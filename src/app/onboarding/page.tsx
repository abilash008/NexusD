"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Standard ServiceNow Industry Role Taxonomy
const SERVICENOW_ROLES = [
  {
    category: "Technical & Developer Tracks",
    roles: [
      { id: "sys_admin", title: "System Administrator", desc: "Configuration, user admin, security, UI policies & workflows (CSA)" },
      { id: "app_dev", title: "Application Developer", desc: "Scripting, custom scoped apps, Flow Designer, REST APIs (CAD)" },
      { id: "tech_consultant", title: "Technical Consultant / Implementation Specialist", desc: "Client requirements, architectural configuration (CIS)" },
      { id: "sol_architect", title: "Solution Architect", desc: "High-level design, enterprise data models, solution governance" },
      { id: "plat_architect", title: "Platform Architect", desc: "Instance health, upgrade strategy, licensing, platform security" },
    ],
  },
  {
    category: "Functional & Process Tracks",
    roles: [
      { id: "business_analyst", title: "ServiceNow Business Analyst", desc: "Process mapping, user stories, stakeholder alignment" },
      { id: "scrum_pm", title: "ServiceNow Scrum Master / Project Manager", desc: "Agile delivery, release cycles, sprint governance" },
    ],
  },
  {
    category: "Specialized Product Line Tracks",
    roles: [
      { id: "mod_itsm", title: "IT Service Management (ITSM)", desc: "Incident, Problem, Change, Service Catalog, Asset Management" },
      { id: "mod_itom", title: "IT Operations Management (ITOM)", desc: "Discovery, Service Mapping, Event Management" },
      { id: "mod_hrsd", title: "HR Service Delivery (HRSD)", desc: "Employee Center, Lifecycle Events, Case Management" },
      { id: "mod_csm", title: "Customer Service Management (CSM)", desc: "Omni-channel cases, omni-channel routing, SLA management" },
      { id: "mod_secops", title: "Security Operations (SecOps)", desc: "Security Incident Response (SIR), Vulnerability Response (VR)" },
      { id: "mod_grc", title: "GRC / Integrated Risk Management (IRM)", desc: "Compliance, Risk, Audit, Policy Management" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [segment, setSegment] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleRole = (roleTitle: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleTitle)
        ? prev.filter((r) => r !== roleTitle)
        : [...prev, roleTitle]
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    // Save onboarding profile to localStorage / database
    const profile = {
      backgroundSegment: segment,
      targetRoles: selectedRoles,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("nexusd_profile", JSON.stringify(profile));

    setTimeout(() => {
      setSaving(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Onboarding Header */}
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#0066FF]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Step {step} of 2 • Personalize Your Experience</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {step === 1 ? "What best describes your background?" : "Which ServiceNow roles are you targeting?"}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
          {step === 1
            ? "We tailor practice question difficulties and career roadmaps based on your current starting point."
            : "Select one or more roles from the official ServiceNow career track taxonomy."}
        </p>
      </div>

      {/* Step 1: Background Segment */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Option A: Fresher */}
          <div
            onClick={() => setSegment("fresher")}
            className={`cursor-pointer rounded-xl border p-6 transition-all ${
              segment === "fresher"
                ? "border-[#0066FF] bg-blue-50/40 shadow-md ring-2 ring-[#0066FF]/20"
                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-[#0066FF] mb-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">College Fresher</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Recent graduate (B.Tech, BCA, MCA, or similar) breaking into enterprise software via the ServiceNow ecosystem.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-[#0066FF]">
              Recommended: CSA Certification
            </div>
          </div>

          {/* Option B: Career Switcher */}
          <div
            onClick={() => setSegment("career_switcher")}
            className={`cursor-pointer rounded-xl border p-6 transition-all ${
              segment === "career_switcher"
                ? "border-[#0066FF] bg-blue-50/40 shadow-md ring-2 ring-[#0066FF]/20"
                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 mb-4">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Career Switcher</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Non-IT professional transitioning from operations, customer support, or domain sales into ServiceNow development or administration.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-emerald-700">
              Recommended: CSA + Business Analyst
            </div>
          </div>

          {/* Option C: Trainee */}
          <div
            onClick={() => setSegment("servicenow_trainee")}
            className={`cursor-pointer rounded-xl border p-6 transition-all ${
              segment === "servicenow_trainee"
                ? "border-[#0066FF] bg-blue-50/40 shadow-md ring-2 ring-[#0066FF]/20"
                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700 mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">ServiceNow Trainee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Junior developer (0–2 years) currently undergoing internal training at TCS, Infosys, Deloitte, or working on initial client implementations.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-amber-700">
              Recommended: CSA & CAD Fast-Track
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Role Taxonomy Selection */}
      {step === 2 && (
        <div className="space-y-8">
          {SERVICENOW_ROLES.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">
                {cat.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.roles.map((r) => {
                  const isSelected = selectedRoles.includes(r.title);
                  return (
                    <div
                      key={r.id}
                      onClick={() => toggleRole(r.title)}
                      className={`cursor-pointer rounded-lg border p-4 transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-[#0066FF] bg-blue-50/60 ring-1 ring-[#0066FF]"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? "border-[#0066FF] bg-[#0066FF] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900">{r.title}</div>
                        <div className="text-xs text-slate-600 leading-normal">{r.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
        {step === 2 ? (
          <Button
            variant="outline"
            onClick={() => setStep(1)}
            className="gap-2 text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Background
          </Button>
        ) : (
          <div />
        )}

        {step === 1 ? (
          <Button
            variant="accent"
            onClick={() => setStep(2)}
            disabled={!segment}
            className="gap-2 ml-auto"
          >
            Next: Select Target Roles <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="accent"
            onClick={handleFinish}
            disabled={selectedRoles.length === 0 || saving}
            className="gap-2 ml-auto"
          >
            {saving ? "Personalizing..." : "Complete & Enter Dashboard"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
