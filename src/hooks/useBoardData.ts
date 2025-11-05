import { useKanbanStore } from '../store/useKanbanStore';
// FIX 1: Use type-only imports for all types
import type { KanbanStore } from '../store/useKanbanStore';
import type { Column, Task } from '../types/kanban'; 

/**
 * Hook to retrieve the currently active board's data,
 * denormalizing the columns and tasks for easy rendering.
 */
export const useBoardData = () => {
  // No changes needed for selector types, as they were fixed in the previous iteration
  const activeBoardId = useKanbanStore((state: KanbanStore) => state.activeBoardId);
  const boards = useKanbanStore((state: KanbanStore) => state.boards);
  const columns = useKanbanStore((state: KanbanStore) => state.columns);
  const tasks = useKanbanStore((state: KanbanStore) => state.tasks);

  if (!activeBoardId || !boards[activeBoardId]) {
    return { activeBoard: null, columnsData: [] };
  }

  const activeBoard = boards[activeBoardId];

  // Denormalize: Map column IDs to full column objects, and map task IDs to full task objects
  const columnsData = activeBoard.columnIds
    .map((colId: string) => columns[colId])
    // FIX 2: Explicitly type the 'col' parameter, ensuring type safety in the filter
    .filter((col): col is Column => !!col) 
    .map((column: Column) => ({
      ...column,
      tasks: column.taskIds
        .map((taskId: string) => tasks[taskId])
        .filter((task): task is Task => !!task),
    }));

  return { activeBoard, columnsData };
};