/**
 * SOPStudio - Structured Document Model
 * 
 * Strict TypeScript representation of a Standard Operating Procedure (SOP).
 * All UI modules (Editor, Outline, Metadata Panel, Preview, Validation, Exporters)
 * operate on this canonical data model.
 */

import type { JSONContent } from '@tiptap/core';

export type { JSONContent };

export type SOPStatus = 'Draft' | 'Under Review' | 'Approved' | 'Obsolete';

export type ConfidentialityLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted';

export type PaperSize = 'A4' | 'Letter' | 'Legal';
export type PageOrientation = 'portrait' | 'landscape';

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
  unit: 'mm' | 'in';
}

/**
 * Page setup configuration stored in canonical document.
 * Note: M0 renders an A4 portrait document preview prototype. Full multi-format
 * layout engine and custom margins are scheduled for the M2 pagination milestone.
 */
export interface PageSetup {
  paperSize: PaperSize;
  orientation: PageOrientation;
  margins: PageMargins;
  showPageNumbers: boolean;
  showWatermark: boolean;
  watermarkText?: string;
  headerDistanceMm: number;
  footerDistanceMm: number;
}

export interface BrandingSettings {
  logoUrl?: string;
  companyName: string;
  facilityName?: string;
  departmentCode?: string;
  headerText?: string;
  footerText?: string;
}

export interface SOPMetadata {
  // Required fields
  title: string;
  sopNumber: string; // Document ID / SOP Number
  version: string;
  effectiveDate: string;
  reviewDate: string;
  department: string;
  processOwner: string;
  author: string;
  approver: string;
  confidentiality: ConfidentialityLevel;
  status: SOPStatus;

  // Optional fields
  organization?: string;
  location?: string;
  category?: string;
  documentOwner?: string;
  preparedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  revisionSummary?: string;
  keywords?: string[];
  referenceDocuments?: string[];
}

export type SectionCategory = 'admin' | 'procedural' | 'safety' | 'governance' | 'quality';

export interface SOPSection {
  id: string;
  number: string; // e.g. "1.0", "2.0", "8.1"
  title: string;
  /**
   * Canonical structured rich-text representation (Tiptap/ProseMirror JSONContent).
   * Raw HTML is never the canonical data format; it is derived strictly for rendering/export.
   */
  content: JSONContent;
  isMandatory: boolean;
  category?: SectionCategory;
  collapsed?: boolean;
  children?: SOPSection[];
  notes?: string;
}

export interface RevisionEntry {
  id: string;
  revision: string;
  date: string;
  description: string;
  author: string;
  approvedBy: string;
}

export interface ApprovalEntry {
  id: string;
  role: string;
  name: string;
  title: string;
  signatureDate?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  comments?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'diagram' | 'chart' | 'attachment';
  url: string;
  caption?: string;
  fileSize?: number;
}

export interface SOPSettings {
  autoSave: boolean;
  strictNumbering: boolean;
  locale: string;
  activeTemplateId: TemplateStyleId;
}

export type TemplateStyleId = 'corporate' | 'industrial' | 'minimal' | 'compliance' | 'technical';

export interface SOPStyle {
  id: TemplateStyleId;
  name: string;
  tagline: string;
  description: string;
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  accentColor: string;
  secondaryColor: string;
  headingStyle: 'underline' | 'bar' | 'border-bottom' | 'boxed' | 'minimal';
  headerFooterStyle: 'classic' | 'boxed' | 'clean' | 'technical' | 'heavy';
  tableStyle: 'bordered' | 'striped' | 'minimal' | 'technical' | 'compliance';
  borderAccent: string;
  badgeStyle: 'soft' | 'solid' | 'outline';
}

export interface SOPDocument {
  id: string;
  schemaVersion: string;
  createdAt: string;
  updatedAt: string;
  metadata: SOPMetadata;
  branding: BrandingSettings;
  pageSetup: PageSetup;
  style: SOPStyle;
  sections: SOPSection[];
  revisionHistory: RevisionEntry[];
  approvals: ApprovalEntry[];
  assets: Asset[];
  settings: SOPSettings;
}

export interface DocumentSummary {
  id: string;
  title: string;
  sopNumber: string;
  version: string;
  department: string;
  status: SOPStatus;
  updatedAt: string;
  templateId: TemplateStyleId;
}
