import { SOPDocument, SOPSection, TemplateStyleId, SOPMetadata } from '../types/document';
import { TEMPLATE_STYLES } from './styles';
import { createContentFromParagraphs } from '../models/content';

export const DEFAULT_SECTION_TEMPLATES: Omit<SOPSection, 'id'>[] = [
  {
    number: '1.0',
    title: 'Document Information',
    content: createContentFromParagraphs(
      'This Standard Operating Procedure establishes standardized instructions and operational standards for the specified laboratory process. Operators must review the active revision before execution.'
    ),
    isMandatory: true,
    category: 'admin'
  },
  {
    number: '2.0',
    title: 'Purpose',
    content: createContentFromParagraphs(
      'Describe the specific objective of this procedure, what process it standardizes, and the desired operational outcome.'
    ),
    isMandatory: true,
    category: 'admin'
  },
  {
    number: '3.0',
    title: 'Scope',
    content: createContentFromParagraphs(
      'Specify the boundaries of applicability including affected facilities, laboratories, equipment models, and personnel roles.'
    ),
    isMandatory: true,
    category: 'admin'
  },
  {
    number: '4.0',
    title: 'Responsibilities',
    content: createContentFromParagraphs(
      'Detail designated roles and responsibilities for procedure execution, supervisor verification, and quality oversight.'
    ),
    isMandatory: true,
    category: 'governance'
  },
  {
    number: '5.0',
    title: 'Definitions',
    content: createContentFromParagraphs(
      'Define technical acronyms, specialized terms, calibration definitions, and operational abbreviations used throughout this document.'
    ),
    isMandatory: false,
    category: 'admin'
  },
  {
    number: '6.0',
    title: 'Prerequisites',
    content: createContentFromParagraphs(
      'List training qualifications, ambient environmental conditions, pre-run system stabilizations, or staging tasks required before beginning.'
    ),
    isMandatory: false,
    category: 'procedural'
  },
  {
    number: '7.0',
    title: 'Required Materials / Tools',
    content: createContentFromParagraphs(
      'Enumerate all certified reagents, reference standards, PPE, analytical instruments, and consumables required.'
    ),
    isMandatory: true,
    category: 'procedural'
  },
  {
    number: '8.0',
    title: 'Safety / Precautions',
    content: createContentFromParagraphs(
      'Highlight safety warnings, hazard classes, personal protective equipment (PPE) mandates, and emergency shut-off actions.'
    ),
    isMandatory: true,
    category: 'safety'
  },
  {
    number: '9.0',
    title: 'Procedure',
    content: createContentFromParagraphs(
      'Step-by-step sequential operational instructions. Each step must be clearly numbered, unambiguous, and specify quantitative targets where applicable.'
    ),
    isMandatory: true,
    category: 'procedural'
  },
  {
    number: '10.0',
    title: 'Process Flow',
    content: createContentFromParagraphs(
      'High-level operational sequence or logic flow summary outlining decision gates, sample routing, and hand-off milestones.'
    ),
    isMandatory: false,
    category: 'procedural'
  },
  {
    number: '11.0',
    title: 'Troubleshooting',
    content: createContentFromParagraphs(
      'Diagnostic guide addressing common failure modes, calibration drift symptoms, corrective interventions, and out-of-spec escalation paths.'
    ),
    isMandatory: false,
    category: 'quality'
  },
  {
    number: '12.0',
    title: 'Quality Checks',
    content: createContentFromParagraphs(
      'Verification criteria, acceptance thresholds, control sample tolerances, and duplicate analysis requirements to validate run integrity.'
    ),
    isMandatory: true,
    category: 'quality'
  },
  {
    number: '13.0',
    title: 'References',
    content: createContentFromParagraphs(
      'Applicable organizational procedures, manufacturer operating manuals, and quality system guidelines.'
    ),
    isMandatory: false,
    category: 'governance'
  },
  {
    number: '14.0',
    title: 'Records / Documentation',
    content: createContentFromParagraphs(
      'Retention schedules, logbook filing requirements, electronic data archive locations, and batch record attachment specifications.'
    ),
    isMandatory: true,
    category: 'governance'
  },
  {
    number: '15.0',
    title: 'Revision History',
    content: createContentFromParagraphs(
      'Summary record of all major and minor revisions, change justification notices, and historical version milestones.'
    ),
    isMandatory: true,
    category: 'governance'
  },
  {
    number: '16.0',
    title: 'Approval',
    content: createContentFromParagraphs(
      'Formal authorization signatories affirming operational suitability, technical clarity, and organizational approval.'
    ),
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
    processOwner: options.metadata?.processOwner || options.author || 'Process Owner',
    author: options.author || options.metadata?.author || 'Document Author',
    approver: options.approver || options.metadata?.approver || 'Quality Approver',
    confidentiality: options.metadata?.confidentiality || 'Internal',
    status: options.metadata?.status || 'Draft',
    organization: options.metadata?.organization || 'BioPharma Precision Technologies',
    location: options.metadata?.location || 'Central Facility - Suite 204',
    category: options.metadata?.category || 'Analytical Method',
    documentOwner: options.metadata?.documentOwner || 'Quality Unit',
    preparedBy: options.author || options.metadata?.preparedBy || 'Document Author',
    reviewedBy: options.metadata?.reviewedBy || 'Technical Reviewer',
    approvedBy: options.approver || options.metadata?.approvedBy || 'Quality Approver',
    revisionSummary: options.metadata?.revisionSummary || 'Initial document creation and baseline establishment.',
    keywords: options.metadata?.keywords || ['Standard Operating Procedure', 'Laboratory', 'Protocol'],
    referenceDocuments: options.metadata?.referenceDocuments || ['Quality Management Manual', 'Instrument Operation Guide']
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
      headerText: 'STANDARD OPERATING PROCEDURE — CONTROLLED DOCUMENTATION',
      footerText: 'Controlled document copy. Verify active revision before operational use.'
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
      watermarkText: 'DRAFT',
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
        title: 'Analytical Specialist',
        signatureDate: now,
        status: 'Approved',
        comments: 'Draft verified against operational requirements.'
      },
      {
        id: 'appr-2',
        role: 'Technical Reviewer',
        name: metadata.reviewedBy || 'Technical Reviewer',
        title: 'Operations Supervisor',
        signatureDate: undefined,
        status: 'Pending',
        comments: 'Pending peer technical review.'
      },
      {
        id: 'appr-3',
        role: 'Quality Approver',
        name: metadata.approvedBy || 'Quality Approver',
        title: 'Quality Assurance Manager',
        signatureDate: undefined,
        status: 'Pending',
        comments: 'Pending final authorization review.'
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
