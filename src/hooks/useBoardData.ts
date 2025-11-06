import { useMemo } from 'react';
import { useKanbanStore } from '../store/useKanbanStore';
import type { Column } from '../types/kanban';

export const useBoardData = () => {
    // Select necessary state parts from the store
    const { activeBoardId, boards, columns, tasks } = useKanbanStore(state => ({
        activeBoardId: state.activeBoardId,
        boards: state.boards,
        columns: state.columns,
        tasks: state.tasks,
    }));

    // Memoize the linked board and columns for performance
    const { activeBoard, columnsData } = useMemo(() => {
        const activeBoard = activeBoardId ? boards[activeBoardId] : undefined;
        
        if (!activeBoard) {
            return { activeBoard: undefined, columnsData: [] };
        }

        // Link tasks to their respective columns
        const columnsData: (Column & { tasks: typeof tasks[string][] })[] = activeBoard.columnIds
            .map(columnId => columns[columnId])
            .filter((column): column is Column => !!column) // Filter out null/undefined columns
            .map(column => ({
                ...column,
                tasks: column.taskIds
                    .map(taskId => tasks[taskId])
                    .filter((task): task is typeof tasks[string] => !!task) // Filter out null/undefined tasks
            }));

        return { activeBoard, columnsData };
    }, [activeBoardId, boards, columns, tasks]);

    return { activeBoard, columnsData };
};