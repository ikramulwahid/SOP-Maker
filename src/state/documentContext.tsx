import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { SOPDocument, SOPMetadata, SOPSection, TemplateStyleId, BrandingSettings, PageSetup } from '../types/document';
import { SAMPLE_LAB_SOP } from '../data/sampleSop';
import { createBlankDocument, CreateDocumentOptions } from '../templates/defaultDocument';
import { TEMPLATE_STYLES } from '../templates/styles';
import { documentStorage } from '../storage/localStorageAdapter';

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
  
  // Granular Document Updates
  updateMetadata: (metadata: Partial<SOPMetadata>) => void;
  updateBranding: (branding: Partial<BrandingSettings>) => void;
  updatePageSetup: (pageSetup: Partial<PageSetup>) => void;
  updateSectionContent: (sectionId: string, content: string) => void;
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
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('workspace');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(100);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<SOPDocument[]>([]);
  const [redoStack, setRedoStack] = useState<SOPDocument[]>([]);

  // Prevent undo recording during undo/redo actions
  const isUndoRedoAction = useRef(false);

  // Push to history helper
  const pushHistory = useCallback((prevDoc: SOPDocument) => {
    if (isUndoRedoAction.current) return;
    setUndoStack(prev => [...prev.slice(-20), prevDoc]); // keep last 20 revisions
    setRedoStack([]); // clear redo on new modification
    setIsDirty(true);
  }, []);

  const selectSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
  }, []);

  const loadDocument = useCallback((doc: SOPDocument) => {
    setDocument(doc);
    setActiveSectionId(doc.sections[0]?.id || '');
    setUndoStack([]);
    setRedoStack([]);
    setIsDirty(false);
    setCurrentScreen('workspace');
  }, []);

  const loadSampleDocument = useCallback(() => {
    loadDocument(SAMPLE_LAB_SOP);
  }, [loadDocument]);

  const startNewDocumentFlow = useCallback(() => {
    setCurrentScreen('new-wizard');
  }, []);

  const createNewDocument = useCallback((options: CreateDocumentOptions) => {
    const newDoc = createBlankDocument(options);
    loadDocument(newDoc);
    documentStorage.save(newDoc).then(() => {
      setLastSavedAt(new Date().toLocaleTimeString());
    });
  }, [loadDocument]);

  const saveDocument = useCallback(async () => {
    await documentStorage.save(document);
    setIsDirty(false);
    setLastSavedAt(new Date().toLocaleTimeString());
  }, [document]);

  const updateMetadata = useCallback((patch: Partial<SOPMetadata>) => {
    setDocument(prev => {
      pushHistory(prev);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        metadata: {
          ...prev.metadata,
          ...patch
        }
      };
    });
  }, [pushHistory]);

  const updateBranding = useCallback((patch: Partial<BrandingSettings>) => {
    setDocument(prev => {
      pushHistory(prev);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        branding: {
          ...prev.branding,
          ...patch
        }
      };
    });
  }, [pushHistory]);

  const updatePageSetup = useCallback((patch: Partial<PageSetup>) => {
    setDocument(prev => {
      pushHistory(prev);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        pageSetup: {
          ...prev.pageSetup,
          ...patch
        }
      };
    });
  }, [pushHistory]);

  const updateSectionContent = useCallback((sectionId: string, content: string) => {
    setDocument(prev => {
      const idx = prev.sections.findIndex(s => s.id === sectionId);
      if (idx === -1) return prev;
      if (prev.sections[idx].content === content) return prev; // no change

      pushHistory(prev);
      const newSections = [...prev.sections];
      newSections[idx] = {
        ...newSections[idx],
        content
      };

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        sections: newSections
      };
    });
  }, [pushHistory]);

  const updateSectionTitle = useCallback((sectionId: string, title: string) => {
    setDocument(prev => {
      const idx = prev.sections.findIndex(s => s.id === sectionId);
      if (idx === -1) return prev;
      pushHistory(prev);

      const newSections = [...prev.sections];
      newSections[idx] = {
        ...newSections[idx],
        title
      };

      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        sections: newSections
      };
    });
  }, [pushHistory]);

  const setTemplateStyle = useCallback((styleId: TemplateStyleId) => {
    const style = TEMPLATE_STYLES[styleId];
    if (!style) return;

    setDocument(prev => {
      pushHistory(prev);
      return {
        ...prev,
        updatedAt: new Date().toISOString(),
        style,
        settings: {
          ...prev.settings,
          activeTemplateId: styleId
        }
      };
    });
  }, [pushHistory]);

  const toggleSectionCollapse = useCallback((sectionId: string) => {
    setDocument(prev => {
      return {
        ...prev,
        sections: prev.sections.map(s => s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s)
      };
    });
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    isUndoRedoAction.current = true;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    setRedoStack(prev => [...prev, document]);
    setDocument(previous);
    setIsDirty(true);
    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 50);
  }, [undoStack, document]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    isUndoRedoAction.current = true;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    setUndoStack(prev => [...prev, document]);
    setDocument(next);
    setIsDirty(true);
    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 50);
  }, [redoStack, document]);

  // Initial local storage check
  useEffect(() => {
    documentStorage.save(SAMPLE_LAB_SOP).catch(() => {});
  }, []);

  const value: DocumentContextType = {
    document,
    activeSectionId,
    viewMode,
    currentScreen,
    isDirty,
    canUndo: undoStack.length > 0,
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
