"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { NexusLogo } from "@/components/brand/nexus-logo";

export function Footer() {
  const pathname = usePathname();

  // Do not render public footer on admin CMS or admin gateway
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block bg-white/90 dark:bg-transparent rounded-lg p-1 shadow-2xs">
              <NexusLogo size="sm" />
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The dedicated career acceleration and certification enablement platform for the ServiceNow ecosystem. Built for freshers, switchers, and developers.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <Mail className="h-3.5 w-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
              <a href="mailto:contact@nexusd.in" className="hover:underline">
                contact@nexusd.in
              </a>
            </div>
          </div>

          {/* Certification Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Certifications
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/certifications" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
                  Certified System Administrator (CSA)
                </Link>
              </li>
              <li>
                <Link href="/certifications/cad" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
                  Certified Application Developer (CAD)
                </Link>
              </li>
              <li>
                <Link href="/certifications/cis-df" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
                  CIS — Data Foundations (CMDB & CSDM)
                </Link>
              </li>
              <li>
                <Link href="/certifications/cis-itsm" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
                  CIS — IT Service Management (ITSM)
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform & Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pricing" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
                  Pricing Plans & Passes
                </Link>
              </li>
              <li>
                <Link href="/study" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
                  Study Blueprints & Question Bank
                </Link>
              </li>
              <li>
                <a href="mailto:support@nexusd.in" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
                  Helpdesk & Support (support@nexusd.in)
                </a>
              </li>
              <li>
                <a href="mailto:talent-acquisition@nexusd.in" className="hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors">
                  Talent Acquisition (talent-acquisition@nexusd.in)
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Disclaimer
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              NexusD is an independent educational platform. ServiceNow, Now Platform, and associated trademarks are registered trademarks of ServiceNow, Inc. NexusD practice exams are independent study materials aligned to public exam blueprints.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© 2026 NexusD (nexusd.in). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Serverless • Zero Latency • Pure TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
