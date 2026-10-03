import { SOPDocument, SOPSection } from '../types/document';

/**
 * Proposed change from an AI evaluation/assistance operation.
 * Every AI recommendation must be reviewed and accepted by a human operator
 * before modifying the underlying SOPDocument.
 */
export interface AISuggestion {
  id: string;
  targetSectionId?: string;
  type: 'language_refinement' | 'safety_gap' | 'missing_section' | 'clarity_improvement';
  title: string;
  originalText?: string;
  proposedText: string;
  rationale: string;
  confidenceScore: number;
}

export interface AIService {
  readonly isAvailable: boolean;
  readonly statusMessage: string;

  /**
   * Identifies safety oversights or missing protective parameters in procedure sections.
   */
  detectSafetyGaps(document: SOPDocument): Promise<AISuggestion[]>;

  /**
   * Refines language to ensure unambiguous, imperative instructional syntax.
   */
  improveProceduralClarity(section: SOPSection): Promise<AISuggestion>;

  /**
   * Identifies missing sections or gaps compared to regulatory standards (ISO 17025, cGMP).
   */
  suggestMissingSections(document: SOPDocument): Promise<AISuggestion[]>;
}

/**
 * Clean architectural stub for M0.
 * Confirms that AI functionality is ready for integration in future work packages
 * without executing simulated or fake responses.
 */
export class DeferredAIService implements AIService {
  readonly isAvailable = false;
  readonly statusMessage = 'AI Assistance (Gemini) is scheduled for Work Package M3. All document authoring operates strictly client-side in M0.';

  async detectSafetyGaps(_document: SOPDocument): Promise<AISuggestion[]> {
    throw new Error(this.statusMessage);
  }

  async improveProceduralClarity(_section: SOPSection): Promise<AISuggestion> {
    throw new Error(this.statusMessage);
  }

  async suggestMissingSections(_document: SOPDocument): Promise<AISuggestion[]> {
    throw new Error(this.statusMessage);
  }
}

export const aiService: AIService = new DeferredAIService();
