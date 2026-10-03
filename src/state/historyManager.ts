import { SOPDocument } from '../types/document';

export const MAX_HISTORY_DEPTH = 25;

export interface HistoryState {
  undoStack: SOPDocument[];
  redoStack: SOPDocument[];
}

/**
 * Pure functions for managing document undo/redo history stacks.
 * Separated from React lifecycle to allow deterministic unit testing.
 */

export function pushHistoryMilestone(
  currentState: HistoryState,
  snapshotDoc: SOPDocument,
  maxDepth: number = MAX_HISTORY_DEPTH
): HistoryState {
  return {
    undoStack: [...currentState.undoStack.slice(-(maxDepth - 1)), snapshotDoc],
    redoStack: [] // any new user action clears the redo branch
  };
}

export function performUndoStep(
  currentState: HistoryState,
  currentDoc: SOPDocument
): { nextDoc: SOPDocument; state: HistoryState } | null {
  if (currentState.undoStack.length === 0) {
    return null;
  }

  const previousDoc = currentState.undoStack[currentState.undoStack.length - 1];
  const nextUndoStack = currentState.undoStack.slice(0, currentState.undoStack.length - 1);
  const nextRedoStack = [...currentState.redoStack, currentDoc];

  return {
    nextDoc: previousDoc,
    state: {
      undoStack: nextUndoStack,
      redoStack: nextRedoStack
    }
  };
}

export function performRedoStep(
  currentState: HistoryState,
  currentDoc: SOPDocument
): { nextDoc: SOPDocument; state: HistoryState } | null {
  if (currentState.redoStack.length === 0) {
    return null;
  }

  const nextDoc = currentState.redoStack[currentState.redoStack.length - 1];
  const nextRedoStack = currentState.redoStack.slice(0, currentState.redoStack.length - 1);
  const nextUndoStack = [...currentState.undoStack, currentDoc];

  return {
    nextDoc,
    state: {
      undoStack: nextUndoStack,
      redoStack: nextRedoStack
    }
  };
}
