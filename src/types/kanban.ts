export const ItemTypes = {
  TASK: 'task',
  COLUMN: 'column',
};
export interface DragItem {
  id: string;
  type: string;
  sourceColumnId?: string; 
}
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  columnIds: string[];
}

export interface KanbanData {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    boards: Record<string, Board>;
    activeBoardId: string | null;
}

export interface TaskModalData {
    task: Task;
    columnId: string;
}