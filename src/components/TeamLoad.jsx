import React, { useState } from 'react';

export default function TeamLoad({ onAdjustCapacity }) {
  const [registryMembers, setRegistryMembers] = useState([
    { id: 1, name: 'Sarah Chen', role: 'Lead Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', tasks: 12, score: '4.8/5.0', status: 'Critical' },
    { id: 2, name: 'Marcus Rodriguez', role: 'Senior Developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', tasks: 8, score: '4.2/5.0', status: 'Critical' },
    { id: 3, name: 'Aisha Gupta', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', tasks: 6, score: '3.5/5.0', status: 'Optimal' },
    { id: 4, name: 'James Wilson', role: 'QA Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', tasks: 3, score: '2.1/5.0', status: 'Under-utilized' },
    { id: 5, name: 'Elena Sokolov', role: 'Frontend Dev', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', tasks: 7, score: '3.8/5.0', status: 'Optimal' },
  ]);

  const handleAdjustCapacityClick = () => {
    alert('Simulating auto-reassignment of tasks to balance workload...');
    // Decrease the workload of critical members slightly to show interaction
    setRegistryMembers(prev => prev.map(m => {
      if (m.name === 'Sarah Chen') {
        return { ...m, tasks: 9, score: '3.9/5.0', status: 'Optimal' };
      }
      if (m.name === 'James Wilson') {
        return { ...m, tasks: 6, score: '3.4/5.0', status: 'Optimal' };
      }
      return m;
    }));
    if (onAdjustCapacity) onAdjustCapacity();
  };

  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'critical': return 'badge-atrisk';
      case 'optimal': return 'badge-completed';
      case 'under-utilized': return 'badge-inprogress';
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
        <div style={styles.headerActions}>
          <select style={styles.timeSelect}>
            <option>Last 30 Days</option>
            <option>Last 14 Days</option>
            <option>Current Sprint</option>
          </select>
          <button className="btn-gradient" onClick={handleAdjustCapacityClick}>
            Adjust Capacity
          </button>
        </div>
      </div>

      {/* Team Load KPIs */}
      <div style={styles.statsRow}>
        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statMetaRow}>
            <div style={styles.statTitle}>TOTAL MEMBERS</div>
            <div style={styles.statIconBlue}>👥</div>
          </div>
          <div style={styles.statValue}>12</div>
          <div style={styles.statSubText}>Active workspace members</div>
        </div>

        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statMetaRow}>
            <div style={styles.statTitle}>OVERLOADED</div>
            <div style={styles.statIconRed}>⚠️</div>
          </div>
          <div style={{ ...styles.statValue, color: '#EF4444' }}>3</div>
          <div style={styles.statSubText}>
            <span style={{ color: '#EF4444', fontWeight: '600' }}>↗ 15%</span> exceeding 4.0 score
          </div>
        </div>

        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statMetaRow}>
            <div style={styles.statTitle}>AVERAGE LOAD</div>
            <div style={styles.statIconPurple}>⚡</div>
          </div>
          <div style={{ ...styles.statValue, color: '#5B5FFB' }}>4.2</div>
          <div style={styles.statSubText}>System-wide capacity score</div>
        </div>

        <div className="premium-card" style={styles.statCard}>
          <div style={styles.statMetaRow}>
            <div style={styles.statTitle}>OPTIMAL STATE</div>
            <div style={styles.statIconGreen}>✓</div>
          </div>
          <div style={{ ...styles.statValue, color: '#10B981' }}>64%</div>
          <div style={styles.statSubText}>
            <span style={{ color: '#10B981', fontWeight: '600' }}>↘ 4%</span> of team at target load
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div style={styles.visualsGrid}>
        
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

              {/* Bar 1: S. Chen (Score 4.8) */}
              <rect x="60" y="44" width="28" height="96" fill="#EF4444" rx="4" />
              {/* Bar 2: M. Rodriguez (Score 4.2) */}
              <rect x="120" y="56" width="28" height="84" fill="#EF4444" rx="4" />
              {/* Bar 3: A. Gupta (Score 3.5) */}
              <rect x="180" y="70" width="28" height="70" fill="#5B5FFB" rx="4" />
              {/* Bar 4: J. Wilson (Score 2.1) */}
              <rect x="240" y="98" width="28" height="42" fill="#5B5FFB" rx="4" />
              {/* Bar 5: E. Sokolov (Score 3.8) */}
              <rect x="300" y="64" width="28" height="76" fill="#5B5FFB" rx="4" />

              {/* Grid line baseline */}
              <line x1="40" y1="140" x2="360" y2="140" stroke="#ECEEF4" strokeWidth="1.5" />

              {/* X Axis Labels */}
              <text x="74" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">S. Chen</text>
              <text x="134" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">M. Rod</text>
              <text x="194" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">A. Gup</text>
              <text x="254" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">J. Wil</text>
              <text x="314" y="152" fontSize="9" fill="#9AA6B2" textAnchor="middle">E. Sok</text>

              {/* Y Axis Labels */}
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
        <div style={styles.panelTitleRow}>
          <div>
            <h3 style={styles.cardTitle}>Member Load Registry</h3>
            <p style={styles.cardSubtitle}>Detailed resource breakdown for the current sprint</p>
          </div>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12.5px' }} onClick={() => alert('Filtering registry members...')}>
            Filter
          </button>
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeadRow}>
              <th style={styles.tableTh}>TEAM MEMBER</th>
              <th style={styles.tableTh}>TASKS</th>
              <th style={styles.tableTh}>UTILIZATION</th>
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
                <td style={styles.tableTd}>{member.tasks}</td>
                <td style={styles.tableTd}>
                  <div style={styles.utilizationCell}>
                    <span style={styles.utilizationLabel}>Score {member.score}</span>
                    <div style={styles.utilProgressBarBg}>
                      <div style={{
                        ...styles.utilProgressBarFill,
                        width: `${(parseFloat(member.score) / 5) * 100}%`,
                        backgroundColor: member.status === 'Critical' ? '#EF4444' : member.status === 'Optimal' ? '#10B981' : '#5B5FFB'
                      }} />
                    </div>
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
