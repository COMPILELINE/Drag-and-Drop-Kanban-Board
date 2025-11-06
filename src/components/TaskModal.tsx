import React, { useState, useEffect, useCallback } from "react";
import { useKanbanStore } from "../store/useKanbanStore";
import type { Task } from "../types/kanban";
import "./TaskModal.scss";

interface TaskModalProps {
  taskId: string;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ taskId, onClose }) => {
  const store = useKanbanStore.getState();
  const task = store.tasks[taskId];
  const updateTask = store.updateTask;
  const deleteTask = store.deleteTask;

  const [localTask, setLocalTask] = useState<Task | null>(task ? { ...task } : null);

  useEffect(() => {
    if (!task) {
      onClose();
    } else {
      setLocalTask({ ...task });
    }
  }, [task, onClose]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalTask(prev => prev ? { ...prev, [name]: value } : null);
  }, []);

  const handleSave = () => {
    if (localTask) {
      updateTask(localTask.id, localTask);
    }
    onClose();
  };

  const handleDelete = () => {
    if (localTask) {
      deleteTask(localTask.id);
      onClose();
    }
  };

  if (!localTask) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <input
            type="text"
            className="modal-title-input"
            name="title"
            value={localTask.title}
            onChange={handleChange}
          />
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </header>

        <section className="modal-section">
          <label>Description</label>
          <textarea
            className="modal-description-input"
            name="description"
            value={localTask.description}
            onChange={handleChange}
          />
        </section>

        <div className="modal-details">
          <div className="modal-detail-group">
            <label>Priority</label>
            <select name="priority" value={localTask.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="modal-detail-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={localTask.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <footer className="modal-footer">
          <button className="btn btn--danger" onClick={handleDelete}>Delete Task</button>
          <button className="btn btn--primary" onClick={handleSave}>Save Changes</button>
        </footer>
      </div>
    </div>
  );
};

export default TaskModal;