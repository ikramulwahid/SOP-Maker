import { SOPSection, JSONContent } from '../types/document';

/**
 * Pure non-React operations for querying and mutating SOP section trees.
 * Designed to work recursively on nested section hierarchies.
 */

/**
 * Recursively locates a section by its unique ID anywhere in the section tree.
 */
export function findSection(sections: SOPSection[], id: string): SOPSection | null {
  for (const sec of sections) {
    if (sec.id === id) {
      return sec;
    }
    if (sec.children && sec.children.length > 0) {
      const found = findSection(sec.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Recursively searches and updates a section within a section tree,
 * returning a new immutable array of sections.
 */
export function updateSection(
  sections: SOPSection[],
  id: string,
  updater: (sec: SOPSection) => SOPSection
): SOPSection[] {
  return sections.map(sec => {
    if (sec.id === id) {
      return updater(sec);
    }

    if (sec.children && sec.children.length > 0) {
      const updatedChildren = updateSection(sec.children, id, updater);
      if (updatedChildren !== sec.children) {
        return {
          ...sec,
          children: updatedChildren
        };
      }
    }

    return sec;
  });
}

/**
 * Recursively updates a section's title by ID.
 */
export function updateSectionTitle(
  sections: SOPSection[],
  id: string,
  newTitle: string
): SOPSection[] {
  return updateSection(sections, id, sec => ({
    ...sec,
    title: newTitle
  }));
}

/**
 * Recursively updates a section's structured JSONContent by ID.
 */
export function updateSectionContent(
  sections: SOPSection[],
  id: string,
  newContent: JSONContent
): SOPSection[] {
  return updateSection(sections, id, sec => ({
    ...sec,
    content: newContent
  }));
}

/**
 * Recursively toggles the collapsed state of a section.
 */
export function toggleSectionCollapse(
  sections: SOPSection[],
  id: string
): SOPSection[] {
  return updateSection(sections, id, sec => ({
    ...sec,
    collapsed: !sec.collapsed
  }));
}

/**
 * Flattens a nested section tree into a flat linear array in document order.
 */
export function flattenSections(sections: SOPSection[]): SOPSection[] {
  const result: SOPSection[] = [];

  function traverse(list: SOPSection[]) {
    for (const item of list) {
      result.push(item);
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(sections);
  return result;
}

/**
 * Counts total sections in a hierarchy including all nested children.
 */
export function countSections(sections: SOPSection[]): number {
  return flattenSections(sections).length;
}

/**
 * Returns the breadcrumb ancestry path to a specific section ID.
 */
export function findSectionPath(sections: SOPSection[], id: string): SOPSection[] {
  const path: SOPSection[] = [];

  function search(currentList: SOPSection[]): boolean {
    for (const sec of currentList) {
      path.push(sec);
      if (sec.id === id) {
        return true;
      }
      if (sec.children && sec.children.length > 0) {
        if (search(sec.children)) {
          return true;
        }
      }
      path.pop();
    }
    return false;
  }

  search(sections);
  return path;
}
