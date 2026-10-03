import { DocumentSummary, SOPDocument } from '../types/document';

/**
 * Storage interface for SOP documents.
 * In M0, implemented via client-side LocalStorage.
 * Designed so that future indexedDB, cloud sync, or filesystem adapters
 * can be plugged in without refactoring UI layers.
 */
export interface DocumentStorage {
  save(document: SOPDocument): Promise<void>;
  get(id: string): Promise<SOPDocument | null>;
  listRecent(): Promise<DocumentSummary[]>;
  delete(id: string): Promise<void>;
  exportToJSONString(document: SOPDocument): string;
  importFromJSONString(json: string): SOPDocument;
}
