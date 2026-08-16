import React, { useState } from 'react';
import { useConflicts } from '../hooks/useConflicts';
import { useTaskHealthDashboard } from '../hooks/useTaskHealth';

export default function TaskHealth({ onOptimizeLoad, tasks: propTasks, projects }) {
  const workspaceId = projects && projects.length > 0 ? projects[0].workspaceId : null;
  const { data: conflictsData } = useConflicts(workspaceId);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');

  const { data: dashboardData } = useTaskHealthDashboard(
    workspaceId,
    selectedProjectFilter === 'all' ? null : selectedProjectFilter
  );

  const summary = dashboardData?.summary || {
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    atRisk: 0,
    blocked: 0,
    overdue: 0,
    criticalCount: 0,
    completionPercentage: 0,
    avgProgress: 0,
    healthScore: 0
  };

  const board = dashboardData?.board || {
    columns: {
      notStarted: [],
      inProgress: [],
      atRisk: [],
      complete: []
    }
  };

  const [showNotice, setShowNotice] = useState(true);

  const handleOptimizeLoad = () => {
    alert('Wostup Autonomous Engine: Rescheduled timeline overlaps. Tasks rebalanced.');
    if (onOptimizeLoad) onOptimizeLoad();
  };

  const getPriorityBadgeStyle = (priority) => {
    if (!priority) return 'badge-low-priority';
    switch (priority.toLowerCase()) {
      case 'critical':
      case 'high': return 'badge-high-priority';
      case 'medium': return 'badge-medium-priority';
      case 'low': return 'badge-low-priority';
      default: return 'badge-low-priority';
    }
  };

  const columns = [
    { key: 'notStarted', label: 'Not Started' },
    { key: 'inProgress', label: 'In Progress' },
    { key: 'atRisk', label: 'At Risk' },
    { key: 'complete', label: 'Completed' }
  ];

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <div className="page-title-group">
          <h1>Task Health Dashboard</h1>
          <p>Monitor risks, delays, and velocity across all workspace projects.</p>
        </div>
        <div className="page-header-actions" style={styles.headerActions}>
          <button style={styles.actionBtn} onClick={() => alert('Filtering options...')}>Filters</button>
          <button style={styles.actionBtn} onClick={() => alert('History graphs...')}>Health History</button>
          {projects && projects.length > 0 && (
            <select
              className="form-input form-select"
              style={{ fontSize: '13px', padding: '8px 36px 8px 12px', width: 'auto' }}
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map(proj => {
                const projId = proj.id || proj._id;
                return (
                  <option key={projId} value={projId}>
                    {proj.key ? `[${proj.key}] ${proj.name}` : proj.name}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      </div>

      {/* Health KPIs Row */}
      <div className="stats-row-responsive" style={styles.kpiRow}>
        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>TOTAL TASKS</span>
            <span style={styles.iconSpan}></span>
          </div>
          <div style={{ ...styles.kpiVal, color: '#5B5FFB' }}>{summary.totalTasks}</div>
          <div style={styles.kpiChange}><span style={{ color: '#10B981', fontWeight: '600' }}>{summary.completionPercentage || 0}%</span> completed</div>
        </div>

        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>AT RISK / BLOCKED</span>
            <span style={styles.iconSpan}>!</span>
          </div>
          <div style={{ ...styles.kpiVal, color: '#EF4444' }}>{summary.atRisk + summary.blocked}</div>
          <div style={styles.kpiChange}><span style={{ color: '#EF4444', fontWeight: '600' }}>{summary.overdue}</span> tasks overdue</div>
        </div>

        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>CONFLICTS DETECTED</span>
            <span style={styles.iconSpan}></span>
          </div>
          <div style={{ ...styles.kpiVal, color: '#10B981' }}>{conflictsData?.conflictCount || 0}</div>
          <div style={styles.kpiChange}>
            {conflictsData?.hasConflicts ? (
              <span style={{ color: '#EF4444', fontWeight: '600' }}>Review needed</span>
            ) : (
              <span style={{ color: '#10B981', fontWeight: '600' }}>Schedule clear</span>
            )}
          </div>
        </div>

        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>HEALTH SCORE</span>
            <span style={styles.iconSpan}></span>
          </div>
          <div style={{ ...styles.kpiVal, color: '#10B981' }}>{summary.healthScore}/100</div>
          <div style={styles.kpiChange}>
            Avg. Progress: <span style={{ color: '#5B5FFB', fontWeight: '600' }}>{summary.avgProgress}%</span>
          </div>
        </div>
      </div>

      {/* Columns Grid */}
      <div style={styles.boardWrapper}>
        <div className="columns-grid" style={styles.columnsGrid}>
          {columns.map((col) => {
            const colTasks = board.columns[col.key] || [];
            return (
              <div key={col.key} className="health-column" style={styles.healthColumn}>
                <div style={styles.columnHeader}>
                  <div style={styles.columnTitleRow}>
                    <span style={{
                      ...styles.statusIndicator,
                      backgroundColor: col.key === 'complete' ? '#10B981' : col.key === 'atRisk' ? '#EF4444' : col.key === 'inProgress' ? '#5B5FFB' : '#9AA6B2'
                    }} />
                    <span style={styles.columnTitle}>{col.label.toUpperCase()}</span>
                    <span style={styles.columnCount}>{colTasks.length}</span>
                  </div>
                  <button style={styles.moreBtn}>•••</button>
                </div>

                <div style={styles.cardsScroll}>
                  {colTasks.map((t) => (
                    <div key={t.id || t._id} className="premium-card" style={styles.taskCard}>
                      <div style={styles.cardHeaderRow}>
                        <span style={styles.cardProjectCode}>{t.projectName ? (t.projectName.substring(0, 15) + (t.projectName.length > 15 ? '...' : '')) : 'General'}</span>
                        <span className={`badge ${getPriorityBadgeStyle(t.priority)}`} style={{ fontSize: '8px', padding: '1px 5px' }}>
                          {t.priority || 'Low'}
                        </span>
                      </div>
                      <h4 style={styles.taskTitle}>{t.title}</h4>
                      
                      {t.statusBadge && (
                        <div style={{ marginBottom: '10px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 6px', borderRadius: '4px', backgroundColor: t.healthStatus === 'healthy' ? '#E6FFFA' : t.healthStatus === 'blocked' || t.healthStatus === 'at_risk' ? '#FFEBEB' : '#FAFCFF', color: t.healthStatus === 'healthy' ? '#10B981' : t.healthStatus === 'blocked' || t.healthStatus === 'at_risk' ? '#EF4444' : '#6C7A87' }}>
                            {t.statusBadge}
                          </span>
                        </div>
                      )}

                      <div style={styles.cardFooter}>
                        {t.assignee && t.assignee.avatar ? (
                           <img src={t.assignee.avatar} alt={t.assignee.name || "Assignee"} style={styles.cardAvatar} onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=32&h=32&q=80"; }} />
                        ) : (
                           <div style={{...styles.cardAvatar, backgroundColor: '#ECEEF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6C7A87'}}>{t.assignee?.name?.charAt(0) || '?'}</div>
                        )}
                        <span style={{...styles.cardDue, color: t.isOverdue ? '#EF4444' : '#9AA6B2', fontWeight: t.isOverdue ? '600' : '400'}}>
                           {t.dueDate ? new Date(t.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'No date'}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <button style={styles.columnAddBtn}>+ Add Task</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  actionBtn: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #ECEEF4',
    color: '#6C7A87',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#F8F9FD',
      color: '#1A1D20',
    },
  },
  kpiRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '24px',
  },
  kpiCard: {
    flex: 1,
    padding: '12px 16px',
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  kpiTitle: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
  },
  iconSpan: {
    fontSize: '12px',
  },
  kpiVal: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  kpiChange: {
    fontSize: '11px',
    color: '#6C7A87',
  },
  boardWrapper: {
    flex: 1,
    overflow: 'hidden',
    marginBottom: '20px',
  },
  columnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    height: '100%',
    overflowX: 'auto',
  },
  healthColumn: {
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
  statusIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
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
  moreBtn: {
    background: 'none',
    border: 'none',
    color: '#9AA6B2',
    cursor: 'pointer',
  },
  cardsScroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '16px',
  },
  taskCard: {
    padding: '14px',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardProjectCode: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: '#F0F2FF',
    color: '#5B5FFB',
    padding: '2px 4px',
    borderRadius: '4px',
  },
  taskTitle: {
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#1A1D20',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #FAFCFF',
    paddingTop: '8px',
  },
  cardAvatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  cardDue: {
    fontSize: '11px',
    color: '#9AA6B2',
  },
  columnAddBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    border: '1px dashed #ECEEF4',
    borderRadius: '10px',
    color: '#6C7A87',
    fontSize: '13px',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#F8F9FD',
    },
  },
  aiAlertBanner: {
    backgroundColor: '#FFEBEB',
    border: '1px solid #FEB2B2',
    borderRadius: '12px',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(229, 62, 62, 0.05)',
  },
  alertLeft: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: '24px',
  },
  alertMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#C53030',
  },
  alertBody: {
    fontSize: '13px',
    color: '#742A2A',
    lineHeight: '1.4',
  },
  alertCTA: {
    backgroundColor: '#E53E3E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 6px rgba(229, 62, 62, 0.2)',
    '&:hover': {
      backgroundColor: '#C53030',
    },
  },
};
