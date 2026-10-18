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
  Share2,
  Copy,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Download,
  CheckCheck,
  Target,
  Compass,
  Eye,
  Star,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useEntitlements } from "@/hooks/use-entitlements";

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear: string;
  cgpa?: string;
  highlights?: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  employmentType?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface CandidateProfileData {
  displayName?: string;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  backgroundSegment?: string;
  experienceLevel?: string;
  availabilityStatus?: "open_to_work" | "actively_interviewing" | "employed_open" | "learning_only";
  targetRoles?: string[];
  targetCertifications?: string[];
  skills?: string[];
  webassessorId?: string;
  nowLearningId?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  partnerShowcaseOptIn?: boolean;
}

const DEFAULT_PROFILE: CandidateProfileData = {
  displayName: "Vithi Sharma",
  headline: "ServiceNow Trainee | Certified System Administrator (CSA) Aspirant | B.Tech CSE",
  bio: "Dedicated ServiceNow aspirant preparing for the Certified System Administrator (CSA) and CAD certifications. Strong foundation in Flow Designer, UI Policies, Business Rules, Client Scripting, and ITIL 4 service desk workflows.",
  location: "Bengaluru, Karnataka, India",
  phone: "+91 98765 43210",
  backgroundSegment: "servicenow_trainee",
  experienceLevel: "0 - 1 Year (Aspirant / Trainee)",
  availabilityStatus: "open_to_work",
  targetRoles: [
    "ServiceNow System Administrator",
    "Junior ServiceNow Developer",
    "Technical Support Engineer",
  ],
  targetCertifications: ["CSA", "CAD"],
  skills: [
    "Flow Designer",
    "Business Rules",
    "Client Scripts",
    "Service Catalog",
    "UI Policies & Actions",
    "GlideRecord & GlideSystem",
    "Incident & Change Management",
    "CMDB Basics",
    "Next Experience UI",
    "REST Integration",
  ],
  webassessorId: "KRY-984210",
  nowLearningId: "NL-741920",
  linkedInUrl: "https://linkedin.com/in/vithi-sharma-servicenow",
  portfolioUrl: "https://github.com/vithi-sharma",
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology (B.Tech)",
      institution: "Vellore Institute of Technology (VIT)",
      fieldOfStudy: "Computer Science & Engineering",
      startYear: "2021",
      endYear: "2025",
      cgpa: "8.8 / 10.0 CGPA",
      highlights: "Coursework in Database Systems, Cloud Computing, Object-Oriented Java, Operating Systems, and Relational Schema Architecture.",
    },
  ],
  experience: [
    {
      id: "exp-1",
      title: "ServiceNow Platform Intern",
      company: "Cognizant Technology Solutions",
      employmentType: "Internship",
      location: "Bengaluru (Hybrid)",
      startDate: "Jan 2025",
      endDate: "Present",
      isCurrent: true,
      description: "Configured catalog items, variable sets, and Flow Designer subflows. Developed client-side validation scripts and tested Australia & Brazil release standards on Personal Developer Instances (PDIs).",
    },
  ],
  partnerShowcaseOptIn: true,
};

export default function CandidateProfilePage() {
  const { data: session, status: authStatus } = useSession();
  const { isPro, entitlement, daysRemaining } = useEntitlements();

  const [profile, setProfile] = useState<CandidateProfileData>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<"overview" | "education" | "experience" | "skills" | "credentials">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editModalTab, setEditModalTab] = useState<"basic" | "education" | "experience" | "skills" | "links">("basic");
  const [editForm, setEditForm] = useState<CandidateProfileData>(DEFAULT_PROFILE);

  const [newSkillInput, setNewSkillInput] = useState("");
  const [newRoleInput, setNewRoleInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load candidate profile from localStorage or defaults, and sync with session
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nexusd_profile");
      if (stored) {
        const parsed = JSON.parse(stored) as CandidateProfileData;
        const merged: CandidateProfileData = {
          ...DEFAULT_PROFILE,
          ...parsed,
          displayName: session?.user?.name || parsed.displayName || DEFAULT_PROFILE.displayName,
        };
        setProfile(merged);
        setEditForm(merged);
      } else {
        const initial: CandidateProfileData = {
          ...DEFAULT_PROFILE,
          displayName: session?.user?.name || DEFAULT_PROFILE.displayName,
        };
        setProfile(initial);
        setEditForm(initial);
        localStorage.setItem("nexusd_profile", JSON.stringify(initial));
      }
    } catch (e) {
      // Fallback
    }
  }, [session]);

  // Save profile changes locally and sync to cloud if authenticated
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem("nexusd_profile", JSON.stringify(editForm));
      setProfile(editForm);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      // Async sync to cloud endpoint if signed in
      if (session?.user) {
        fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            backgroundSegment: editForm.backgroundSegment,
            targetRoles: editForm.targetRoles,
            targetSpecializations: editForm.targetCertifications,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const handleCopyProfileLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {}
  };

  const handlePrintProfile = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Add / Remove Education helpers
  const handleAddEducation = () => {
    const newEdu: EducationEntry = {
      id: `edu-${Date.now()}`,
      degree: "Degree / Diploma",
      institution: "Institution / University",
      endYear: new Date().getFullYear().toString(),
    };
    const updated = [...(editForm.education || []), newEdu];
    setEditForm({ ...editForm, education: updated });
  };

  const handleRemoveEducation = (id: string) => {
    const updated = (editForm.education || []).filter((e) => e.id !== id);
    setEditForm({ ...editForm, education: updated });
  };

  // Add / Remove Experience helpers
  const handleAddExperience = () => {
    const newExp: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      title: "ServiceNow Role / Intern",
      company: "Company Name",
      startDate: "2025",
      endDate: "Present",
      isCurrent: true,
    };
    const updated = [...(editForm.experience || []), newExp];
    setEditForm({ ...editForm, experience: updated });
  };

  const handleRemoveExperience = (id: string) => {
    const updated = (editForm.experience || []).filter((e) => e.id !== id);
    setEditForm({ ...editForm, experience: updated });
  };

  // Skills tag helpers
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const currentSkills = editForm.skills || [];
    if (!currentSkills.includes(newSkillInput.trim())) {
      setEditForm({ ...editForm, skills: [...currentSkills, newSkillInput.trim()] });
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setEditForm({
      ...editForm,
      skills: (editForm.skills || []).filter((s) => s !== skill),
    });
  };

  // Target Roles tag helpers
  const handleAddRole = () => {
    if (!newRoleInput.trim()) return;
    const currentRoles = editForm.targetRoles || [];
    if (!currentRoles.includes(newRoleInput.trim())) {
      setEditForm({ ...editForm, targetRoles: [...currentRoles, newRoleInput.trim()] });
    }
    setNewRoleInput("");
  };

  const handleRemoveRole = (role: string) => {
    setEditForm({
      ...editForm,
      targetRoles: (editForm.targetRoles || []).filter((r) => r !== role),
    });
  };

  // Calculate Profile Completeness Score (Gamified Meter)
  const calculateCompleteness = () => {
    let score = 0;
    if (profile.displayName && profile.headline) score += 20;
    if (profile.bio && profile.location) score += 15;
    if (profile.education && profile.education.length > 0) score += 20;
    if (profile.experience && profile.experience.length > 0) score += 15;
    if (profile.skills && profile.skills.length >= 4) score += 15;
    if (profile.webassessorId || profile.nowLearningId) score += 15;
    return Math.min(100, score);
  };

  const completenessScore = calculateCompleteness();

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

  const getAvailabilityBadge = (status?: string) => {
    switch (status) {
      case "open_to_work":
        return { label: "Open to Opportunities", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800" };
      case "actively_interviewing":
        return { label: "Actively Interviewing", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800" };
      case "employed_open":
        return { label: "Employed • Open to Offers", color: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800" };
      default:
        return { label: "Upskilling & Learning", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700" };
    }
  };

  const availBadge = getAvailabilityBadge(profile.availabilityStatus);
  const displayName = profile.displayName || session?.user?.name || "ServiceNow Candidate";
  const displayEmail = session?.user?.email || "candidate@nexusd.in";

  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isAuthenticated = authStatus === "authenticated" && Boolean(session?.user);

  // Digital University Badges
  const BADGES = [
    {
      id: "csa_pioneer",
      title: "CSA Blueprint Aligned",
      description: "Demonstrated competency across all 5 official CSA examination domains.",
      icon: "🏅",
      isUnlocked: true,
      category: "Blueprint",
    },
    {
      id: "aus_brazil",
      title: "Australia & Brazil Sync",
      description: "Verified on the latest Australia & Brazil release syllabus standards.",
      icon: "🛡️",
      isUnlocked: true,
      category: "Release",
    },
    {
      id: "pro_pass",
      title: "Pro Candidate Vault",
      description: "Holds active certification pass with full question bank and PDF export access.",
      icon: "💎",
      isUnlocked: Boolean(isAuthenticated && isPro),
      category: "Credential",
    },
    {
      id: "velocity_master",
      title: "Mock Velocity Master",
      description: "Completed full 90-minute timed simulation within official exam pacing.",
      icon: "⚡",
      isUnlocked: true,
      category: "Simulation",
    },
    {
      id: "benchmark_70",
      title: "70% Pass Benchmark",
      description: "Achieved the official 70% passing standard on diagnostic mock exams.",
      icon: "🎯",
      isUnlocked: true,
      category: "Benchmark",
    },
    {
      id: "doc_scholar",
      title: "Now Docs Scholar",
      description: "Cross-referenced official ServiceNow Product Documentation architecture.",
      icon: "📜",
      isUnlocked: true,
      category: "Research",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. Candidate Hero Identity Card with Modern Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-sm overflow-hidden">
        {/* Cover Pattern Header */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-[#0B192C] via-[#0066FF] to-[#38BDF8] relative p-6 flex items-start justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
            <Compass className="h-3.5 w-3.5" />
            ServiceNow Candidate Portfolio
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyProfileLink}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs backdrop-blur-md gap-1.5 cursor-pointer"
            >
              {copiedLink ? <CheckCheck className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              {copiedLink ? "Link Copied!" : "Share Profile"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintProfile}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs backdrop-blur-md gap-1.5 cursor-pointer hidden sm:flex"
            >
              <Download className="h-3.5 w-3.5" /> Print / PDF
            </Button>
          </div>
        </div>

        {/* Profile Info Row with Overlapping Avatar */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Avatar & Core Metadata */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative group">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-gradient-to-tr from-[#0066FF] to-[#38BDF8] border-4 border-white dark:border-[#131D31] flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xl shrink-0">
                  {userInitials || "SC"}
                </div>
                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131D31]" title="Active Status" />
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {displayName}
                  </h1>
                  <Badge variant="accent" className="text-xs font-bold gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified Candidate
                  </Badge>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${availBadge.color}`}>
                    {availBadge.label}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug max-w-2xl">
                  {profile.headline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {profile.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {displayEmail}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <GraduationCap className="h-3.5 w-3.5 text-[#0066FF]" />
                    {getSegmentLabel(profile.backgroundSegment)}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              <Button
                variant="accent"
                onClick={() => {
                  setEditForm(profile);
                  setIsEditing(true);
                }}
                className="gap-2 text-xs font-bold shadow-sm cursor-pointer"
              >
                <Edit3 className="h-4 w-4" /> Edit Profile
              </Button>

              {!isAuthenticated && (
                <Link href="/login">
                  <Button variant="outline" className="gap-1.5 text-xs dark:border-slate-700">
                    <LogIn className="h-3.5 w-3.5" /> Sign In to Sync
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Verification Pills & External Links Row */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              {profile.webassessorId && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0066FF] dark:text-[#38BDF8] font-mono text-[11px] font-bold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Webassessor ID: {profile.webassessorId}
                </div>
              )}
              {profile.nowLearningId && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Now Learning: {profile.nowLearningId}
                </div>
              )}
              {isAuthenticated && isPro && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  {entitlement?.planId === "all_access" ? "2-Year All-Access Pass Active" : "Pro Pass Active"} ({daysRemaining}d)
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {profile.linkedInUrl && (
                <a
                  href={profile.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-[#0066FF] transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> LinkedIn
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-[#0066FF] transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> GitHub / Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Gamified Profile Completeness Meter (Top EdTech standard) */}
      <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#0066FF] dark:text-[#38BDF8]">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Profile Completeness:</span>
                <span className="font-mono text-[#0066FF] dark:text-[#38BDF8]">{completenessScore}%</span>
                <Badge variant={completenessScore >= 80 ? "success" : "warning"} className="text-[10px] py-0 px-1.5">
                  {completenessScore >= 80 ? "All-Star Candidate" : "Intermediate"}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {completenessScore >= 90
                  ? "Your profile is fully optimized for ServiceNow Elite Partner recruiter searches."
                  : "Complete education, experience, and Now Learning credentials to unlock priority recruiter visibility."}
              </p>
            </div>
          </div>

          {completenessScore < 100 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditForm(profile);
                setIsEditing(true);
              }}
              className="text-xs shrink-0 dark:border-slate-700"
            >
              Complete Missing Sections →
            </Button>
          )}
        </div>

        <Progress value={completenessScore} className="h-2" />
      </Card>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" /> Candidate Profile details updated and saved successfully!
        </div>
      )}

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto">
        {[
          { key: "overview", label: "Overview & Bio", icon: User },
          { key: "education", label: `Education (${profile.education?.length || 0})`, icon: GraduationCap },
          { key: "experience", label: `Experience (${profile.experience?.length || 0})`, icon: Briefcase },
          { key: "skills", label: `Skills (${profile.skills?.length || 0})`, icon: Layers },
          { key: "credentials", label: "Credentials & Badges", icon: Award },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-[#0066FF] text-[#0066FF] dark:text-[#38BDF8]"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Panels */}
      {/* TAB 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Executive Bio Card */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-[#0066FF]" /> About Candidate
                </h3>
                <button
                  onClick={() => {
                    setEditForm(profile);
                    setEditModalTab("basic");
                    setIsEditing(true);
                  }}
                  className="text-xs text-[#0066FF] dark:text-[#38BDF8] hover:underline font-semibold"
                >
                  Edit Bio
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {profile.bio || "No candidate bio provided yet."}
              </p>
            </Card>

            {/* Target Roles & Certifications */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-[#0066FF]" /> Target ServiceNow Roles & Aspirations
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.targetRoles && profile.targetRoles.length > 0 ? (
                  profile.targetRoles.map((role) => (
                    <Badge key={role} variant="accent" className="text-xs py-1 px-3">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No target roles listed.</span>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Target Exam Tracks:
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.targetCertifications?.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs py-1 px-3 dark:border-slate-700">
                      ServiceNow {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Experience Preview */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#0066FF]" /> Recent Experience
                </h3>
                <button
                  onClick={() => setActiveTab("experience")}
                  className="text-xs text-[#0066FF] hover:underline font-semibold"
                >
                  View All ({profile.experience?.length || 0}) →
                </button>
              </div>

              {profile.experience && profile.experience.length > 0 ? (
                <div className="space-y-4">
                  {profile.experience.slice(0, 2).map((exp) => (
                    <div key={exp.id} className="border-l-2 border-blue-200 dark:border-blue-900 pl-4 space-y-1">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {exp.title} • {exp.company}
                      </div>
                      <div className="text-xs text-slate-500">
                        {exp.startDate} - {exp.endDate} {exp.location ? `• ${exp.location}` : ""}
                      </div>
                      {exp.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 line-clamp-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No experience added yet.</p>
              )}
            </Card>
          </div>

          {/* Right Rail: Quick Stats & Partner Showcase */}
          <div className="space-y-6">
            {/* Quick Readiness Widget */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Certification Telemetry</span>
                <Clock className="h-4 w-4 text-[#0066FF]" />
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Active Syllabus:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Australia & Brazil 2026</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Passing Benchmark:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">70% Required</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Account Type:</span>
                  <span className="font-bold text-[#0066FF] dark:text-[#38BDF8]">
                    {isAuthenticated && isPro ? "Pro Member" : "Free Starter"}
                  </span>
                </div>
              </div>

              <Link href="/dashboard" className="block pt-1">
                <Button variant="outline" className="w-full text-xs font-semibold dark:border-slate-700">
                  Open Learning Dashboard →
                </Button>
              </Link>
            </Card>

            {/* Recruiter Placement Showcase Card */}
            <Card className="p-6 border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-[#0066FF]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Partner Talent Showcase
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your profile is set to <strong>Verified Public</strong> for certified ServiceNow Elite & Premier partner firms hiring across India & APAC.
              </p>
              <div className="pt-1">
                <Badge variant="success" className="text-[10px] gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Live on Recruiter Showcase
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: Education */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Education & Academic Qualifications
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Degrees, universities, specializations, and academic performance.
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setEditForm(profile);
                setEditModalTab("education");
                setIsEditing(true);
              }}
              className="gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add / Edit Education
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {profile.education && profile.education.length > 0 ? (
              profile.education.map((edu) => (
                <Card
                  key={edu.id}
                  className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-[#0066FF]" />
                        {edu.degree}
                      </h3>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {edu.institution} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span>{edu.startYear ? `${edu.startYear} - ` : ""}{edu.endYear}</span>
                      {edu.cgpa && (
                        <Badge variant="accent" className="text-[10px] font-bold">
                          {edu.cgpa}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {edu.highlights && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {edu.highlights}
                    </p>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center space-y-3 border-dashed border-slate-300 dark:border-slate-700">
                <GraduationCap className="h-8 w-8 mx-auto text-slate-400" />
                <p className="text-xs text-slate-500">No education entries added yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditForm(profile);
                    setEditModalTab("education");
                    setIsEditing(true);
                  }}
                  className="text-xs"
                >
                  Add Your Degree
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Experience */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Work Experience & Internships
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ServiceNow and technical industry experience, internships, and platform contributions.
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              onClick={() => {
                setEditForm(profile);
                setEditModalTab("experience");
                setIsEditing(true);
              }}
              className="gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add / Edit Experience
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {profile.experience && profile.experience.length > 0 ? (
              profile.experience.map((exp) => (
                <Card
                  key={exp.id}
                  className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-[#0066FF]" />
                        {exp.title}
                      </h3>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {exp.company} {exp.employmentType ? `• ${exp.employmentType}` : ""} {exp.location ? `• ${exp.location}` : ""}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
                      {exp.startDate} - {exp.endDate}
                    </Badge>
                  </div>

                  {exp.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {exp.description}
                    </p>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center space-y-3 border-dashed border-slate-300 dark:border-slate-700">
                <Briefcase className="h-8 w-8 mx-auto text-slate-400" />
                <p className="text-xs text-slate-500">No experience records added yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditForm(profile);
                    setEditModalTab("experience");
                    setIsEditing(true);
                  }}
                  className="text-xs"
                >
                  Add Experience
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Skills Matrix */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Technical Skills & Competency Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Core ServiceNow development, administration, flow building, and scripting proficiencies.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditForm(profile);
                setEditModalTab("skills");
                setIsEditing(true);
              }}
              className="gap-1.5 text-xs dark:border-slate-700"
            >
              <Edit3 className="h-3.5 w-3.5" /> Manage Skills
            </Button>
          </div>

          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-xs space-y-4">
            <div className="flex flex-wrap gap-2.5">
              {profile.skills?.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-2xs"
                >
                  <Check className="h-3.5 w-3.5 text-[#0066FF]" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 5: Credentials & Badges */}
      {activeTab === "credentials" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              ServiceNow Badges & Official Certifications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified examination credentials, platform achievements, and syllabus milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BADGES.map((badge) => (
              <Card
                key={badge.id}
                className={`p-5 border transition-all flex items-start gap-3.5 ${
                  badge.isUnlocked
                    ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131D31] shadow-2xs"
                    : "border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-60"
                }`}
              >
                <div className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {badge.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {badge.title}
                    </h4>
                    {badge.isUnlocked ? (
                      <Badge variant="success" className="text-[9px] py-0 px-1.5">
                        Achieved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-slate-400">
                        Locked
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 5. Comprehensive "Edit Profile" Interactive Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-[#0066FF]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Edit Candidate Profile
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              {[
                { key: "basic", label: "Basic Info" },
                { key: "education", label: "Education" },
                { key: "experience", label: "Experience" },
                { key: "skills", label: "Skills & Targets" },
                { key: "links", label: "Ecosystem IDs & Links" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEditModalTab(key as any)}
                  className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    editModalTab === key
                      ? "border-[#0066FF] text-[#0066FF] dark:text-[#38BDF8]"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* TAB A: Basic Info */}
              {editModalTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Full Display Name
                      </label>
                      <Input
                        value={editForm.displayName || ""}
                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                        placeholder="e.g. Vithi Sharma"
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Location (City, Country)
                      </label>
                      <Input
                        value={editForm.location || ""}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="e.g. Bengaluru, Karnataka, India"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Professional Headline
                    </label>
                    <Input
                      value={editForm.headline || ""}
                      onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                      placeholder="e.g. ServiceNow Trainee | Certified System Administrator Aspirant | B.Tech CSE"
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Career Segment Track
                      </label>
                      <select
                        value={editForm.backgroundSegment || "servicenow_trainee"}
                        onChange={(e) => setEditForm({ ...editForm, backgroundSegment: e.target.value })}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                      >
                        <option value="servicenow_trainee">ServiceNow Trainee Fast-Track</option>
                        <option value="fresher">College Fresher Track</option>
                        <option value="career_switcher">Career Switcher Track</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Availability Status
                      </label>
                      <select
                        value={editForm.availabilityStatus || "open_to_work"}
                        onChange={(e) => setEditForm({ ...editForm, availabilityStatus: e.target.value as any })}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                      >
                        <option value="open_to_work">Open to Opportunities</option>
                        <option value="actively_interviewing">Actively Interviewing</option>
                        <option value="employed_open">Employed • Open to Offers</option>
                        <option value="learning_only">Upskilling & Learning</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      About Candidate / Bio
                    </label>
                    <textarea
                      rows={4}
                      value={editForm.bio || ""}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Share your technical background, ServiceNow journey, and career goals..."
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* TAB B: Education */}
              {editModalTab === "education" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Academic Credentials
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddEducation}
                      className="text-xs gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Degree
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {editForm.education?.map((edu, idx) => (
                      <div
                        key={edu.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Degree #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(edu.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            placeholder="Degree (e.g. B.Tech Computer Science)"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...(editForm.education || [])];
                              updated[idx].degree = e.target.value;
                              setEditForm({ ...editForm, education: updated });
                            }}
                            className="text-xs"
                          />
                          <Input
                            placeholder="Institution / College Name"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...(editForm.education || [])];
                              updated[idx].institution = e.target.value;
                              setEditForm({ ...editForm, education: updated });
                            }}
                            className="text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            placeholder="Start Year (2021)"
                            value={edu.startYear || ""}
                            onChange={(e) => {
                              const updated = [...(editForm.education || [])];
                              updated[idx].startYear = e.target.value;
                              setEditForm({ ...editForm, education: updated });
                            }}
                            className="text-xs"
                          />
                          <Input
                            placeholder="Graduation Year (2025)"
                            value={edu.endYear}
                            onChange={(e) => {
                              const updated = [...(editForm.education || [])];
                              updated[idx].endYear = e.target.value;
                              setEditForm({ ...editForm, education: updated });
                            }}
                            className="text-xs"
                          />
                          <Input
                            placeholder="CGPA / Grade (e.g. 8.8 / 10)"
                            value={edu.cgpa || ""}
                            onChange={(e) => {
                              const updated = [...(editForm.education || [])];
                              updated[idx].cgpa = e.target.value;
                              setEditForm({ ...editForm, education: updated });
                            }}
                            className="text-xs"
                          />
                        </div>

                        <Input
                          placeholder="Relevant Coursework / Specializations..."
                          value={edu.highlights || ""}
                          onChange={(e) => {
                            const updated = [...(editForm.education || [])];
                            updated[idx].highlights = e.target.value;
                            setEditForm({ ...editForm, education: updated });
                          }}
                          className="text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB C: Experience */}
              {editModalTab === "experience" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Work & Internship Experience
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddExperience}
                      className="text-xs gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Experience
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {editForm.experience?.map((exp, idx) => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            Role #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            placeholder="Job Title (e.g. ServiceNow Platform Intern)"
                            value={exp.title}
                            onChange={(e) => {
                              const updated = [...(editForm.experience || [])];
                              updated[idx].title = e.target.value;
                              setEditForm({ ...editForm, experience: updated });
                            }}
                            className="text-xs"
                          />
                          <Input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...(editForm.experience || [])];
                              updated[idx].company = e.target.value;
                              setEditForm({ ...editForm, experience: updated });
                            }}
                            className="text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Duration (e.g. Jan 2025 - Present)"
                            value={exp.startDate ? `${exp.startDate} - ${exp.endDate || "Present"}` : ""}
                            onChange={(e) => {
                              const updated = [...(editForm.experience || [])];
                              updated[idx].startDate = e.target.value;
                              setEditForm({ ...editForm, experience: updated });
                            }}
                            className="text-xs"
                          />
                          <Input
                            placeholder="Location / Type (e.g. Bengaluru / Hybrid)"
                            value={exp.location || ""}
                            onChange={(e) => {
                              const updated = [...(editForm.experience || [])];
                              updated[idx].location = e.target.value;
                              setEditForm({ ...editForm, experience: updated });
                            }}
                            className="text-xs"
                          />
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Key ServiceNow projects, modules, and achievements..."
                          value={exp.description || ""}
                          onChange={(e) => {
                            const updated = [...(editForm.experience || [])];
                            updated[idx].description = e.target.value;
                            setEditForm({ ...editForm, experience: updated });
                          }}
                          className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB D: Skills & Targets */}
              {editModalTab === "skills" && (
                <div className="space-y-6">
                  {/* Skills Tag Input */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 dark:text-slate-200">
                      Technical Skills (Tag list)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add skill (e.g. Flow Designer, GlideRecord, Business Rules)..."
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleAddSkill}
                        className="text-xs shrink-0"
                      >
                        Add Skill
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {editForm.skills?.map((s) => (
                        <div
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0066FF] dark:text-[#38BDF8] text-xs font-semibold flex items-center gap-1.5"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(s)}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target Roles Tag Input */}
                  <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="font-bold text-slate-800 dark:text-slate-200">
                      Target ServiceNow Roles
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add target role (e.g. ServiceNow Admin, Implementation Consultant)..."
                        value={newRoleInput}
                        onChange={(e) => setNewRoleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddRole();
                          }
                        }}
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleAddRole}
                        className="text-xs shrink-0"
                      >
                        Add Role
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {editForm.targetRoles?.map((r) => (
                        <div
                          key={r}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <span>{r}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(r)}
                            className="hover:text-red-500 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB E: Ecosystem Links */}
              {editModalTab === "links" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Webassessor Candidate ID
                      </label>
                      <Input
                        placeholder="e.g. KRY-984210"
                        value={editForm.webassessorId || ""}
                        onChange={(e) => setEditForm({ ...editForm, webassessorId: e.target.value })}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Now Learning Profile ID
                      </label>
                      <Input
                        placeholder="e.g. NL-741920"
                        value={editForm.nowLearningId || ""}
                        onChange={(e) => setEditForm({ ...editForm, nowLearningId: e.target.value })}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      LinkedIn Profile URL
                    </label>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      value={editForm.linkedInUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, linkedInUrl: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      GitHub or Portfolio Website URL
                    </label>
                    <Input
                      placeholder="https://github.com/username"
                      value={editForm.portfolioUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, portfolioUrl: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Changes save locally and sync to your NexusD profile.
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    className="gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" /> Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
