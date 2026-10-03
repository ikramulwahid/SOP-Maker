import { SOPDocument } from '../types/document';
import { ValidationError, ValidationEngine, ValidationResult } from './types';
import { extractPlainText } from '../models/content';
import { flattenSections } from '../operations/sectionOperations';

export class StandardValidationEngine implements ValidationEngine {
  validate(doc: SOPDocument): ValidationResult {
    const metadataErrors = this.validateMetadata(doc);
    const sectionErrors = this.validateSections(doc);
    const allIssues = [...metadataErrors, ...sectionErrors];

    const errors = allIssues.filter(i => i.severity === 'error');
    const warnings = allIssues.filter(i => i.severity === 'warning');
    const infos = allIssues.filter(i => i.severity === 'info');

    // Calculate document completeness score
    const requiredMetadataFields = [
      'title', 'sopNumber', 'version', 'effectiveDate', 
      'reviewDate', 'department', 'processOwner', 'author', 'approver'
    ] as const;

    let filledRequiredMeta = 0;
    requiredMetadataFields.forEach(f => {
      if (doc.metadata[f] && doc.metadata[f].trim() !== '') filledRequiredMeta++;
    });

    const allSections = flattenSections(doc.sections);
    const mandatorySections = allSections.filter(s => s.isMandatory);
    let filledSections = 0;
    mandatorySections.forEach(s => {
      const text = extractPlainText(s.content).trim();
      if (text.length > 10) filledSections++;
    });

    const totalWeight = requiredMetadataFields.length + mandatorySections.length;
    const earnedWeight = filledRequiredMeta + filledSections;
    const completionPercentage = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 100;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      infos,
      completionPercentage
    };
  }

  validateMetadata(doc: SOPDocument): ValidationError[] {
    const issues: ValidationError[] = [];
    const meta = doc.metadata;

    if (!meta.title || meta.title.trim() === '') {
      issues.push({ field: 'title', message: 'Document Title is required.', severity: 'error' });
    }
    if (!meta.sopNumber || meta.sopNumber.trim() === '') {
      issues.push({ field: 'sopNumber', message: 'Document ID / SOP Number is required.', severity: 'error' });
    }
    if (!meta.version || meta.version.trim() === '') {
      issues.push({ field: 'version', message: 'Version is required.', severity: 'error' });
    }
    if (!meta.department || meta.department.trim() === '') {
      issues.push({ field: 'department', message: 'Department is required.', severity: 'error' });
    }
    if (!meta.author || meta.author.trim() === '') {
      issues.push({ field: 'author', message: 'Author name is required.', severity: 'error' });
    }
    if (!meta.approver || meta.approver.trim() === '') {
      issues.push({ field: 'approver', message: 'Approver name is required.', severity: 'error' });
    }
    if (!meta.processOwner || meta.processOwner.trim() === '') {
      issues.push({ field: 'processOwner', message: 'Process Owner is required.', severity: 'error' });
    }

    if (meta.effectiveDate && meta.reviewDate) {
      const eff = new Date(meta.effectiveDate).getTime();
      const rev = new Date(meta.reviewDate).getTime();
      if (!isNaN(eff) && !isNaN(rev) && rev <= eff) {
        issues.push({ field: 'reviewDate', message: 'Review date must occur after the effective date.', severity: 'warning' });
      }
    }

    return issues;
  }

  validateSections(doc: SOPDocument): ValidationError[] {
    const issues: ValidationError[] = [];
    const allSections = flattenSections(doc.sections);

    allSections.forEach(section => {
      const text = extractPlainText(section.content).trim();
      if (section.isMandatory && text.length === 0) {
        issues.push({
          field: `section-${section.id}`,
          sectionId: section.id,
          message: `Mandatory section "${section.number} ${section.title}" has no content recorded.`,
          severity: 'error'
        });
      }
    });

    return issues;
  }
}

export const validationEngine = new StandardValidationEngine();
