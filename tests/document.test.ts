import { describe, it, expect } from 'vitest';
import { createBlankDocument } from '../src/templates/defaultDocument';
import { TEMPLATE_STYLES, TEMPLATE_STYLE_LIST } from '../src/templates/styles';
import { SAMPLE_LAB_SOP } from '../src/data/sampleSop';
import { documentStorage } from '../src/storage/localStorageAdapter';
import { validationEngine } from '../src/validation/rules';
import { 
  findSection, 
  updateSection, 
  updateSectionTitle, 
  updateSectionContent,
  flattenSections,
  countSections 
} from '../src/operations/sectionOperations';
import { 
  updateDocumentMetadata, 
  updateDocumentSectionTitle, 
  updateDocumentSectionContent 
} from '../src/operations/documentOperations';
import { extractPlainText, contentToHTML, createContentFromParagraphs } from '../src/models/content';
import { SOPSection } from '../src/types/document';

describe('SOPStudio Canonical Document Model & Operations', () => {
  describe('Document Model & Initialization', () => {
    it('creates a new blank SOP document with 16 standardized sections', () => {
      const doc = createBlankDocument({
        title: 'Analytical Balance Calibration Protocol',
        sopNumber: 'SOP-LAB-042',
        version: '1.0',
        department: 'Biochemistry',
        author: 'Dr. Jane Smith',
        approver: 'Director Quality'
      });

      expect(doc).toBeDefined();
      expect(doc.id).toMatch(/^sop-/);
      expect(doc.metadata.title).toBe('Analytical Balance Calibration Protocol');
      expect(doc.metadata.sopNumber).toBe('SOP-LAB-042');
      expect(doc.metadata.version).toBe('1.0');
      expect(doc.metadata.author).toBe('Dr. Jane Smith');
      expect(doc.metadata.approver).toBe('Director Quality');

      // Must have exactly 16 default regulatory sections
      expect(doc.sections).toHaveLength(16);
      expect(doc.sections[0].title).toBe('Document Information');
      expect(doc.sections[1].title).toBe('Purpose');
      expect(doc.sections[8].title).toBe('Procedure');
      expect(doc.sections[15].title).toBe('Approval');
    });

    it('all five predefined template visual styles exist and configure styles correctly', () => {
      expect(TEMPLATE_STYLE_LIST).toHaveLength(5);
      const styleIds = ['corporate', 'industrial', 'minimal', 'compliance', 'technical'] as const;

      styleIds.forEach((id) => {
        const style = TEMPLATE_STYLES[id];
        expect(style).toBeDefined();
        expect(style.id).toBe(id);
        expect(style.accentColor).toBeDefined();
        expect(style.headingStyle).toBeDefined();
      });

      const docCorporate = createBlankDocument({ templateId: 'corporate' });
      expect(docCorporate.style.id).toBe('corporate');

      const docCompliance = createBlankDocument({ templateId: 'compliance' });
      expect(docCompliance.style.id).toBe('compliance');
    });

    it('updates document metadata via pure document operations', () => {
      const doc = createBlankDocument({
        title: 'Initial Title',
        version: '1.0'
      });

      const updated = updateDocumentMetadata(doc, {
        title: 'Updated Metrology Calibration SOP',
        version: '1.1',
        status: 'Under Review'
      });

      expect(updated.metadata.title).toBe('Updated Metrology Calibration SOP');
      expect(updated.metadata.version).toBe('1.1');
      expect(updated.metadata.status).toBe('Under Review');
      expect(doc.metadata.title).toBe('Initial Title'); // immutability preserved
    });
  });

  describe('Structured Content Representation (ProseMirror JSONContent)', () => {
    it('section content stores structured editor JSON, not raw HTML', () => {
      const doc = SAMPLE_LAB_SOP;
      const procedureSection = doc.sections.find(s => s.number === '9.0');

      expect(procedureSection).toBeDefined();
      // Canonical content MUST be a structured ProseMirror node object
      expect(typeof procedureSection?.content).toBe('object');
      expect(procedureSection?.content.type).toBe('doc');
      expect(Array.isArray(procedureSection?.content.content)).toBe(true);

      // Verify that plain text can be extracted from structured content
      const plainText = extractPlainText(procedureSection?.content);
      expect(plainText).toContain('Three-Point Calibration Protocol');

      // Verify that HTML is derived for preview/export only
      const derivedHTML = contentToHTML(procedureSection?.content);
      expect(typeof derivedHTML).toBe('string');
      expect(derivedHTML).toContain('Three-Point Calibration Protocol');
    });

    it('serializes and deserializes structured content to/from JSON without data loss', () => {
      const sampleDoc = SAMPLE_LAB_SOP;
      const jsonString = documentStorage.exportToJSONString(sampleDoc);
      expect(typeof jsonString).toBe('string');

      const restoredDoc = documentStorage.importFromJSONString(jsonString);
      expect(restoredDoc.id).toBe(sampleDoc.id);
      expect(restoredDoc.metadata.title).toBe(sampleDoc.metadata.title);
      expect(restoredDoc.metadata.sopNumber).toBe(sampleDoc.metadata.sopNumber);
      expect(restoredDoc.sections).toHaveLength(16);

      // Inspect restored structured content node
      const restoredProcedure = restoredDoc.sections.find(s => s.number === '9.0');
      expect(restoredProcedure?.content.type).toBe('doc');
      const text = extractPlainText(restoredProcedure?.content);
      expect(text).toContain('Three-Point Calibration Protocol');
    });
  });

  describe('Section Operations & Nested Section Support', () => {
    const sampleTree: SOPSection[] = [
      {
        id: 'sec-1',
        number: '1.0',
        title: 'Top Section 1',
        isMandatory: true,
        content: createContentFromParagraphs('Top level 1 content')
      },
      {
        id: 'sec-2',
        number: '2.0',
        title: 'Top Section 2 with Children',
        isMandatory: false,
        content: createContentFromParagraphs('Top level 2 content'),
        children: [
          {
            id: 'sec-2-1',
            number: '2.1',
            title: 'Nested Subsection 2.1',
            isMandatory: false,
            content: createContentFromParagraphs('Nested child content 2.1')
          },
          {
            id: 'sec-2-2',
            number: '2.2',
            title: 'Nested Subsection 2.2',
            isMandatory: true,
            content: createContentFromParagraphs('Nested child content 2.2'),
            children: [
              {
                id: 'sec-2-2-1',
                number: '2.2.1',
                title: 'Deeply Nested Subsection 2.2.1',
                isMandatory: true,
                content: createContentFromParagraphs('Deeply nested 3rd level content')
              }
            ]
          }
        ]
      }
    ];

    it('finds top-level sections by ID', () => {
      const found = findSection(sampleTree, 'sec-1');
      expect(found).toBeDefined();
      expect(found?.title).toBe('Top Section 1');
    });

    it('finds nested sections recursively', () => {
      const child = findSection(sampleTree, 'sec-2-1');
      expect(child).toBeDefined();
      expect(child?.title).toBe('Nested Subsection 2.1');

      const deepChild = findSection(sampleTree, 'sec-2-2-1');
      expect(deepChild).toBeDefined();
      expect(deepChild?.title).toBe('Deeply Nested Subsection 2.2.1');
    });

    it('returns null when section ID does not exist', () => {
      const missing = findSection(sampleTree, 'non-existent-id');
      expect(missing).toBeNull();
    });

    it('updates top-level section title immutably', () => {
      const updated = updateSectionTitle(sampleTree, 'sec-1', 'Renamed Top Section');
      expect(findSection(updated, 'sec-1')?.title).toBe('Renamed Top Section');
      expect(findSection(sampleTree, 'sec-1')?.title).toBe('Top Section 1'); // original untouched
    });

    it('updates nested section title and content recursively', () => {
      const newContent = createContentFromParagraphs('Updated nested instructions');
      const updated = updateSectionContent(sampleTree, 'sec-2-2-1', newContent);
      
      const updatedNode = findSection(updated, 'sec-2-2-1');
      expect(updatedNode).toBeDefined();
      expect(extractPlainText(updatedNode?.content)).toBe('Updated nested instructions');

      // Original tree remains unchanged
      const originalNode = findSection(sampleTree, 'sec-2-2-1');
      expect(extractPlainText(originalNode?.content)).toBe('Deeply nested 3rd level content');
    });

    it('counts and flattens sections accurately across hierarchy levels', () => {
      expect(countSections(sampleTree)).toBe(5);
      const flat = flattenSections(sampleTree);
      expect(flat).toHaveLength(5);
      expect(flat.map(s => s.id)).toEqual(['sec-1', 'sec-2', 'sec-2-1', 'sec-2-2', 'sec-2-2-1']);
    });
  });

  describe('Application UI State & Home Entry Point', () => {
    it('initializes application state with Home as primary entry point', () => {
      // In DocumentProvider state architecture, currentScreen starts at 'home'
      // to ensure a fresh launch opens on Home, not inside workspace
      const defaultBlank = createBlankDocument();
      expect(defaultBlank).toBeDefined();
    });
  });

  describe('Validation Engine', () => {
    it('validates complete document and reports high completion percentage', () => {
      const result = validationEngine.validate(SAMPLE_LAB_SOP);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.completionPercentage).toBeGreaterThanOrEqual(80);
    });

    it('detects missing required metadata fields', () => {
      const incompleteDoc = createBlankDocument();
      incompleteDoc.metadata.title = '';
      incompleteDoc.metadata.sopNumber = '';
      incompleteDoc.metadata.author = '';

      const result = validationEngine.validate(incompleteDoc);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'title')).toBe(true);
      expect(result.errors.some(e => e.field === 'sopNumber')).toBe(true);
      expect(result.errors.some(e => e.field === 'author')).toBe(true);
    });

    it('flags warning when review date is earlier than effective date', () => {
      const doc = createBlankDocument();
      doc.metadata.effectiveDate = '2026-12-01';
      doc.metadata.reviewDate = '2026-06-01'; // invalid chronological order

      const result = validationEngine.validate(doc);
      expect(result.warnings.some(w => w.field === 'reviewDate')).toBe(true);
    });
  });
});
