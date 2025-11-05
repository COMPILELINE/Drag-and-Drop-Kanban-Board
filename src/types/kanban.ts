// Using TypeScript for professional clarity (can be adapted to JSDoc/Vanilla JS)

// --- BASE ENTITIES ---
export interface Task {
  id: string;
  title: string;
  description: string;
  priority?: 'High' | 'Medium' | 'Low'; // V1.1+
  dueDate?: string; // V1.1+
  labelIds?: string[]; // V2.0+
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[]; // Normalized: Holds the ordered list of task IDs
}

export interface Board {
  id: string;
  title: string;
  columnIds: string[]; // Normalized: Holds the ordered list of column IDs
}

// --- GLOBAL STATE SHAPE ---
export interface KanbanState {
  boards: {
    [id: string]: Board;
  };
  columns: {
    [id: string]: Column;
  };
  tasks: {
    [id: string]: Task;
  };
  activeBoardId: string | null;
}

// --- DRAG-AND-DROP TYPES ---
export const ItemTypes = {
  TASK: 'task',
  COLUMN: 'column',
} as const;

export type ItemTypeKey = (typeof ItemTypes)[keyof typeof ItemTypes];


export interface DragItem {
  id: string;
  type: ItemTypeKey; // Use the fixed type
  sourceColumnId: string;
  // Other necessary metadata for drag operations
}