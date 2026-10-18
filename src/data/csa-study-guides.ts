export interface DomainTopicSection {
  title: string;
  summary: string;
  keyPoints: string[];
  examTips: string;
  pitfalls?: string;
}

export interface DomainStudyGuide {
  slug: string;
  name: string;
  weight: number;
  questionCount: number;
  overview: string;
  releaseNotes: string;
  topics: DomainTopicSection[];
  keyTerminology: { term: string; definition: string }[];
  practiceUrl: string;
}

// ============================================================================
// CSA — Certified System Administrator Study Guides (KB0011554)
// ============================================================================
export const CSA_STUDY_GUIDES: DomainStudyGuide[] = [
  {
    slug: "platform-overview",
    name: "Platform Overview and Navigation",
    weight: 7,
    questionCount: 4,
    overview:
      "Evaluates core understanding of ServiceNow architecture, multi-instance model, Next Experience Unified Navigation, and contextual navigation headers.",
    releaseNotes:
      "Aligned with Australia & Brazil releases, featuring Next Experience Unified Navigation, All menu, Workspaces, and Favorites pinned headers.",
    topics: [
      {
        title: "Next Experience Unified Navigation",
        summary:
          "The unified primary navigation header providing access to menus, global search, and contextual workspace features.",
        keyPoints: [
          "All Menu: Houses the full Application Navigator containing all application modules and tables accessible to the user.",
          "Favorites Menu: Stores pinned records, lists, dashboards, and modules customized by the individual user.",
          "History Menu: Stores up to 30 of the most recently visited records, lists, and forms.",
          "Workspaces Menu: Dedicated multi-tab operational consoles (e.g., Service Operations Workspace).",
          "Contextual App Bar: Displays application-specific actions, tabs, and notifications on the current active view.",
        ],
        examTips:
          "Remember that the History menu stores exactly 30 items by default. The All menu replaces the legacy UI16 left sidebar.",
        pitfalls:
          "Do not confuse Workspaces with Dashboards. Workspaces are interactive, tabbed multi-record operational agent consoles.",
      },
    ],
    keyTerminology: [
      { term: "Next Experience", definition: "ServiceNow's unified modern design system and web framework." },
      { term: "All Menu", definition: "The unified navigation dropdown containing all modules and applications." },
      { term: "Contextual App Bar", definition: "Dynamic toolbar showing actions relevant to the current screen." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=platform-overview",
  },
  {
    slug: "instance-config",
    name: "Instance Configuration",
    weight: 10,
    questionCount: 6,
    overview:
      "Installing plugins and Store applications, personalizing user preferences, company branding, and instance-wide system configuration properties.",
    releaseNotes:
      "Features modern ServiceNow Store auto-updates, Application Manager, and Guided Setup.",
    topics: [
      {
        title: "System Properties & Branding",
        summary:
          "Customizing instance appearance, logos, banner text, timezones, and system settings.",
        keyPoints: [
          "Basic Configuration UI16 / Theme Builder: Configures header logos, page titles, and color palettes.",
          "System Properties [sys_properties]: Stores platform-wide configuration key-value flags.",
          "Plugins & ServiceNow Store: Enables modular functionality without code rewrite.",
        ],
        examTips:
          "Personalizing settings changes preferences only for the current user profile; System Properties change settings for all users.",
      },
    ],
    keyTerminology: [
      { term: "System Properties", definition: "Instance-wide settings stored in the [sys_properties] table." },
      { term: "Guided Setup", definition: "Step-by-step wizard assisting administrators in configuring applications." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=instance-config",
  },
  {
    slug: "collaboration-apps",
    name: "Configuring Applications for Collaboration",
    weight: 20,
    questionCount: 12,
    overview:
      "Lists, filters, breadcrumbs, form anatomy, Form Designer, Visual Task Boards (VTBs), Visualizations, Dashboards, Platform Analytics, and Notifications.",
    releaseNotes:
      "Covers Next Experience Form Designer, Platform Analytics Workspace, and visual data-driven VTBs.",
    topics: [
      {
        title: "Lists, Filters & Breadcrumbs",
        summary: "Viewing, filtering, and organizing records in tabular list views.",
        keyPoints: [
          "Filter Anatomy: Field (column), Operator (e.g. 'is', 'contains'), and Value.",
          "Breadcrumbs: Hierarchical visual query paths above lists; clicking a segment trims conditions backward.",
          "Quick Navigation: '[table].list' opens in current tab; '[table].LIST' opens in a new tab.",
          "List Actions: Context menus (right-click headers), List Mechanics gear, and search filters.",
        ],
        examTips: "Breadcrumbs evaluate from left to right as an AND query hierarchy.",
      },
      {
        title: "Forms, Form Designer & Visual Task Boards",
        summary: "Configuring record layouts, form sections, formatters, and Kanban boards.",
        keyPoints: [
          "Form Designer: Visual drag-and-drop tool to arrange fields, create 1 or 2-column sections, and add formatters.",
          "VTB Types: Freeform (manual cards), Flexible (lane mapped to choice field), and Data-Driven (strictly bound to state/choice).",
          "Activity Stream: Chronicled formatter showing work notes, customer comments, timestamps, and field updates.",
        ],
        examTips: "Know the three VTB types: Freeform, Flexible, and Data-Driven.",
      },
    ],
    keyTerminology: [
      { term: "Breadcrumbs", definition: "Hierarchical filter trail displayed at the top of list views." },
      { term: "Form Designer", definition: "Drag-and-drop visual interface to configure forms, sections, and fields." },
      { term: "Data-Driven VTB", definition: "Kanban board synchronized directly to a task table choice column." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=collaboration-apps",
  },
  {
    slug: "self-service-automation",
    name: "Self-Service & Automation",
    weight: 20,
    questionCount: 12,
    overview:
      "Knowledge Management architecture, Service Catalog components (Record Producers, Order Guides, Variables), Flow Designer, and Virtual Agent.",
    releaseNotes:
      "Emphasizes Workflow Studio, Flow Designer natural language actions, and conversational Service Operations Workspace.",
    topics: [
      {
        title: "Knowledge Management",
        summary: "Organizing, publishing, versioning, and securing organizational knowledge articles.",
        keyPoints: [
          "Hierarchy: Knowledge Bases → Categories → Articles.",
          "Security: User Criteria determines 'Can Read' and 'Can Contribute' permissions at the KB level.",
          "Workflows: Default workflows govern review, instant publish, or retirement.",
        ],
        examTips: "User Criteria controls Knowledge Base access, NOT standard ACLs.",
      },
      {
        title: "Service Catalog & Request Fulfillment",
        summary: "Ordering hardware, software, services, and submitting task requests via the catalog.",
        keyPoints: [
          "Catalog Items: Discrete requestable goods or services resulting in REQ → RITM → SCTASK.",
          "Record Producers: End-user forms that insert records directly into task tables (e.g. Incident, Change).",
          "Order Guides: Bundles multiple related catalog items into a unified checkout wizard (e.g. Employee Onboarding).",
          "Variable Sets: Reusable collections of variables shared across multiple catalog items.",
        ],
        examTips: "Record Producers create task records (like Incident); standard Catalog Items create REQ/RITM/SCTASK.",
      },
      {
        title: "Flow Designer & Workflow Studio",
        summary: "Natural language, trigger-action automation engine replacing legacy graphical workflows.",
        keyPoints: [
          "Trigger: Determines when a flow runs (Record Created/Updated, Scheduled, or REST).",
          "Actions: Discrete reusable units of work (e.g. Ask for Approval, Create Task, Send Email).",
          "Data Pill Picker: Passes output values from previous steps into subsequent action inputs.",
        ],
        examTips: "Flow Designer is the default recommendation for new business process automations.",
      },
    ],
    keyTerminology: [
      { term: "User Criteria", definition: "Rules defining which users or groups can access a Knowledge Base or Catalog Item." },
      { term: "Order Guide", definition: "A multi-item ordering wizard that uses variables to dynamically present relevant items." },
      { term: "Data Pill", definition: "Draggable data token representing runtime outputs in Flow Designer." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=self-service-automation",
  },
  {
    slug: "database-security",
    name: "Database Management and Platform Security",
    weight: 30,
    questionCount: 18,
    overview:
      "Tables, records, fields, inheritance hierarchy, Schema Map, Data Dictionary, CMDB & CSDM fundamentals, Import Sets, Transform Maps, Access Control Lists (ACLs), and Platform Security Center.",
    releaseNotes:
      "Covers Next Experience Security Center, CSDM v4.0 alignment, IRE ingestion, and granular ACL debugging.",
    topics: [
      {
        title: "Database Architecture, Schema & CMDB",
        summary: "ServiceNow relational database structure, table inheritance, dictionary overrides, and CI relationships.",
        keyPoints: [
          "Tables & Inheritance: The base Task table [task] extends to Incident, Problem, and Change. The Configuration Item table [cmdb_ci] extends to Hardware, Server, etc.",
          "Dictionary Overrides: Changes field attributes (e.g. Default value, Mandatory) on child tables without altering the parent.",
          "CMDB & IRE: Tracks enterprise assets, services, and relationships [cmdb_rel_ci] managed via IRE.",
        ],
        examTips: "CMDB is not just asset management; it maps upstream and downstream dependencies between infrastructure and business services.",
      },
      {
        title: "Data Ingestion & Transform Maps",
        summary: "Importing legacy data into target tables using staging tables and transform mappings.",
        keyPoints: [
          "Workflow: Data Source → Import Set Table (staging) → Transform Map → Target Table.",
          "Coalesce: Identifies matching unique keys to update existing records instead of creating duplicates.",
          "Transform Scripts: onStart, onBefore, onAfter, and onReject customize data transformations.",
        ],
        examTips: "If coalesce is NOT set, every imported row creates a new record in the target table.",
      },
      {
        title: "Access Control Lists (ACLs) & Platform Security",
        summary: "Securing data at the row, table, and field level with role-based and contextual evaluation.",
        keyPoints: [
          "Evaluation Sequence: Table-level ACL (table.None) evaluates first. If passed, field-level ACLs (table.field or table.*) evaluate.",
          "Requirements: To pass an ACL, the user must satisfy: 1. Roles, 2. Condition builder, 3. Advanced script (all 3 must evaluate true).",
          "Security Admin Role: Required to create or modify ACLs; must be elevated via the profile menu.",
        ],
        examTips: "If table-level ACL (table.None) fails, all field-level ACLs are immediately denied.",
      },
    ],
    keyTerminology: [
      { term: "Coalesce", definition: "A field setting in Transform Maps that checks for existing matching records." },
      { term: "Dictionary Override", definition: "Allows child tables to define unique field behaviors without changing the parent." },
      { term: "Security Admin", definition: "Elevated privilege role required to create and modify Access Controls." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=database-security",
  },
  {
    slug: "data-migration-integration",
    name: "Data Migration and Integration",
    weight: 13,
    questionCount: 8,
    overview:
      "UI Policies, Data Policies, Business Rules, Client Scripts, Script Includes, and System Update Sets lifecycle management.",
    releaseNotes:
      "Emphasizes scriptless policies first, display business rules with g_scratchpad, and update set preview collision handling.",
    topics: [
      {
        title: "Client Scripts & UI Policies",
        summary: "Browser-side logic modifying form appearance, mandatory states, and interactive validations.",
        keyPoints: [
          "Client Script Types: onLoad(), onChange(), onSubmit(), onCellEdit().",
          "UI Policies: Scriptless declarative rules to make fields Mandatory, Read-only, or Visible based on conditions.",
          "Data Policies: Enforce mandatory and read-only constraints on both server and client (including REST and imports).",
        ],
        examTips: "UI Policies run ONLY in the browser; Data Policies enforce constraints on both browser and server.",
      },
      {
        title: "Business Rules & Scripting",
        summary: "Server-side JavaScript executing on record database transactions.",
        keyPoints: [
          "Timing: 'before' (pre-insert/update), 'after' (post-commit), 'async' (background job), 'display' (form load with g_scratchpad).",
          "current & previous: 'current' represents the record being saved; 'previous' represents pre-transaction values.",
          "GlideRecord: Server database API for querying, inserting, and updating records.",
        ],
        examTips: "Use Display Business Rules with g_scratchpad to pass server data to client scripts without slow synchronous calls.",
      },
      {
        title: "Update Sets & Migration Lifecycle",
        summary: "Capturing, packing, and deploying configurations between ServiceNow instances.",
        keyPoints: [
          "Captured: Configuration changes (Business Rules, Client Scripts, Tables, Fields, Forms, Flows).",
          "NOT Captured: Data records (new Incidents, Users [sys_user], Groups, CIs) unless manually exported.",
          "Lifecycle: In Progress (Dev) → Completed → Retrieved in Target → Preview → Commit.",
        ],
        examTips: "Update Sets capture customizations and configurations, NEVER transactional data.",
      },
    ],
    keyTerminology: [
      { term: "Update Set", definition: "Container capturing point-in-time configuration changes for migration between environments." },
      { term: "Data Policy", definition: "Server-enforced rule keeping fields mandatory and read-only regardless of entry method." },
      { term: "g_scratchpad", definition: "Data exchange object passing server values to client scripts during form load." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=data-migration-integration",
  },
];

// ============================================================================
// CAD — Certified Application Developer Study Guides (KB0011498)
// ============================================================================
export const CAD_STUDY_GUIDES: DomainStudyGuide[] = [
  {
    slug: "app-design",
    name: "Designing and Creating an Application",
    weight: 20,
    questionCount: 12,
    overview:
      "Covers application scoping, ServiceNow Studio, App Engine Studio, custom table schemas, naming conventions, and determining platform fit.",
    releaseNotes:
      "Aligned with Australia & Brazil releases, featuring App Engine Studio templates and private application scope isolation.",
    topics: [
      {
        title: "Application Scoping & Isolation",
        summary: "Private application scopes protect applications from being broken by global code changes and provide explicit access boundaries.",
        keyPoints: [
          "Custom scoped tables prepend 'x_[company_code]_[app_id]_' to table names.",
          "Metadata stored in Application [sys_app] table.",
          "Cross-Scope Access (Restricted Caller Access) enforces permission checks at runtime.",
        ],
        examTips: "Global scope is legacy; new custom applications should always be built in private scopes.",
      },
    ],
    keyTerminology: [
      { term: "Application Scope", definition: "A namespace boundary that encapsulates all artifacts for an application." },
      { term: "sys_app", definition: "Table storing metadata for custom scoped applications created in Studio." },
    ],
    practiceUrl: "/certifications/cad/practice?domain=app-design",
  },
  {
    slug: "app-ui",
    name: "Application User Interface",
    weight: 20,
    questionCount: 12,
    overview:
      "Forms, fields, views, Client Scripts (onLoad, onChange, onSubmit, onCellEdit), UI Policies, UI Actions, and Record Producers.",
    releaseNotes:
      "Next Experience component architecture, asynchronous GlideAjax with getXMLAnswer, and g_scratchpad.",
    topics: [
      {
        title: "Client-Side Scripting & GlideAjax",
        summary: "Executing asynchronous JavaScript in the browser to validate and populate form data without locking the UI thread.",
        keyPoints: [
          "GlideAjax with getXMLAnswer() is the best-practice method to query server data asynchronously.",
          "Display Business Rules populate g_scratchpad to avoid unnecessary server round-trips on form load.",
          "UI Actions render buttons, context menus, and links on forms and lists.",
        ],
        examTips: "Never use synchronous GlideRecord in Client Scripts; always use GlideAjax.",
      },
    ],
    keyTerminology: [
      { term: "GlideAjax", definition: "Asynchronous client-to-server communication API invoking Script Includes." },
      { term: "UI Action", definition: "Interactive button or link executing client or server code on records." },
    ],
    practiceUrl: "/certifications/cad/practice?domain=app-ui",
  },
  {
    slug: "security-access",
    name: "Security and Restricting Access",
    weight: 20,
    questionCount: 12,
    overview:
      "Access Control Lists (ACLs), Application Access settings, cross-scope privileges, and GlideSystem security methods.",
    releaseNotes:
      "Granular RCA (Restricted Caller Access) tracking, table-level vs field-level ACLs, and scope protection.",
    topics: [
      {
        title: "Application Access & Cross-Scope Security",
        summary: "Configuring CRUD permissions and web service access on scoped application tables.",
        keyPoints: [
          "Application Access controls whether other application scopes can read, create, update, or delete records.",
          "Table-level ACL (table.None) evaluates before field-level ACLs (table.field or table.*).",
          "GlideSystem methods gs.hasRole() and gs.getUserID() evaluate user permissions in server scripts.",
        ],
        examTips: "Table-level access is required before field-level rules are even checked.",
      },
    ],
    keyTerminology: [
      { term: "Application Access", definition: "Table settings defining cross-scope CRUD permissions." },
      { term: "table.None", definition: "Table-level ACL rule that grants record access before field rules evaluate." },
    ],
    practiceUrl: "/certifications/cad/practice?domain=security-access",
  },
  {
    slug: "app-automation",
    name: "Application Automation",
    weight: 20,
    questionCount: 12,
    overview:
      "Flow Designer actions and subflows, Business Rules (Before, After, Async, Display), Script Includes, Events, Scheduled Script Executions, and Notifications.",
    releaseNotes:
      "Modern Workflow Studio, custom Action step configurations, and reusable client-callable Script Includes.",
    topics: [
      {
        title: "Script Includes & Flow Designer",
        summary: "Reusable server-side modular code libraries and modern low-code flow automation.",
        keyPoints: [
          "Client-callable Script Includes must extend global.AbstractAjaxProcessor.",
          "Flow Designer Subflows define inputs and outputs, allowing modular invocation across multiple flows.",
          "Events queued via gs.eventQueue() trigger asynchronous notifications and script actions.",
        ],
        examTips: "Script Includes store reusable server-side functions and classes.",
      },
    ],
    keyTerminology: [
      { term: "AbstractAjaxProcessor", definition: "Base class required for client-callable Script Includes using GlideAjax." },
      { term: "Subflow", definition: "Standalone parameterized automation sequence with defined inputs and outputs." },
    ],
    practiceUrl: "/certifications/cad/practice?domain=app-automation",
  },
  {
    slug: "external-data",
    name: "Working with External Data",
    weight: 10,
    questionCount: 6,
    overview:
      "Inbound and outbound web services, Scripted REST APIs, REST Messages, and data import parsing.",
    releaseNotes:
      "Featuring OpenAPI specifications, OAuth 2.0 token profiles, and JSON/XML request parsing.",
    topics: [
      {
        title: "Scripted REST APIs",
        summary: "Custom web service endpoints defined on the instance to process incoming HTTP requests.",
        keyPoints: [
          "request.body.data parses incoming JSON or XML payloads into a JavaScript object.",
          "Endpoints are protected by ACLs of type 'rest_endpoint'.",
          "REST Messages handle outbound HTTP requests to external third-party systems.",
        ],
        examTips: "request.body.data automatically parses request body payloads in Scripted REST APIs.",
      },
    ],
    keyTerminology: [
      { term: "Scripted REST API", definition: "Custom web service resource handling inbound HTTP requests with JavaScript." },
      { term: "REST Message", definition: "Outbound integration configuration to consume external third-party REST endpoints." },
    ],
    practiceUrl: "/certifications/cad/practice?domain=external-data",
  },
  {
    slug: "app-management",
    name: "Managing Applications",
    weight: 10,
    questionCount: 6,
    overview:
      "Source Control integration (Git), branching, stashing, Delegated Development permissions, and publishing to Application Repository.",
    releaseNotes:
      "Covers Git personal access token authentication, stashing changes, and Delegated Development user roles.",
    topics: [
      {
        title: "Git Integration & Delegated Development",
        summary: "Managing application code with external Git repositories and delegating developer permissions safely.",
        keyPoints: [
          "Studio links to Git using HTTPS repository URLs and Personal Access Tokens (PAT).",
          "Stashing temporarily stores uncommitted local changes before switching branches.",
          "Delegated Development grants non-admin users specific development permissions on a scoped app.",
        ],
        examTips: "Delegated Development allows teams to build apps without full system administrator privileges.",
      },
    ],
    keyTerminology: [
      { term: "Delegated Development", definition: "Feature granting specific development permissions to non-admin developers." },
      { term: "Stash", definition: "Temporary storage of local uncommitted changes when managing Git branches in Studio." },
    ],
    practiceUrl: "/certifications/cad/practice?domain=app-management",
  },
];

// ============================================================================
// CIS-DF — Certified Implementation Specialist (Data Foundations: CMDB and CSDM)
// Aligned to ServiceNow KB0012913 Official Blueprint
// ============================================================================
export const CIS_DF_STUDY_GUIDES: DomainStudyGuide[] = [
  {
    slug: "govern",
    name: "Govern",
    weight: 35,
    questionCount: 26,
    overview:
      "Covers CMDB Health Dashboard scorecards (Completeness, Correctness, Compliance), Identification and Reconciliation Engine (IRE) rules, De-duplication tasks, CMDB Data Manager policies, and Multisource CMDB tracking.",
    releaseNotes:
      "Official blueprint (KB0012913): CMDB Data Manager lifecycle rules, automated CI attestation, and multisource data tracking.",
    topics: [
      {
        title: "CMDB Health Dashboard Scorecards",
        summary: "The official framework measuring the accuracy, completeness, and compliance of Configuration Items.",
        keyPoints: [
          "Completeness: Evaluates required and recommended attributes defined on CI classes.",
          "Correctness: Detects duplicate CIs, orphan CIs (missing relationships), and stale CIs.",
          "Compliance: Measures adherence to audit rules and desired state configurations.",
        ],
        examTips: "Know the three CMDB Health pillars: Completeness, Correctness, Compliance. This accounts for major exam questions.",
      },
      {
        title: "Identification and Reconciliation Engine (IRE)",
        summary: "Standardized engine evaluating incoming CI payloads to identify existing CIs and prevent duplicate creation.",
        keyPoints: [
          "Identifier Entries: Rules specifying attributes (e.g. serial_number, mac_address, name) evaluated in priority order.",
          "De-duplication Tasks: Generated on [rem_cmdb_duplicate_task] when IRE detects multiple matching records with identical confidence.",
          "Reconciliation Rules: Define which discovery source is authorized to update specific attributes on specific CI classes.",
        ],
        examTips: "IRE never creates duplicates; if an ambiguity is found, it generates a De-duplication Task.",
      },
      {
        title: "CMDB Data Manager & Life Cycle Policies",
        summary: "Automating governance actions (retire, delete, archive, attest) across CIs based on operational conditions.",
        keyPoints: [
          "Life Cycle Policies: Define rules to automatically transition CIs through lifecycle stages without custom scripts.",
          "Attestation: Assigns tasks to CI owners to verify whether configuration items are still active and accurate.",
          "Multisource CMDB: Property glide.identification_engine.multisource_cmdb_ci_enabled retains raw source-reported values.",
        ],
        examTips: "CMDB Data Manager replaces legacy custom scheduled cleanup scripts.",
      },
    ],
    keyTerminology: [
      { term: "IRE", definition: "Identification and Reconciliation Engine that guarantees CI uniqueness across all discovery sources." },
      { term: "De-duplication Task", definition: "Remediation record created when IRE matches multiple CIs with identical thresholds." },
      { term: "CMDB Data Manager", definition: "Policy-driven engine managing CI retirement, archival, deletion, and attestation." },
    ],
    practiceUrl: "/certifications/cis-df/practice?domain=govern",
  },
  {
    slug: "insight",
    name: "Insight",
    weight: 20,
    questionCount: 15,
    overview:
      "CMDB Workspace, CMDB Query Builder, Data Foundations Dashboards, Unified Maps, dependency mapping, and impact analysis.",
    releaseNotes:
      "Features modern CMDB Workspace operational dashboards, complex Query Builder relationship joins, and remediation playbooks.",
    topics: [
      {
        title: "CMDB Query Builder",
        summary: "Visual drag-and-drop tool for constructing complex multi-level CI queries and identifying missing relationships.",
        keyPoints: [
          "Canvas queries traverse parent-child relationships and service topologies.",
          "Can identify non-reporting CIs (e.g., 'Web Servers without downstream Database CIs').",
          "Saved queries can be scheduled to populate CMDB groups or generate reports.",
        ],
        examTips: "Query Builder constructs complex graph queries without writing database views or SQL joins.",
      },
      {
        title: "CMDB Workspace & Data Foundations Dashboards",
        summary: "Central operational surface for CMDB health, attestation metrics, and Data Foundations governance.",
        keyPoints: [
          "Data Foundations Dashboard assesses CSDM adoption maturity, health scorecards, and IRE health.",
          "Unified Maps provide interactive visual dependency graphs of infrastructure and application services.",
        ],
        examTips: "CMDB Workspace is the central hub for CMDB administrators in Next Experience.",
      },
    ],
    keyTerminology: [
      { term: "CMDB Query Builder", definition: "Visual canvas tool to query CI relationships and missing dependencies." },
      { term: "Data Foundations Dashboard", definition: "Built-in assessment dashboard evaluating CMDB and CSDM maturity." },
    ],
    practiceUrl: "/certifications/cis-df/practice?domain=insight",
  },
  {
    slug: "ingest",
    name: "Ingest",
    weight: 19,
    questionCount: 14,
    overview:
      "Ingesting configuration data into the platform via IntegrationHub ETL, Service Graph Connectors, Agent Client Collector, and Import Sets routed through IRE.",
    releaseNotes:
      "Emphasizes Service Graph Connectors, IntegrationHub ETL mapping, and IRE ingestion pipelines over legacy Transform Maps.",
    topics: [
      {
        title: "Service Graph Connectors & IntegrationHub ETL",
        summary: "ServiceNow-validated integrations to import third-party asset data cleanly into the CMDB via IRE.",
        keyPoints: [
          "Service Graph Connectors follow strict ServiceNow engineering standards to ensure clean data flow.",
          "IntegrationHub ETL provides a guided visual mapping interface that funnels incoming rows through IRE.",
          "Never use direct database inserts into cmdb_ci; always route through IRE.",
        ],
        examTips: "IntegrationHub ETL guarantees that incoming data respects identification and reconciliation definitions.",
      },
    ],
    keyTerminology: [
      { term: "IntegrationHub ETL", definition: "Visual mapping tool that transforms raw source data into IRE-validated CI payloads." },
      { term: "Service Graph Connector", definition: "Pre-built, certified integration funneling third-party data through IRE into CMDB." },
    ],
    practiceUrl: "/certifications/cis-df/practice?domain=ingest",
  },
  {
    slug: "configuration",
    name: "Configuration",
    weight: 15,
    questionCount: 11,
    overview:
      "CI Class Manager hierarchy, base table [cmdb_ci], table inheritance, Principal Classes, and CI relationship types [cmdb_rel_ci].",
    releaseNotes:
      "Covers CI Class Manager central console, Principal Classes filtering, and CI relationship definitions.",
    topics: [
      {
        title: "CI Class Manager & Principal Classes",
        summary: "The single location to configure table schemas, identification rules, reconciliation rules, and health metrics.",
        keyPoints: [
          "CI Class Manager centralizes all class settings, attributes, and inheritance hierarchies.",
          "Principal Classes restrict CI reference pickers on Incident, Problem, and Change forms to only actionable primary CIs.",
          "Relationship definitions on [cmdb_rel_ci] define valid upstream/downstream parent-child connections.",
        ],
        examTips: "Principal Classes prevent end users from selecting minor subcomponents in ITSM forms.",
      },
    ],
    keyTerminology: [
      { term: "CI Class Manager", definition: "Central administrative interface for managing all CMDB class definitions and rules." },
      { term: "Principal Classes", definition: "Designated classes that filter CI lookup lists on task forms." },
    ],
    practiceUrl: "/certifications/cis-df/practice?domain=configuration",
  },
  {
    slug: "csdm-fundamentals",
    name: "CSDM Fundamentals",
    weight: 11,
    questionCount: 9,
    overview:
      "Common Service Data Model (CSDM v4.0) architecture, the 4 core domains, Business Application vs Application Service, and Crawl-Walk-Run-Fly maturity.",
    releaseNotes:
      "Aligned to CSDM v4.0 standards, SDLC component models, and service portfolio integration.",
    topics: [
      {
        title: "CSDM v4.0 Domains & Implementation Journey",
        summary: "Standardized service data architecture connecting business capabilities, applications, and infrastructure.",
        keyPoints: [
          "Foundation Domain: Core reference data (Companies, Users, Locations, Business Units).",
          "Design Domain: Conceptual software portfolio (Business Application [cmdb_ci_appl], Capabilities).",
          "Manage Technical Services: Operational infrastructure (Application Service, Technical Service Offerings).",
          "Sell / Consume: Customer-facing products (Business Services, Service Offerings).",
          "Maturity Journey: Crawl (Foundation/Business Apps) → Walk (Technical Services) → Run (Business Services) → Fly (Strategy).",
        ],
        examTips: "Business Application lives in Design domain; Application Service lives in Manage Technical Services domain.",
      },
    ],
    keyTerminology: [
      { term: "CSDM v4.0", definition: "Common Service Data Model defining standard terms, tables, and relationships." },
      { term: "Business Application", definition: "Design domain CI representing software portfolio assets (e.g. SAP ERP)." },
      { term: "Application Service", definition: "Operational deployed instance of an application supporting business workflows." },
    ],
    practiceUrl: "/certifications/cis-df/practice?domain=csdm-fundamentals",
  },
];

// ============================================================================
// CIS-ITSM — Certified Implementation Specialist (IT Service Management)
// Aligned to ServiceNow KB0011560 Official Blueprint
// ============================================================================
export const CIS_ITSM_STUDY_GUIDES: DomainStudyGuide[] = [
  {
    slug: "incident-mgmt",
    name: "Incident Management",
    weight: 25,
    questionCount: 15,
    overview:
      "Incident architecture, state model, major incident management, script includes, incident properties, and assignment routing.",
    releaseNotes:
      "Aligned to ServiceNow ITIL 4 standards, Service Operations Workspace incident triage, and Major Incident Workbench.",
    topics: [
      {
        title: "Incident Architecture & Priority Lookup",
        summary: "Incident lifecycle from New to Closed, priority matrix calculation, and incident states.",
        keyPoints: [
          "Priority is calculated automatically from Impact and Urgency via Priority Data Lookup [dl_u_priority].",
          "Major Incident Management provides a dedicated Workbench for high-priority outage coordination.",
          "Incident properties configure caller autofill, mandatory resolution codes, and auto-close timer.",
        ],
        examTips: "Data Lookup Rules calculate priority based on Impact and Urgency matrix.",
      },
    ],
    keyTerminology: [
      { term: "Major Incident Management", definition: "Coordinated process and workbench for resolving catastrophic service interruptions." },
      { term: "Priority Data Lookup", definition: "Data matrix table mapping Impact and Urgency combinations to Priority." },
    ],
    practiceUrl: "/certifications/cis-itsm/practice?domain=incident-mgmt",
  },
  {
    slug: "change-mgmt",
    name: "Change Management",
    weight: 25,
    questionCount: 15,
    overview:
      "Change architecture, change models (Normal, Standard, Emergency), CAB workbench, risk assessments, conflict detection, and blackout windows.",
    releaseNotes:
      "Modern State Model, Change Velocity, automated risk calculations, and Standard Change proposal catalog.",
    topics: [
      {
        title: "Change Models & Conflict Detection",
        summary: "Governing changes to configuration items and production environments while minimizing service disruption.",
        keyPoints: [
          "Standard Change: Pre-approved, low risk, follows template, bypasses CAB approval.",
          "Normal Change: Follows full authorization lifecycle (Peer review, CAB approval, PIR).",
          "Emergency Change: Addresses urgent outages; requires ECAB approval and retroactive documentation.",
          "Conflict Detection: Evaluates maintenance schedules, blackout windows, and concurrent CI changes.",
        ],
        examTips: "Standard changes are pre-approved and do not require CAB evaluation.",
      },
    ],
    keyTerminology: [
      { term: "Standard Change", definition: "Pre-authorized, low-risk change following a proven procedure template." },
      { term: "CAB Workbench", definition: "Dedicated console to schedule, review, and approve Normal changes." },
      { term: "Conflict Detection", definition: "Automated engine checking CI schedules and blackout windows for colliding changes." },
    ],
    practiceUrl: "/certifications/cis-itsm/practice?domain=change-mgmt",
  },
  {
    slug: "service-catalog",
    name: "Service Catalog and Request Management",
    weight: 25,
    questionCount: 15,
    overview:
      "Catalog architecture, scoping, fulfillment workflows, variable sets, multi-row variable sets (MRVS), Record Producers, and Order Guides.",
    releaseNotes:
      "Service Catalog Next Experience enhancements, Flow Designer fulfillment, and cart properties.",
    topics: [
      {
        title: "Catalog Fulfillment & Variables",
        summary: "Configuring end-user request forms, approvals, and multi-step fulfillment tasks.",
        keyPoints: [
          "Request Hierarchy: Request [sc_request] → Requested Item [sc_req_item] → Catalog Task [sc_task].",
          "Record Producers allow catalog forms to insert directly into target task tables (Incident, Change).",
          "Multi-Row Variable Sets (MRVS) collect dynamic tabular input from users.",
        ],
        examTips: "Record Producers bypass REQ/RITM and insert directly into tables like [incident].",
      },
    ],
    keyTerminology: [
      { term: "MRVS", definition: "Multi-Row Variable Set allowing users to add multiple rows of structured data." },
      { term: "Record Producer", definition: "Catalog form that creates standard task records like Incident or Change." },
    ],
    practiceUrl: "/certifications/cis-itsm/practice?domain=service-catalog",
  },
  {
    slug: "problem-mgmt",
    name: "Problem Management",
    weight: 15,
    questionCount: 9,
    overview:
      "Problem architecture, root cause analysis, Known Error Database (KEDB), workaround publication, and problem lifecycle states.",
    releaseNotes:
      "Structured Problem lifecycle (New, Assess, Root Cause Analysis, Fix in Progress, Resolved, Closed).",
    topics: [
      {
        title: "Root Cause Analysis & Known Error Database",
        summary: "Investigating underlying causes of recurring incidents and publishing workarounds.",
        keyPoints: [
          "Problem tasks (Root Cause Analysis, General) can be assigned to different technical teams.",
          "Known Error articles document workarounds in the Knowledge Base to accelerate incident resolution.",
          "Resolving a problem can automatically resolve associated incidents if configured in properties.",
        ],
        examTips: "Known Error records document identified root causes with temporary workarounds.",
      },
    ],
    keyTerminology: [
      { term: "Known Error", definition: "A problem with a confirmed root cause and a documented workaround." },
      { term: "KEDB", definition: "Known Error Database published to service desk teams in Knowledge Management." },
    ],
    practiceUrl: "/certifications/cis-itsm/practice?domain=problem-mgmt",
  },
  {
    slug: "service-portfolio",
    name: "Service Portfolio Management",
    weight: 5,
    questionCount: 3,
    overview:
      "Service taxonomy, Business Services, Technical Services, Service Offerings, and subscriber visibility.",
    releaseNotes:
      "Integration with Digital Portfolio Management (DPM) and CSDM v4.0 service relationships.",
    topics: [
      {
        title: "Service Portfolio Taxonomy & Offerings",
        summary: "Structuring business and technical services into logical portfolios with committed offerings.",
        keyPoints: [
          "Service Offerings define SLA commitment levels (e.g. Gold 24x7, Standard) for a parent service.",
          "Subscribers can be associated with offerings to control visibility and notification routing.",
        ],
        examTips: "Service Offerings inherit the parent service context and define specific customer SLAs.",
      },
    ],
    keyTerminology: [
      { term: "Service Offering", definition: "Specific commitment tier and SLA package derived from a parent service." },
    ],
    practiceUrl: "/certifications/cis-itsm/practice?domain=service-portfolio",
  },
  {
    slug: "cmdb-itsm",
    name: "Configuration Management Database (CMDB)",
    weight: 5,
    questionCount: 3,
    overview:
      "CMDB concepts relevant to ITSM: CI classes, dependency mapping, maintenance windows, and CI impact analysis on incident and change records.",
    releaseNotes:
      "Principal classes filtering and CI relationship visualization in Service Operations Workspace.",
    topics: [
      {
        title: "ITSM CI Dependencies & Maintenance Windows",
        summary: "How Configuration Items empower incident triage, change conflict avoidance, and root-cause mapping.",
        keyPoints: [
          "Associating CIs with Incidents enables visual impact analysis and automated support group assignment.",
          "Change conflict detection compares scheduled change windows against CI maintenance schedules.",
        ],
        examTips: "CMDB CI association is critical for automated change collision detection.",
      },
    ],
    keyTerminology: [
      { term: "Maintenance Window", definition: "Approved scheduled timeframe during which CIs can undergo change." },
    ],
    practiceUrl: "/certifications/cis-itsm/practice?domain=cmdb-itsm",
  },
];

// ============================================================================
// Study Guides Resolver Functions
// ============================================================================
export function getTrackStudyGuides(trackId: string): DomainStudyGuide[] {
  const normalized = (trackId || "csa").toLowerCase();
  if (normalized === "csa") return CSA_STUDY_GUIDES;
  if (normalized === "cad") return CAD_STUDY_GUIDES;
  if (normalized === "cis-df") return CIS_DF_STUDY_GUIDES;
  if (normalized === "cis-itsm") return CIS_ITSM_STUDY_GUIDES;
  return CSA_STUDY_GUIDES;
}

export function getDomainStudyGuide(trackId: string, domainSlug: string): DomainStudyGuide | undefined {
  const guides = getTrackStudyGuides(trackId);
  const normalizedSlug = domainSlug.toLowerCase();
  
  // Exact slug match
  const exact = guides.find((g) => g.slug.toLowerCase() === normalizedSlug);
  if (exact) return exact;

  // Name match
  const byName = guides.find((g) => g.name.toLowerCase() === normalizedSlug);
  if (byName) return byName;

  // Legacy CSA aliases mapping to official domains
  if ((trackId || "csa").toLowerCase() === "csa") {
    if (normalizedSlug === "ui-nav") return guides.find((g) => g.slug === "platform-overview");
    if (normalizedSlug === "collaboration") return guides.find((g) => g.slug === "collaboration-apps");
    if (normalizedSlug === "db-admin") return guides.find((g) => g.slug === "database-security");
    if (normalizedSlug === "automation") return guides.find((g) => g.slug === "self-service-automation");
    if (normalizedSlug === "development") return guides.find((g) => g.slug === "data-migration-integration");
  }

  // Legacy CAD aliases mapping
  if (trackId.toLowerCase() === "cad") {
    if (normalizedSlug === "data-model") return guides.find((g) => g.slug === "security-access");
    if (normalizedSlug === "integration") return guides.find((g) => g.slug === "external-data");
    if (normalizedSlug === "ui-experience") return guides.find((g) => g.slug === "app-ui");
  }

  return undefined;
}
