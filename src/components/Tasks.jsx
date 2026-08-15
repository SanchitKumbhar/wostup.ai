import React, { useState, useRef, useEffect } from 'react';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useEpics, useCreateEpic } from '../hooks/useEpics';
import { useSprints, useCreateSprint, useUpdateSprint } from '../hooks/useSprints';
import { useCurrentUser } from '../hooks/useUser';

// ─── WIP LIMITS per column ──────────────────────────────────────────
const WIP_LIMITS = {
  'Todo': 10,
  'In Progress': 4,
  'Review': 3,
  'Completed': 999,
};

// ─── Story-point options (Fibonacci) ────────────────────────────────
const STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

// ─── Color preset palette for Epics ─────────────────────────────────
const EPIC_COLOR_PALETTE = [
  '#8B5CF6', '#7C3AED', '#6366F1', '#3B82F6',
  '#0EA5E9', '#06B6D4', '#0891B2', '#10B981',
  '#059669', '#D97706', '#F59E0B', '#EF4444',
  '#EC4899', '#DB2777', '#D946EF', '#8B5CF6',
];

// ─── Status options for tasks ───────────────────────────────────────
const TASK_STATUS_OPTIONS = ['Backlog', 'Todo', 'In Progress', 'Blocked', 'Waiting Review', 'Done'];

export default function Tasks({
  projects,
  isMyTasksView,
  onUpdateProject,
}) {
  // ── View state ────────────────────────────────────────────────────
  const [boardView, setBoardView] = useState(null); // 'board' | 'backlog' | null
  const [filterView, setFilterView] = useState(null); // 'My Tasks' | 'All Tasks' | null
  const [sortBy, setSortBy] = useState('Priority');
  const [filterEpic, setFilterEpic] = useState(null); // epic id or null
  const [filterSprint, setFilterSprint] = useState(null); // sprint id or null
  const [filterActiveSprintOnly, setFilterActiveSprintOnly] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || projects[0]?._id || '');

  // ── API Hooks ─────────────────────────────────────────────────────
  const { data: currentUser } = useCurrentUser();
  const { data: tasks = [] } = useTasks(activeProjectId);
  const { mutateAsync: createTask } = useCreateTask();
  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: deleteTask } = useDeleteTask();
  const { data: epics = [] } = useEpics(activeProjectId);
  const { mutateAsync: createEpic } = useCreateEpic();
  const { data: sprints = [] } = useSprints(activeProjectId);
  const { mutateAsync: createSprint } = useCreateSprint();
  const { mutateAsync: updateSprint } = useUpdateSprint();

  // ── Sync with sidebar nav and project load ─────────────────────────
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
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isCreateEpicOpen, setIsCreateEpicOpen] = useState(false);
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
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
  const [newTaskSprint, setNewTaskSprint] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('Backlog');

  // ── Create Epic form ──────────────────────────────────────────────
  useEffect(() => {
    if (projects.length > 0) {
      if (!activeProjectId) setActiveProjectId(projects[0].id || projects[0]._id);
      if (!newTaskProjectId) setNewTaskProjectId(projects[0].id || projects[0]._id);
    }
  }, [projects, activeProjectId, newTaskProjectId]);


  const [newEpicName, setNewEpicName] = useState('');
  const [newEpicSummary, setNewEpicSummary] = useState('');
  const [newEpicDesc, setNewEpicDesc] = useState('');
  const [newEpicColor, setNewEpicColor] = useState('#8B5CF6');
  const [newEpicStatus, setNewEpicStatus] = useState('To Do');
  const [newEpicStartDate, setNewEpicStartDate] = useState('');
  const [newEpicDueDate, setNewEpicDueDate] = useState('');
  const [newEpicColorInput, setNewEpicColorInput] = useState('#8B5CF6');

  // ── Create Sprint form ────────────────────────────────────────────
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');
  const [newSprintStatus, setNewSprintStatus] = useState('Future');
  const [newSprintStartDate, setNewSprintStartDate] = useState('');
  const [newSprintEndDate, setNewSprintEndDate] = useState('');

  // ─── Derived ─────────────────────────────────────────────────────
  const activeProject = projects.find(p => (p.id || p._id) === activeProjectId) || projects[0];
  const methodology = activeProject?.methodology || activeProject?.projectType || 'scrum';
  const projectEpics = epics;
  const projectSprints = sprints;
  const activeSprint = projectSprints.find(s => (s.status || '').toLowerCase() === 'active');

  const activeBoardView = boardView || 'board';
  const activeFilterView = filterView || (isMyTasksView ? 'My Tasks' : 'All Tasks');

  // Auto-suggest sprint name when opening create sprint modal
  useEffect(() => {
    if (isCreateSprintOpen) {
      const projectSprintCount = projectSprints.length;
      setNewSprintName(`Sprint ${projectSprintCount + 1}`);
    }
  }, [isCreateSprintOpen, projectSprints.length]);

  // Board tasks = non-backlog tasks for active project
  const boardTasks = tasks.filter(t => !t.isBacklog);
  // Backlog tasks
  const rawBacklogTasks = tasks.filter(t => t.isBacklog);
  const backlogTasks = backlogOrder
    ? backlogOrder.map(id => rawBacklogTasks.find(t => t.id === id)).filter(Boolean)
    : rawBacklogTasks;

  // Filter board tasks by view, epic, and sprint
  const filteredBoardTasks = boardTasks.filter(task => {
    const matchesView = activeFilterView === 'My Tasks'
      ? (task.assignee === 'Sarah Chen' || task.assignee === 'Alex Rivers')
      : true;
    const matchesEpic = filterEpic ? task.epic === filterEpic : true;
    // Sprint filter logic
    let matchesSprint = true;
    if (filterActiveSprintOnly && activeSprint) {
      matchesSprint = task.sprintId === activeSprint.id;
    } else if (filterSprint) {
      matchesSprint = task.sprintId === filterSprint;
    }
    return matchesView && matchesEpic && matchesSprint;
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

  const getEpicById = (id) => epics.find(e => (e.id || e._id) === (id?._id || id));
  const getSprintById = (id) => sprints.find(s => (s.id || s._id) === (id?._id || id));

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

  const formatSprintDates = (sprint) => {
    if (!sprint) return '';
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const opts = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
  };

  const getSprintStatusColor = (status) => {
    switch (status) {
      case 'Active': return { bg: '#ECFDF5', text: '#059669' };
      case 'Future': return { bg: '#EFF6FF', text: '#2563EB' };
      case 'Completed': return { bg: '#F3F4F6', text: '#6B7280' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  // ─── Drag & Drop (Kanban columns) ────────────────────────────────
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    let mappedStatus = targetStatus.toLowerCase().replace(' ', '-');
    if (mappedStatus === 'completed') mappedStatus = 'done';
    
    try {
      await updateTask({ taskId: taskId, updates: { status: mappedStatus } });
      if (activeTaskDetail?.id === taskId || activeTaskDetail?._id === taskId) {
        setActiveTaskDetail(prev => ({ ...prev, status: targetStatus }));
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
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
  const handleInlineCreate = async (e) => {
    e.preventDefault();
    if (!inlineTitle.trim()) return;
    try {
      await createTask({
        workspaceId: activeProject.workspaceId,
        projectId: activeProjectId,
        title: inlineTitle,
        description: '',
        assigneeUserId: currentUser?._id || currentUser?.id,
        status: 'todo',
        actualProgress: 0,
        dueDate: new Date().toISOString(),
        dependency: []
      });
      setInlineTitle('');
      setInlinePoints(3);
    } catch (error) {
      console.error('Failed to create inline task:', error);
    }
  };

  // ─── New Task modal submit ────────────────────────────────────────
  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDueDate) return;
    
    let mappedStatus = newTaskStatus === 'Done' ? 'done' : (newTaskStatus === 'Waiting Review' ? 'review' : newTaskStatus.toLowerCase().replace(' ', '-'));
    if (mappedStatus === 'backlog') mappedStatus = 'todo'; // Map backlog to todo for API
    
    try {
      await createTask({
        workspaceId: activeProject.workspaceId,
        projectId: newTaskProjectId,
        title: newTaskTitle,
        description: newTaskDesc,
        assigneeUserId: currentUser?._id || currentUser?.id,
        status: mappedStatus,
        actualProgress: newTaskStatus === 'Done' ? 100 : 0,
        epicId: newTaskEpic || undefined,
        sprintId: newTaskSprint || undefined,
        dueDate: new Date(newTaskDueDate).toISOString(),
        dependency: []
      });
      setIsNewTaskModalOpen(false);
      setNewTaskTitle(''); setNewTaskDesc(''); setNewTaskPriority('Medium');
      setNewTaskDueDate(''); setNewTaskPoints(3); setNewTaskEpic('');
      setNewTaskSprint(''); setNewTaskStatus('Backlog');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // ─── Create Epic submit ──────────────────────────────────────────
  const handleCreateEpicSubmit = async (e) => {
    e.preventDefault();
    if (!newEpicName.trim()) return;
    try {
      await createEpic({
        workspaceId: activeProject.workspaceId,
        projectId: activeProjectId,
        name: newEpicName,
        summary: newEpicSummary,
        description: newEpicDesc,
        color: newEpicColor,
        status: newEpicStatus,
        startDate: newEpicStartDate ? new Date(newEpicStartDate).toISOString() : new Date().toISOString(),
        dueDate: newEpicDueDate ? new Date(newEpicDueDate).toISOString() : new Date().toISOString()
      });
      setIsCreateEpicOpen(false);
      setNewEpicName(''); setNewEpicSummary(''); setNewEpicDesc('');
      setNewEpicColor('#8B5CF6'); setNewEpicColorInput('#8B5CF6');
      setNewEpicStatus('To Do'); setNewEpicStartDate(''); setNewEpicDueDate('');
    } catch (error) {
      console.error('Failed to create epic:', error);
    }
  };

  // ─── Create Sprint submit ────────────────────────────────────────
  const handleCreateSprintSubmit = async (e) => {
    e.preventDefault();
    if (!newSprintName.trim() || !newSprintStartDate || !newSprintEndDate) return;
    try {
      await createSprint({
        workspaceId: activeProject.workspaceId,
        projectId: activeProjectId,
        name: newSprintName,
        goal: newSprintGoal,
        status: newSprintStatus.toLowerCase(),
        startDate: new Date(newSprintStartDate).toISOString(),
        endDate: new Date(newSprintEndDate).toISOString()
      });
      setIsCreateSprintOpen(false);
      setNewSprintName(''); setNewSprintGoal(''); setNewSprintStatus('Future');
      setNewSprintStartDate(''); setNewSprintEndDate('');
    } catch (error) {
      console.error('Failed to create sprint:', error);
    }
  };

  // ─── Sprint date presets ──────────────────────────────────────────
  const applySprintPreset = (weeks) => {
    const start = newSprintStartDate ? new Date(newSprintStartDate) : new Date();
    if (!newSprintStartDate) {
      setNewSprintStartDate(start.toISOString().split('T')[0]);
    }
    const end = new Date(start);
    end.setDate(end.getDate() + (weeks * 7) - 1);
    setNewSprintEndDate(end.toISOString().split('T')[0]);
  };

  // ─── Complete Sprint confirm ──────────────────────────────────────
  const handleConfirmCompleteSprint = async () => {
    if (activeSprint) {
      try {
        await updateSprint({
          id: activeSprint.id || activeSprint._id,
          payload: { status: 'completed' }
        });
      } catch (error) {
        console.error('Failed to complete sprint:', error);
      }
    }
    setCompleteSprintModal(false);
  };

  // ─── Epic color hex input handler ─────────────────────────────────
  const handleEpicColorInputChange = (val) => {
    setNewEpicColorInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setNewEpicColor(val);
    }
  };

  const columns = ['Todo', 'In Progress', 'Review', 'Completed'];

  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

      {/* ── Unified Nav Header ─────────────────────────────────────────── */}
      <div className="unified-nav-header" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '16px', 
        padding: '12px 16px', 
        backgroundColor: '#FFFFFF', 
        border: '1px solid #ECEEF4', 
        borderRadius: '12px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        
        {/* 1. Project Selector & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <select
            value={activeProjectId}
            onChange={e => { setActiveProjectId(e.target.value); setFilterEpic(null); setFilterSprint(null); setFilterActiveSprintOnly(false); }}
            className="form-input form-select"
            style={{ fontSize: '14px', fontWeight: '700', padding: '4px 28px 4px 8px', width: 'auto', border: 'none', backgroundColor: 'transparent', color: '#1A1D20', cursor: 'pointer' }}
          >
            {projects.map(p => {
              const projectId = p.id || p._id;
              return (
                <option key={projectId} value={projectId}>
                  {p.key ? `[${p.key}] ${p.name}` : p.name}
                </option>
              );
            })}
          </select>

          <span style={{
            fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px',
            backgroundColor: methodology === 'scrum' ? '#EDE9FE' : '#E0F2FE',
            color: methodology === 'scrum' ? '#7C3AED' : '#0369A1',
            letterSpacing: '0.05em'
          }}>
            {methodology === 'scrum' ? 'SCRUM' : 'KANBAN'}
          </span>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: '#ECEEF4', flexShrink: 0 }} />

        {/* 2. View Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={styles.tabToggle}>
            {['board', 'backlog'].map(v => (
              <button
                key={v}
                onClick={() => setBoardView(v)}
                style={{ ...styles.toggleBtn, ...(boardView === v ? styles.toggleBtnActive : {}) }}
              >
                {v === 'board' ? 'Board' : 'Backlog'}
              </button>
            ))}
          </div>

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

        <div style={{ width: '1px', height: '24px', backgroundColor: '#ECEEF4', flexShrink: 0 }} />

        {/* 3. Filters (takes up available middle space) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 'min-content' }}>
          {projectSprints.length > 0 && activeBoardView === 'board' && (
            <select
              value={filterActiveSprintOnly ? '__active__' : (filterSprint || '')}
              onChange={e => {
                const val = e.target.value;
                if (val === '__active__') {
                  setFilterActiveSprintOnly(true);
                  setFilterSprint(null);
                } else {
                  setFilterActiveSprintOnly(false);
                  setFilterSprint(val || null);
                }
              }}
              className="form-input form-select"
              style={{ fontSize: '12px', padding: '5px 28px 5px 10px', width: 'auto' }}
            >
              <option value="">All Sprints</option>
              <option value="__active__">Active Sprint Only</option>
              {projectSprints.map(sp => (
                <option key={sp.id} value={sp.id}>
                  {sp.name} ({sp.status})
                </option>
              ))}
            </select>
          )}

          {projectEpics.length > 0 && activeBoardView === 'board' && (
            <select
              value={filterEpic || ''}
              onChange={e => setFilterEpic(e.target.value || null)}
              className="form-input form-select"
              style={{ fontSize: '12px', padding: '5px 28px 5px 10px', width: 'auto' }}
            >
              <option value="">All Epics</option>
              {projectEpics.map(ep => (
                <option key={ep.id} value={ep.id}>
                  Epic: {ep.name}
                </option>
              ))}
            </select>
          )}

          {activeBoardView === 'board' && (
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-input form-select" style={{ fontSize: '12px', padding: '5px 28px 5px 10px', width: 'auto' }}>
              <option value="Priority">Sort: Priority</option>
              <option value="Due Date">Sort: Due Date</option>
            </select>
          )}
        </div>

        {/* 4. Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {methodology === 'scrum' && (
            <button
              className="btn-gradient"
              style={{ backgroundColor: 'var(--color-danger)', fontSize: '12px', padding: '6px 12px' }}
              onClick={() => setCompleteSprintModal(true)}
            >
              Complete Sprint
            </button>
          )}
          <button onClick={() => setIsCreateEpicOpen(true)} style={{ ...styles.headerSecondaryBtn, fontSize: '12px', padding: '6px 12px' }}>
            New Epic
          </button>
          <button onClick={() => setIsCreateSprintOpen(true)} style={{ ...styles.headerSecondaryBtn, fontSize: '12px', padding: '6px 12px' }}>
            New Sprint
          </button>
          <button className="btn-gradient" onClick={() => setIsNewTaskModalOpen(true)} style={{ fontSize: '12px', padding: '6px 14px' }}>
            + New Task
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* BOARD VIEW                                                */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeBoardView === 'board' && (
        <div style={styles.boardWrapper}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Sprint Header (if a sprint is selected or active) */}
            {(() => {
              const displayedSprint = filterSprint ? getSprintById(filterSprint) : activeSprint;
              if (!displayedSprint) return null;
              
              const totalTasks = boardTasks.filter(t => t.sprintId === displayedSprint.id || t.sprintId === displayedSprint._id).length;
              const completedTasks = boardTasks.filter(t => (t.sprintId === displayedSprint.id || t.sprintId === displayedSprint._id) && (t.status === 'done' || t.status === 'completed')).length;
              
              return (
                <div style={styles.sprintHeaderBar}>
                  <div style={styles.sprintLeft}>
                    <div>
                      <div style={styles.sprintLabel}>SPRINT</div>
                      <div style={styles.sprintName}>{displayedSprint.name}</div>
                    </div>
                    <div style={{ width: '1px', height: '24px', backgroundColor: '#E0E4FF' }} />
                    <div style={styles.sprintDates}>{formatSprintDates(displayedSprint)}</div>
                  </div>
                  <div style={styles.sprintRight}>
                    {displayedSprint.goal && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={styles.sprintGoalLabel}>GOAL</span>
                        <span style={styles.sprintGoal}>{displayedSprint.goal}</span>
                      </div>
                    )}
                    <div style={{ flex: 1 }} />
                    <div style={styles.sprintStats}>
                      <div style={styles.sprintStat}>
                        <div style={styles.sprintStatVal}>{completedTasks}/{totalTasks}</div>
                        <div style={styles.sprintStatLabel}>TASKS DONE</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Kanban columns */}
            <div className="kanban-board-scroll" style={styles.kanbanGrid}>
              {columns.map(column => {
                const columnTasks = sortedBoardTasks.filter(t => {
                  let s = (t.status || '').toLowerCase();
                  if (s === 'done') s = 'completed';
                  s = s.replace('-', ' ');
                  return s === column.toLowerCase();
                });
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
                        <span style={styles.columnIndicatorDot} />
                        <span style={{
                          ...styles.columnTitle,
                          color: isOverWip ? '#92400E' : '#334155',
                        }}>
                          {column.toUpperCase()}
                        </span>
                        {/* Kanban WIP counter */}
                        {methodology === 'kanban' && column !== 'Completed' ? (
                          <span style={{
                            ...styles.columnCount,
                            backgroundColor: isOverWip ? '#FEF3C7' : '#E2E8F0',
                            color: isOverWip ? '#92400E' : '#475569',
                          }}>
                            {columnTasks.length}/{wipLimit}
                          </span>
                        ) : (
                          <span style={styles.columnCount}>{columnTasks.length}</span>
                        )}
                        {isOverWip && (
                          <span style={styles.wipWarningBadge} title="WIP limit exceeded">Limit Exceeded</span>
                        )}
                      </div>
                      <button style={styles.columnMenuBtn}>•••</button>
                    </div>

                    {/* Cards */}
                    <div style={styles.cardContainer}>
                      {columnTasks.map(task => {
                        const epic = getEpicById(task.epic);
                        const taskSprint = getSprintById(task.sprintId);
                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={e => handleDragStart(e, task.id)}
                            onClick={() => setActiveTaskDetail(task)}
                            className="task-card-hover"
                            style={styles.taskCard}
                          >
                            {/* Epic pill */}
                            {epic && (
                              <div style={{ ...styles.epicPill, backgroundColor: epic.color + '22', color: epic.color, borderColor: epic.color + '44' }}>
                                {epic.name}
                              </div>
                            )}

                              <div style={{ ...styles.cardTopRow, position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {task.storyPoints && (
                                    <span style={styles.storyPointsBadge}>{task.storyPoints} SP</span>
                                  )}
                                  <span style={styles.taskId}>{task.id}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span className={`badge ${getPriorityStyle(task.priority)}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                                    {task.priority.toLowerCase()}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenEllipsisId(openEllipsisId === task.id ? null : task.id);
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '0 4px', fontSize: '14px', lineHeight: '1' }}
                                  >
                                    •••
                                  </button>
                                  {openEllipsisId === task.id && (
                                    <div style={{ ...styles.ellipsisMenu, right: 0, left: 'auto', top: '24px' }} onClick={e => e.stopPropagation()}>
                                      <button
                                        style={styles.ellipsisMenuItem}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveTaskDetail(task);
                                          setNewTaskTitle(task.title);
                                          setNewTaskDesc(task.description || '');
                                          setNewTaskStatus(task.status || 'Todo');
                                          setNewTaskPriority(task.priority || 'Medium');
                                          setNewTaskPoints(task.storyPoints || 3);
                                          setNewTaskAssignee(task.assignee || 'Sarah Chen');
                                          setNewTaskProjectId(task.projectId || activeProjectId);
                                          setNewTaskEpic(task.epicId || '');
                                          setNewTaskSprint(task.sprintId || '');
                                          setIsEditTaskModalOpen(true);
                                          setOpenEllipsisId(null);
                                        }}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        style={{ ...styles.ellipsisMenuItem, color: '#EF4444' }}
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          if (window.confirm('Are you sure you want to delete this task?')) {
                                            await deleteTask(task.id || task._id);
                                            if (activeTaskDetail && (activeTaskDetail.id === task.id || activeTaskDetail._id === task.id)) {
                                              setActiveTaskDetail(null);
                                            }
                                          }
                                          setOpenEllipsisId(null);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                            <h4 style={styles.cardTitle}>{task.title}</h4>
                            <p style={styles.cardDesc}>
                              {task.description || 'Connect task integration protocols to orchestrate workflows.'}
                            </p>

                            {task.priority === 'High' && column !== 'Completed' && (
                              <div style={styles.aiWarning}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                AI: Target delivery risk
                              </div>
                            )}

                            {/* Sprint indicator chip */}
                            {taskSprint && (
                              <div style={styles.sprintChip}>
                                <span style={styles.sprintChipIcon}>S</span>
                                <span>{taskSprint.name}</span>
                                <span style={{
                                  ...styles.sprintChipStatus,
                                  backgroundColor: getSprintStatusColor(taskSprint.status).bg,
                                  color: getSprintStatusColor(taskSprint.status).text,
                                }}>
                                  {taskSprint.status}
                                </span>
                              </div>
                            )}

                            <div style={styles.cardFooter}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img src={task.avatar} alt={task.assignee} style={styles.cardAvatar} />
                                {task.commentsCount > 0 && (
                                  <span style={styles.commentsIndicator}>{task.commentsCount} comments</span>
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => {
                    setNewTaskTitle(activeTaskDetail.title);
                    setNewTaskDesc(activeTaskDetail.description || '');
                    setNewTaskStatus(activeTaskDetail.status || 'Todo');
                    setNewTaskPriority(activeTaskDetail.priority || 'Medium');
                    setNewTaskPoints(activeTaskDetail.storyPoints || 3);
                    setNewTaskAssignee(activeTaskDetail.assignee || 'Sarah Chen');
                    setNewTaskProjectId(activeTaskDetail.projectId || activeProjectId);
                    setNewTaskEpic(activeTaskDetail.epicId || '');
                    setNewTaskSprint(activeTaskDetail.sprintId || '');
                    setIsEditTaskModalOpen(true);
                  }} style={{ ...styles.panelCloseBtn, fontSize: '13px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#F0F2FF', color: '#5B5FFB' }}>Edit</button>
                  <button onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this task?')) {
                      await deleteTask(activeTaskDetail.id || activeTaskDetail._id);
                      setActiveTaskDetail(null);
                    }
                  }} style={{ ...styles.panelCloseBtn, fontSize: '13px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#FEF2F2', color: '#EF4444' }}>Delete</button>
                  <button onClick={() => setActiveTaskDetail(null)} style={styles.panelCloseBtn}>×</button>
                </div>
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
                {/* Sprint info in detail panel */}
                {activeTaskDetail.sprintId && (() => {
                  const sp = getSprintById(activeTaskDetail.sprintId);
                  return sp ? (
                    <div style={styles.metaItem}>
                      <div style={styles.metaLabel}>SPRINT</div>
                      <div style={styles.metaVal}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', fontWeight: '600',
                          padding: '2px 8px', borderRadius: '6px',
                          backgroundColor: getSprintStatusColor(sp.status).bg,
                          color: getSprintStatusColor(sp.status).text,
                        }}>
                          {sp.name}
                        </span>
                      </div>
                    </div>
                  ) : null;
                })()}
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
                    <p>I've updated the API routes for the sync logic. Please review!</p>
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
                      onClick={() => setActiveTaskDetail(task)}
                      style={{ ...styles.backlogRow, cursor: 'pointer' }}
                    >
                      {/* Drag handle */}
                      <td style={styles.backlogTd}>
                        <span style={styles.dragHandle} title="Drag to reorder">::</span>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTaskDetail(task);
                                setNewTaskTitle(task.title);
                                setNewTaskDesc(task.description || '');
                                setNewTaskStatus(task.status || 'Todo');
                                setNewTaskPriority(task.priority || 'Medium');
                                setNewTaskPoints(task.storyPoints || 3);
                                setNewTaskAssignee(task.assignee || 'Sarah Chen');
                                setNewTaskProjectId(task.projectId || activeProjectId);
                                setNewTaskEpic(task.epicId || '');
                                setNewTaskSprint(task.sprintId || '');
                                setIsEditTaskModalOpen(true);
                                setOpenEllipsisId(null);
                              }}
                            >
                              Edit Task
                            </button>
                            <button
                              style={styles.ellipsisMenuItem}
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (activeSprint) {
                                  await updateTask({ taskId: task.id || task._id, updates: { sprintId: activeSprint.id || activeSprint._id, status: 'todo', isBacklog: false } });
                                } else {
                                  alert("No active sprint available to move the task to.");
                                }
                                setOpenEllipsisId(null);
                              }}
                            >
                              Move to Active Sprint
                            </button>
                            <button
                              style={{ ...styles.ellipsisMenuItem, color: '#EF4444' }}
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this task?')) {
                                  await deleteTask(task.id || task._id);
                                }
                                setOpenEllipsisId(null);
                              }}
                            >
                              Delete
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
                    <span style={{ ...styles.dragHandle, opacity: 0.3 }}>+</span>
                  </td>
                  <td style={styles.backlogTd}>
                    <span style={{ ...styles.backlogTaskId, color: '#94A3B8' }}>NEW</span>
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

      {/* Edit Task Modal */}
      {isEditTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '700px' }}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Task</h2>
              <button style={styles.modalCloseBtn} onClick={() => setIsEditTaskModalOpen(false)}>×</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateTask({
                  taskId: activeTaskDetail.id || activeTaskDetail._id,
                  updates: {
                    title: newTaskTitle,
                    description: newTaskDesc,
                    projectId: newTaskProjectId,
                    assignee: newTaskAssignee,
                    priority: newTaskPriority,
                    dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : undefined,
                    storyPoints: Number(newTaskPoints),
                    epicId: newTaskEpic || undefined,
                    sprintId: newTaskSprint || undefined,
                    status: newTaskStatus,
                    isBacklog: newTaskStatus === 'Backlog'
                  }
                });
                setIsEditTaskModalOpen(false);
                setActiveTaskDetail(null);
              } catch (error) {
                console.error("Failed to update task", error);
              }
            }}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input type="text" className="form-input" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} required />
              </div>

              <div className="split-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Status</label>
                  <select className="form-input form-select" value={newTaskStatus} onChange={e => setNewTaskStatus(e.target.value)}>
                    {TASK_STATUS_OPTIONS.map(st => <option key={st}>{st}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Assignee</label>
                  <select className="form-input form-select" value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)}>
                    <option>Sarah Chen</option>
                    <option>Alex Rivers</option>
                    <option>Jordan Smith</option>
                  </select>
                </div>
              </div>

              <div className="split-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select className="form-input form-select" value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Story Points</label>
                  <select className="form-input form-select" value={newTaskPoints} onChange={e => setNewTaskPoints(e.target.value)}>
                    {STORY_POINTS.map(sp => <option key={sp} value={sp}>{sp}</option>)}
                  </select>
                </div>
              </div>

              <div className="split-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Epic</label>
                  <select className="form-input form-select" value={newTaskEpic} onChange={e => setNewTaskEpic(e.target.value)}>
                    <option value="">No Epic</option>
                    {projectEpics.map(ep => (
                      <option key={ep.id} value={ep.id}>{ep.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Sprint</label>
                  <select className="form-input form-select" value={newTaskSprint} onChange={e => setNewTaskSprint(e.target.value)}>
                    <option value="">No Sprint (Backlog)</option>
                    {projectSprints.map(sp => (
                      <option key={sp.id} value={sp.id}>{sp.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" style={{ minHeight: '80px' }} value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn-secondary" onClick={() => setIsEditTaskModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-gradient">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Task Modal */}
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
                  <label className="form-label">Sprint</label>
                  <select className="form-input" value={newTaskSprint} onChange={e => setNewTaskSprint(e.target.value)}>
                    <option value="">Unassigned / Backlog</option>
                    {sprints.filter(sp => sp.projectId === newTaskProjectId).map(sp => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name} ({sp.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Epic</label>
                  <select className="form-input" value={newTaskEpic} onChange={e => setNewTaskEpic(e.target.value)}>
                    <option value="">— No Epic —</option>
                    {epics.filter(ep => ep.projectId === newTaskProjectId).map(ep => (
                      <option key={ep.id} value={ep.id} style={{ color: ep.color, fontWeight: '600' }}>
                        {ep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={newTaskStatus} onChange={e => setNewTaskStatus(e.target.value)}>
                    {TASK_STATUS_OPTIONS.map(st => (
                      <option key={st} value={st}>{st}</option>
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

      {/* ── Create Epic Modal ─────────────────────────────────────── */}
      {isCreateEpicOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateEpicOpen(false)}>
          <div className="modal-content" style={{ ...styles.modalContent, maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>

                Create New Epic
              </h2>
              <button style={styles.modalCloseBtn} onClick={() => setIsCreateEpicOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateEpicSubmit} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Epic Name *</label>
                <input
                  type="text"
                  placeholder="e.g., User Authentication Overhaul"
                  className="form-input"
                  value={newEpicName}
                  onChange={e => setNewEpicName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Summary</label>
                <input
                  type="text"
                  placeholder="Brief high-level overview"
                  className="form-input"
                  value={newEpicSummary}
                  onChange={e => setNewEpicSummary(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Detailed scope and goals of this epic..."
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={newEpicDesc}
                  onChange={e => setNewEpicDesc(e.target.value)}
                />
              </div>

              {/* Color Picker */}
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={styles.colorPickerWrapper}>
                  <div style={styles.colorSwatchGrid}>
                    {EPIC_COLOR_PALETTE.map((color, i) => (
                      <button
                        key={`${color}-${i}`}
                        type="button"
                        onClick={() => { setNewEpicColor(color); setNewEpicColorInput(color); }}
                        style={{
                          ...styles.colorSwatch,
                          backgroundColor: color,
                          ...(newEpicColor === color ? styles.colorSwatchActive : {}),
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div style={styles.hexInputRow}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '6px',
                      backgroundColor: newEpicColor, border: '2px solid #ECEEF4', flexShrink: 0,
                    }} />
                    <input
                      type="text"
                      value={newEpicColorInput}
                      onChange={e => handleEpicColorInputChange(e.target.value)}
                      placeholder="#8B5CF6"
                      style={styles.hexInput}
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={newEpicStatus} onChange={e => setNewEpicStatus(e.target.value)}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-input" value={newEpicStartDate} onChange={e => setNewEpicStartDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={newEpicDueDate} onChange={e => setNewEpicDueDate(e.target.value)} />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsCreateEpicOpen(false)} style={styles.discardBtn}>Cancel</button>
                <button
                  type="submit"
                  style={{
                    ...styles.gradientPillBtn,
                    background: `linear-gradient(135deg, ${newEpicColor}, ${newEpicColor}CC)`,
                  }}
                >
                  Create Epic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Sprint Modal ──────────────────────────────────── */}
      {isCreateSprintOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateSprintOpen(false)}>
          <div className="modal-content" style={{ ...styles.modalContent, maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>

                Create New Sprint
              </h2>
              <button style={styles.modalCloseBtn} onClick={() => setIsCreateSprintOpen(false)}>×</button>
            </div>

            <form onSubmit={handleCreateSprintSubmit} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Sprint Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Sprint 1"
                  className="form-input"
                  value={newSprintName}
                  onChange={e => setNewSprintName(e.target.value)}
                  required
                />
                <div style={{ fontSize: '11px', color: '#9AA6B2', marginTop: '4px' }}>
                  Auto-suggested: Sprint {projectSprints.length + 1}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sprint Goal</label>
                <textarea
                  placeholder="What should the team accomplish in this sprint?"
                  className="form-input"
                  style={{ minHeight: '70px', resize: 'vertical' }}
                  value={newSprintGoal}
                  onChange={e => setNewSprintGoal(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={newSprintStatus} onChange={e => setNewSprintStatus(e.target.value)}>
                  <option value="Future">Future</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="split-row" style={styles.row}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newSprintStartDate}
                    onChange={e => setNewSprintStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newSprintEndDate}
                    onChange={e => setNewSprintEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Quick duration presets */}
              <div className="form-group">
                <label className="form-label">Quick Duration</label>
                <div style={styles.presetRow}>
                  {[
                    { label: '1 Week', weeks: 1 },
                    { label: '2 Weeks', weeks: 2 },
                    { label: '3 Weeks', weeks: 3 },
                  ].map(preset => (
                    <button
                      key={preset.weeks}
                      type="button"
                      onClick={() => applySprintPreset(preset.weeks)}
                      style={styles.presetBtn}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: '#9AA6B2', marginTop: '4px' }}>
                  Sets end date relative to start date (or today if no start date set)
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setIsCreateSprintOpen(false)} style={styles.discardBtn}>Cancel</button>
                <button type="submit" className="btn-gradient">Create Sprint</button>
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
              <h2 style={{ ...styles.modalTitle, color: '#DC2626' }}>Complete {activeSprint?.name || 'Sprint'}?</h2>
              <button style={styles.modalCloseBtn} onClick={() => setCompleteSprintModal(false)}>×</button>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={styles.sprintCompleteWarning}>
                <div style={styles.warningRow}>
                  <span style={styles.warningIcon}></span>
                  <div>
                    <div style={styles.warningTitle}>Completed tasks will be archived</div>
                    <div style={styles.warningDesc}>{boardTasks.filter(t => t.status === 'Completed').length} task(s) will be marked as done and removed from the active board.</div>
                  </div>
                </div>
                <div style={styles.warningRow}>
                  <span style={styles.warningIcon}></span>
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
                  style={{ backgroundColor: 'var(--color-danger)', color: '#FFF', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
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
    backgroundColor: 'transparent',
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
    display: 'inline-flex',
    alignItems: 'center',
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
  // ── Header secondary button ───────────────────────────────────────
  headerSecondaryBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
  },
  // ── Sprint Header ──────────────────────────────────────────────────
  sprintHeaderBar: {
    backgroundColor: 'var(--color-accent-bg, #EFF6FF)',
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
    backgroundColor: 'rgba(248, 249, 253, 0.6)',
    borderRadius: '16px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: '260px',
    overflow: 'hidden',
    transition: 'background-color 0.3s ease',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
    padding: '8px 10px',
    borderRadius: '8px',
  },
  columnHeaderWip: {
    backgroundColor: '#FEF3C7',
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
    backgroundColor: 'transparent',
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
    padding: '16px',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
    borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  epicPill: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    marginBottom: '10px',
    letterSpacing: '0.03em',
  },
  storyPointsBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#6C7A87',
    backgroundColor: '#F4F6F9',
    borderRadius: '6px',
    padding: '2px 6px',
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
  // ── Sprint chip on task card ──────────────────────────────────────
  sprintChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    fontWeight: '600',
    color: '#6C7A87',
    backgroundColor: '#F4F6F9',
    borderRadius: '8px',
    padding: '4px 10px',
    marginBottom: '12px',
  },
  sprintChipIcon: {
    fontSize: '10px',
  },
  sprintChipStatus: {
    fontSize: '9px',
    fontWeight: '700',
    padding: '1px 5px',
    borderRadius: '4px',
    marginLeft: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
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
    backgroundColor: 'transparent',
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
    backgroundColor: '#F8FAFC',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    display: 'flex',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
    border: 'none',
    color: '#6C7A87',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px',
  },
  // ── Color Picker ──────────────────────────────────────────────────
  colorPickerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  colorSwatchGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  colorSwatch: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    border: '2px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    padding: 0,
  },
  colorSwatchActive: {
    border: '2px solid #1A1D20',
    boxShadow: '0 0 0 2px #FFF, 0 0 0 4px #1A1D20',
  },
  hexInputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  hexInput: {
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '13px',
    color: '#1A1D20',
    fontFamily: 'monospace',
    width: '100px',
    outline: 'none',
    backgroundColor: '#FAFCFF',
  },
  // ── Gradient pill button for epic ─────────────────────────────────
  gradientPillBtn: {
    color: '#FFFFFF',
    border: 'none',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '14px',
    padding: '10px 24px',
    borderRadius: '24px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
  },
  // ── Sprint date presets ───────────────────────────────────────────
  presetRow: {
    display: 'flex',
    gap: '8px',
  },
  presetBtn: {
    backgroundColor: '#F0F2FF',
    border: '1px solid #E0E4FF',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#5B5FFB',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
