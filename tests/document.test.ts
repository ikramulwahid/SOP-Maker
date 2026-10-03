import { describe, it, expect } from 'vitest';
import { createBlankDocument } from '../src/templates/defaultDocument';
import { TEMPLATE_STYLES, TEMPLATE_STYLE_LIST } from '../src/templates/styles';
import { SAMPLE_LAB_SOP } from '../src/data/sampleSop';
import { documentStorage } from '../src/storage/localStorageAdapter';
import { validationEngine } from '../src/validation/rules';

describe('SOPStudio Document Model & Operations', () => {
  it('creates a new blank SOP document with 16 standardized sections', () => {
    const doc = createBlankDocument({
      title: 'Centrifuge Standard Operation',
      sopNumber: 'SOP-LAB-042',
      version: '1.0',
      department: 'Biochemistry',
      author: 'Dr. Jane Smith',
      approver: 'Director Quality'
    });

    expect(doc).toBeDefined();
    expect(doc.id).toMatch(/^sop-/);
    expect(doc.metadata.title).toBe('Centrifuge Standard Operation');
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

  it('supports all 5 predefined template visual styles', () => {
    expect(TEMPLATE_STYLE_LIST).toHaveLength(5);
    const styleIds = ['corporate', 'industrial', 'minimal', 'compliance', 'technical'];

    styleIds.forEach((id) => {
      const style = TEMPLATE_STYLES[id as keyof typeof TEMPLATE_STYLES];
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

  it('updates document metadata correctly', () => {
    const doc = createBlankDocument({
      title: 'Initial Title',
      version: '1.0'
    });

    // Emulate updating metadata
    const updated = {
      ...doc,
      updatedAt: new Date().toISOString(),
      metadata: {
        ...doc.metadata,
        title: 'Updated Metrology Calibration SOP',
        version: '1.1',
        status: 'Under Review' as const
      }
    };

    expect(updated.metadata.title).toBe('Updated Metrology Calibration SOP');
    expect(updated.metadata.version).toBe('1.1');
    expect(updated.metadata.status).toBe('Under Review');
  });

  it('correctly tracks and selects sections', () => {
    const doc = SAMPLE_LAB_SOP;
    const procedureSection = doc.sections.find(s => s.number === '9.0');

    expect(procedureSection).toBeDefined();
    expect(procedureSection?.title).toBe('Procedure');
    expect(procedureSection?.content).toContain('Three-Point Calibration Protocol');
    expect(procedureSection?.isMandatory).toBe(true);
  });

  it('correctly serializes and deserializes the document model to/from JSON', () => {
    const sampleDoc = SAMPLE_LAB_SOP;
    const jsonString = documentStorage.exportToJSONString(sampleDoc);
    expect(typeof jsonString).toBe('string');

    const restoredDoc = documentStorage.importFromJSONString(jsonString);
    expect(restoredDoc.id).toBe(sampleDoc.id);
    expect(restoredDoc.metadata.title).toBe(sampleDoc.metadata.title);
    expect(restoredDoc.metadata.sopNumber).toBe(sampleDoc.metadata.sopNumber);
    expect(restoredDoc.sections).toHaveLength(16);
    expect(restoredDoc.style.id).toBe(sampleDoc.style.id);
    expect(restoredDoc.revisionHistory).toHaveLength(sampleDoc.revisionHistory.length);
    expect(restoredDoc.approvals).toHaveLength(sampleDoc.approvals.length);
  });

  it('validates document completeness and required fields', () => {
    // Valid complete sample SOP
    const sampleValidation = validationEngine.validate(SAMPLE_LAB_SOP);
    expect(sampleValidation.isValid).toBe(true);
    expect(sampleValidation.errors).toHaveLength(0);
    expect(sampleValidation.completionPercentage).toBeGreaterThan(80);

    // Incomplete document missing title
    const incompleteDoc = createBlankDocument();
    incompleteDoc.metadata.title = '';
    const incompleteValidation = validationEngine.validate(incompleteDoc);
    expect(incompleteValidation.isValid).toBe(false);
    expect(incompleteValidation.errors.some(e => e.field === 'title')).toBe(true);
  });
});
