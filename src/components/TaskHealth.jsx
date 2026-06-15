import React, { useState } from 'react';

export default function TaskHealth({ onOptimizeLoad }) {
  const [localTasks, setLocalTasks] = useState([
    { id: 'T-10', title: 'Refactor Auth Service', project: 'P-12', priority: 'High', due: 'Oct 24', status: 'Not Started', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { id: 'T-11', title: 'Update Documentation', project: 'P-5', priority: 'Low', due: 'Oct 28', status: 'Not Started', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    { id: 'T-12', title: 'Mobile Layout Redesign', project: 'P-8', priority: 'Medium', due: 'Oct 22', status: 'In Progress', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
    { id: 'T-13', title: 'API Load Balancing', project: 'P-12', priority: 'High', due: 'Oct 21', status: 'In Progress', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
    { id: 'T-14', title: 'Database Migration', project: 'P-12', priority: 'High', due: 'Oct 19', status: 'At Risk', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { id: 'T-15', title: 'Client Feedback Phase 2', project: 'P-3', priority: 'Medium', due: 'Oct 18', status: 'At Risk', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
    { id: 'T-16', title: 'Initial Prototype', project: 'P-5', priority: 'Low', due: 'Oct 10', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    { id: 'T-17', title: 'Security Audit', project: 'P-12', priority: 'High', due: 'Oct 12', status: 'Completed', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  ]);

  const [atRiskCount, setAtRiskCount] = useState(8);
  const [onTrackCount, setOnTrackCount] = useState(96);
  const [showNotice, setShowNotice] = useState(true);

  const handleOptimizeLoad = () => {
    alert('Wostup Autonomous Engine: Rescheduled timeline overlaps. Tasks rebalanced.');
    // Move 'At Risk' tasks to 'In Progress' and update counts
    setLocalTasks(prev => prev.map(t => {
      if (t.status === 'At Risk') {
        return { ...t, status: 'In Progress', priority: 'Medium' };
      }
      return t;
    }));
    setAtRiskCount(0);
    setOnTrackCount(104);
    setShowNotice(false);
    if (onOptimizeLoad) onOptimizeLoad();
  };

  const getPriorityBadgeStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'badge-high-priority';
      case 'medium': return 'badge-medium-priority';
      case 'low': return 'badge-low-priority';
      default: return 'badge-low-priority';
    }
  };

  const columns = ['Not Started', 'In Progress', 'At Risk', 'Completed'];

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
          <button className="btn-gradient" onClick={() => alert('New task creation...')}>+ New Task</button>
        </div>
      </div>

      {/* Health KPIs Row */}
      <div className="stats-row-responsive" style={styles.kpiRow}>
        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>TOTAL TASKS</span>
            <span style={styles.iconSpan}>📋</span>
          </div>
          <div style={{ ...styles.kpiVal, color: '#5B5FFB' }}>124</div>
          <div style={styles.kpiChange}><span style={{ color: '#10B981', fontWeight: '600' }}>↗ 12%</span> from last week</div>
        </div>

        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>AT RISK</span>
            <span style={styles.iconSpan}>⚠️</span>
          </div>
          <div style={{ ...styles.kpiVal, color: '#EF4444' }}>{atRiskCount}</div>
          <div style={styles.kpiChange}><span style={{ color: '#EF4444', fontWeight: '600' }}>↘ 3%</span> from last week</div>
        </div>

        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>ON TRACK</span>
            <span style={styles.iconSpan}>✓</span>
          </div>
          <div style={{ ...styles.kpiVal, color: '#10B981' }}>{onTrackCount}</div>
          <div style={styles.kpiChange}><span style={{ color: '#10B981', fontWeight: '600' }}>↗ 8%</span> from last week</div>
        </div>

        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>AVG. DELAY</span>
            <span style={styles.iconSpan}>⏱</span>
          </div>
          <div style={{ ...styles.kpiVal, color: '#FF7A00' }}>{atRiskCount > 0 ? '1.2d' : '0.1d'}</div>
          <div style={styles.kpiChange}>
            <span style={{ color: '#FF7A00', fontWeight: '600' }}>
              {atRiskCount > 0 ? '↗ 0.4d' : '↘ 1.1d'}
            </span> from last week
          </div>
        </div>
      </div>

      {/* Columns Grid */}
      <div style={styles.boardWrapper}>
        <div className="columns-grid" style={styles.columnsGrid}>
          {columns.map((col) => {
            const colTasks = localTasks.filter(t => t.status === col);
            return (
              <div key={col} className="health-column" style={styles.healthColumn}>
                <div style={styles.columnHeader}>
                  <div style={styles.columnTitleRow}>
                    <span style={{
                      ...styles.statusIndicator,
                      backgroundColor: col === 'Completed' ? '#10B981' : col === 'At Risk' ? '#EF4444' : col === 'In Progress' ? '#5B5FFB' : '#9AA6B2'
                    }} />
                    <span style={styles.columnTitle}>{col.toUpperCase()}</span>
                    <span style={styles.columnCount}>{colTasks.length}</span>
                  </div>
                  <button style={styles.moreBtn}>•••</button>
                </div>

                <div style={styles.cardsScroll}>
                  {colTasks.map((t) => (
                    <div key={t.id} className="premium-card" style={styles.taskCard}>
                      <div style={styles.cardHeaderRow}>
                        <span style={styles.cardProjectCode}>{t.project}</span>
                        <span className={`badge ${getPriorityBadgeStyle(t.priority)}`} style={{ fontSize: '8px', padding: '1px 5px' }}>
                          {t.priority}
                        </span>
                      </div>
                      <h4 style={styles.taskTitle}>{t.title}</h4>
                      
                      <div style={styles.cardFooter}>
                        <img src={t.avatar} alt="Assignee" style={styles.cardAvatar} />
                        <span style={styles.cardDue}>📅 {t.due}</span>
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

      {/* Large AI Alert Banner */}
      {showNotice && (
        <div className="ai-alert-banner-responsive" style={styles.aiAlertBanner}>
          <div style={styles.alertLeft}>
            <span style={styles.alertIcon}>🤖</span>
            <div style={styles.alertMeta}>
              <div style={styles.alertTitle}>Risk Insight Detected</div>
              <div style={styles.alertBody}>
                Projects "Internal API" and "Security Audit" have overlapping milestones for 3 team members next week. Resource conflict likely.
              </div>
            </div>
          </div>
          <button className="alert-cta-responsive" style={styles.alertCTA} onClick={handleOptimizeLoad}>
            Optimize Load
          </button>
        </div>
      )}
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
    padding: '20px',
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  kpiTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
  },
  iconSpan: {
    fontSize: '14px',
  },
  kpiVal: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  kpiChange: {
    fontSize: '12px',
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
