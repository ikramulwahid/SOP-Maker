import { 
  SOPDocument, 
  SOPMetadata, 
  BrandingSettings, 
  PageSetup, 
  SOPStyle, 
  JSONContent 
} from '../types/document';
import { 
  updateSectionTitle, 
  updateSectionContent, 
  toggleSectionCollapse 
} from './sectionOperations';

/**
 * Pure non-React document operations.
 * These functions take an immutable SOPDocument and return a new SOPDocument
 * with updated timestamps and patched properties.
 * Reusable by editor, outline, validation, importers, exporters, and future AI tools.
 */

export function touchDocument(doc: SOPDocument): SOPDocument {
  return {
    ...doc,
    updatedAt: new Date().toISOString()
  };
}

export function updateDocumentMetadata(
  doc: SOPDocument,
  patch: Partial<SOPMetadata>
): SOPDocument {
  return {
    ...doc,
    updatedAt: new Date().toISOString(),
    metadata: {
      ...doc.metadata,
      ...patch
    }
  };
}

export function updateDocumentBranding(
  doc: SOPDocument,
  patch: Partial<BrandingSettings>
): SOPDocument {
  return {
    ...doc,
    updatedAt: new Date().toISOString(),
    branding: {
      ...doc.branding,
      ...patch
    }
  };
}

export function updateDocumentPageSetup(
  doc: SOPDocument,
  patch: Partial<PageSetup>
): SOPDocument {
  return {
    ...doc,
    updatedAt: new Date().toISOString(),
    pageSetup: {
      ...doc.pageSetup,
      ...patch
    }
  };
}

export function updateDocumentStyle(
  doc: SOPDocument,
  style: SOPStyle
): SOPDocument {
  return {
    ...doc,
    updatedAt: new Date().toISOString(),
    style,
    settings: {
      ...doc.settings,
      activeTemplateId: style.id
    }
  };
}

export function updateDocumentSectionTitle(
  doc: SOPDocument,
  sectionId: string,
  title: string
): SOPDocument {
  return {
    ...doc,
    updatedAt: new Date().toISOString(),
    sections: updateSectionTitle(doc.sections, sectionId, title)
  };
}

export function updateDocumentSectionContent(
  doc: SOPDocument,
  sectionId: string,
  content: JSONContent
): SOPDocument {
  return {
    ...doc,
    updatedAt: new Date().toISOString(),
    sections: updateSectionContent(doc.sections, sectionId, content)
  };
}

export function toggleDocumentSectionCollapse(
  doc: SOPDocument,
  sectionId: string
): SOPDocument {
  return {
    ...doc,
    sections: toggleSectionCollapse(doc.sections, sectionId)
  };
}
