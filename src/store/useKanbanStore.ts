import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
// Removed unused imports (Column, Board)
import type { KanbanState, Task } from '../types/kanban'; 
import { v4 as uuidv4 } from 'uuid';

// --- INITIAL MOCK STATE ---
// (Define initialMockState here as before)
// ...
const mockTaskId1 = uuidv4();
const mockTaskId2 = uuidv4();
const mockTaskId3 = uuidv4();
const mockColId1 = uuidv4();
const mockColId2 = uuidv4();
const mockBoardId = uuidv4();

const initialMockState: KanbanState = {
  boards: {
    [mockBoardId]: { id: mockBoardId, title: 'Project Alpha Board', columnIds: [mockColId1, mockColId2] },
  },
  columns: {
    [mockColId1]: { id: mockColId1, title: 'To Do', taskIds: [mockTaskId1, mockTaskId3] },
    [mockColId2]: { id: mockColId2, title: 'In Progress', taskIds: [mockTaskId2] },
  },
  tasks: {
    [mockTaskId1]: { id: mockTaskId1, title: 'Design initial wireframes', description: '' },
    [mockTaskId2]: { id: mockTaskId2, title: 'Set up React/Vite project', description: 'Install all core dependencies.' },
    [mockTaskId3]: { id: mockTaskId3, title: 'Define SCSS variables', description: '' },
  },
  activeBoardId: mockBoardId,
};


// --- STORE ACTIONS INTERFACE ---
export interface KanbanActions {
  addTask: (columnId: string, title: string) => void;
  updateTask: (taskId: string, data: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newIndex: number
  ) => void;

  setActiveBoard: (boardId: string) => void;
}

// Combine state and actions
export type KanbanStore = KanbanState & KanbanActions;

// --- ZUSTAND STORE CREATION ---
export const useKanbanStore = create<KanbanStore>()(
  persist(
    // NOTE: Removed 'get' parameter from definition as it is unused (cleanup warning 6133)
    immer((set) => ({ 
      // FIX 2322: Spread the initial state properties here to satisfy the KanbanStore type
      ...initialMockState,

      // --- ACTIONS IMPLEMENTATION ---

      addTask: (columnId, title) => 
        set((state: KanbanStore) => {
          const newTaskId = uuidv4();
          state.tasks[newTaskId] = { id: newTaskId, title, description: '' };
          state.columns[columnId].taskIds.push(newTaskId);
        }),

      updateTask: (taskId, data) => 
        set((state: KanbanStore) => {
          // Ensure we don't try to merge with undefined if task doesn't exist
          if (state.tasks[taskId]) { 
              Object.assign(state.tasks[taskId], data);
          }
        }),
      
      deleteTask: (taskId: string) => {
        set((state: KanbanStore) => {
          // Find which column this task belongs to and remove the task ID
          for (const colId in state.columns) {
            const col = state.columns[colId];
            const taskIndex = col.taskIds.indexOf(taskId);
            if (taskIndex !== -1) {
              col.taskIds.splice(taskIndex, 1);
              delete state.tasks[taskId];
              break;
            }
          }
        });
      },

      moveTask: (taskId, sourceColumnId, targetColumnId, newIndex) => {
        set((state: KanbanStore) => {
          const sourceCol = state.columns[sourceColumnId];
          const targetCol = state.columns[targetColumnId];

          // 1. Remove from Source Column
          const taskIndex = sourceCol.taskIds.indexOf(taskId);
          if (taskIndex !== -1) {
            sourceCol.taskIds.splice(taskIndex, 1);
          }

          // 2. Insert into Target Column at the new index
          targetCol.taskIds.splice(newIndex, 0, taskId);
        });
      },

      setActiveBoard: (boardId) => set({ activeBoardId: boardId }),
    })),
    {
      name: 'kanban-storage',
      storage: localStorage as any, 
    }
  )
);