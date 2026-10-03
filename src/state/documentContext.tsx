import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { 
  SOPDocument, 
  SOPMetadata, 
  TemplateStyleId, 
  BrandingSettings, 
  PageSetup, 
  JSONContent 
} from '../types/document';
import { SAMPLE_LAB_SOP } from '../data/sampleSop';
import { createBlankDocument, CreateDocumentOptions } from '../templates/defaultDocument';
import { TEMPLATE_STYLES } from '../templates/styles';
import { documentStorage } from '../storage/localStorageAdapter';
import { 
  updateDocumentMetadata, 
  updateDocumentBranding, 
  updateDocumentPageSetup, 
  updateDocumentStyle, 
  updateDocumentSectionTitle, 
  updateDocumentSectionContent, 
  toggleDocumentSectionCollapse 
} from '../operations/documentOperations';
import { 
  HistoryState, 
  pushHistoryMilestone, 
  performUndoStep, 
  performRedoStep 
} from './historyManager';

export type ViewMode = 'editor' | 'preview' | 'split';
export type AppScreen = 'home' | 'workspace' | 'new-wizard';

interface DocumentContextType {
  document: SOPDocument;
  activeSectionId: string;
  viewMode: ViewMode;
  currentScreen: AppScreen;
  isDirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  lastSavedAt: string | null;

  // Navigation & Screen actions
  setCurrentScreen: (screen: AppScreen) => void;
  setViewMode: (mode: ViewMode) => void;
  setZoom: (zoom: number) => void;
  selectSection: (sectionId: string) => void;

  // Document Operations
  loadDocument: (doc: SOPDocument) => void;
  loadSampleDocument: () => void;
  startNewDocumentFlow: () => void;
  createNewDocument: (options: CreateDocumentOptions) => void;
  saveDocument: () => Promise<void>;
  
  // Granular Document Updates (operating on canonical model)
  updateMetadata: (metadata: Partial<SOPMetadata>) => void;
  updateBranding: (branding: Partial<BrandingSettings>) => void;
  updatePageSetup: (pageSetup: Partial<PageSetup>) => void;
  updateSectionContent: (sectionId: string, content: JSONContent) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  setTemplateStyle: (styleId: TemplateStyleId) => void;
  toggleSectionCollapse: (sectionId: string) => void;

  // History
  undo: () => void;
  redo: () => void;
}

const DocumentContext = createContext<DocumentContextType | null>(null);

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [document, setDocument] = useState<SOPDocument>(SAMPLE_LAB_SOP);
  const [activeSectionId, setActiveSectionId] = useState<string>(SAMPLE_LAB_SOP.sections[0]?.id || 'sec-1');
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  
  // Correct M0 initial state: App MUST launch on 'home', not inside workspace
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(100);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<SOPDocument[]>([]);
  const [redoStack, setRedoStack] = useState<SOPDocument[]>([]);

  // Prevent undo recording during undo/redo execution
  const isUndoRedoAction = useRef(false);

  // Keystroke debouncing ref for rich text editor typing
  const typingBaselineDoc = useRef<SOPDocument | null>(null);
  const typingDebounceTimer = useRef<number | null>(null);

  const flushTypingHistory = useCallback(() => {
    if (typingDebounceTimer.current) {
      window.clearTimeout(typingDebounceTimer.current);
      typingDebounceTimer.current = null;
    }
    if (typingBaselineDoc.current && !isUndoRedoAction.current) {
      const snapshot = typingBaselineDoc.current;
      typingBaselineDoc.current = null;
      setUndoStack(prev => {
        const nextState = pushHistoryMilestone({ undoStack: prev, redoStack: [] }, snapshot);
        return nextState.undoStack;
      });
      setRedoStack([]);
      setIsDirty(true);
    }
  }, []);

  const pushImmediateHistory = useCallback((prevDoc: SOPDocument) => {
    if (isUndoRedoAction.current) return;
    flushTypingHistory();
    setUndoStack(prev => {
      const nextState = pushHistoryMilestone({ undoStack: prev, redoStack: [] }, prevDoc);
      return nextState.undoStack;
    });
    setRedoStack([]);
    setIsDirty(true);
  }, [flushTypingHistory]);

  const selectSection = useCallback((sectionId: string) => {
    flushTypingHistory();
    setActiveSectionId(sectionId);
  }, [flushTypingHistory]);

  const loadDocument = useCallback((doc: SOPDocument) => {
    flushTypingHistory();
    setDocument(doc);
    setActiveSectionId(doc.sections[0]?.id || '');
    setUndoStack([]);
    setRedoStack([]);
    setIsDirty(false);
    setCurrentScreen('workspace');
  }, [flushTypingHistory]);

  const loadSampleDocument = useCallback(() => {
    loadDocument(SAMPLE_LAB_SOP);
  }, [loadDocument]);

  const startNewDocumentFlow = useCallback(() => {
    flushTypingHistory();
    setCurrentScreen('new-wizard');
  }, [flushTypingHistory]);

  const createNewDocument = useCallback((options: CreateDocumentOptions) => {
    const newDoc = createBlankDocument(options);
    loadDocument(newDoc);
    documentStorage.save(newDoc).then(() => {
      setLastSavedAt(new Date().toLocaleTimeString());
    });
  }, [loadDocument]);

  const saveDocument = useCallback(async () => {
    flushTypingHistory();
    await documentStorage.save(document);
    setIsDirty(false);
    setLastSavedAt(new Date().toLocaleTimeString());
  }, [document, flushTypingHistory]);

  const updateMetadata = useCallback((patch: Partial<SOPMetadata>) => {
    setDocument(prev => {
      pushImmediateHistory(prev);
      return updateDocumentMetadata(prev, patch);
    });
  }, [pushImmediateHistory]);

  const updateBranding = useCallback((patch: Partial<BrandingSettings>) => {
    setDocument(prev => {
      pushImmediateHistory(prev);
      return updateDocumentBranding(prev, patch);
    });
  }, [pushImmediateHistory]);

  const updatePageSetup = useCallback((patch: Partial<PageSetup>) => {
    setDocument(prev => {
      pushImmediateHistory(prev);
      return updateDocumentPageSetup(prev, patch);
    });
  }, [pushImmediateHistory]);

  // Structured JSONContent update with typing history burst debouncing
  const updateSectionContent = useCallback((sectionId: string, content: JSONContent) => {
    setDocument(prev => {
      // Capture the state prior to this burst of typing if not already captured
      if (!typingBaselineDoc.current) {
        typingBaselineDoc.current = prev;
      }

      // Reset debounce timer: if typing pauses for 1000ms, commit history milestone
      if (typingDebounceTimer.current) {
        window.clearTimeout(typingDebounceTimer.current);
      }
      typingDebounceTimer.current = window.setTimeout(() => {
        flushTypingHistory();
      }, 1000);

      setIsDirty(true);
      return updateDocumentSectionContent(prev, sectionId, content);
    });
  }, [flushTypingHistory]);

  const updateSectionTitle = useCallback((sectionId: string, title: string) => {
    setDocument(prev => {
      pushImmediateHistory(prev);
      return updateDocumentSectionTitle(prev, sectionId, title);
    });
  }, [pushImmediateHistory]);

  const setTemplateStyle = useCallback((styleId: TemplateStyleId) => {
    const style = TEMPLATE_STYLES[styleId];
    if (!style) return;

    setDocument(prev => {
      pushImmediateHistory(prev);
      return updateDocumentStyle(prev, style);
    });
  }, [pushImmediateHistory]);

  const toggleSectionCollapse = useCallback((sectionId: string) => {
    setDocument(prev => toggleDocumentSectionCollapse(prev, sectionId));
  }, []);

  const undo = useCallback(() => {
    flushTypingHistory();
    if (undoStack.length === 0) return;
    isUndoRedoAction.current = true;

    const result = performUndoStep({ undoStack, redoStack }, document);
    if (result) {
      setUndoStack(result.state.undoStack);
      setRedoStack(result.state.redoStack);
      setDocument(result.nextDoc);
      setIsDirty(true);
    }

    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 50);
  }, [undoStack, redoStack, document, flushTypingHistory]);

  const redo = useCallback(() => {
    flushTypingHistory();
    if (redoStack.length === 0) return;
    isUndoRedoAction.current = true;

    const result = performRedoStep({ undoStack, redoStack }, document);
    if (result) {
      setUndoStack(result.state.undoStack);
      setRedoStack(result.state.redoStack);
      setDocument(result.nextDoc);
      setIsDirty(true);
    }

    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 50);
  }, [redoStack, undoStack, document, flushTypingHistory]);

  // Initial local storage check - seed demonstration sample silently if absent
  useEffect(() => {
    documentStorage.get(SAMPLE_LAB_SOP.id).then(stored => {
      if (!stored) {
        documentStorage.save(SAMPLE_LAB_SOP).catch(() => {});
      }
    });
  }, []);

  const value: DocumentContextType = {
    document,
    activeSectionId,
    viewMode,
    currentScreen,
    isDirty,
    canUndo: undoStack.length > 0 || typingBaselineDoc.current !== null,
    canRedo: redoStack.length > 0,
    zoom,
    lastSavedAt,
    setCurrentScreen,
    setViewMode,
    setZoom,
    selectSection,
    loadDocument,
    loadSampleDocument,
    startNewDocumentFlow,
    createNewDocument,
    saveDocument,
    updateMetadata,
    updateBranding,
    updatePageSetup,
    updateSectionContent,
    updateSectionTitle,
    setTemplateStyle,
    toggleSectionCollapse,
    undo,
    redo
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export const useSOP = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useSOP must be used within a DocumentProvider');
  }
  return context;
};
