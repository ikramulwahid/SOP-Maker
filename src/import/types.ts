import { SOPDocument } from '../types/document';

export interface DocumentImporter {
  readonly formatId: string;
  readonly formatName: string;
  readonly acceptedExtensions: string[];
  readonly isSupported: boolean;
  readonly unsupportedReason?: string;
  importDocument(file: File): Promise<SOPDocument>;
}
