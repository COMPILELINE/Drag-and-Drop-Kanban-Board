import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd'; 
import type { DropTargetMonitor, DragSourceMonitor, XYCoord } from 'react-dnd';
import type { Column, Task, DragItem } from '../types/kanban';
import { ItemTypes } from '../types/kanban';
import { useKanbanStore } from '../store/useKanbanStore';
import TaskCard from './TaskCard'; 
import './KanbanColumn.scss';

interface ColumnDragItem extends DragItem {
  type: typeof ItemTypes.COLUMN;
  id: string;
  index: number;
}

interface KanbanColumnProps {
  column: Column & { tasks: Task[] };
  onTaskClick: (taskId: string) => void; 
  index: number; 
  onMoveColumn: (dragColumnId: string, hoverIndex: number) => void; 
  isColumnDraggingEnabled: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, onTaskClick, index, onMoveColumn, isColumnDraggingEnabled }) => { 
  const ref = useRef<HTMLDivElement>(null);
  const moveTask = useKanbanStore((state) => state.moveTask);

  const [{ handlerId: columnDropHandlerId }, dropColumn] = useDrop<ColumnDragItem, unknown, { handlerId: string | null }>(() => ({
    accept: ItemTypes.COLUMN,
    hover(item, monitor) {
      if (!ref.current || item.id === column.id) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset() as XYCoord;
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
      
      onMoveColumn(item.id, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
      handlerId: monitor.getHandlerId()?.toString() ?? null,
    }),
  }));
  
  const [{ isColumnDragging }, dragColumn] = useDrag<ColumnDragItem, unknown, { isColumnDragging: boolean }>(() => ({
    type: ItemTypes.COLUMN,
    item: { id: column.id, type: ItemTypes.COLUMN, index }, 
    collect: (monitor: DragSourceMonitor) => ({
      isColumnDragging: monitor.isDragging(),
    }),
    canDrag: isColumnDraggingEnabled,
  }));

  const [{ isOver }, dropTask] = useDrop<DragItem, unknown, { isOver: boolean }>(() => ({
    accept: ItemTypes.TASK,
    collect: (monitor: DropTargetMonitor<DragItem, unknown>) => ({
      isOver: monitor.isOver(), 
    }),
    
    hover() { },
    
    drop(item: DragItem, monitor) {
      if (!monitor.didDrop()) {
        const sourceColumnId = item.sourceColumnId;
        // The column must be empty or the task must be dropped directly here
        if (!column.tasks.length || !item.sourceColumnId) {
          // Drop into an empty column or final drop
          moveTask(item.id, sourceColumnId as string, column.id, 0); // Asserting as string as it must exist for a task drag
        }
        item.sourceColumnId = column.id;
      }
    },
  }));

  const connectedRef = (element: HTMLDivElement | null) => {
    dragColumn(dropColumn(element)); 
    dropTask(element);
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
  };
  
  const columnClasses = `kanban-column ${isOver && !column.tasks.length ? 'kanban-column--empty-over' : ''}`;
  const columnStyle: React.CSSProperties = {
    opacity: isColumnDragging ? 0.5 : 1, 
  };

  return (
    <div 
      ref={connectedRef} 
      className={columnClasses} 
      role="region" 
      aria-label={`Column: ${column.title}`}
      style={columnStyle}
      data-handler-id={columnDropHandlerId} 
    >
      <h3 className="kanban-column__header" data-drag-handle>
        {column.title} ({column.tasks.length})
      </h3>
      <div className="kanban-column__card-list" role="list">
        {column.tasks.map((task, taskIndex) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            columnId={column.id}
            index={taskIndex} 
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
      <button className="kanban-column__add-button" onClick={() => useKanbanStore.getState().addTask(column.id, 'New Task')}>
        + Add Task
      </button>
    </div>
  );
};

export default KanbanColumn;