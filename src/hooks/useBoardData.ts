import { useMemo } from 'react';
import { useKanbanStore } from '../store/useKanbanStore';
import type { Column } from '../types/kanban';

export const useBoardData = () => {
    const { activeBoardId, boards, columns, tasks } = useKanbanStore(state => ({
        activeBoardId: state.activeBoardId,
        boards: state.boards,
        columns: state.columns,
        tasks: state.tasks,
    }));

    const { activeBoard, columnsData } = useMemo(() => {
        const activeBoard = activeBoardId ? boards[activeBoardId] : undefined;
        
        if (!activeBoard) {
            return { activeBoard: undefined, columnsData: [] };
        }

        const columnsData: (Column & { tasks: typeof tasks[string][] })[] = activeBoard.columnIds
            .map(columnId => columns[columnId])
            .filter((column): column is Column => !!column)
            .map(column => ({
                ...column,
                tasks: column.taskIds
                    .map(taskId => tasks[taskId])
                    .filter((task): task is typeof tasks[string] => !!task)
            }));

        return { activeBoard, columnsData };
    }, [activeBoardId, boards, columns, tasks]);

    return { activeBoard, columnsData };
};