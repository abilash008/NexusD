export interface ExamDomain {
  slug: string;
  name: string;
  weight: number; // percentage weighting e.g. 20
}

export interface CertificationTrack {
  id: string; // e.g. "csa", "cad", "cis-df", "cis-itsm"
  code: string; // e.g. "CSA", "CAD"
  title: string; // e.g. "Certified System Administrator"
  shortDescription: string;
  releaseVersion: string; // e.g. "Australia & Brazil 2026"
  durationMinutes: number; // e.g. 90
  passingPercentage: number; // e.g. 70
  totalQuestions: number; // e.g. 60
  status: "active" | "draft" | "upcoming";
  priceINR: number; // e.g. 499
  domains: ExamDomain[];
  createdAt: string;
}

const CERTS_STORAGE_KEY = "nexusd_certifications_registry";

export const DEFAULT_CERTIFICATION_TRACKS: CertificationTrack[] = [
  {
    id: "csa",
    code: "CSA",
    title: "ServiceNow Certified System Administrator",
    shortDescription: "Foundational administration, schema architecture, workflow automation, and Next Experience configuration.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 70,
    totalQuestions: 60,
    status: "active",
    priceINR: 499,
    domains: [
      { slug: "ui-nav", name: "User Interface & Navigation", weight: 20 },
      { slug: "collaboration", name: "Collaboration & Task Management", weight: 20 },
      { slug: "db-admin", name: "Database Administration & Schema", weight: 30 },
      { slug: "automation", name: "Self-Service & Process Automation", weight: 20 },
      { slug: "development", name: "Introduction to Development", weight: 10 },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cad",
    code: "CAD",
    title: "ServiceNow Certified Application Developer",
    shortDescription: "Custom application design, data modeling, client/server scripting, Flow Designer, and REST API integrations.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 70,
    totalQuestions: 60,
    status: "active",
    priceINR: 499,
    domains: [
      { slug: "app-design", name: "Designing and Creating Applications", weight: 15 },
      { slug: "data-model", name: "Application Data Model & Security", weight: 25 },
      { slug: "app-automation", name: "Automating Application Logic & Flows", weight: 30 },
      { slug: "integration", name: "Scripting, REST APIs & Integration", weight: 20 },
      { slug: "ui-experience", name: "User Interface & Workspace Views", weight: 10 },
    ],
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "cis-df",
    code: "CIS-DF",
    title: "ServiceNow CIS - Data Foundations & Discovery",
    shortDescription: "ITOM architecture, Mid Server deployment, Discovery patterns, CMDB identification rules, and reconciliation.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 72,
    totalQuestions: 60,
    status: "upcoming",
    priceINR: 499,
    domains: [
      { slug: "discovery-setup", name: "Discovery Setup & Mid Servers", weight: 35 },
      { slug: "cmdb-schema", name: "CMDB Schema & Identification Rules", weight: 35 },
      { slug: "troubleshooting", name: "Diagnostics, Credentials & Schedules", weight: 30 },
    ],
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "cis-itsm",
    code: "CIS-ITSM",
    title: "ServiceNow CIS - IT Service Management",
    shortDescription: "Enterprise ITIL lifecycle, Incident, Change, Release, Problem Management, Service Catalog, and SLA benchmarks.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 75,
    totalQuestions: 60,
    status: "upcoming",
    priceINR: 499,
    domains: [
      { slug: "incident-mgmt", name: "Incident & Problem Architecture", weight: 30 },
      { slug: "change-mgmt", name: "Change & Release Management Workflows", weight: 30 },
      { slug: "service-catalog", name: "Service Catalog & Request Fulfillment", weight: 25 },
      { slug: "slm-metrics", name: "Service Level Management & Benchmarks", weight: 15 },
    ],
    createdAt: "2026-03-15T00:00:00.000Z",
  },
];

/**
 * Retrieves all registered certification tracks
 */
export function getAllCertifications(): CertificationTrack[] {
  if (typeof window === "undefined") {
    return DEFAULT_CERTIFICATION_TRACKS;
  }

  try {
    const raw = localStorage.getItem(CERTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CERTS_STORAGE_KEY, JSON.stringify(DEFAULT_CERTIFICATION_TRACKS));
      return DEFAULT_CERTIFICATION_TRACKS;
    }

    const customCerts: CertificationTrack[] = JSON.parse(raw);
    return customCerts;
  } catch (err) {
    console.error("Error reading certifications registry:", err);
    return DEFAULT_CERTIFICATION_TRACKS;
  }
}

/**
 * Saves or updates a certification track
 */
export function saveCertification(cert: CertificationTrack): void {
  if (typeof window === "undefined") return;

  try {
    const certs = getAllCertifications();
    const existingIndex = certs.findIndex((c) => c.id.toLowerCase() === cert.id.toLowerCase());

    if (existingIndex >= 0) {
      certs[existingIndex] = cert;
    } else {
      certs.push(cert);
    }

    localStorage.setItem(CERTS_STORAGE_KEY, JSON.stringify(certs));
    window.dispatchEvent(new CustomEvent("nexusd_certifications_updated", { detail: cert }));
  } catch (err) {
    console.error("Error saving certification track:", err);
  }
}

/**
 * Gets a specific certification by ID
 */
export function getCertificationById(certId: string): CertificationTrack | undefined {
  const certs = getAllCertifications();
  return certs.find((c) => c.id.toLowerCase() === certId.toLowerCase());
}

/**
 * Deletes or archives a certification
 */
export function deleteCertification(certId: string): void {
  if (typeof window === "undefined") return;

  try {
    const certs = getAllCertifications().filter((c) => c.id.toLowerCase() !== certId.toLowerCase());
    localStorage.setItem(CERTS_STORAGE_KEY, JSON.stringify(certs));
    window.dispatchEvent(new CustomEvent("nexusd_certifications_updated", { detail: { id: certId } }));
  } catch (err) {
    console.error("Error deleting certification:", err);
  }
}
