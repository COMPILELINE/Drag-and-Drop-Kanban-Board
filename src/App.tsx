import React, { useState, useCallback } from 'react';
import BoardView from './components/BoardView';
import TaskModal from './components/TaskModal';
import { useKanbanStore } from './store/useKanbanStore';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.scss';

// Custom hook to track local storage hydration status
const useHydrationStatus = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  React.useEffect(() => {
    // Check initial status
    if (useKanbanStore.persist.hasHydrated()) {
        setIsHydrated(true);
    }

    // Set up listeners for hydration completion
    const unsubFinish = useKanbanStore.persist.onFinishHydration(() => setIsHydrated(true));

    return () => {
      unsubFinish();
    };
  }, []);

  return isHydrated;
};


const AppContent: React.FC = () => {
  // Use custom hook to track local storage hydration status
  const isHydrated = useHydrationStatus();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const openTaskModal = useCallback((taskId: string) => {
    setActiveTaskId(taskId);
  }, []);

  const closeTaskModal = useCallback(() => {
    setActiveTaskId(null);
  }, []);
  
  const handleCardClick = (taskId: string) => {
      openTaskModal(taskId);
  }

  // Show a loading state until data hydration from Local Storage is complete
  if (!isHydrated) {
    return (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading Kanban Data...
        </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <header className="app-header">
          <h1>ProjectForge Kanban</h1>
        </header>
        
        <main className="app-main">
          <BoardView onTaskClick={handleCardClick} /> 
        </main>
        
        {activeTaskId && (
          <TaskModal 
            taskId={activeTaskId} 
            onClose={closeTaskModal} 
          />
        )}
      </div>
    </DndProvider>
  );
};

const App: React.FC = () => (
    <AppContent />
);

export default App;