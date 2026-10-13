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

export const CSA_STUDY_GUIDES: DomainStudyGuide[] = [
  // =========================================================================
  // DOMAIN 1: User Interface & Navigation (20%)
  // =========================================================================
  {
    slug: "ui-nav",
    name: "User Interface & Navigation",
    weight: 20,
    questionCount: 12,
    overview:
      "This domain evaluates your understanding of the Next Experience UI, Unified Navigation framework, list mechanics, form layouts, filter configurations, and user personalization options.",
    releaseNotes:
      "Aligned with the Australia & Brazil releases, featuring Next Experience Unified Navigation, Command Analytics, Workspaces, and the Form Designer visual interface.",
    topics: [
      {
        title: "Next Experience Unified Navigation",
        summary:
          "The primary header interface providing access to navigation menus, global search, and contextual workspace features.",
        keyPoints: [
          "All Menu: Houses the full Application Navigator containing all application modules and tables accessible to the user.",
          "Favorites Menu: Stores pinned records, lists, dashboards, and modules customized by the individual user.",
          "History Menu: Stores up to 30 of the most recently visited records, lists, and forms.",
          "Workspaces Menu: Dedicated multi-tab operational workspaces (e.g., Service Operations Workspace).",
          "Contextual App Bar: Displays application-specific actions, tabs, and notifications on the current page.",
        ],
        examTips:
          "Remember that the History menu stores exactly 30 items by default. The All menu replaces the legacy UI16 left sidebar.",
        pitfalls:
          "Do not confuse Workspaces with Dashboards. Workspaces are interactive, tabbed multi-record agent consoles.",
      },
      {
        title: "Lists, Filters & Breadcrumbs",
        summary:
          "Mechanics for viewing, filtering, and organizing records in tabular list views.",
        keyPoints: [
          "Filter Anatomy: Every filter condition consists of Field (column), Operator (e.g., 'is', 'contains', 'greater than'), and Value.",
          "Breadcrumbs: Hierarchical visual query paths above lists. Clicking a breadcrumb segment trims conditions backward.",
          "Quick Navigation: Typing '[table].list' opens in the current tab; '[table].LIST' opens in a new tab/window.",
          "List Actions: Context menu (right-click headers), List Mechanics gear (personalize columns), and list search filters.",
        ],
        examTips:
          "Filter order matters. Breadcrumbs evaluate from left to right as an AND query hierarchy.",
        pitfalls:
          "Personalizing a list modifies columns only for your personal profile; Configuring a list layout requires admin role and modifies it globally.",
      },
      {
        title: "Forms, Form Designer & Formatters",
        summary:
          "Configuring record layouts, form sections, formatters, and activity history.",
        keyPoints: [
          "Form Designer: Visual drag-and-drop tool to arrange fields, create 1 or 2-column sections, and add formatters.",
          "Form Layout: The traditional dual-slushbucket interface accessible via Configure > Form Layout.",
          "Activity Stream: Chronicled formatter showing work notes, customer comments, timestamps, and field updates.",
          "Related Lists: Tabs at the bottom of forms displaying child records from other tables (e.g., Incident Tasks, SLAs).",
        ],
        examTips:
          "Form Designer can create and configure fields directly without navigating away to the Data Dictionary.",
      },
      {
        title: "Visual Task Boards (VTBs)",
        summary:
          "Kanban-style interactive boards that transform standard lists into visual workflow lanes.",
        keyPoints: [
          "Freeform Boards: Custom lanes where any task card can be dropped and organized manually.",
          "Flexible Boards: Lanes mapped to a choice field; cards can be moved across lanes to update the field.",
          "Data-Driven Boards: Lanes strictly bound to a choice or reference field (e.g., State); moving cards updates the record automatically.",
        ],
        examTips:
          "The three VTB types are: Freeform, Flexible, and Data-Driven. This is frequently tested as a multi-choice question.",
      },
    ],
    keyTerminology: [
      { term: "Next Experience", definition: "ServiceNow's unified modern design system and web framework." },
      { term: "Slushbucket", definition: "Two-column list selector allowing users to move items between Available and Selected." },
      { term: "Sysparm_query", definition: "URL parameter encoding encoded query filters." },
      { term: "Formatter", definition: "Form element that displays information not directly tied to a table column (e.g., Activity Formatter, Process Flow)." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=ui-nav",
  },

  // =========================================================================
  // DOMAIN 2: Collaboration & Task Management (20%)
  // =========================================================================
  {
    slug: "collaboration",
    name: "Collaboration & Task Management",
    weight: 20,
    questionCount: 12,
    overview:
      "This domain assesses governance of users, groups, and roles, assignment rules, task stream collaboration, notifications, and service level agreements (SLAs).",
    releaseNotes:
      "Australia & Brazil releases highlight Sidebar collaboration, enhanced Agent Chat, and strict role inheritance standards.",
    topics: [
      {
        title: "User, Group & Role Governance",
        summary:
          "Managing platform identity, memberships, and authorization permissions.",
        keyPoints: [
          "sys_user table: Houses all user account records, credentials, departments, and titles.",
          "sys_user_group table: Houses functional groups (e.g., 'Database Support', 'Service Desk').",
          "sys_user_role table: Houses platform capabilities and permissions.",
          "Golden Rule: Never assign roles directly to users. Assign roles to Groups, and add users to Groups.",
          "Impersonation: Tool for administrators to test visibility and permissions as another user without knowing passwords.",
        ],
        examTips:
          "The 'itil' role enables core fulfiller access across Incident, Problem, and Change. The 'admin' role provides broad system configuration rights.",
        pitfalls:
          "Assigning roles directly to sys_user records violates ServiceNow best practices and makes auditing difficult.",
      },
      {
        title: "Task Lifecycle & Assignment Rules",
        summary:
          "Mechanics of the Task base table, state transitions, and automated record routing.",
        keyPoints: [
          "Task [task]: Base class table for Incident, Problem, Change, HR Task, and Catalog Task.",
          "Assignment Rules: Automatically populate Assignment Group and Assigned To based on record conditions.",
          "Work Notes vs. Additional Comments: Additional comments are customer-visible; Work notes are yellow-tinted internal notes.",
          "Activity @mentions: Tagging a colleague with @ in journal fields sends an automated notification alert.",
        ],
        examTips:
          "Assignment Rules only execute on record insertion unless specifically configured otherwise.",
      },
      {
        title: "Notifications & Inbound Email",
        summary:
          "Configuring outbound event alerts, templates, and inbound email ingestion.",
        keyPoints: [
          "Notification Tabs: 1) 'When to send' (insert/update conditions or events), 2) 'Who will receive' (users, groups, fields), 3) 'What it will contain' (subject & message template).",
          "Watermark: Unique identifier (e.g., MSG0010001) in emails allowing ServiceNow to associate incoming replies with the existing task record.",
          "Inbound Email Actions: Server-side scripts and rules that parse incoming emails to create or update records.",
        ],
        examTips:
          "Remember the exact names of the 3 tabs on an Email Notification: 'When to send', 'Who will receive', 'What it will contain'.",
      },
      {
        title: "Service Level Agreements (SLAs)",
        summary:
          "Measuring fulfiller delivery times, commitments, and escalation warnings.",
        keyPoints: [
          "SLA Definitions [contract_sla]: Define conditions for Start, Pause, Stop, and Reset.",
          "SLA Types: SLA (customer agreement), OLA (Operational Level Agreement between internal teams), Underpinning Contract (UC with third-party vendors).",
          "SLA Schedules: Defining working hours (e.g., 24x7 vs. 8x5 weekdays excluding public holidays).",
        ],
        examTips:
          "OLAs and Underpinning Contracts use the exact same SLA engine and contract_sla table; only the SLA Type field differs.",
      },
    ],
    keyTerminology: [
      { term: "sys_user_grmember", definition: "Many-to-many junction table mapping users to their group memberships." },
      { term: "Watermark", definition: "Cryptographic tracking token embedded in email footers to associate replies to tickets." },
      { term: "OLA", definition: "Operational Level Agreement governing internal fulfiller teams." },
      { term: "Sidebar", definition: "Real-time record-based chat tool enabling fulfills to collaborate on tasks." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=collaboration",
  },

  // =========================================================================
  // DOMAIN 3: Database Administration & Schema (30%)
  // =========================================================================
  {
    slug: "db-admin",
    name: "Database Administration & Schema",
    weight: 30,
    questionCount: 18,
    overview:
      "This is the largest domain (30% weight), evaluating table inheritance, the Data Dictionary, Import Sets, Transform Maps, Access Control Lists (ACLs), and the Configuration Management Database (CMDB).",
    releaseNotes:
      "Australia & Brazil releases reinforce security admin elevation, CMDB Health, and Common Service Data Model (CSDM) alignment.",
    topics: [
      {
        title: "Tables, Dictionary & Schema Map",
        summary:
          "Understanding the relational architecture, table inheritance, and metadata catalog.",
        keyPoints: [
          "sys_dictionary: The master Data Dictionary table housing field names, types, max lengths, and mandatory flags.",
          "Table Inheritance: Child tables inherit all fields, relationships, and business logic from parent tables (e.g., Incident extends Task).",
          "Base Tables: Core tables that are extended by child tables but do not extend another table (e.g., Task, cmdb_ci).",
          "Custom Table Prefixes: 'u_' for global scope custom tables; 'x_[vendor]_[app]_' for scoped applications.",
          "sys_id: 32-character hexadecimal globally unique identifier for every record in the database.",
          "Schema Map: Visual graphical tool showing incoming and outgoing references and extensions for a table.",
        ],
        examTips:
          "A Reference field creates a One-to-Many relationship between two tables in the database.",
        pitfalls:
          "Do not confuse extending a table with referencing a table. Extending inherits all parent fields; referencing simply points to a single foreign record.",
      },
      {
        title: "Import Sets & Transform Maps",
        summary:
          "Ingesting external data from CSV, Excel, XML, or JDBC into target tables.",
        keyPoints: [
          "Import Set Table: Temporary staging table that receives raw data from an external source.",
          "Transform Map: Mapping rules connecting staging columns to target production fields.",
          "Coalesce: Identifies unique match keys. If match is found, updates existing record; if not found, inserts a new record.",
          "Multiple Coalesce: When multiple fields have coalesce enabled, all must match to trigger an update.",
        ],
        examTips:
          "Coalesce is critical for preventing duplicate records during recurring data loads.",
      },
      {
        title: "Access Control Lists (ACLs) & Security",
        summary:
          "Row-level and field-level database authorization engine.",
        keyPoints: [
          "security_admin: Elevated role required to create or modify Access Control (ACL) rules.",
          "table.none: Grants access to the table itself (row-level access). User must pass this to see any rows.",
          "table.*: Wildcard rule granting access to all fields on the table that don't have explicit field ACLs.",
          "table.field: Explicit field-level rule granting access to a specific column.",
          "ACL Evaluation Order: 1) Roles, 2) Conditions, 3) Advanced Script (all configured checks must evaluate to TRUE).",
        ],
        examTips:
          "Rule processing order: Table-level evaluated first, then Field-level evaluated second. Both must pass.",
      },
      {
        title: "CMDB & CI Relationships",
        summary:
          "Configuration Management Database structure, CI classes, and dependency relationships.",
        keyPoints: [
          "cmdb_ci: Base parent table for all Configuration Items (servers, databases, applications).",
          "cmdb_rel_ci: Table storing relationships between CIs (e.g., 'Runs on', 'Depends on', 'Powered by').",
          "Population Methods: ServiceNow Discovery, Service Mapping, Import Sets, Integration Hub REST APIs.",
          "Dependency Views: Graphical visualizer showing CI dependencies, upstream business services, and outage impacts.",
        ],
        examTips:
          "Discovery uses MID Servers (Management, Instrumentation, and Discovery) deployed on local networks to query hardware without opening inbound firewall ports.",
      },
    ],
    keyTerminology: [
      { term: "sys_id", definition: "32-character alphanumeric GUID uniquely identifying every ServiceNow database record." },
      { term: "Coalesce", definition: "Unique match field flag in Transform Maps that dictates insert vs update behavior." },
      { term: "security_admin", definition: "Elevated privilege required to alter Access Control Lists." },
      { term: "cmdb_rel_ci", definition: "Table tracking relationships between parent and child Configuration Items." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=db-admin",
  },

  // =========================================================================
  // DOMAIN 4: Self-Service & Process Automation (20%)
  // =========================================================================
  {
    slug: "automation",
    name: "Self-Service & Process Automation",
    weight: 20,
    questionCount: 12,
    overview:
      "This domain assesses knowledge of Knowledge Management workflows, the Service Catalog ecosystem, Record Producers, Order Guides, and Flow Designer automation.",
    releaseNotes:
      "Australia & Brazil releases emphasize Workflow Studio consolidation, Subflows, and Employee Center multi-department routing.",
    topics: [
      {
        title: "Knowledge Management & User Criteria",
        summary:
          "Authoring, categorizing, approving, and governing self-service knowledge articles.",
        keyPoints: [
          "User Criteria: Controls access to Knowledge Bases and Service Catalog items via 'Can Read' and 'Can Contribute'.",
          "Workflows: Out-of-the-box approval workflows including 'Instant Publish' and 'Approval Publish'.",
          "Feedback Loop: Users can rate articles (1-5 stars), mark helpful (Yes/No), and flag articles for revision.",
          "Social Q&A: Community-style question and answer forum integrated with Knowledge.",
        ],
        examTips:
          "User Criteria can evaluate roles, departments, locations, companies, or individual user lists.",
      },
      {
        title: "Service Catalog & Fulfillment Hierarchy",
        summary:
          "Self-service ordering system for goods, services, and record creation.",
        keyPoints: [
          "Catalog Hierarchy: Request [sc_request] → Requested Item [sc_req_item] → Catalog Task [sc_task].",
          "Variables: Questions asked to customers on catalog forms (e.g., Single Line Text, Multiple Choice, Reference, Checkbox).",
          "Variable Sets: Bundles of reusable variables shared across multiple catalog items.",
          "Record Producer: Catalog item providing a friendly front-end form to insert records on target tables (e.g., create an Incident).",
          "Order Guide: Guided multi-step ordering flow that dynamically bundles multiple catalog items based on user input.",
        ],
        examTips:
          "Remember the 3-tier catalog record hierarchy: REQ (cart) → RITM (items) → SCTASK (fulfillment work).",
      },
      {
        title: "Flow Designer & Workflow Studio",
        summary:
          "Modern no-code process automation engine replacing legacy graphical workflow editor.",
        keyPoints: [
          "Flow Structure: Triggers (Record Created/Updated, Scheduled, or Application) + Actions (Create Record, Send Email, Update Record).",
          "Data Pills: Draggable variables representing data outputs from triggers or previous actions.",
          "Subflows: Reusable sequences of actions that have defined Inputs and Outputs, called from other Flows without record triggers.",
          "Spokes: Bundles of Flow Designer actions for integrating with external platforms (e.g., Slack, Microsoft Teams).",
        ],
        examTips:
          "Flow Designer is ServiceNow's primary recommendation for workflow automation in modern releases.",
        pitfalls:
          "Do not use legacy Workflow Editor for new catalog items unless legacy features (like graphical rollback) are explicitly mandated.",
      },
    ],
    keyTerminology: [
      { term: "User Criteria", definition: "Granular access definitions governing who can read or contribute to catalog and knowledge items." },
      { term: "Data Pill", definition: "Visual variable representation in Flow Designer passed between action steps." },
      { term: "Record Producer", definition: "Catalog form that directly inserts records into standard platform tables." },
      { term: "Employee Center", definition: "Unified employee portal destination across IT, HR, Legal, and Facilities." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=automation",
  },

  // =========================================================================
  // DOMAIN 5: Introduction to Development (10%)
  // =========================================================================
  {
    slug: "development",
    name: "Introduction to Development",
    weight: 10,
    questionCount: 6,
    overview:
      "This domain tests foundational scripting and configuration governance: UI Policies, Data Policies, Client Scripts, Business Rules, and Update Sets.",
    releaseNotes:
      "Australia & Brazil releases emphasize client-side performance, modern ECMAScript standards, and source control via App Engine Studio.",
    topics: [
      {
        title: "UI Policies vs. Data Policies",
        summary:
          "Enforcing mandatory, read-only, and visible field behaviors without code.",
        keyPoints: [
          "UI Policies: Client-side rules executing only in the user browser when forms are displayed.",
          "Data Policies: Server-side rules enforcing mandatory and read-only constraints on both form submissions AND backend data imports (APIs, Import Sets).",
          "UI Policy Actions: Define field behaviors: Mandatory (True/False/Leave alone), Visible (True/False), Read-Only (True/False).",
          "Conversion: UI Policies can be converted directly into Data Policies via related links.",
        ],
        examTips:
          "Remember: UI Policies can hide fields; Data Policies cannot hide fields (they run on the server).",
      },
      {
        title: "Client Scripts",
        summary:
          "Client-side JavaScript executing in the user's browser to modify forms in real-time.",
        keyPoints: [
          "onLoad(): Executes when the form is initially loaded and rendered.",
          "onChange(): Executes when a specific field value is modified by the user.",
          "onSubmit(): Executes when the user clicks Save, Submit, or Update, before sending to the server.",
          "onCellEdit(): Executes when a user edits a cell directly within a list view.",
          "g_form API: GlideForm client-side API (e.g., g_form.setValue(), g_form.addErrorMessage()).",
          "g_user API: GlideUser API for current logged-in user details (e.g., g_user.hasRole()).",
        ],
        examTips:
          "Know the 4 Client Script types: onLoad, onChange, onSubmit, onCellEdit. This is tested on every CSA exam.",
      },
      {
        title: "Business Rules",
        summary:
          "Server-side JavaScript executing on database record insertions, updates, queries, and deletions.",
        keyPoints: [
          "Execution Timing: 'before' (before database commit), 'after' (after database commit), 'async' (queued in background), 'display' (before form renders for user).",
          "current & previous objects: 'current' represents the record being saved; 'previous' represents the record state before changes.",
          "GlideRecord: Server-side database querying API used inside Business Rules and Script Includes.",
        ],
        examTips:
          "Business Rules run on the SERVER, not in the user browser. They run even when records are updated via REST APIs or Import Sets.",
      },
      {
        title: "Update Sets & Migration Lifecycle",
        summary:
          "Capturing, packing, and deploying configurations between ServiceNow instances.",
        keyPoints: [
          "Captured: Customizations and configuration items (Business Rules, Client Scripts, Tables, Fields, Forms, Flows).",
          "NOT Captured: Data records (new Incidents, Users [sys_user], Groups, CIs) and Homepages/Dashboards unless manually exported.",
          "Lifecycle: Development (state: In Progress) → Completed → Retrieved in Target (Preview) → Commit.",
          "Collision Prevention: Merging update sets helps resolve sequence issues; always preview before committing.",
        ],
        examTips:
          "Update Sets capture customization/configuration, NEVER operational transactional data.",
      },
    ],
    keyTerminology: [
      { term: "Update Set", definition: "Container capturing point-in-time configuration changes for migration between environments." },
      { term: "GlideForm (g_form)", definition: "Client-side API for managing form fields and validations." },
      { term: "Data Policy", definition: "Server-enforced rule keeping fields mandatory and read-only regardless of entry method." },
      { term: "onCellEdit", definition: "Client script executing when updating values in list views without opening the form." },
    ],
    practiceUrl: "/certifications/csa/practice?domain=development",
  },
];

export const CAD_STUDY_GUIDES: DomainStudyGuide[] = [
  {
    slug: "app-design",
    name: "Designing and Creating Applications",
    weight: 15,
    questionCount: 9,
    overview: "Covers application scoping, ServiceNow Studio, App Engine Studio, source control integration (Git), and global vs private application architectures.",
    releaseNotes: "Aligned with Australia & Brazil releases, featuring App Engine Studio templates and Git multi-branch development.",
    topics: [
      {
        title: "Application Scoping & Isolation",
        summary: "Private application scopes protect applications from being broken by global code changes and provide explicit access boundaries.",
        keyPoints: [
          "Every scoped app has an artifact prefix (e.g., x_company_app).",
          "Scope isolation ensures tables and scripts are protected by default.",
          "Cross-Scope Access (Restricted Caller Access) enforces permission checks at runtime."
        ],
        examTips: "Global scope is legacy; new applications should always be built in private scopes.",
      }
    ],
    keyTerminology: [
      { term: "Application Scope", definition: "A namespace boundary that encapsulates all artifacts for an application." },
      { term: "RCA (Restricted Caller Access)", definition: "Mechanism to control cross-scope access to tables and script includes." }
    ],
    practiceUrl: "/certifications/cad/practice?domain=app-design"
  },
  {
    slug: "data-model",
    name: "Application Data Model & Security",
    weight: 25,
    questionCount: 15,
    overview: "Data model design, extending tables, field types, and Access Control Lists (ACLs) evaluated in order of security precedence.",
    releaseNotes: "Includes Data Filtration rules, ACL execution evaluation order, and Role-Based Access Control (RBAC).",
    topics: [
      {
        title: "Table Extension vs New Tables",
        summary: "Deciding when to extend an existing ServiceNow table (e.g., Task) versus creating a standalone new table.",
        keyPoints: [
          "Extending Task inherits workflow, assignment, state, and SLA capabilities.",
          "Standalone tables are preferred when records do not represent work or task lifecycles.",
          "Table limit pricing considerations apply when licensing custom tables."
        ],
        examTips: "Extending Task is best when you need assignment groups, work notes, and SLA tracking.",
      }
    ],
    keyTerminology: [
      { term: "ACL Precedence", definition: "Object-level ACL is checked first; if passed, field-level ACL is checked." }
    ],
    practiceUrl: "/certifications/cad/practice?domain=data-model"
  },
  {
    slug: "app-automation",
    name: "Automating Application Logic & Flows",
    weight: 30,
    questionCount: 18,
    overview: "Flow Designer subflows, triggers, actions, Script Includes, and Business Rules (Before, After, Async, Display).",
    releaseNotes: "Emphasizes Flow Designer over legacy Workflows, custom Action definitions, and Execution Forensics.",
    topics: [
      {
        title: "Flow Designer Architecture",
        summary: "Modern low-code automation engine replacing legacy graphical workflow editor.",
        keyPoints: [
          "Flows execute triggers (record created/updated, scheduled, or REST REST call).",
          "Actions bundle reusable discrete tasks; Subflows can be called from multiple flows.",
          "Execution details provide step-by-step auditing for troubleshooting."
        ],
        examTips: "Flow Designer is the default recommendation for business logic automation over legacy workflow.",
      }
    ],
    keyTerminology: [
      { term: "Subflow", definition: "A standalone, parameterized automation sequence with defined inputs and outputs." }
    ],
    practiceUrl: "/certifications/cad/practice?domain=app-automation"
  },
  {
    slug: "integration",
    name: "Scripting, REST APIs & Integration",
    weight: 20,
    questionCount: 12,
    overview: "REST Message outbound integrations, Scripted REST APIs (inbound), GlideRecord vs GlideRecordSecure, and client/server data exchanges.",
    releaseNotes: "Featuring OpenAPI specifications, OAuth 2.0 token profiles, and Integration Hub spokes.",
    topics: [
      {
        title: "Scripted REST APIs",
        summary: "Custom web service endpoints defined on the instance to process incoming HTTP requests.",
        keyPoints: [
          "Provides request and response GlideScriptable objects.",
          "Supports JSON and XML serialization.",
          "Security governed by ACLs of type 'rest_endpoint'."
        ],
        examTips: "Always use GlideRecordSecure or check canRead()/canWrite() when handling user input in REST APIs.",
      }
    ],
    keyTerminology: [
      { term: "Integration Hub", definition: "No-code integration spokes executing third-party API actions in Flow Designer." }
    ],
    practiceUrl: "/certifications/cad/practice?domain=integration"
  },
  {
    slug: "ui-experience",
    name: "User Interface & Workspace Views",
    weight: 10,
    questionCount: 6,
    overview: "Next Experience UI Builder, Form views, UI Actions, and Client Scripts (onLoad, onChange, onSubmit).",
    releaseNotes: "Next Experience component library and Workspace view rules.",
    topics: [
      {
        title: "UI Builder & Configurable Workspaces",
        summary: "Visual development environment for building web component-based portals and workspaces.",
        keyPoints: [
          "Uses Seiko component library and event handlers.",
          "Data resources bind GraphQL and REST queries to components."
        ],
        examTips: "UI Builder creates responsive experiences decoupled from classic UI16 forms.",
      }
    ],
    keyTerminology: [
      { term: "UI Action", definition: "Buttons, context menus, and links on forms and lists executing client or server code." }
    ],
    practiceUrl: "/certifications/cad/practice?domain=ui-experience"
  }
];

export function getTrackStudyGuides(trackId: string): DomainStudyGuide[] {
  const normalized = (trackId || "csa").toLowerCase();
  if (normalized === "csa") return CSA_STUDY_GUIDES;
  if (normalized === "cad") return CAD_STUDY_GUIDES;
  return CSA_STUDY_GUIDES;
}

export function getDomainStudyGuide(trackId: string, domainSlug: string): DomainStudyGuide | undefined {
  const guides = getTrackStudyGuides(trackId);
  return guides.find((g) => g.slug.toLowerCase() === domainSlug.toLowerCase());
}

