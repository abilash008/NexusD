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

const CERTS_STORAGE_KEY = "nexusd_certifications_registry_v3";

export const DEFAULT_CERTIFICATION_TRACKS: CertificationTrack[] = [
  {
    id: "csa",
    code: "CSA",
    title: "ServiceNow Certified System Administrator",
    shortDescription: "Platform navigation, instance configuration, application collaboration, self-service automation, database security, and data integration.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 70,
    totalQuestions: 60,
    status: "active",
    priceINR: 499,
    domains: [
      { slug: "platform-overview", name: "Platform Overview and Navigation", weight: 7 },
      { slug: "instance-config", name: "Instance Configuration", weight: 10 },
      { slug: "collaboration-apps", name: "Configuring Applications for Collaboration", weight: 20 },
      { slug: "self-service-automation", name: "Self-Service & Automation", weight: 20 },
      { slug: "database-security", name: "Database Management and Platform Security", weight: 30 },
      { slug: "data-migration-integration", name: "Data Migration and Integration", weight: 13 },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "cad",
    code: "CAD",
    title: "ServiceNow Certified Application Developer",
    shortDescription: "Designing scoped applications, user interface architecture, application security & ACLs, Flow Designer automation, external REST data, and application management.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 70,
    totalQuestions: 60,
    status: "active",
    priceINR: 499,
    domains: [
      { slug: "app-design", name: "Designing and Creating an Application", weight: 20 },
      { slug: "app-ui", name: "Application User Interface", weight: 20 },
      { slug: "security-access", name: "Security and Restricting Access", weight: 20 },
      { slug: "app-automation", name: "Application Automation", weight: 20 },
      { slug: "external-data", name: "Working with External Data", weight: 10 },
      { slug: "app-management", name: "Managing Applications", weight: 10 },
    ],
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "cis-df",
    code: "CIS-DF",
    title: "ServiceNow Certified Implementation Specialist - Data Foundations (CMDB and CSDM)",
    shortDescription: "Enterprise CMDB architecture, CSDM v4.0 governance, Identification and Reconciliation Engine (IRE), CMDB Health, Data Manager policies, and multi-source ingestion.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 70,
    totalQuestions: 75,
    status: "active",
    priceINR: 499,
    domains: [
      { slug: "govern", name: "Govern", weight: 35 },
      { slug: "insight", name: "Insight", weight: 20 },
      { slug: "ingest", name: "Ingest", weight: 19 },
      { slug: "configuration", name: "Configuration", weight: 15 },
      { slug: "csdm-fundamentals", name: "CSDM Fundamentals", weight: 11 },
    ],
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "cis-itsm",
    code: "CIS-ITSM",
    title: "ServiceNow Certified Implementation Specialist - IT Service Management",
    shortDescription: "Enterprise ITIL lifecycle, Incident Management, Change Management, Service Catalog & Request, Problem Management, Service Portfolio, and ITSM CMDB.",
    releaseVersion: "Australia & Brazil 2026",
    durationMinutes: 90,
    passingPercentage: 70,
    totalQuestions: 60,
    status: "active",
    priceINR: 499,
    domains: [
      { slug: "incident-mgmt", name: "Incident Management", weight: 25 },
      { slug: "change-mgmt", name: "Change Management", weight: 25 },
      { slug: "service-catalog", name: "Service Catalog and Request Management", weight: 25 },
      { slug: "problem-mgmt", name: "Problem Management", weight: 15 },
      { slug: "service-portfolio", name: "Service Portfolio Management", weight: 5 },
      { slug: "cmdb-itsm", name: "Configuration Management Database (CMDB)", weight: 5 },
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
