import { SOPDocument } from '../types/document';

export interface ExportOptions {
  includeRevisionHistory?: boolean;
  includeSignatures?: boolean;
  includeCoverPage?: boolean;
}

export interface DocumentExporter {
  readonly formatId: string;
  readonly formatName: string;
  readonly fileExtension: string;
  readonly isSupported: boolean;
  readonly unsupportedReason?: string;
  exportDocument(doc: SOPDocument, options?: ExportOptions): Promise<void>;
}
