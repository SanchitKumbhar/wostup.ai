import React, { useState, useEffect } from 'react';
import { useTeamLoad } from '../hooks/useTeamLoad';

export default function TeamLoad({ onAdjustCapacity, workspaceId }) {
  const { data: teamLoadData } = useTeamLoad(workspaceId);
  const [registryMembers, setRegistryMembers] = useState([]);

  useEffect(() => {
    if (teamLoadData && teamLoadData.members) {
      setRegistryMembers(teamLoadData.members.map((m, index) => {
        // Map the member data using API values with fallbacks
        return {
          id: m.userId || m.memberId || index,
          name: m.name || fallbackNames[index % fallbackNames.length],
          role: m.roleTitle || m.role || 'Member',
          avatar: m.avatar || fallbackAvatars[index % fallbackAvatars.length],
          tasks: m.taskBreakdown?.total || (m.assignedTasks ? m.assignedTasks.length : 0),
          openTasks: m.taskBreakdown?.open || 0,
          criticalTasks: m.taskBreakdown?.critical || 0,
          blockedTasks: m.taskBreakdown?.blocked || 0,
          score: m.loadScore ? (m.loadScore / 2).toFixed(1) + '/5.0' : '0.0/5.0',
          rawScore: m.loadScore || 0,
          utilization: m.utilizationPercentage || 0,
          status: m.status || 'Optimal',
          projectSplit: m.projectSplit || []
        };
      }));
    } else {
      setRegistryMembers([]);
    }
  }, [teamLoadData]);

  const handleDownloadReport = () => {
    const headers = ['Name', 'Role', 'Tasks', 'Utilization Score', 'Status'];
    const rows = registryMembers.map(m => [
      `"${m.name}"`,
      `"${m.role}"`,
      m.tasks,
      `"${m.score}"`,
      `"${m.status}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team_load_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'overloaded':
      case 'critical': return 'badge-atrisk';
      case 'optimal': return 'badge-completed';
      case 'underloaded':
      case 'under-utilized': return 'badge-todo';
      default: return 'badge-todo';
    }
  };

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Team Load</h1>
          <p>Real-time resource capacity and workload distribution analytics.</p>
        </div>
        <div className="page-header-actions" style={styles.headerActions}>
          <select className="form-input form-select" style={{ fontSize: '13px', padding: '8px 36px 8px 12px', width: 'auto' }}>
            <option>Last 30 Days</option>
            <option>Last 14 Days</option>
            <option>Current Sprint</option>
          </select>
          <button className="btn-gradient download-report-btn" onClick={handleDownloadReport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Report
          </button>
        </div>
      </div>

      {/* Team Load KPIs */}
      <div className="stats-row-responsive" style={styles.statsRow}>
        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statMetaRow}>
            <div style={styles.statTitle}>TOTAL MEMBERS</div>
            <div style={styles.statIconBlue}></div>
          </div>
          <div style={styles.statValue}>{teamLoadData?.totalMembers || 0}</div>
          <div style={styles.statSubText}>Active workspace members</div>
        </div>

        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statMetaRow}>
            <div style={styles.statTitle}>OVERLOADED</div>
            <div style={styles.statIconRed}>!</div>
          </div>
          <div style={{ ...styles.statValue, color: '#EF4444' }}>{teamLoadData?.overloadedMembers || 0}</div>
          <div style={styles.statSubText}>
            <span style={{ color: '#EF4444', fontWeight: '600' }}>Exceeding 100% capacity</span>
          </div>
        </div>

        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statMetaRow}>
            <div style={styles.statTitle}>AVERAGE UTILIZATION</div>
            <div style={styles.statIconPurple}></div>
          </div>
          <div style={{ ...styles.statValue, color: '#5B5FFB' }}>{teamLoadData?.averageCapacityUtilization || 0}%</div>
          <div style={styles.statSubText}>System-wide capacity utilized</div>
        </div>

        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statMetaRow}>
            <div style={styles.statTitle}>OPTIMAL / UNDERLOADED</div>
            <div style={styles.statIconGreen}></div>
          </div>
          <div style={{ ...styles.statValue, color: '#10B981' }}>
            {(teamLoadData?.optimalMembers || 0) + (teamLoadData?.underloadedMembers || 0)}
          </div>
          <div style={styles.statSubText}>
            Members at target load or below
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="visuals-grid" style={styles.visualsGrid}>
        
        {/* Member Load Distribution - Bar Chart */}
        <div className="premium-card" style={styles.visualCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Member Load Distribution</h3>
              <p style={styles.cardSubtitle}>Individual load scores relative to task volume</p>
            </div>
            <span style={styles.chartLink}>Details</span>
          </div>

          <div style={styles.barChartContainer}>
            <svg viewBox="0 0 400 160" width="100%" height="100%">
              {/* Target capacity dashed line at load score 4.0 (Y = 60) */}
              <line x1="40" y1="60" x2="380" y2="60" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4" />
              <text x="385" y="64" fontSize="8" fill="#EF4444" fontWeight="600">Limit (4.0)</text>

              {/* Dynamic Bars based on registryMembers limit to 5 max for layout */}
              {registryMembers.slice(0, 5).map((member, i) => {
                const xPos = 60 + (i * 60);
                const score = member.rawScore || 0;
                // Map rawScore (0-10) to height (0-140 max). Height per score point = 14
                const barHeight = Math.min(score * 14, 140);
                const barY = 140 - barHeight;
                const fillClr = score >= 8 ? '#EF4444' : (score <= 2 ? '#9AA6B2' : '#5B5FFB');
                const displayName = member.name.split(' ').map((n, idx) => idx === 0 ? n[0] + '.' : n.substring(0,3)).join(' ');

                return (
                  <g key={member.id}>
                    <rect x={xPos} y={barY} width="28" height={barHeight} fill={fillClr} rx="4" />
                    <text x={xPos + 14} y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">{displayName}</text>
                  </g>
                );
              })}
              <text x="30" y="144" fontSize="8" fill="#9AA6B2" textAnchor="end">0</text>
              <text x="30" y="104" fontSize="8" fill="#9AA6B2" textAnchor="end">2</text>
              <text x="30" y="64" fontSize="8" fill="#9AA6B2" textAnchor="end">4</text>
              <text x="30" y="24" fontSize="8" fill="#9AA6B2" textAnchor="end">8</text>
            </svg>
          </div>
        </div>

        {/* Load Trend - Line Chart */}
        <div className="premium-card" style={styles.visualCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Load Trend</h3>
              <p style={styles.cardSubtitle}>Average capacity utilization over time</p>
            </div>
          </div>

          <div style={styles.lineChartContainer}>
            <svg viewBox="0 0 300 160" width="100%" height="100%">
              {/* Grid baseline */}
              <line x1="30" y1="140" x2="270" y2="140" stroke="#ECEEF4" strokeWidth="1.5" />
              
              {/* Trend filled area */}
              <path d="M 40 100 Q 95 80 150 95 T 260 70 L 260 140 L 40 140 Z" fill="url(#lineGrad)" opacity="0.15" />
              
              {/* Trend Line */}
              <path d="M 40 100 Q 95 80 150 95 T 260 70" fill="none" stroke="#5B5FFB" strokeWidth="3" />
              <circle cx="260" cy="70" r="4" fill="#5B5FFB" />

              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B5FFB" />
                  <stop offset="100%" stopColor="#5B5FFB" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* X Axis */}
              <text x="40" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">W2</text>
              <text x="113" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">W3</text>
              <text x="186" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">W4</text>
              <text x="260" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">W5</text>
            </svg>
          </div>
        </div>

      </div>

      {/* Member Load Registry */}
      <div className="premium-card" style={styles.registryPanel}>
        <div className="panel-title-row-responsive" style={styles.panelTitleRow}>
          <div>
            <h3 style={styles.cardTitle}>Member Load Registry</h3>
            <p style={styles.cardSubtitle}>Detailed resource breakdown for the current sprint</p>
          </div>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12.5px' }} onClick={() => alert('Filtering registry members...')}>
            Filter
          </button>
        </div>

        <div className="table-responsive">
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeadRow}>
                <th style={styles.tableTh}>TEAM MEMBER</th>
                <th style={styles.tableTh}>TASKS (OPEN / BLOCKED)</th>
                <th style={styles.tableTh}>UTILIZATION</th>
                <th style={styles.tableTh}>PROJECTS</th>
                <th style={styles.tableTh}>STATUS</th>
                <th style={styles.tableTh}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {registryMembers.map((member) => (
                <tr key={member.id} style={styles.tableRow}>
                  <td style={styles.tableTd}>
                    <div style={styles.memberCell}>
                      <img src={member.avatar} alt={member.name} style={styles.memberAvatar} />
                      <div>
                        <div style={styles.memberName}>{member.name}</div>
                        <div style={styles.memberRole}>{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableTd}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', color: '#1A1D20' }}>{member.tasks}</span>
                      <span style={{ fontSize: '11px', color: '#6C7A87' }}>({member.openTasks} open, <span style={{ color: member.blockedTasks > 0 ? '#EF4444' : '#6C7A87' }}>{member.blockedTasks} blocked</span>)</span>
                    </div>
                  </td>
                  <td style={styles.tableTd}>
                    <div style={styles.utilizationCell}>
                      <span style={styles.utilizationLabel}>{member.utilization}% ({member.score})</span>
                      <div style={styles.utilProgressBarBg}>
                        <div style={{
                          ...styles.utilProgressBarFill,
                          width: `${Math.min(member.utilization, 100)}%`,
                          backgroundColor: member.status === 'Overloaded' ? '#EF4444' : member.status === 'Optimal' ? '#10B981' : '#5B5FFB'
                        }} />
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {member.projectSplit && member.projectSplit.length > 0 ? (
                        member.projectSplit.map((ps, i) => (
                          <div key={i} style={{ fontSize: '11px', color: '#6C7A87' }}>
                            <span style={{ fontWeight: '600', color: '#5B5FFB' }}>{ps.tasksCount} tasks</span> in {ps.projectName}
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: '11px', color: '#9AA6B2' }}>None</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.tableTd}>
                    <span className={`badge ${getStatusBadgeStyle(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td style={styles.tableTd}>
                    <button style={styles.actionBtn} onClick={() => alert(`Context action for ${member.name}`)}>•••</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={styles.paginationRow}>
          <span style={styles.paginationLabel}>Showing 5 of 12 members</span>
          <div style={styles.paginationBtns}>
            <button className="btn-secondary" style={styles.pagerBtn} disabled>Previous</button>
            <button className="btn-secondary" style={styles.pagerBtn}>Next</button>
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
    alignItems: 'center',
  },
  timeSelect: {
    border: '1px solid #ECEEF4',
    borderRadius: '8px',
    fontSize: '13px',
    padding: '8px 12px',
    backgroundColor: '#FFFFFF',
    color: '#1A1D20',
  },
  statsRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '28px',
  },
  statCard: {
    flex: 1,
    padding: '20px',
  },
  statMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.08em',
  },
  statIconBlue: {
    fontSize: '14px',
    backgroundColor: '#F0F2FF',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconRed: {
    fontSize: '14px',
    backgroundColor: '#FFE5E5',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconPurple: {
    fontSize: '14px',
    backgroundColor: '#FAF0E6',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconGreen: {
    fontSize: '14px',
    backgroundColor: '#E6FFFA',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1A1D20',
    marginBottom: '4px',
  },
  statSubText: {
    fontSize: '12px',
    color: '#6C7A87',
  },
  visualsGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '24px',
    marginBottom: '28px',
  },
  visualCard: {
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  cardSubtitle: {
    fontSize: '12px',
    color: '#6C7A87',
  },
  chartLink: {
    fontSize: '12px',
    color: '#5B5FFB',
    fontWeight: '600',
    cursor: 'pointer',
  },
  barChartContainer: {
    height: '160px',
  },
  lineChartContainer: {
    height: '160px',
  },
  registryPanel: {
    padding: '24px',
  },
  panelTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeadRow: {
    backgroundColor: '#FAFCFF',
    borderBottom: '1px solid #ECEEF4',
  },
  tableTh: {
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#9AA6B2',
    letterSpacing: '0.05em',
  },
  tableRow: {
    borderBottom: '1px solid #ECEEF4',
    '&:hover': {
      backgroundColor: '#FAFCFF',
    },
  },
  tableTd: {
    padding: '14px 16px',
    fontSize: '13.5px',
    color: '#1A1D20',
  },
  memberCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  memberAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  memberName: {
    fontSize: '13.5px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  memberRole: {
    fontSize: '11px',
    color: '#9AA6B2',
  },
  utilizationCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  utilizationLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1A1D20',
  },
  utilProgressBarBg: {
    width: '120px',
    height: '4px',
    backgroundColor: '#F8F9FD',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  utilProgressBarFill: {
    height: '100%',
    borderRadius: '2px',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    color: '#9AA6B2',
    cursor: 'pointer',
    fontSize: '12px',
  },
  paginationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationLabel: {
    fontSize: '13px',
    color: '#6C7A87',
  },
  paginationBtns: {
    display: 'flex',
    gap: '8px',
  },
  pagerBtn: {
    padding: '6px 12px',
    fontSize: '12.5px',
  },
};
