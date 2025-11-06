import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd'; 
import type { XYCoord } from 'react-dnd'; 
import type { Task } from '../types/kanban';
import { ItemTypes } from '../types/kanban';
import type { DragItem } from '../types/kanban';
import { useKanbanStore } from '../store/useKanbanStore'; 
import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
  columnId: string;
  index: number; 
  onTaskClick: (taskId: string) => void; 
}

const TaskCard: React.FC<TaskCardProps> = ({ task, columnId, index, onTaskClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const moveTask = useKanbanStore((state) => state.moveTask);
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, type: ItemTypes.TASK, sourceColumnId: columnId }, 
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const [{ handlerId }, drop] = useDrop<DragItem, unknown, { handlerId: string | null }>(() => ({ 
    accept: ItemTypes.TASK,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId()?.toString() ?? null, 
    }),
    
    hover(item, monitor) {
      if (!ref.current || item.id === task.id) return;
      
      const sourceColumnId = item.sourceColumnId;
      if (!sourceColumnId) return;

      const sourceColumn = useKanbanStore.getState().columns[sourceColumnId];
      if (!sourceColumn) return;

      const dragIndex = sourceColumn.taskIds.indexOf(item.id);
      const hoverIndex = index;

      if (dragIndex === hoverIndex && sourceColumnId === columnId) return;
      
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset() as XYCoord;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTask(item.id, sourceColumnId, columnId, hoverIndex); 
      item.sourceColumnId = columnId;
    },
    
    drop(item: DragItem) {
      item.sourceColumnId = columnId; 
    }
  }));

  const connectedRef = (element: HTMLDivElement | null) => {
    drag(element);
    drop(element); 
    (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
  };

  const opacity = isDragging ? 0 : 1;
  const cardClass = isDragging ? 'task-card--dragging' : 'task-card';

  return (
    <div 
      ref={connectedRef} 
      className={cardClass} 
      style={{ opacity }}
      role="listitem"
      tabIndex={0} 
      onClick={() => onTaskClick(task.id)} 
      data-handler-id={handlerId || ''} 
    >
      <p className="task-card__title">{task.title}</p>
    </div>
  );
};

export default TaskCard;