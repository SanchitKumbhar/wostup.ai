import React, { useState, useEffect } from 'react';

export default function Dashboard({
  user,
  projects,
  tasks,
  onNavigate,
  onOpenNewProjectModal,
  aiRecommendations,
  recentUpdates,
  teamMembers,
}) {
  const [countdown, setCountdown] = useState({ days: 14, hours: 2, minutes: 44, seconds: 12 });

  // Countdown timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  // KPI math
  const totalProjects = projects.length;
  const onTrackProjects = projects.filter(p => p.status === 'Active' && p.risk === 'Low').length;
  const atRiskProjects = projects.filter(p => p.risk === 'High').length;
  
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const reviewTasks = tasks.filter(t => t.status === 'Review').length;

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name || 'User'}! Here's what's happening in your workspace today.</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.scheduleBtn} onClick={() => alert('Scheduling system simulated.')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Schedule
          </button>
          <button className="btn-gradient" onClick={onOpenNewProjectModal}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={styles.kpiRow}>
        {/* Active Projects */}
        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <div>
              <div style={styles.kpiTitle}>Active Projects</div>
              <div style={styles.kpiValue}>{totalProjects} <span style={styles.kpiSubValue}>/ 15</span></div>
            </div>
            <div style={styles.kpiIconBg}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B5FFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
          <div style={styles.kpiProgressContainer}>
            <div style={{ ...styles.kpiProgressBar, width: `${(totalProjects / 15) * 100}%` }} />
          </div>
          <div style={styles.kpiFooter}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
            <span style={styles.kpiTrendGreen}>12% increase</span> from last week
          </div>
        </div>

        {/* On Track Projects */}
        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <div>
              <div style={styles.kpiTitle}>On Track</div>
              <div style={styles.kpiValue}>{onTrackProjects} <span style={styles.kpiSubValue}>/ {totalProjects}</span></div>
            </div>
            <div style={{ ...styles.kpiIconBg, backgroundColor: '#E6FFFA' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
          </div>
          <div style={styles.kpiProgressContainer}>
            <div style={{ ...styles.kpiProgressBar, backgroundColor: '#10B981', width: `${totalProjects > 0 ? (onTrackProjects / totalProjects) * 100 : 0}%` }} />
          </div>
          <div style={styles.kpiFooter}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
            <span style={styles.kpiTrendGreen}>12% increase</span> from last week
          </div>
        </div>

        {/* Projects At Risk */}
        <div className="premium-card" style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <div>
              <div style={styles.kpiTitle}>At Risk</div>
              <div style={styles.kpiValue}>{atRiskProjects} <span style={styles.kpiSubValue}>/ {totalProjects}</span></div>
            </div>
            <div style={{ ...styles.kpiIconBg, backgroundColor: '#FFE5E5' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div style={styles.kpiProgressContainer}>
            <div style={{ ...styles.kpiProgressBar, backgroundColor: '#EF4444', width: `${totalProjects > 0 ? (atRiskProjects / totalProjects) * 100 : 0}%` }} />
          </div>
          <div style={styles.kpiFooter}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
            <span style={styles.kpiTrendGreen}>12% increase</span> from last week
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout Grid */}
      <div style={styles.dashboardGrid}>
        
        {/* Left Column */}
        <div style={styles.leftColumn}>
          {/* AI Recommendations Panel */}
          <div className="glass-card" style={styles.aiPanel}>
            <div style={styles.panelTitleRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B5FFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <h3 style={styles.panelTitle}>Wostup AI Workspace Insights</h3>
              </div>
              <button onClick={() => onNavigate('ai-assistant')} style={styles.aiCTA}>Ask Wostup AI</button>
            </div>
            <div style={styles.aiList}>
              {aiRecommendations.map((rec) => (
                <div key={rec.id} style={styles.aiRecItem}>
                  <div style={styles.aiRecHeader}>
                    <span style={{
                      ...styles.aiPriorityBadge,
                      backgroundColor: rec.severity === 'high' ? '#FFEBEB' : '#FFF8E6',
                      color: rec.severity === 'high' ? '#E53E3E' : '#DD6B20',
                    }}>
                      {rec.severity.toUpperCase()}
                    </span>
                    <span style={styles.aiRecCategory}>{rec.category}</span>
                  </div>
                  <div style={styles.aiRecText}>{rec.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="premium-card" style={styles.panelCard}>
            <div style={styles.panelTitleRow}>
              <h3 style={styles.panelTitle}>Recent Updates</h3>
              <button style={styles.linkTextBtn} onClick={() => alert('Full activity logs view simulated.')}>View Logs</button>
            </div>
            <div style={styles.activityFeed}>
              {recentUpdates.map((update) => (
                <div key={update.id} style={styles.activityItem}>
                  <img src={update.avatar} alt={update.user} style={styles.activityAvatar} />
                  <div style={styles.activityMeta}>
                    <div style={styles.activityText}>
                      <span style={styles.activityUser}>{update.user}</span> {update.action}{' '}
                      <span style={styles.activityTarget}>{update.target}</span>
                    </div>
                    <div style={styles.activityTime}>{update.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button style={styles.loadMoreBtn} onClick={() => alert('Simulated loading additional activities.')}>
              Load More Activity
            </button>
          </div>

          {/* My Tasks Status & Countdown Split */}
          <div style={styles.splitRow}>
            {/* My Tasks Status */}
            <div className="premium-card" style={{ ...styles.panelCard, flex: 1 }}>
              <h3 style={styles.panelTitle}>My Tasks Status</h3>
              <div style={styles.taskStatusList}>
                <div style={styles.taskStatusItem}>
                  <span style={styles.taskStatusLabel}>In Progress</span>
                  <span className="badge badge-inprogress">{inProgressTasks} Tasks</span>
                </div>
                <div style={styles.taskStatusItem}>
                  <span style={styles.taskStatusLabel}>Review Needed</span>
                  <span className="badge badge-atrisk">{reviewTasks} Critical</span>
                </div>
              </div>
              <button style={styles.bottomLinkBtn} onClick={() => onNavigate('my-tasks')}>
                Go to My Board
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Countdown */}
            <div className="premium-card" style={{ ...styles.panelCard, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={styles.countdownTag}>PRODUCT LAUNCH COUNTDOWN</div>
              <div style={styles.countdownDisplay}>
                {formatNumber(countdown.days)}d : {formatNumber(countdown.hours)}h : {formatNumber(countdown.minutes)}m : {formatNumber(countdown.seconds)}s
              </div>
              <div style={styles.countdownFooter}>Days : Hours : Mins : Secs until Q4 Release</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          {/* Team Load */}
          <div className="premium-card" style={styles.panelCard}>
            <div style={styles.panelTitleRow}>
              <h3 style={styles.panelTitle}>Team Load</h3>
              <span style={{ fontSize: '11px', color: '#9AA6B2', fontWeight: '600' }}>Resource allocation status</span>
            </div>
            <div style={styles.teamLoadList}>
              {teamMembers.map((member) => (
                <div key={member.id} style={styles.teamLoadItem}>
                  <div style={styles.teamMemberInfo}>
                    <img src={member.avatar} alt={member.name} style={styles.teamAvatar} />
                    <span style={styles.teamMemberName}>{member.name}</span>
                  </div>
                  <div style={styles.teamProgressWrapper}>
                    <div style={styles.teamProgressBg}>
                      <div style={{
                        ...styles.teamProgressFill,
                        width: `${member.load}%`,
                        backgroundColor: member.load > 80 ? '#EF4444' : member.load > 50 ? '#DD6B20' : '#10B981'
                      }} />
                    </div>
                    <span style={{
                      ...styles.teamLoadPercent,
                      color: member.load > 80 ? '#C53030' : member.load > 50 ? '#DD6B20' : '#234E52'
                    }}>
                      {member.load}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.avgLoadRow}>
              <span style={styles.avgLoadLabel}>Avg. Workspace Load</span>
              <span style={styles.avgLoadVal}>74%</span>
            </div>
            <button className="btn-secondary" style={{ width: '100%', marginTop: '12px' }} onClick={() => onNavigate('team-load')}>
              Manage Capacity
            </button>
          </div>

          {/* Workspace Health */}
          <div className="premium-card" style={styles.panelCard}>
            <h3 style={styles.panelTitle}>Workspace Health</h3>
            <div style={styles.healthStatsGrid}>
              <div style={styles.healthStatBox}>
                <div style={styles.healthStatVal}>142</div>
                <div style={styles.healthStatLabel}>STABLE</div>
              </div>
              <div style={{ ...styles.healthStatBox, borderRight: 'none' }}>
                <div style={{ ...styles.healthStatVal, color: '#FF7A00' }}>8</div>
                <div style={styles.healthStatLabel}>CRITICAL</div>
              </div>
            </div>

            {/* System Notice Box */}
            <div style={styles.noticeBox}>
              <div style={styles.noticeHeader}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B5FFB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                System Notice
              </div>
              <div style={styles.noticeBody}>
                Sprint 14 velocity is tracking 15% higher than average. 2 critical blockers remain in 'Platform API'.
              </div>
              <button style={styles.noticeLink} onClick={() => onNavigate('task-health')}>
                View Detailed Health Report
              </button>
            </div>
          </div>
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
  scheduleBtn: {
    backgroundColor: '#FFFFFF',
    color: '#1A1D20',
    border: '1px solid #ECEEF4',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  kpiRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '28px',
  },
  kpiCard: {
    flex: 1,
    padding: '24px',
  },
  kpiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  kpiTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  kpiValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1A1D20',
  },
  kpiSubValue: {
    fontSize: '16px',
    color: '#9AA6B2',
    fontWeight: '400',
  },
  kpiIconBg: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#F0F2FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiProgressContainer: {
    height: '6px',
    backgroundColor: '#FAFCFF',
    border: '1px solid #ECEEF4',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  kpiProgressBar: {
    height: '100%',
    backgroundColor: '#5B5FFB',
    borderRadius: '3px',
  },
  kpiFooter: {
    fontSize: '12px',
    color: '#6C7A87',
    display: 'flex',
    alignItems: 'center',
  },
  kpiTrendGreen: {
    color: '#10B981',
    fontWeight: '600',
    marginRight: '3px',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  aiPanel: {
    padding: '24px',
    border: '1px solid rgba(178, 77, 255, 0.2)',
  },
  panelTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  aiCTA: {
    background: 'none',
    border: 'none',
    color: '#B24DFF',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
  aiList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  aiRecItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid #ECEEF4',
    padding: '14px 16px',
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderColor: '#B24DFF',
    },
  },
  aiRecHeader: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '6px',
  },
  aiPriorityBadge: {
    fontSize: '9px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
  },
  aiRecCategory: {
    fontSize: '11px',
    color: '#9AA6B2',
    fontWeight: '600',
  },
  aiRecText: {
    fontSize: '13px',
    color: '#1A1D20',
    lineHeight: '1.4',
  },
  panelCard: {
    padding: '24px',
  },
  linkTextBtn: {
    background: 'none',
    border: 'none',
    color: '#5B5FFB',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
  activityFeed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  activityAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  activityMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  activityText: {
    fontSize: '13px',
    color: '#6C7A87',
    lineHeight: '1.4',
  },
  activityUser: {
    fontWeight: '600',
    color: '#1A1D20',
  },
  activityTarget: {
    fontWeight: '600',
    color: '#5B5FFB',
  },
  activityTime: {
    fontSize: '11px',
    color: '#9AA6B2',
  },
  loadMoreBtn: {
    width: '100%',
    backgroundColor: '#FAFCFF',
    border: '1px dashed #ECEEF4',
    color: '#6C7A87',
    fontSize: '13px',
    fontWeight: '500',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#F8F9FD',
      borderColor: '#9AA6B2',
      color: '#1A1D20',
    },
  },
  splitRow: {
    display: 'flex',
    gap: '24px',
  },
  taskStatusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
    marginBottom: '20px',
  },
  taskStatusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '12px',
    borderBottom: '1px solid #F8F9FD',
  },
  taskStatusLabel: {
    fontSize: '14px',
    color: '#6C7A87',
    fontWeight: '500',
  },
  bottomLinkBtn: {
    background: 'none',
    border: 'none',
    color: '#5B5FFB',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    marginTop: 'auto',
  },
  countdownTag: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#FF4D4D',
    letterSpacing: '0.08em',
    marginBottom: '12px',
    backgroundColor: '#FFE5E5',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  countdownDisplay: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '32px',
    fontWeight: '700',
    color: '#FF4D4D',
    letterSpacing: '-0.02em',
    marginBottom: '8px',
  },
  countdownFooter: {
    fontSize: '11px',
    color: '#9AA6B2',
    fontWeight: '600',
  },
  teamLoadList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '16px',
  },
  teamLoadItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  teamMemberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  teamAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  teamMemberName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  teamProgressWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  teamProgressBg: {
    flex: 1,
    height: '4px',
    backgroundColor: '#F8F9FD',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  teamProgressFill: {
    height: '100%',
    borderRadius: '2px',
  },
  teamLoadPercent: {
    fontSize: '12px',
    fontWeight: '700',
    width: '32px',
    textAlign: 'right',
  },
  avgLoadRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #ECEEF4',
    marginBottom: '8px',
  },
  avgLoadLabel: {
    fontSize: '13px',
    color: '#6C7A87',
    fontWeight: '500',
  },
  avgLoadVal: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#5B5FFB',
  },
  healthStatsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    border: '1px solid #ECEEF4',
    borderRadius: '12px',
    marginTop: '16px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  healthStatBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 0',
    borderRight: '1px solid #ECEEF4',
    backgroundColor: '#FAFCFF',
  },
  healthStatVal: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#10B981',
    marginBottom: '4px',
  },
  healthStatLabel: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
  },
  noticeBox: {
    backgroundColor: '#F0F2FF',
    border: '1px solid #E6ECFF',
    borderRadius: '10px',
    padding: '14px',
  },
  noticeHeader: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#5B5FFB',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '6px',
  },
  noticeBody: {
    fontSize: '12px',
    color: '#6C7A87',
    lineHeight: '1.4',
    marginBottom: '10px',
  },
  noticeLink: {
    background: 'none',
    border: 'none',
    color: '#5B5FFB',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
};
