"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [profile, setProfile] = useState<{
    backgroundSegment?: string;
    targetRoles?: string[];
  }>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nexusd_profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const getSegmentLabel = (seg?: string) => {
    switch (seg) {
      case "fresher":
        return "College Fresher Track";
      case "career_switcher":
        return "Career Switcher Track";
      case "servicenow_trainee":
        return "ServiceNow Trainee Fast-Track";
      default:
        return "ServiceNow Practitioner";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                {getSegmentLabel(profile.backgroundSegment)}
              </Badge>
              {profile.targetRoles && profile.targetRoles.length > 0 && (
                <span className="text-xs text-slate-500 font-medium">
                  Targeting: {profile.targetRoles.slice(0, 2).join(", ")}
                  {profile.targetRoles.length > 2 ? ` +${profile.targetRoles.length - 2} more` : ""}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B192C] tracking-tight">
              Ready to Accelerate Your ServiceNow Career
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl">
              Begin with the certification preparation practice engine to establish your baseline score across the 5 official domains.
            </p>
          </div>
          <Link href="/certifications/csa/practice">
            <Button variant="accent" size="lg" className="gap-2 shadow-sm whitespace-nowrap">
              <Zap className="h-4 w-4" /> Start Practice Test
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Practice Engine Hub */}
        <Card className="border-slate-200 shadow-xs md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="accent">Practice Engine for Certification Preparations</Badge>
              <span className="text-xs font-mono text-slate-500">CSA Active • CAD / CIS Staging</span>
            </div>
            <CardTitle className="text-xl">ServiceNow Certification Practice Engine</CardTitle>
            <CardDescription>
              Currently active: Certified System Administrator (CSA) blueprint. CAD and CIS-ITSM preparation modules loading next.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Practice Mode</span>
                  <Badge variant="success">Free</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Instant answer reveal and deep explanations after each question.
                </p>
                <Link href="/certifications/csa/practice" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Practice Mode (Untimed)
                  </Button>
                </Link>
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0066FF]">Timed Mock Mode</span>
                  <Clock className="h-3.5 w-3.5 text-[#0066FF]" />
                </div>
                <p className="text-xs text-slate-500">
                  Realistic exam simulation with 90-minute timer and domain score report.
                </p>
                <Link href="/certifications/csa/mock" className="block pt-2">
                  <Button variant="accent" size="sm" className="w-full">
                    Timed Exam Mode
                  </Button>
                </Link>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span>Blueprint coverage: UI, Collaboration, Database, Flow Designer, Scripting</span>
              <Link href="/study/csa" className="text-[#0066FF] hover:underline font-medium">
                View CSA Blueprint →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Exam Readiness Telemetry Widget */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Exam Readiness
              </span>
              <Target className="h-4 w-4 text-[#0066FF]" />
            </div>
            <CardTitle className="text-lg">Readiness Gauge</CardTitle>
            <CardDescription>
              Based on your practice exam attempts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-6 text-center space-y-2">
              <div className="text-3xl font-extrabold text-[#0B192C]">
                -- <span className="text-sm font-normal text-slate-500">/ 100%</span>
              </div>
              <p className="text-xs text-slate-500">
                Take your first practice exam to calibrate your domain readiness score.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Passing Threshold:</span>
                <span className="font-semibold text-slate-900">70% Required</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Domain Mastery:</span>
                <span className="font-semibold text-slate-400">0 of 5 Evaluated</span>
              </div>
            </div>

            <Link href="/certifications/csa/practice" className="block pt-2">
              <Button variant="default" className="w-full text-xs">
                Calibrate Readiness Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
