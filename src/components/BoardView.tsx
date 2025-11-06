import React from 'react';
import { useBoardData } from '../hooks/useBoardData';
import KanbanColumn from './KanbanColumn'; 
import { useKanbanStore } from '../store/useKanbanStore';
import './BoardView.scss'; 

interface BoardViewProps {
  onTaskClick: (taskId: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ onTaskClick }) => {
  const { activeBoard, columnsData } = useBoardData();
  const moveColumn = useKanbanStore(state => state.moveColumn); 

  if (!activeBoard) {
    // Check hydration status from the persist middleware
    if (!useKanbanStore.persist.hasHydrated()) {
      return null;
    }
    return <div className="board-view__empty">No active board selected.</div>;
  }

  const handleMoveColumn = (dragColumnId: string, hoverIndex: number) => {
    moveColumn(activeBoard.id, dragColumnId, hoverIndex);
  };
  
  return (
    <div className="board-view">
      <h2 className="board-view__title">{activeBoard.title}</h2>
      <div className="board-view__column-container">
        {activeBoard.columnIds.map((columnId, index) => {
          const column = columnsData.find(c => c.id === columnId);
          
          if (!column) return null;

          return (
            <KanbanColumn 
              key={column.id} 
              column={column} 
              index={index} 
              onTaskClick={onTaskClick} 
              onMoveColumn={handleMoveColumn} 
              isColumnDraggingEnabled={true} 
            />
          );
        })}
      </div>
      <button 
        className="btn btn--secondary board-view__add-column"
        onClick={() => useKanbanStore.getState().addColumn(activeBoard.id, 'New Column')}
      >
        + Add Column
      </button>
    </div>
  );
};

export default BoardView;