"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  User,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Mail,
  Briefcase,
  ExternalLink,
  Edit3,
  Save,
  X,
  Sparkles,
  Zap,
  BookOpen,
  ArrowRight,
  Clock,
  Layers,
  GraduationCap,
  Globe,
  Check,
  Lock,
  FileText,
  BadgeCheck,
  Building,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEntitlements } from "@/hooks/use-entitlements";

interface CandidateProfileData {
  backgroundSegment?: string;
  targetRoles?: string[];
  targetSpecializations?: string[];
  webassessorId?: string;
  nowLearningId?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  experienceLevel?: string;
  bio?: string;
}

export default function CandidateProfilePage() {
  const { data: session, status: authStatus } = useSession();
  const { isPro, entitlement, daysRemaining, isCertificationActive } = useEntitlements();

  const [profile, setProfile] = useState<CandidateProfileData>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CandidateProfileData>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load candidate profile from localStorage or defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nexusd_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setEditForm(parsed);
      } else {
        const defaults: CandidateProfileData = {
          backgroundSegment: "servicenow_trainee",
          targetRoles: ["ServiceNow System Administrator", "Implementation Specialist"],
          experienceLevel: "0 - 1 Year (Aspirant / Trainee)",
          webassessorId: "",
          nowLearningId: "",
          linkedInUrl: "",
          portfolioUrl: "",
          bio: "Preparing for ServiceNow Certified System Administrator (CSA) certification.",
        };
        setProfile(defaults);
        setEditForm(defaults);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("nexusd_profile", JSON.stringify(editForm));
      setProfile(editForm);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

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

  const displayName = session?.user?.name || "ServiceNow Candidate";
  const displayEmail = session?.user?.email || "candidate@nexusd.in";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAuthenticated = authStatus === "authenticated" && Boolean(session?.user);

  // ServiceNow University Badges
  const BADGES = [
    {
      id: "csa_pioneer",
      title: "CSA Blueprint Aligned",
      description: "Mastered the 5 core ServiceNow CSA exam blueprint domains.",
      icon: "🏅",
      isUnlocked: true,
      category: "Blueprint",
    },
    {
      id: "aus_brazil",
      title: "Australia & Brazil Sync",
      description: "Verified on the latest Washington, Australia & Brazil release syllabus.",
      icon: "🛡️",
      isUnlocked: true,
      category: "Release",
    },
    {
      id: "pro_pass",
      title: "Pro Candidate Vault",
      description: "Holds active 1-year certification pass with full question bank access.",
      icon: "💎",
      isUnlocked: Boolean(isAuthenticated && isPro),
      category: "Credential",
    },
    {
      id: "velocity_master",
      title: "Mock Velocity Master",
      description: "Completed 90-minute timed simulation within official exam pacing.",
      icon: "⚡",
      isUnlocked: true,
      category: "Simulation",
    },
    {
      id: "benchmark_70",
      title: "70% Pass Achiever",
      description: "Reached official passing benchmark on full diagnostic exams.",
      icon: "🎯",
      isUnlocked: true,
      category: "Benchmark",
    },
    {
      id: "doc_scholar",
      title: "Now Docs Scholar",
      description: "Cross-referenced official ServiceNow Product Documentation explanations.",
      icon: "📜",
      isUnlocked: true,
      category: "Research",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. Candidate Hero Identity Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-blue-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shrink-0">
              {userInitials || "SC"}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {displayName}
                </h1>
                <Badge variant="accent" className="text-xs font-semibold">
                  <BadgeCheck className="h-3.5 w-3.5 mr-1" /> Verified Candidate
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {displayEmail}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <GraduationCap className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
                  {getSegmentLabel(profile.backgroundSegment)}
                </span>
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl pt-0.5 leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1.5 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer text-xs"
            >
              <Edit3 className="h-3.5 w-3.5" />
              {isEditing ? "Close Editor" : "Edit Candidate Details"}
            </Button>
            {!isAuthenticated && (
              <Link href="/login">
                <Button variant="accent" size="sm" className="gap-1.5 text-xs font-semibold">
                  <LogIn className="h-3.5 w-3.5" /> Sign In to Link Account
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Success toast if updated */}
        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Candidate Profile details updated successfully.
          </div>
        )}

        {/* Inline Edit Form Modal */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-[#0066FF]" /> Update ServiceNow Candidate Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Career Segment Track
                </label>
                <select
                  value={editForm.backgroundSegment || "servicenow_trainee"}
                  onChange={(e) =>
                    setEditForm({ ...editForm, backgroundSegment: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                >
                  <option value="servicenow_trainee">ServiceNow Trainee Fast-Track</option>
                  <option value="fresher">College Fresher Track</option>
                  <option value="career_switcher">Career Switcher Track</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Experience Level
                </label>
                <Input
                  value={editForm.experienceLevel || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, experienceLevel: e.target.value })
                  }
                  placeholder="e.g. 0 - 1 Year (Aspirant / Trainee)"
                  className="dark:bg-slate-900 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Webassessor / Candidate ID
                </label>
                <Input
                  value={editForm.webassessorId || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, webassessorId: e.target.value })
                  }
                  placeholder="e.g. KRY-984210"
                  className="dark:bg-slate-900 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  LinkedIn Profile URL
                </label>
                <Input
                  value={editForm.linkedInUrl || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, linkedInUrl: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="dark:bg-slate-900 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Portfolio / GitHub URL
                </label>
                <Input
                  value={editForm.portfolioUrl || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, portfolioUrl: e.target.value })
                  }
                  placeholder="https://github.com/username"
                  className="dark:bg-slate-900 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Bio / ServiceNow Aspirations
                </label>
                <Input
                  value={editForm.bio || ""}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Brief statement about your certification goals and ServiceNow expertise..."
                  className="dark:bg-slate-900 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" variant="accent" size="sm" className="gap-1.5 text-xs font-bold">
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Active Subscription & Certification Passes Vault */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#0066FF] dark:text-[#38BDF8]" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ServiceNow Certification Passes & Active Subscriptions
            </h2>
          </div>
          <Link href="/pricing" className="text-xs text-[#0066FF] dark:text-[#38BDF8] font-semibold hover:underline">
            View All Plans →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: CSA Pass */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="accent" className="text-[10px]">
                  Core Track
                </Badge>
                {isAuthenticated && isPro && (entitlement?.planId === "all_access" || entitlement?.certifications?.includes("csa")) ? (
                  <Badge variant="success" className="text-[10px] gap-1">
                    <Check className="h-3 w-3" /> Active Pass ({daysRemaining}d left)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] dark:border-slate-700 text-slate-400">
                    Free Starter (60 Qs Unlocked)
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Certified System Administrator (CSA)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete 85+ question vault, Australia & Brazil release syllabus updates, and 3-mode high-fidelity printable PDF exporter.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link href="/certifications/csa/practice">
                <Button variant="default" size="sm" className="text-xs font-semibold">
                  Open CSA Engine →
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="ghost" size="sm" className="text-xs text-[#0066FF] dark:text-[#38BDF8]">
                  View Telemetry
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 2: All-Access Pass */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="accent" className="text-[10px]">
                  Multi-Track
                </Badge>
                {isAuthenticated && isPro && entitlement?.planId === "all_access" ? (
                  <Badge variant="success" className="text-[10px] gap-1">
                    <Check className="h-3 w-3" /> Active Pass ({daysRemaining}d left)
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] dark:border-slate-700 text-slate-400">
                    All-Access Pass
                  </Badge>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                All-Access Certification Pass (CSA, CAD, CIS-DF, CIS-ITSM)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Full 1-year access across all 4 ServiceNow tracks: Administrator, Application Developer, Discovery Specialist, and ITSM Implementation.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {isAuthenticated && isPro && entitlement?.planId === "all_access" ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> All 4 Tracks Unlocked
                </span>
              ) : (
                <Link href="/pricing">
                  <Button variant="accent" size="sm" className="text-xs font-bold">
                    Upgrade to All-Access
                  </Button>
                </Link>
              )}
              <Link href="/certifications">
                <Button variant="ghost" size="sm" className="text-xs text-[#0066FF] dark:text-[#38BDF8]">
                  Browse Tracks
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. ServiceNow University Badges & Credentials System */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ServiceNow University Badges & Credentials
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {BADGES.filter((b) => b.isUnlocked).length} of {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                badge.isUnlocked
                  ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-2xs"
                  : "border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-60"
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                {badge.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {badge.title}
                  </h4>
                  {badge.isUnlocked ? (
                    <Badge variant="success" className="text-[9px] py-0 px-1">
                      Achieved
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] py-0 px-1 text-slate-400">
                      Locked
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ServiceNow Career Network & Recruitment Teaser */}
      <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/60 via-white to-blue-50/30 dark:from-[#131D31] dark:via-[#0E1524] dark:to-[#131D31] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-xs font-bold text-[#0066FF] dark:text-[#38BDF8]">
              <Building className="h-3.5 w-3.5" />
              ServiceNow Ecosystem Partner Talent Showcase
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Direct Placement & Partner Matchmaking
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              We connect candidates scoring 75%+ on NexusD diagnostic simulations with certified ServiceNow Elite & Premier partner firms hiring administrators, developers, and consultants across India, APAC, and Global centers.
            </p>
          </div>

          <div className="shrink-0 space-y-2">
            <Link href="/community">
              <Button variant="accent" size="lg" className="w-full gap-2 font-bold text-xs sm:text-sm shadow-sm cursor-pointer">
                Join ServiceNow Candidate Network <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 font-medium">
              Free inclusion for all certified aspirants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
