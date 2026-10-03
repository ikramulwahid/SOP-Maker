import { SOPDocument } from '../types/document';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationError {
  field: string;
  sectionId?: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  infos: ValidationError[];
  completionPercentage: number;
}

export interface ValidationEngine {
  validate(document: SOPDocument): ValidationResult;
  validateMetadata(document: SOPDocument): ValidationError[];
  validateSections(document: SOPDocument): ValidationError[];
}
