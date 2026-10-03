import { SOPDocument, SOPSection, TemplateStyleId, SOPMetadata } from '../types/document';
import { TEMPLATE_STYLES } from './styles';

export const DEFAULT_SECTION_TEMPLATES: Omit<SOPSection, 'id'>[] = [
  {
    number: '1.0',
    title: 'Document Information',
    content: '<p>This Standard Operating Procedure defines the mandatory standards and protocols for the specified laboratory process. All operators must verify the current active version before execution.</p>',
    isMandatory: true,
    category: 'admin'
  },
  {
    number: '2.0',
    title: 'Purpose',
    content: '<p>Describe the specific objective of this procedure, what it intends to accomplish, and the desired operational outcome.</p>',
    isMandatory: true,
    category: 'admin'
  },
  {
    number: '3.0',
    title: 'Scope',
    content: '<p>Specify the boundaries of applicability including affected facilities, laboratories, equipment models, and personnel roles.</p>',
    isMandatory: true,
    category: 'admin'
  },
  {
    number: '4.0',
    title: 'Responsibilities',
    content: '<p>Detail the roles and designated responsibilities for procedure execution, supervisor review, and quality assurance compliance.</p>',
    isMandatory: true,
    category: 'governance'
  },
  {
    number: '5.0',
    title: 'Definitions',
    content: '<p>Define technical acronyms, specialized terms, calibration definitions, and operational abbreviations used throughout this document.</p>',
    isMandatory: false,
    category: 'admin'
  },
  {
    number: '6.0',
    title: 'Prerequisites',
    content: '<p>List training certifications, ambient environmental conditions, pre-run system stabilizations, or staging tasks required before beginning.</p>',
    isMandatory: false,
    category: 'procedural'
  },
  {
    number: '7.0',
    title: 'Required Materials / Tools',
    content: '<p>Enumerate all certified reagents, reference standards, PPE, analytical instruments, and consumables required.</p>',
    isMandatory: true,
    category: 'procedural'
  },
  {
    number: '8.0',
    title: 'Safety / Precautions',
    content: '<p>Highlight critical safety warnings, hazard classes, personal protective equipment (PPE) mandates, and emergency shut-off actions.</p>',
    isMandatory: true,
    category: 'safety'
  },
  {
    number: '9.0',
    title: 'Procedure',
    content: '<p>Step-by-step sequential operational instructions. Each step must be clearly numbered, unambiguous, and specify quantitative targets where applicable.</p>',
    isMandatory: true,
    category: 'procedural'
  },
  {
    number: '10.0',
    title: 'Process Flow',
    content: '<p>High-level visual diagram description or logic flow summary outlining decision gates, sample routing, and hand-off milestones.</p>',
    isMandatory: false,
    category: 'procedural'
  },
  {
    number: '11.0',
    title: 'Troubleshooting',
    content: '<p>Diagnostic guide addressing common failure modes, calibration drift symptoms, corrective interventions, and out-of-spec escalation paths.</p>',
    isMandatory: false,
    category: 'quality'
  },
  {
    number: '12.0',
    title: 'Quality Checks',
    content: '<p>Verification criteria, acceptance thresholds, control sample tolerances, and duplicate analysis requirements to validate run integrity.</p>',
    isMandatory: true,
    category: 'quality'
  },
  {
    number: '13.0',
    title: 'References',
    content: '<p>Applicable regulatory standards (ISO 17025, cGMP, ASTM), instrument operating manuals, and corporate quality manual citations.</p>',
    isMandatory: false,
    category: 'governance'
  },
  {
    number: '14.0',
    title: 'Records / Documentation',
    content: '<p>Retention schedules, logbook filing requirements, electronic data archive locations, and batch record attachment specifications.</p>',
    isMandatory: true,
    category: 'governance'
  },
  {
    number: '15.0',
    title: 'Revision History',
    content: '<p>Summary record of all major and minor revisions, change justification notices, and historical version milestones.</p>',
    isMandatory: true,
    category: 'governance'
  },
  {
    number: '16.0',
    title: 'Approval',
    content: '<p>Formal authorization signatories affirming technical accuracy, safety compliance, and quality authorization.</p>',
    isMandatory: true,
    category: 'governance'
  }
];

export interface CreateDocumentOptions {
  title?: string;
  sopNumber?: string;
  version?: string;
  department?: string;
  author?: string;
  approver?: string;
  templateId?: TemplateStyleId;
  metadata?: Partial<SOPMetadata>;
}

export function createBlankDocument(options: CreateDocumentOptions = {}): SOPDocument {
  const templateId = options.templateId || 'corporate';
  const style = TEMPLATE_STYLES[templateId] || TEMPLATE_STYLES.corporate;
  const now = new Date().toISOString().split('T')[0];
  
  // Review date 1 year from now
  const reviewDateObj = new Date();
  reviewDateObj.setFullYear(reviewDateObj.getFullYear() + 1);
  const nextYear = reviewDateObj.toISOString().split('T')[0];

  const docId = `sop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const sections: SOPSection[] = DEFAULT_SECTION_TEMPLATES.map((tmpl, index) => ({
    id: `sec-${index + 1}`,
    number: tmpl.number,
    title: tmpl.title,
    content: tmpl.content,
    isMandatory: tmpl.isMandatory,
    category: tmpl.category,
    collapsed: false
  }));

  const metadata: SOPMetadata = {
    title: options.title || 'Standard Operating Procedure',
    sopNumber: options.sopNumber || `SOP-LAB-${Math.floor(100 + Math.random() * 900)}`,
    version: options.version || '1.0',
    effectiveDate: options.metadata?.effectiveDate || now,
    reviewDate: options.metadata?.reviewDate || nextYear,
    department: options.department || options.metadata?.department || 'Analytical Laboratory',
    processOwner: options.metadata?.processOwner || options.author || 'Lead Chemist',
    author: options.author || options.metadata?.author || 'Senior Lab Analyst',
    approver: options.approver || options.metadata?.approver || 'Quality Assurance Manager',
    confidentiality: options.metadata?.confidentiality || 'Internal',
    status: options.metadata?.status || 'Draft',
    organization: options.metadata?.organization || 'BioPharma Precision Technologies',
    location: options.metadata?.location || 'Central Research Facility - Building 4',
    category: options.metadata?.category || 'Analytical Chemistry',
    documentOwner: options.metadata?.documentOwner || 'Quality Control Unit',
    preparedBy: options.author || options.metadata?.preparedBy || 'Laboratory Operations Specialist',
    reviewedBy: options.metadata?.reviewedBy || 'Technical Supervisor',
    approvedBy: options.approver || options.metadata?.approvedBy || 'Quality Assurance Director',
    revisionSummary: options.metadata?.revisionSummary || 'Initial document creation and baseline establishment.',
    keywords: options.metadata?.keywords || ['Standard Operating Procedure', 'Laboratory', 'Protocol'],
    referenceDocuments: options.metadata?.referenceDocuments || ['ISO 9001:2015', 'Good Laboratory Practices (GLP)']
  };

  return {
    id: docId,
    schemaVersion: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata,
    branding: {
      companyName: metadata.organization || 'BioPharma Precision Technologies',
      facilityName: metadata.location || 'Central Analytical Core',
      departmentCode: 'LAB-ANL',
      headerText: 'CONFIDENTIAL & PROPRIETARY — STANDARD OPERATING PROCEDURE',
      footerText: 'Controlled Copy. Uncontrolled when printed. Verify valid active revision before use.'
    },
    pageSetup: {
      paperSize: 'A4',
      orientation: 'portrait',
      margins: {
        top: 25,
        right: 20,
        bottom: 25,
        left: 20,
        unit: 'mm'
      },
      showPageNumbers: true,
      showWatermark: false,
      watermarkText: 'DRAFT - NOT FOR PRODUCTION',
      headerDistanceMm: 12,
      footerDistanceMm: 12
    },
    style,
    sections,
    revisionHistory: [
      {
        id: 'rev-1',
        revision: '1.0',
        date: now,
        description: 'Initial release of Standard Operating Procedure.',
        author: metadata.author,
        approvedBy: metadata.approver
      }
    ],
    approvals: [
      {
        id: 'appr-1',
        role: 'Author / Method Developer',
        name: metadata.author,
        title: 'Analytical Method Specialist',
        signatureDate: now,
        status: 'Approved',
        comments: 'Draft verified against experimental validation parameters.'
      },
      {
        id: 'appr-2',
        role: 'Technical Reviewer',
        name: metadata.reviewedBy || 'Technical Supervisor',
        title: 'Lead Operations Supervisor',
        signatureDate: undefined,
        status: 'Pending',
        comments: 'Awaiting secondary instrumentation audit.'
      },
      {
        id: 'appr-3',
        role: 'Quality Assurance Director',
        name: metadata.approvedBy || 'Quality Assurance Director',
        title: 'Director of Regulatory Compliance',
        signatureDate: undefined,
        status: 'Pending',
        comments: 'Pending supervisor sign-off and safety audit.'
      }
    ],
    assets: [],
    settings: {
      autoSave: true,
      strictNumbering: true,
      locale: 'en-US',
      activeTemplateId: templateId
    }
  };
}
