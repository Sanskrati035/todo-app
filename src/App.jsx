import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  ListFilter, 
  Edit2, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';

const App = () => {
  // State initialization
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo-tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Welcome to your new Todo App!', completed: false, createdAt: Date.now() },
      { id: 2, text: 'Try adding a new task above', completed: true, createdAt: Date.now() - 100000 },
    ];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // Ref for focus management
  const editInputRef = useRef(null);

  // Save to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  // Handlers
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditValue(task.text);
  };

  const saveEdit = (id) => {
    if (!editValue.trim()) {
      deleteTask(id);
    } else {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, text: editValue.trim() } : task
      ));
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Derived state
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.length - activeCount;

  // Date formatter
  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans text-gray-800">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="bg-indigo-600 p-6 sm:p-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
              <div className="flex items-center mt-2 text-indigo-100 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(Date.now())}</span>
              </div>
            </div>
            <div className="bg-indigo-500/30 p-2 rounded-lg backdrop-blur-sm text-center min-w-[80px]">
              <span className="block text-2xl font-bold">{activeCount}</span>
              <span className="text-xs text-indigo-100 uppercase tracking-wider">To Do</span>
            </div>
          </div>

          {/* Add Task Input */}
          <form onSubmit={handleAddTask} className="relative mt-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full py-4 pl-5 pr-14 rounded-xl text-gray-700 bg-white/95 focus:bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-400/50 transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </form>
        </div>

        {/* Filters & Actions */}
        <div className="bg-gray-50 border-b border-gray-100 p-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex bg-gray-200/50 p-1 rounded-lg">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                  filter === f 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear Completed
            </button>
          )}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-2 scroll-smooth">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <ListFilter className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm">
                {filter === 'completed' 
                  ? "You haven't completed any tasks yet." 
                  : filter === 'active' 
                    ? "No active tasks. Good job!" 
                    : "Add a task to get started."}
              </p>
            </div>
          ) : (
            <ul className="space-y-2 pb-4">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`group flex items-center gap-3 p-3 bg-white border border-transparent hover:border-indigo-100 hover:shadow-sm rounded-xl transition-all duration-200 ${
                    task.completed ? 'opacity-75 bg-gray-50/50' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 transition-all duration-200 ${
                      task.completed ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 fill-green-50" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {editingId === task.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(task.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          onBlur={() => saveEdit(task.id)} // Optional: save on blur
                          className="w-full px-2 py-1 text-sm border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                        />
                      </div>
                    ) : (
                      <div 
                        onClick={() => toggleTask(task.id)}
                        className="cursor-pointer select-none"
                      >
                        <p className={`text-base font-medium truncate transition-all duration-200 ${
                          task.completed ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-700'
                        }`}>
                          {task.text}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:opacity-0 focus-within:opacity-100">
                    <button
                      onClick={() => startEditing(task)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;