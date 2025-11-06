// ✅ Fixed Zustand Store — Fully Working (TS 5+, Zustand 5+)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ✅ Use type-only imports (required when verbatimModuleSyntax = true)
import type { Task, Column, Board, KanbanData } from '../types/kanban';

// --- INITIAL STATE ---
const initialTasks: Record<string, Task> = {
  'task-1': { id: 'task-1', title: 'Setup Project structure', description: 'Create React components, SCSS files, and initial store structure.', priority: 'High', dueDate: '2025-11-10' },
  'task-2': { id: 'task-2', title: 'Implement Task Drag & Drop', description: 'Use react-dnd for vertical task movement.', priority: 'Medium', dueDate: '2025-11-12' },
  'task-3': { id: 'task-3', title: 'Design basic UI layout', description: 'Style columns and task cards using SCSS/Tailwind principles.', priority: 'Low', dueDate: '2025-11-15' },
};

const initialColumns: Record<string, Column> = {
  'col-1': { id: 'col-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
  'col-2': { id: 'col-2', title: 'In Progress', taskIds: [] },
  'col-3': { id: 'col-3', title: 'Done', taskIds: ['task-3'] },
};

const initialBoards: Record<string, Board> = {
  'board-1': { id: 'board-1', title: 'Main Project Board', columnIds: ['col-1', 'col-2', 'col-3'] },
};

// --- STORE INTERFACE ---
export interface KanbanState extends KanbanData {
  setActiveBoard: (boardId: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => void;
  moveColumn: (boardId: string, dragColumnId: string, hoverIndex: number) => void;
  addTask: (columnId: string, title: string) => void;
  addColumn: (boardId: string, title: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

// --- STORE IMPLEMENTATION ---
export const useKanbanStore = create<KanbanState>()(
  persist(
    immer((set) => ({
      // Initial State
      tasks: initialTasks,
      columns: initialColumns,
      boards: initialBoards,
      activeBoardId: 'board-1',

      // --- Actions ---

      setActiveBoard: (boardId) => set({ activeBoardId: boardId }),

      moveTask: (taskId, sourceColumnId, targetColumnId, targetIndex) => {
        set((state) => {
          const sourceColumn = state.columns[sourceColumnId];
          const targetColumn = state.columns[targetColumnId];

          const dragIndex = sourceColumn.taskIds.indexOf(taskId);
          if (dragIndex > -1) sourceColumn.taskIds.splice(dragIndex, 1);

          targetColumn.taskIds.splice(targetIndex, 0, taskId);
        });
      },

      moveColumn: (boardId, dragColumnId, hoverIndex) => {
        set((state) => {
          const board = state.boards[boardId];
          const dragIndex = board.columnIds.indexOf(dragColumnId);
          if (dragIndex > -1) {
            board.columnIds.splice(dragIndex, 1);
            board.columnIds.splice(hoverIndex, 0, dragColumnId);
          }
        });
      },

      addTask: (columnId, title) => {
        set((state) => {
          const newTaskId = `task-${Date.now()}`;
          state.tasks[newTaskId] = {
            id: newTaskId,
            title,
            description: '',
            priority: 'Medium',
            dueDate: new Date().toISOString().slice(0, 10),
          };
          state.columns[columnId].taskIds.unshift(newTaskId);
        });
      },

      addColumn: (boardId, title) => {
        set((state) => {
          const newColumnId = `col-${Date.now()}`;
          state.columns[newColumnId] = {
            id: newColumnId,
            title,
            taskIds: [],
          };
          state.boards[boardId].columnIds.push(newColumnId);
        });
      },

      updateTask: (taskId, updates) => {
        set((state) => {
          if (state.tasks[taskId]) {
            state.tasks[taskId] = { ...state.tasks[taskId], ...updates };
          }
        });
      },

      deleteTask: (taskId) => {
        set((state) => {
          delete state.tasks[taskId];
          Object.values(state.columns).forEach((column) => {
            const index = column.taskIds.indexOf(taskId);
            if (index > -1) column.taskIds.splice(index, 1);
          });
        });
      },
    })),
    {
      name: 'kanban-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: KanbanState) => ({
        tasks: state.tasks,
        columns: state.columns,
        boards: state.boards,
        activeBoardId: state.activeBoardId,
      }),
    }
  )
);
