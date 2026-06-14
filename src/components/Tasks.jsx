import React, { useState } from 'react';

export default function Tasks({
  tasks,
  projects,
  onAddTask,
  onUpdateTaskStatus,
}) {
  const [filterView, setFilterView] = useState('My Tasks'); // Project Tasks vs My Tasks
  const [sortBy, setSortBy] = useState('Priority');
  const [activeTaskDetail, setActiveTaskDetail] = useState(null); // Slide-out panel state
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // New Task Form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState(projects[0]?.id || '');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Sarah Chen');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onUpdateTaskStatus(taskId, targetStatus);
    if (activeTaskDetail && activeTaskDetail.id === taskId) {
      setActiveTaskDetail(prev => ({ ...prev, status: targetStatus }));
    }
  };

  // Filter and Sort Tasks
  const filteredTasks = tasks.filter((task) => {
    if (filterView === 'My Tasks') {
      return task.assignee === 'Sarah Chen' || task.assignee === 'Alex Rivers';
    }
    return true; // All Project Tasks
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'Priority') {
      const priorityMap = { High: 3, Medium: 2, Low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    } else if (sortBy === 'Due Date') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDueDate) return;

    const newT = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      projectId: newTaskProjectId,
      title: newTaskTitle,
      description: newTaskDesc,
      assignee: newTaskAssignee,
      avatar: newTaskAssignee === 'Sarah Chen'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
        : newTaskAssignee === 'Alex Rivers'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'Todo',
      dueDate: new Date(newTaskDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      priority: newTaskPriority,
      progress: 0,
      commentsCount: 0,
    };

    onAddTask(newT);
    setIsNewTaskModalOpen(false);

    // Reset Form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('Medium');
    setNewTaskDueDate('');
  };

  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'badge-high-priority';
      case 'medium': return 'badge-medium-priority';
      case 'low': return 'badge-low-priority';
      default: return 'badge-low-priority';
    }
  };

  const columns = ['Todo', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div className="page-title-group">
          <h1>Project Board</h1>
          <p>WorkWise Platform Redesign • Sprint 4</p>
        </div>
        <button className="btn-gradient" onClick={() => setIsNewTaskModalOpen(true)}>
          + New Task
        </button>
      </div>

      {/* Filter and Board Actions Row */}
      <div style={styles.actionRow}>
        <div style={styles.tabToggle}>
          <button
            onClick={() => setFilterView('Project Tasks')}
            style={{ ...styles.toggleBtn, ...(filterView === 'Project Tasks' ? styles.toggleBtnActive : {}) }}
          >
            Project Tasks
          </button>
          <button
            onClick={() => setFilterView('My Tasks')}
            style={{ ...styles.toggleBtn, ...(filterView === 'My Tasks' ? styles.toggleBtnActive : {}) }}
          >
            My Tasks
          </button>
        </div>

        <div style={styles.rightActions}>
          <span style={{ fontSize: '13px', color: '#6C7A87', fontWeight: '500' }}>Sort by:</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
            <option value="Priority">Priority</option>
            <option value="Due Date">Due Date</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div style={styles.boardWrapper}>
        <div className="kanban-board-scroll" style={styles.kanbanGrid}>
          {columns.map((column) => {
            const columnTasks = sortedTasks.filter(t => t.status.toLowerCase() === column.toLowerCase());
            return (
              <div
                key={column}
                className="kanban-col"
                style={styles.kanbanColumn}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column)}
              >
                <div style={styles.columnHeader}>
                  <div style={styles.columnTitleRow}>
                    <span style={styles.columnIndicatorDot} />
                    <span style={styles.columnTitle}>{column.toUpperCase()}</span>
                    <span style={styles.columnCount}>{columnTasks.length}</span>
                  </div>
                  <button style={styles.columnMenuBtn}>•••</button>
                </div>

                <div style={styles.cardContainer}>
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => setActiveTaskDetail(task)}
                      className="premium-card"
                      style={styles.taskCard}
                    >
                      <div style={styles.cardTopRow}>
                        <span className={`badge ${getPriorityStyle(task.priority)}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                          {task.priority.toLowerCase()}
                        </span>
                        <span style={styles.taskId}>{task.id}</span>
                      </div>

                      <h4 style={styles.cardTitle}>{task.title}</h4>
                      <p style={styles.cardDesc}>
                        {task.description || 'Connect task integration protocols to orchestrate workflows.'}
                      </p>

                      {task.priority === 'High' && column !== 'Completed' && (
                        <div style={styles.aiWarning}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C53030" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          AI: Target delivery risk
                        </div>
                      )}

                      <div style={styles.cardFooter}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={task.avatar} alt={task.assignee} style={styles.cardAvatar} />
                          {task.commentsCount > 0 && (
                            <span style={styles.commentsIndicator}>
                              💬 {task.commentsCount}
                            </span>
                          )}
                        </div>
                        <span style={styles.dueDateText}>{task.dueDate}</span>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={() => setIsNewTaskModalOpen(true)} style={styles.columnAddBtn}>
                    + Add Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sliding glassmorphism details panel */}
        {activeTaskDetail && (
          <div className="glass-card" style={styles.slidingPanel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Futuristic Glassmorphism UI</h3>
              <button onClick={() => setActiveTaskDetail(null)} style={styles.panelCloseBtn}>×</button>
            </div>
            
            <p style={styles.panelDesc}>
              {activeTaskDetail.description || 'Develop the core dashboard layout with glassmorphism effects and blurred backgrounds.'}
            </p>

            <div style={styles.divider} />

            <div style={styles.metaGrid}>
              <div style={styles.metaItem}>
                <div style={styles.metaLabel}>ASSIGNEE</div>
                <div style={styles.metaValFlex}>
                  <img src={activeTaskDetail.avatar} alt={activeTaskDetail.assignee} style={styles.avatarMini} />
                  <span>{activeTaskDetail.assignee}</span>
                </div>
              </div>

              <div style={styles.metaItem}>
                <div style={styles.metaLabel}>DUE DATE</div>
                <div style={styles.metaVal}>{activeTaskDetail.dueDate}, 2026</div>
              </div>
            </div>

            <div style={styles.metaItem} style={{ marginTop: '16px' }}>
              <div style={styles.metaLabel}>TAGS</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <span className="badge badge-inprogress" style={{ fontSize: '10px' }}>Frontend</span>
                <span className="badge badge-completed" style={{ fontSize: '10px' }}>UI</span>
              </div>
            </div>

            <div style={styles.divider} />

            <h4 style={styles.sectionHeader}>Discussion ({activeTaskDetail.commentsCount || 0})</h4>
            <div style={styles.panelComments}>
              <div style={styles.panelCommentItem}>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="John" style={styles.avatarMini} />
                <div style={styles.commentContent}>
                  <div style={styles.commentHeader}>
                    <strong>John Doe</strong>
                    <span>2h ago</span>
                  </div>
                  <p>I've updated the API routes for the sync logic. Please review the new endpoints in the documentation! 🚀</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Task</h2>
              <button style={styles.modalCloseBtn} onClick={() => setIsNewTaskModalOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateTaskSubmit} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Finalize UI design system"
                  className="form-input"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project *</label>
                <select
                  className="form-input"
                  value={newTaskProjectId}
                  onChange={(e) => setNewTaskProjectId(e.target.value)}
                  required
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Assignee</label>
                  <select
                    className="form-input"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                  >
                    <option value="Sarah Chen">Sarah Chen</option>
                    <option value="Alex Rivers">Alex Rivers</option>
                    <option value="Jordan Smith">Jordan Smith</option>
                  </select>
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Provide brief outline of the sub-tasks or specs..."
                  className="form-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsNewTaskModalOpen(false)} style={styles.discardBtn}>
                  Discard
                </button>
                <button type="submit" className="btn-gradient">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  tabToggle: {
    display: 'flex',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '10px',
    padding: '4px',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13.5px',
    fontWeight: '500',
    color: '#6C7A87',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  toggleBtnActive: {
    backgroundColor: '#F0F2FF',
    color: '#5B5FFB',
    fontWeight: '600',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sortSelect: {
    border: '1px solid #ECEEF4',
    borderRadius: '6px',
    fontSize: '13px',
    padding: '4px 8px',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: '#1A1D20',
  },
  boardWrapper: {
    display: 'flex',
    gap: '20px',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  kanbanGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    flex: 1,
    height: '100%',
    overflowX: 'auto',
  },
  kanbanColumn: {
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: '220px',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  columnTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  columnIndicatorDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#5B5FFB',
  },
  columnTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
  },
  columnCount: {
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: '#ECEEF4',
    color: '#6C7A87',
    padding: '2px 6px',
    borderRadius: '10px',
  },
  columnMenuBtn: {
    background: 'none',
    border: 'none',
    color: '#9AA6B2',
    cursor: 'pointer',
    fontSize: '12px',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '20px',
  },
  taskCard: {
    padding: '16px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  taskId: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9AA6B2',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '6px',
    lineHeight: '1.4',
  },
  cardDesc: {
    fontSize: '12.5px',
    color: '#6C7A87',
    lineHeight: '1.4',
    marginBottom: '14px',
  },
  aiWarning: {
    backgroundColor: '#FFE5E5',
    color: '#C53030',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #F8F9FD',
  },
  cardAvatar: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  commentsIndicator: {
    fontSize: '11px',
    color: '#9AA6B2',
  },
  dueDateText: {
    fontSize: '11px',
    color: '#9AA6B2',
    fontWeight: '500',
  },
  columnAddBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    border: '1px dashed #ECEEF4',
    borderRadius: '10px',
    color: '#6C7A87',
    fontSize: '13px',
    fontWeight: '500',
    padding: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#F8F9FD',
      borderColor: '#9AA6B2',
    },
  },
  slidingPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '320px',
    height: '100%',
    zIndex: 30,
    padding: '24px',
    borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-10px 0 30px rgba(31, 38, 135, 0.05)',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  panelCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#9AA6B2',
    cursor: 'pointer',
    lineHeight: 1,
  },
  panelDesc: {
    fontSize: '13px',
    color: '#6C7A87',
    lineHeight: '1.4',
    marginBottom: '20px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(236, 238, 244, 0.6)',
    margin: '16px 0',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metaLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
  },
  metaVal: {
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  metaValFlex: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  avatarMini: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  sectionHeader: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
    marginBottom: '12px',
  },
  panelComments: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflowY: 'auto',
    flex: 1,
  },
  panelCommentItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  commentContent: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '8px 10px',
    flex: 1,
    fontSize: '12px',
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '11px',
  },
  modalContent: {
    maxWidth: '460px',
  },
  modalHeader: {
    padding: '24px 24px 12px 24px',
    borderBottom: '1px solid #ECEEF4',
    position: 'relative',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#9AA6B2',
    cursor: 'pointer',
  },
  modalForm: {
    padding: '16px 24px 24px 24px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
  discardBtn: {
    background: 'none',
    border: 'none',
    color: '#6C7A87',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};
