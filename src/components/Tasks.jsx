import React, { useState, useRef, useEffect } from 'react';

// ─── WIP LIMITS per column ──────────────────────────────────────────
const WIP_LIMITS = {
  'Todo': 10,
  'In Progress': 4,
  'Review': 3,
  'Completed': 999,
};

// ─── Story-point options (Fibonacci) ────────────────────────────────
const STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

// ─── Sprint mock data ────────────────────────────────────────────────
const SPRINT = {
  name: 'Sprint 14',
  dates: 'Oct 1 – Oct 14',
  goal: 'Complete API layer and dashboard integration',
};

export default function Tasks({
  tasks,
  projects,
  epics = [],
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTask,
  onMoveToBoard,
  onCompleteSprint,
  isMyTasksView,
  onUpdateProject,
}) {
  // ── View state ────────────────────────────────────────────────────
  const [boardView, setBoardView] = useState(null); // 'board' | 'backlog' | null
  const [filterView, setFilterView] = useState(null); // 'My Tasks' | 'All Tasks' | null
  const [sortBy, setSortBy] = useState('Priority');
  const [filterEpic, setFilterEpic] = useState(null); // epic id or null
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || '');

  // ── Sync with sidebar nav ─────────────────────────────────────────
  useEffect(() => {
    if (isMyTasksView) {
      setFilterView('My Tasks');
    } else {
      setFilterView('All Tasks');
    }
  }, [isMyTasksView]);

  // ── Panel / modal state ───────────────────────────────────────────
  const [activeTaskDetail, setActiveTaskDetail] = useState(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [completeSprintModal, setCompleteSprintModal] = useState(false);
  const [openEllipsisId, setOpenEllipsisId] = useState(null); // backlog row menu

  // ── Backlog drag-to-reorder ───────────────────────────────────────
  const [backlogOrder, setBacklogOrder] = useState(null); // null = use default order
  const dragBacklogRef = useRef(null);
  const dragOverBacklogRef = useRef(null);

  // ── Inline backlog creation ───────────────────────────────────────
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlinePoints, setInlinePoints] = useState(3);

  // ── New Task Modal form ───────────────────────────────────────────
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState(projects[0]?.id || '');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Sarah Chen');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPoints, setNewTaskPoints] = useState(3);
  const [newTaskEpic, setNewTaskEpic] = useState('');

  // ─── Derived ─────────────────────────────────────────────────────
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const methodology = activeProject?.methodology || 'scrum';
  const projectEpics = epics.filter(e => e.projectId === activeProjectId);

  const activeBoardView = boardView || 'board';
  const activeFilterView = filterView || (isMyTasksView ? 'My Tasks' : 'All Tasks');

  // Board tasks = non-backlog tasks for active project
  const boardTasks = tasks.filter(t => t.projectId === activeProjectId && !t.isBacklog);
  // Backlog tasks
  const rawBacklogTasks = tasks.filter(t => t.projectId === activeProjectId && t.isBacklog);
  const backlogTasks = backlogOrder
    ? backlogOrder.map(id => rawBacklogTasks.find(t => t.id === id)).filter(Boolean)
    : rawBacklogTasks;

  // Filter board tasks by view and epic
  const filteredBoardTasks = boardTasks.filter(task => {
    const matchesView = activeFilterView === 'My Tasks'
      ? (task.assignee === 'Sarah Chen' || task.assignee === 'Alex Rivers')
      : true;
    const matchesEpic = filterEpic ? task.epic === filterEpic : true;
    return matchesView && matchesEpic;
  });

  const sortedBoardTasks = [...filteredBoardTasks].sort((a, b) => {
    if (sortBy === 'Priority') {
      const p = { High: 3, Medium: 2, Low: 1 };
      return p[b.priority] - p[a.priority];
    }
    return 0;
  });

  // ─── Helpers ─────────────────────────────────────────────────────
  const getPriorityStyle = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'high': return 'badge-high-priority';
      case 'medium': return 'badge-medium-priority';
      case 'low': return 'badge-low-priority';
      default: return 'badge-low-priority';
    }
  };

  const getEpicById = (id) => epics.find(e => e.id === id);

  const getAvatarForAssignee = (name) => {
    const map = {
      'Sarah Chen': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      'Alex Rivers': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      'Jordan Smith': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      'Marcus Rodriguez': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      'Elena Sokolov': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    };
    return map[name] || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80';
  };

  // ─── Drag & Drop (Kanban columns) ────────────────────────────────
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onUpdateTaskStatus(taskId, targetStatus);
    if (activeTaskDetail?.id === taskId) {
      setActiveTaskDetail(prev => ({ ...prev, status: targetStatus }));
    }
  };

  // ─── Backlog row drag-to-reorder ─────────────────────────────────
  const handleBacklogDragStart = (e, index) => {
    dragBacklogRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleBacklogDragEnter = (index) => {
    dragOverBacklogRef.current = index;
  };
  const handleBacklogDragEnd = () => {
    const from = dragBacklogRef.current;
    const to = dragOverBacklogRef.current;
    if (from === null || to === null || from === to) return;
    const ordered = [...backlogTasks];
    const [moved] = ordered.splice(from, 1);
    ordered.splice(to, 0, moved);
    setBacklogOrder(ordered.map(t => t.id));
    dragBacklogRef.current = null;
    dragOverBacklogRef.current = null;
  };

  // ─── Inline backlog creation ──────────────────────────────────────
  const handleInlineCreate = (e) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return;
    const newT = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      projectId: activeProjectId,
      title: inlineTitle,
      assignee: 'Sarah Chen',
      avatar: getAvatarForAssignee('Sarah Chen'),
      status: 'Todo',
      dueDate: 'TBD',
      priority: 'Medium',
      progress: 0,
      commentsCount: 0,
      storyPoints: inlinePoints,
      epic: null,
      isBacklog: true,
    };
    onAddTask(newT);
    setInlineTitle('');
    setInlinePoints(3);
  };

  // ─── New Task modal submit ────────────────────────────────────────
  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDueDate) return;
    const newT = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      projectId: newTaskProjectId,
      title: newTaskTitle,
      description: newTaskDesc,
      assignee: newTaskAssignee,
      avatar: getAvatarForAssignee(newTaskAssignee),
      status: 'Todo',
      dueDate: new Date(newTaskDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      priority: newTaskPriority,
      progress: 0,
      commentsCount: 0,
      storyPoints: newTaskPoints,
      epic: newTaskEpic || null,
      isBacklog: false,
    };
    onAddTask(newT);
    setIsNewTaskModalOpen(false);
    setNewTaskTitle(''); setNewTaskDesc(''); setNewTaskPriority('Medium');
    setNewTaskDueDate(''); setNewTaskPoints(3); setNewTaskEpic('');
  };

  // ─── Complete Sprint confirm ──────────────────────────────────────
  const handleConfirmCompleteSprint = () => {
    onCompleteSprint(activeProjectId);
    setCompleteSprintModal(false);
  };

  const columns = ['Todo', 'In Progress', 'Review', 'Completed'];

  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="page-header" style={{ marginBottom: '12px' }}>
        <div className="page-title-group">
          <h1>Project Board</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{activeProject?.name || 'All Projects'}</span>
            <span style={{
              fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', marginLeft: '8px',
              backgroundColor: methodology === 'scrum' ? '#EDE9FE' : '#E0F2FE',
              color: methodology === 'scrum' ? '#7C3AED' : '#0369A1',
            }}>
              {methodology === 'scrum' ? '🏃 SCRUM' : '📋 KANBAN'}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Project switcher */}
          <select
            value={activeProjectId}
            onChange={e => { setActiveProjectId(e.target.value); setFilterEpic(null); }}
            className="form-input form-select"
            style={{ fontSize: '13px', padding: '8px 32px 8px 12px', width: 'auto' }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {methodology === 'scrum' && (
            <button
              className="btn-gradient"
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', fontSize: '13px', padding: '8px 16px' }}
              onClick={() => setCompleteSprintModal(true)}
            >
              ✓ Complete Sprint
            </button>
          )}
          <button className="btn-gradient" onClick={() => setIsNewTaskModalOpen(true)}>
            + New Task
          </button>
        </div>
      </div>

      {/* ── Action / Filter Row ──────────────────────────────────── */}
      <div className="action-row-responsive" style={styles.actionRow}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Board / Backlog toggle */}
          <div style={styles.tabToggle}>
            {['board', 'backlog'].map(v => (
              <button
                key={v}
                onClick={() => setBoardView(v)}
                style={{ ...styles.toggleBtn, ...(boardView === v ? styles.toggleBtnActive : {}) }}
              >
                {v === 'board' ? '⬛ Board' : '📋 Backlog'}
              </button>
            ))}
          </div>

          {/* My Tasks / All Tasks */}
          <div style={styles.tabToggle}>
            {['My Tasks', 'All Tasks'].map(v => (
              <button
                key={v}
                onClick={() => setFilterView(v)}
                style={{ ...styles.toggleBtn, ...(filterView === v ? styles.toggleBtnActive : {}) }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.rightActions}>
          {/* Epic filter */}
          {projectEpics.length > 0 && activeBoardView === 'board' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#6C7A87', fontWeight: '600' }}>Epic:</span>
              <div style={styles.epicFilterRow}>
                <button
                  onClick={() => setFilterEpic(null)}
                  style={{ ...styles.epicFilterPill, ...(filterEpic === null ? styles.epicFilterPillActive : {}) }}
                >
                  All
                </button>
                {projectEpics.map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => setFilterEpic(filterEpic === ep.id ? null : ep.id)}
                    style={{
                      ...styles.epicFilterPill,
                      ...(filterEpic === ep.id ? { backgroundColor: ep.color, color: '#FFF', borderColor: ep.color } : {}),
                    }}
                  >
                    {ep.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeBoardView === 'board' && (
            <>
              <span style={{ fontSize: '13px', color: '#6C7A87', fontWeight: '500' }}>Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-input form-select" style={{ fontSize: '13px', padding: '6px 32px 6px 10px', width: 'auto' }}>
                <option value="Priority">Priority</option>
                <option value="Due Date">Due Date</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* BOARD VIEW                                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeBoardView === 'board' && (
        <div style={styles.boardWrapper}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Scrum Sprint Header */}
            {methodology === 'scrum' && (
              <div className="sprint-header-bar" style={styles.sprintHeaderBar}>
                <div style={styles.sprintLeft}>
                  <span style={styles.sprintLabel}>CURRENT SPRINT</span>
                  <span style={styles.sprintName}>{SPRINT.name}</span>
                  <span style={styles.sprintDates}>📅 {SPRINT.dates}</span>
                </div>
                <div style={styles.sprintRight}>
                  <span style={styles.sprintGoalLabel}>Goal:</span>
                  <span style={styles.sprintGoal}>{SPRINT.goal}</span>
                </div>
                <div style={styles.sprintStats}>
                  <div style={styles.sprintStat}>
                    <div style={styles.sprintStatVal}>{boardTasks.filter(t => t.status === 'Completed').length}</div>
                    <div style={styles.sprintStatLabel}>DONE</div>
                  </div>
                  <div style={styles.sprintStat}>
                    <div style={styles.sprintStatVal}>{boardTasks.length}</div>
                    <div style={styles.sprintStatLabel}>TOTAL</div>
                  </div>
                  <div style={styles.sprintStat}>
                    <div style={styles.sprintStatVal}>{boardTasks.reduce((s, t) => s + (t.storyPoints || 0), 0)}</div>
                    <div style={styles.sprintStatLabel}>SP</div>
                  </div>
                </div>
              </div>
            )}

            {/* Kanban columns */}
            <div className="kanban-board-scroll" style={styles.kanbanGrid}>
              {columns.map(column => {
                const columnTasks = sortedBoardTasks.filter(t => t.status.toLowerCase() === column.toLowerCase());
                const wipLimit = WIP_LIMITS[column];
                const isOverWip = methodology === 'kanban' && columnTasks.length > wipLimit;

                return (
                  <div
                    key={column}
                    className="kanban-col"
                    style={styles.kanbanColumn}
                    onDragOver={handleDragOver}
                    onDrop={e => handleDrop(e, column)}
                  >
                    {/* Column header */}
                    <div style={{
                      ...styles.columnHeader,
                      ...(isOverWip ? styles.columnHeaderWip : {}),
                    }}>
                      <div style={styles.columnTitleRow}>
                        <span style={{
                          ...styles.columnIndicatorDot,
                          backgroundColor: isOverWip ? '#D97706' : '#5B5FFB',
                        }} />
                        <span style={{
                          ...styles.columnTitle,
                          color: isOverWip ? '#92400E' : '#9AA6B2',
                        }}>
                          {column.toUpperCase()}
                        </span>
                        {/* Kanban WIP counter */}
                        {methodology === 'kanban' && column !== 'Completed' ? (
                          <span style={{
                            ...styles.columnCount,
                            backgroundColor: isOverWip ? '#FEF3C7' : '#ECEEF4',
                            color: isOverWip ? '#92400E' : '#6C7A87',
                            fontWeight: isOverWip ? '700' : '600',
                          }}>
                            {columnTasks.length}/{wipLimit}
                          </span>
                        ) : (
                          <span style={styles.columnCount}>{columnTasks.length}</span>
                        )}
                        {isOverWip && (
                          <span style={styles.wipWarningBadge} title="WIP limit exceeded">⚠</span>
                        )}
                      </div>
                      <button style={styles.columnMenuBtn}>•••</button>
                    </div>

                    {/* Cards */}
                    <div style={styles.cardContainer}>
                      {columnTasks.map(task => {
                        const epic = getEpicById(task.epic);
                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={e => handleDragStart(e, task.id)}
                            onClick={() => setActiveTaskDetail(task)}
                            className="premium-card task-card-hover"
                            style={styles.taskCard}
                          >
                            {/* Epic pill */}
                            {epic && (
                              <div style={{ ...styles.epicPill, backgroundColor: epic.color + '22', color: epic.color, borderColor: epic.color + '44' }}>
                                {epic.name}
                              </div>
                            )}

                            <div style={styles.cardTopRow}>
                              <span className={`badge ${getPriorityStyle(task.priority)}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                                {task.priority.toLowerCase()}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {task.storyPoints && (
                                  <span style={styles.storyPointsBadge}>{task.storyPoints} SP</span>
                                )}
                                <span style={styles.taskId}>{task.id}</span>
                              </div>
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
                                  <span style={styles.commentsIndicator}>💬 {task.commentsCount}</span>
                                )}
                              </div>
                              <span style={styles.dueDateText}>{task.dueDate}</span>
                            </div>
                          </div>
                        );
                      })}

                      <button onClick={() => setIsNewTaskModalOpen(true)} className="kanban-add-btn" style={styles.columnAddBtn}>
                        + Add Task
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sliding detail panel */}
          {activeTaskDetail && (
            <div className="glass-card" style={styles.slidingPanel}>
              <div style={styles.panelHeader}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#9AA6B2', letterSpacing: '0.05em', marginBottom: '4px' }}>{activeTaskDetail.id}</div>
                  <h3 style={styles.panelTitle}>{activeTaskDetail.title}</h3>
                </div>
                <button onClick={() => setActiveTaskDetail(null)} style={styles.panelCloseBtn}>×</button>
              </div>

              {activeTaskDetail.epic && (() => {
                const ep = getEpicById(activeTaskDetail.epic);
                return ep ? (
                  <div style={{ ...styles.epicPill, backgroundColor: ep.color + '22', color: ep.color, borderColor: ep.color + '44', marginBottom: '12px' }}>
                    {ep.name}
                  </div>
                ) : null;
              })()}

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
                <div style={styles.metaItem}>
                  <div style={styles.metaLabel}>STORY POINTS</div>
                  <div style={styles.metaVal}>{activeTaskDetail.storyPoints || '—'} SP</div>
                </div>
                <div style={styles.metaItem}>
                  <div style={styles.metaLabel}>PRIORITY</div>
                  <div style={styles.metaVal}>
                    <span className={`badge ${getPriorityStyle(activeTaskDetail.priority)}`} style={{ fontSize: '10px' }}>
                      {activeTaskDetail.priority}
                    </span>
                  </div>
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
                    <p>I've updated the API routes for the sync logic. Please review! 🚀</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* BACKLOG VIEW                                              */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeBoardView === 'backlog' && (
        <div style={styles.backlogWrapper}>
          <div style={styles.backlogHeader}>
            <div>
              <h2 style={styles.backlogTitle}>Product Backlog</h2>
              <p style={styles.backlogSubtitle}>{backlogTasks.length} items — drag to reorder by priority</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={styles.backlogStat}>
                <strong>{backlogTasks.reduce((s, t) => s + (t.storyPoints || 0), 0)}</strong> total story points
              </span>
            </div>
          </div>

          <div className="premium-card" style={{ overflow: 'hidden' }}>
            <table style={styles.backlogTable}>
              <thead>
                <tr style={styles.backlogThead}>
                  <th style={{ ...styles.backlogTh, width: '32px' }}></th>
                  <th style={{ ...styles.backlogTh, width: '90px' }}>TASK ID</th>
                  <th style={styles.backlogTh}>TITLE</th>
                  <th style={{ ...styles.backlogTh, width: '80px', textAlign: 'center' }}>POINTS</th>
                  <th style={{ ...styles.backlogTh, width: '100px' }}>EPIC</th>
                  <th style={{ ...styles.backlogTh, width: '90px' }}>PRIORITY</th>
                  <th style={{ ...styles.backlogTh, width: '44px' }}></th>
                </tr>
              </thead>
              <tbody>
                {backlogTasks.map((task, index) => {
                  const epic = getEpicById(task.epic);
                  return (
                    <tr
                      key={task.id}
                      className="backlog-row"
                      draggable
                      onDragStart={e => handleBacklogDragStart(e, index)}
                      onDragEnter={() => handleBacklogDragEnter(index)}
                      onDragEnd={handleBacklogDragEnd}
                      onDragOver={e => e.preventDefault()}
                      style={styles.backlogRow}
                    >
                      {/* Drag handle */}
                      <td style={styles.backlogTd}>
                        <span style={styles.dragHandle} title="Drag to reorder">⠿</span>
                      </td>
                      <td style={styles.backlogTd}>
                        <span style={styles.backlogTaskId}>{task.id}</span>
                      </td>
                      <td style={styles.backlogTd}>
                        <span style={styles.backlogTaskTitle}>{task.title}</span>
                      </td>
                      <td style={{ ...styles.backlogTd, textAlign: 'center' }}>
                        <span style={styles.spBadge}>{task.storyPoints || '?'}</span>
                      </td>
                      <td style={styles.backlogTd}>
                        {epic ? (
                          <span style={{ ...styles.epicPill, backgroundColor: epic.color + '22', color: epic.color, borderColor: epic.color + '44', fontSize: '10px', padding: '2px 7px' }}>
                            {epic.name}
                          </span>
                        ) : <span style={{ color: '#C4CDD6', fontSize: '12px' }}>—</span>}
                      </td>
                      <td style={styles.backlogTd}>
                        <span className={`badge ${getPriorityStyle(task.priority)}`} style={{ fontSize: '10px' }}>
                          {task.priority}
                        </span>
                      </td>
                      <td style={{ ...styles.backlogTd, position: 'relative' }}>
                        <button
                          style={styles.ellipsisBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenEllipsisId(openEllipsisId === task.id ? null : task.id);
                          }}
                        >
                          ···
                        </button>
                        {openEllipsisId === task.id && (
                          <div style={styles.ellipsisMenu} onClick={e => e.stopPropagation()}>
                            <button
                              style={styles.ellipsisMenuItem}
                              onClick={() => {
                                onMoveToBoard(task.id);
                                setOpenEllipsisId(null);
                              }}
                            >
                              🚀 Move to Active Sprint
                            </button>
                            <button
                              style={{ ...styles.ellipsisMenuItem, color: '#EF4444' }}
                              onClick={() => setOpenEllipsisId(null)}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* Inline creation row */}
                <tr style={styles.inlineCreateRow}>
                  <td style={styles.backlogTd}>
                    <span style={{ ...styles.dragHandle, opacity: 0.3 }}>⠿</span>
                  </td>
                  <td style={styles.backlogTd}>
                    <span style={{ ...styles.backlogTaskId, color: '#C4CDD6' }}>NEW</span>
                  </td>
                  <td style={styles.backlogTd} colSpan={1}>
                    <form onSubmit={handleInlineCreate} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={inlineTitle}
                        onChange={e => setInlineTitle(e.target.value)}
                        placeholder="+ Add backlog item..."
                        style={styles.inlineInput}
                      />
                      <button type="submit" style={styles.inlineAddBtn}>Add</button>
                    </form>
                  </td>
                  <td style={{ ...styles.backlogTd, textAlign: 'center' }}>
                    <select
                      value={inlinePoints}
                      onChange={e => setInlinePoints(Number(e.target.value))}
                      style={styles.inlinePointsSelect}
                    >
                      {STORY_POINTS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                    </select>
                  </td>
                  <td colSpan={3} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── New Task Modal ───────────────────────────────────────── */}
      {isNewTaskModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewTaskModalOpen(false)}>
          <div className="modal-content" style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Task</h2>
              <button style={styles.modalCloseBtn} onClick={() => setIsNewTaskModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input type="text" placeholder="e.g. Finalize UI design system" className="form-input" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Project *</label>
                <select className="form-input" value={newTaskProjectId} onChange={e => setNewTaskProjectId(e.target.value)} required>
                  {projects.map(proj => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Epic</label>
                  <select className="form-input" value={newTaskEpic} onChange={e => setNewTaskEpic(e.target.value)}>
                    <option value="">— No Epic —</option>
                    {epics.filter(ep => ep.projectId === newTaskProjectId).map(ep => (
                      <option key={ep.id} value={ep.id}>{ep.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: '0 0 110px' }}>
                  <label className="form-label">Story Points</label>
                  <select className="form-input" value={newTaskPoints} onChange={e => setNewTaskPoints(Number(e.target.value))}>
                    {STORY_POINTS.map(sp => <option key={sp} value={sp}>{sp} pts</option>)}
                  </select>
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Assignee</label>
                  <select className="form-input" value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)}>
                    <option value="Sarah Chen">Sarah Chen</option>
                    <option value="Alex Rivers">Alex Rivers</option>
                    <option value="Jordan Smith">Jordan Smith</option>
                    <option value="Marcus Rodriguez">Marcus Rodriguez</option>
                    <option value="Elena Sokolov">Elena Sokolov</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input type="date" className="form-input" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea placeholder="Provide brief outline of the sub-tasks or specs..." className="form-input" style={{ minHeight: '60px', resize: 'vertical' }} value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsNewTaskModalOpen(false)} style={styles.discardBtn}>Discard</button>
                <button type="submit" className="btn-gradient">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Complete Sprint Modal ────────────────────────────────── */}
      {completeSprintModal && (
        <div className="modal-overlay" onClick={() => setCompleteSprintModal(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ ...styles.modalTitle, color: '#DC2626' }}>⚡ Complete {SPRINT.name}?</h2>
              <button style={styles.modalCloseBtn} onClick={() => setCompleteSprintModal(false)}>×</button>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={styles.sprintCompleteWarning}>
                <div style={styles.warningRow}>
                  <span style={styles.warningIcon}>📦</span>
                  <div>
                    <div style={styles.warningTitle}>Completed tasks will be archived</div>
                    <div style={styles.warningDesc}>{boardTasks.filter(t => t.status === 'Completed').length} task(s) will be marked as done and removed from the active board.</div>
                  </div>
                </div>
                <div style={styles.warningRow}>
                  <span style={styles.warningIcon}>🔄</span>
                  <div>
                    <div style={styles.warningTitle}>Unfinished tasks move to Backlog</div>
                    <div style={styles.warningDesc}>{boardTasks.filter(t => t.status !== 'Completed').length} in-progress / todo task(s) will be returned to the Product Backlog for re-prioritization.</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button onClick={() => setCompleteSprintModal(false)} style={styles.discardBtn}>Cancel</button>
                <button
                  onClick={handleConfirmCompleteSprint}
                  style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Complete Sprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click-away to close ellipsis menu */}
      {openEllipsisId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpenEllipsisId(null)} />
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles = {
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '10px',
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
    padding: '7px 14px',
    borderRadius: '7px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#6C7A87',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  toggleBtnActive: {
    backgroundColor: '#F0F2FF',
    color: '#5B5FFB',
    fontWeight: '600',
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  epicFilterRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  epicFilterPill: {
    border: '1px solid #ECEEF4',
    borderRadius: '20px',
    padding: '4px 10px',
    fontSize: '11.5px',
    fontWeight: '600',
    color: '#6C7A87',
    backgroundColor: '#FAFCFF',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
  },
  epicFilterPillActive: {
    backgroundColor: '#5B5FFB',
    color: '#FFF',
    borderColor: '#5B5FFB',
  },
  methodologyToggleBtn: {
    background: 'none',
    border: 'none',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '16px',
    color: '#9AA6B2',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  methodologyToggleActiveScrum: {
    backgroundColor: '#EDE9FE',
    color: '#7C3AED',
  },
  methodologyToggleActiveKanban: {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
  },
  // ── Sprint Header ──────────────────────────────────────────────────
  sprintHeaderBar: {
    background: 'linear-gradient(135deg, #5B5FFB11 0%, #B24DFF11 100%)',
    border: '1px solid #E0E4FF',
    borderRadius: '12px',
    padding: '12px 20px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  sprintLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sprintLabel: {
    fontSize: '10px',
    fontWeight: '800',
    color: '#9AA6B2',
    letterSpacing: '0.1em',
  },
  sprintName: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#5B5FFB',
  },
  sprintDates: {
    fontSize: '12.5px',
    color: '#6C7A87',
    fontWeight: '500',
  },
  sprintRight: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '200px',
  },
  sprintGoalLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  sprintGoal: {
    fontSize: '12.5px',
    color: '#1A1D20',
    fontStyle: 'italic',
  },
  sprintStats: {
    display: 'flex',
    gap: '16px',
  },
  sprintStat: {
    textAlign: 'center',
  },
  sprintStatVal: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1A1D20',
  },
  sprintStatLabel: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
  },
  // ── Board / Columns ────────────────────────────────────────────────
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
    gap: '16px',
    flex: 1,
    height: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  kanbanColumn: {
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '16px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: '220px',
    overflow: 'hidden',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    padding: '8px 10px',
    borderRadius: '8px',
    transition: 'background 0.2s ease',
  },
  columnHeaderWip: {
    backgroundColor: '#FEF3C7',
    border: '1px solid #FDE68A',
  },
  columnTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
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
    padding: '2px 7px',
    borderRadius: '10px',
  },
  wipWarningBadge: {
    fontSize: '13px',
    color: '#D97706',
    cursor: 'help',
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
    gap: '10px',
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '12px',
  },
  taskCard: {
    padding: '14px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
  },
  epicPill: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid',
    marginBottom: '8px',
    letterSpacing: '0.02em',
  },
  storyPointsBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#6C7A87',
    backgroundColor: '#F0F4F8',
    border: '1px solid #ECEEF4',
    borderRadius: '6px',
    padding: '1px 5px',
  },
  cardTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  taskId: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
  },
  cardTitle: {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '6px',
    lineHeight: '1.4',
  },
  cardDesc: {
    fontSize: '12px',
    color: '#6C7A87',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  aiWarning: {
    backgroundColor: '#FFE5E5',
    color: '#C53030',
    padding: '5px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
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
    padding: '9px',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '4px',
  },
  // ── Sliding panel ─────────────────────────────────────────────────
  slidingPanel: {
    position: 'absolute',
    top: 0, right: 0,
    width: '300px',
    height: '100%',
    zIndex: 30,
    padding: '20px',
    borderLeft: '1px solid rgba(255,255,255,0.4)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-10px 0 30px rgba(31,38,135,0.05)',
    overflowY: 'auto',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  panelTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1A1D20',
    lineHeight: '1.4',
  },
  panelCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    color: '#9AA6B2',
    cursor: 'pointer',
    lineHeight: 1,
    flexShrink: 0,
  },
  panelDesc: {
    fontSize: '13px',
    color: '#6C7A87',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#ECEEF4',
    margin: '14px 0',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
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
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.06em',
    marginBottom: '10px',
  },
  panelComments: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
    overflowY: 'auto',
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
  // ── Backlog ───────────────────────────────────────────────────────
  backlogWrapper: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  backlogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backlogTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#1A1D20',
    marginBottom: '2px',
  },
  backlogSubtitle: {
    fontSize: '13px',
    color: '#6C7A87',
  },
  backlogStat: {
    fontSize: '13px',
    color: '#6C7A87',
    backgroundColor: '#F0F4F8',
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '6px 14px',
  },
  backlogTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  backlogThead: {
    backgroundColor: '#F8F9FD',
    borderBottom: '2px solid #ECEEF4',
  },
  backlogTh: {
    padding: '10px 14px',
    fontSize: '10px',
    fontWeight: '800',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  },
  backlogRow: {
    borderBottom: '1px solid #F0F4F8',
    cursor: 'grab',
    transition: 'background 0.15s ease',
  },
  backlogTd: {
    padding: '10px 14px',
    verticalAlign: 'middle',
    fontSize: '13px',
    color: '#1A1D20',
    position: 'relative',
  },
  dragHandle: {
    fontSize: '18px',
    color: '#C4CDD6',
    cursor: 'grab',
    userSelect: 'none',
    display: 'inline-block',
    lineHeight: 1,
  },
  backlogTaskId: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#5B5FFB',
    fontFamily: 'monospace',
  },
  backlogTaskTitle: {
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  spBadge: {
    display: 'inline-block',
    minWidth: '28px',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '700',
    backgroundColor: '#EDE9FE',
    color: '#7C3AED',
    borderRadius: '6px',
    padding: '2px 8px',
  },
  ellipsisBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: '#9AA6B2',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '6px',
    transition: 'background 0.15s',
    lineHeight: 1,
  },
  ellipsisMenu: {
    position: 'absolute',
    right: '36px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    zIndex: 100,
    minWidth: '200px',
    overflow: 'hidden',
  },
  ellipsisMenuItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    padding: '11px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#1A1D20',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  inlineCreateRow: {
    borderBottom: '1px solid #ECEEF4',
    backgroundColor: '#FAFCFF',
  },
  inlineInput: {
    flex: 1,
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '7px 12px',
    fontSize: '13px',
    color: '#1A1D20',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    minWidth: '200px',
  },
  inlineAddBtn: {
    backgroundColor: '#5B5FFB',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  inlinePointsSelect: {
    border: '1px solid #ECEEF4',
    borderRadius: '6px',
    padding: '5px 8px',
    fontSize: '12px',
    color: '#6C7A87',
    backgroundColor: '#FAFCFF',
    outline: 'none',
    width: '60px',
  },
  // ── Complete Sprint modal ─────────────────────────────────────────
  sprintCompleteWarning: {
    backgroundColor: '#FFF7ED',
    border: '1px solid #FED7AA',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  warningRow: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  warningIcon: {
    fontSize: '22px',
    flexShrink: 0,
  },
  warningTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '4px',
  },
  warningDesc: {
    fontSize: '12.5px',
    color: '#6C7A87',
    lineHeight: '1.5',
  },
  // ── Modal ─────────────────────────────────────────────────────────
  modalContent: {
    maxWidth: '480px',
  },
  modalHeader: {
    padding: '24px 28px 14px 28px',
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
    padding: '18px 28px 28px 28px',
  },
  row: {
    display: 'flex',
    gap: '14px',
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
    padding: '8px',
  },
};
